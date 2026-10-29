// Shared helpers for hidden checks. Copied into the work directory after the agent finishes,
// so the agent never sees them. Run from the work directory root.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = process.cwd();
const load = rel => require(path.join(root, rel));
const loadModule = rel => import(path.join(root, rel));

const url = 'https://www.microcenter.com/product/711043/macbook?storeid=095';
const config = { resendApiKey: 're_test', fromEmail: 'sender@example.org', toEmail: 'person@example.org', products: [] };
const cloudEnv = {
  ACCESS_TEAM_DOMAIN: 'test.cloudflareaccess.com', ACCESS_AUD: 'test-audience', ALLOWED_EMAILS: 'owner@example.org',
  ALLOWED_STORE_HOSTS: 'microcenter.com', RESEND_API_KEY: 're_test', FROM_EMAIL: 'sender@example.org', TO_EMAIL: 'owner@example.org'
};
const result = price => ({ price, currency: 'USD', name: 'MacBook Pro', source: 'hidden check' });

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-eval-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

// Replaces the global Date so `new Date()` and `Date.now()` read a controlled clock. In production
// the tracker's injected clock and the wall clock are the same clock; checks must not fail code that
// relies on that, so both read this one clock unless a test deliberately offsets them.
function installClock(t, start = Date.now()) {
  const Real = globalThis.Date;
  let clock = start;
  class FakeDate extends Real {
    constructor(...args) { if (args.length) super(...args); else super(clock); }
    static now() { return clock; }
  }
  globalThis.Date = FakeDate;
  t.after(() => { globalThis.Date = Real; });
  return { now: () => clock, advance: ms => (clock += ms) };
}

// Local tracker whose clock moves one hour per reading, so observations are realistically spaced.
// `offset` runs the tracker's injected clock that far from the wall clock, to test independence.
function tracker(t, { scrape, send, directory = tempDir(t), offset = 0 } = {}) {
  const { Tracker } = load('lib/tracker');
  const clock = installClock(t);
  return new Tracker({ directory, config, scrape, send, now: () => new Date(clock.advance(3600000) + offset) });
}

// D1-shaped adapter over in-memory SQLite with every migration applied in order.
function database(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const dir = path.join(root, 'cloudflare/migrations');
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) db.exec(fs.readFileSync(path.join(dir, file), 'utf8'));
  return {
    raw: db,
    prepare(query) {
      const stmt = db.prepare(query);
      return { bind(...args) { return {
        async first() { return stmt.get(...args) || null; },
        async all() { return { results: stmt.all(...args) }; },
        async run() { const v = stmt.run(...args); return { meta: { changes: Number(v.changes) } }; }
      }; } };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try { const out = []; for (const s of statements) out.push(await s.run()); db.exec('COMMIT'); return out; }
      catch (err) { db.exec('ROLLBACK'); throw err; }
    }
  };
}

// Runs one cloud check per price through the real queue job, an hour apart on the shared clock.
// The job builds its own Store on Date.now; without a controlled clock, checks in a fast test would
// share a millisecond, which never happens in production.
async function cloud(t, { threshold, send } = {}) {
  const [{ Store }, { processJob }] = await Promise.all([loadModule('cloudflare/store.mjs'), loadModule('cloudflare/jobs.mjs')]);
  const db = database(t);
  const clock = installClock(t);
  const store = new Store(db, clock.now);
  const env = { ...cloudEnv, DB: db };
  const product = await store.add({ url, priceThreshold: threshold });
  const messages = [];
  const check = async price => {
    clock.advance(3600000);
    await store.enqueue(product.id, { send: async job => messages.push(job) });
    await processJob(env, messages.shift(), async () => result(price), send);
  };
  return { db, store, env, product, check };
}

// Finds a string anywhere in an object's own string fields, so checks do not depend on field names.
function holds(object, text) {
  return Object.values(object || {}).some(v => typeof v === 'string' && v.includes(text));
}

module.exports = { load, loadModule, url, config, cloudEnv, result, tempDir, installClock, tracker, database, cloud, holds };
