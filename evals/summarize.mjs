#!/usr/bin/env node
// Summarizes graded runs under a directory into a Markdown table, one row per task and condition.
//
//   node evals/summarize.mjs <results-dir>
//
// Each run directory holds .eval-result.json (from grade.mjs) and, optionally, .eval-meta.json
// ({ task, cond, seconds, cost, turns }). Without meta, the condition is read from the directory
// name (<task>-<base|skill>-<rep>).
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: summarize.mjs <results-dir>'); process.exit(2); }
const read = file => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };

const rows = new Map();
for (const name of fs.readdirSync(dir).sort()) {
  const result = read(path.join(dir, name, '.eval-result.json'));
  if (!result) continue;
  const meta = read(path.join(dir, name, '.eval-meta.json')) || {};
  const cond = meta.cond || name.match(/-(base|skill)-\d+$/)?.[1] || '?';
  const key = `${result.task}|${cond}`;
  if (!rows.has(key)) rows.set(key, []);
  rows.get(key).push({ result, meta });
}

const ratio = s => { const [a, b] = s.split('/').map(Number); return [a, b]; };
const sum = (runs, pick) => runs.reduce(([a, b], r) => { const [x, y] = ratio(pick(r)); return [a + x, b + y]; }, [0, 0]);
const pct = ([a, b]) => (b ? `${Math.round((100 * a) / b)}% (${a}/${b})` : '—');
const avg = (runs, pick) => { const v = runs.map(pick).filter(n => typeof n === 'number'); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
const fmt = (n, digits = 0) => (n === null ? '—' : n.toFixed(digits));

console.log('| Task | Condition | Runs | Core behavior | Bonus | Hygiene/docs | Lines changed | Seconds | Cost $ |');
console.log('|---|---|---|---|---|---|---|---|---|');
for (const [key, runs] of rows) {
  const [task, cond] = key.split('|');
  console.log(`| ${task} | ${cond} | ${runs.length} | ${pct(sum(runs, r => r.result.score.core))} | ${pct(sum(runs, r => r.result.score.bonus))} | ${pct(sum(runs, r => r.result.score.statics))} | ${fmt(avg(runs, r => r.result.diff.added + r.result.diff.removed))} | ${fmt(avg(runs, r => r.meta.seconds))} | ${fmt(avg(runs, r => r.meta.cost), 2)} |`);
}

// Per-check failures, so a percentage can be traced to what actually went wrong.
console.log('\n**Failed checks**\n');
for (const [key, runs] of rows) {
  const failed = {};
  for (const { result } of runs) for (const [k, v] of Object.entries({ ...result.hidden, ...result.statics })) if (!v) failed[k] = (failed[k] || 0) + 1;
  const list = Object.entries(failed).map(([k, n]) => `${k} (${n}/${runs.length})`);
  console.log(`- ${key.replace('|', ', ')}: ${list.length ? list.join('; ') : 'none'}`);
}
