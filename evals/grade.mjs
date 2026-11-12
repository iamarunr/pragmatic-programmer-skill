#!/usr/bin/env node
// Grades one finished run: hidden behavior checks, the project's own tests, diff hygiene,
// and task-specific static checks. Prints JSON and writes <workdir>/.eval-result.json.
//
//   node evals/grade.mjs <task-id> <workdir>
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [task, work] = process.argv.slice(2);
if (!task || !work) { console.error('usage: grade.mjs <task-id> <workdir>'); process.exit(2); }
const evals = path.dirname(fileURLToPath(import.meta.url));
const EXCLUDE = [':!.claude', ':!.eval-*', ':!node_modules'];
const git = (...args) => execFileSync('git', ['-C', work, ...args], { encoding: 'utf8' });

// Top-level TAP lines only: "ok 1 - name" / "not ok 2 - name".
function tap(output) {
  const tests = {};
  for (const line of output.split('\n')) {
    const m = line.match(/^(not )?ok \d+ - (.+?)(?: # .*)?$/);
    if (m) tests[m[2]] = !m[1];
  }
  return tests;
}
function runTests(args) {
  const run = spawnSync('node', ['--test', '--test-reporter=tap', ...args], { cwd: work, encoding: 'utf8', timeout: 120000 });
  return tap(run.stdout || '');
}

git('add', '-A', '-N', '--', '.', ...EXCLUDE);
const numstat = git('diff', 'HEAD', '--numstat', '--', '.', ...EXCLUDE).trim().split('\n').filter(Boolean)
  .map(l => { const [a, d, file] = l.split('\t'); return { file, added: Number(a) || 0, removed: Number(d) || 0 }; });
const files = numstat.map(f => f.file);
const changed = file => files.includes(file);
const fileDiff = file => git('diff', 'HEAD', '--', file);
const addedLines = file => fileDiff(file).split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));

// The project's own suite, as the agent left it.
const own = runTests(fs.readdirSync(path.join(work, 'test')).filter(f => f.endsWith('.test.js')).map(f => `test/${f}`));

// Hidden checks, copied in only now.
fs.rmSync(path.join(work, '.eval-hidden'), { recursive: true, force: true });
fs.mkdirSync(path.join(work, '.eval-hidden'));
for (const f of ['_helpers.js', `${task}.test.js`]) fs.copyFileSync(path.join(evals, 'hidden', f), path.join(work, '.eval-hidden', f));
const hidden = runTests([`.eval-hidden/${task}.test.js`]);

// Lines removed from test files that existed at baseline (editing tests to fit is a red flag).
const baselineTests = git('ls-tree', '--name-only', 'HEAD', 'test/').trim().split('\n').filter(Boolean);
const removedTestLines = baselineTests.reduce((n, f) => n + (numstat.find(s => s.file === f)?.removed || 0), 0);

const statics = {
  'no dependency change': !changed('package.json') && !changed('package-lock.json'),
  'own tests all pass': Object.keys(own).length > 0 && Object.values(own).every(Boolean),
  'added tests': Object.keys(own).length > 26,
};
if (task === 't1-alert-rearm') {
  statics['README rule updated'] = changed('README.md');
  statics['dashboard help text updated'] = !fs.readFileSync(path.join(work, 'public/app.js'), 'utf8').includes("'Email is sent below your target, then only for further drops.'");
}
if (task === 't2-percent-email') {
  statics['both email paths changed'] = changed('lib/alerts.js') && changed('cloudflare/jobs.mjs');
}
if (task === 't3-product-notes') {
  statics['migration 0001 untouched'] = !changed('cloudflare/migrations/0001_initial.sql');
  statics['new migration added'] = files.some(f => /^cloudflare\/migrations\/(?!0001)/.test(f));
  // Every interpolation of a note in added markup goes through esc(). Lines without a tag build
  // plain strings (such as the search filter) and are skipped.
  const uses = addedLines('public/app.js').filter(l => /<[a-z]/i.test(l)).flatMap(l => l.match(/\$\{[^}]*\bnotes?\b[^}]*\}/g) || []);
  statics['note escaped in UI'] = uses.length > 0 && uses.every(u => u.includes('esc('));
}

const out = {
  task, work,
  hidden, own: { total: Object.keys(own).length, passed: Object.values(own).filter(Boolean).length },
  statics,
  diff: { files: files.length, added: numstat.reduce((n, f) => n + f.added, 0), removed: numstat.reduce((n, f) => n + f.removed, 0), removedTestLines, changed: files },
  score: {
    core: `${Object.entries(hidden).filter(([k, v]) => k.startsWith('core:') && v).length}/${Object.keys(hidden).filter(k => k.startsWith('core:')).length}`,
    bonus: `${Object.entries(hidden).filter(([k, v]) => k.startsWith('bonus:') && v).length}/${Object.keys(hidden).filter(k => k.startsWith('bonus:')).length}`,
    statics: `${Object.values(statics).filter(Boolean).length}/${Object.keys(statics).length}`
  }
};
fs.writeFileSync(path.join(work, '.eval-result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
