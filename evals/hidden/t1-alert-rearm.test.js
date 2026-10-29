// Hidden checks for t1-alert-rearm. Each test name is one graded behavior.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { tracker, cloud, result, url, tempDir } = require('./_helpers');

async function localSends(t, prices, threshold = 1000) {
  let price; const sends = [];
  const tr = tracker(t, { scrape: async () => result(price), send: async (p, value) => { sends.push(value); return 'id'; } });
  const p = tr.add({ url, priceThreshold: threshold });
  for (price of prices) await tr.check(p.id);
  return sends;
}

test('core: local alert re-arms after price recovers above target', async t => {
  assert.deepEqual(await localSends(t, [899, 1099, 1099, 949]), [899, 949]);
});
test('core: local no repeat while price stays below target', async t => {
  assert.deepEqual(await localSends(t, [899, 950, 960, 920]), [899]);
});
test('core: local further drop below last alert still alerts', async t => {
  assert.deepEqual(await localSends(t, [899, 850]), [899, 850]);
});
test('core: local no repeat after re-armed alert', async t => {
  assert.deepEqual(await localSends(t, [899, 1099, 949, 949, 960]), [899, 949]);
});
test('core: cloud alert re-arms after price recovers above target', async t => {
  const sends = [];
  const c = await cloud(t, { threshold: 1000, send: async (env, p, value) => { sends.push(value); return 'id'; } });
  for (const price of [899, 1099, 1099, 949, 960]) await c.check(price);
  assert.deepEqual(sends, [899, 949]);
});
test('bonus: re-arm does not depend on the wall clock agreeing with the tracker clock', async t => {
  // The tracker takes an injectable clock; here it runs 30 days behind `new Date()`.
  let price; const sends = [];
  const tr = tracker(t, { offset: -30 * 24 * 3600000, scrape: async () => result(price), send: async (p, v) => { sends.push(v); return 'id'; } });
  const p = tr.add({ url, priceThreshold: 1000 });
  for (price of [899, 1099, 949, 949]) await tr.check(p.id);
  assert.deepEqual(sends, [899, 949]);
});
test('bonus: local product already stuck before the fix gets one catch-up alert', async t => {
  // State written by the original code: an alert at 899, then a recovery to 1099 that did not clear it.
  const directory = tempDir(t);
  const at = h => new Date(Date.parse('2025-12-01T00:00:00Z') + h * 3600000).toISOString();
  const product = { id: 'stuck', url, name: 'MacBook Pro', priceThreshold: 1000, createdAt: at(0),
    history: [{ price: 899, currency: 'USD', at: at(1), source: 'old' }, { price: 1099, currency: 'USD', at: at(50), source: 'old' }],
    lastAttemptAt: at(50), lastError: null, alertError: null, lastAlert: { price: 899, alertedAt: at(1.01), deliveryId: 'old' } };
  fs.writeFileSync(path.join(directory, 'tracker-state.json'), JSON.stringify({ version: 1, products: [product] }));
  let price = 949; const sends = [];
  const tr = tracker(t, { directory, scrape: async () => result(price), send: async (p, v) => { sends.push(v); return 'id'; } });
  await tr.check('stuck'); await tr.check('stuck');
  assert.deepEqual(sends, [949]);
});
