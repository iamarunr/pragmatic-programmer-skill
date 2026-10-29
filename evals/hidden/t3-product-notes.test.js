// Hidden checks for t3-product-notes. Each test name is one graded behavior.
// The input field name is not specified by the task, so `note` and `notes` are both accepted.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { tracker, cloud, result, url, tempDir, holds } = require('./_helpers');

const NOTE = "for Mahi's laptop";

function updateLocal(tr, id, note) {
  for (const key of ['note', 'notes']) {
    try { tr.update(id, { [key]: note }); } catch { continue; }
    if (holds(tr.find(id), note)) return key;
  }
  return null;
}
async function updateCloud(store, id, note) {
  for (const key of ['note', 'notes']) {
    try { await store.update(id, { [key]: note }); } catch { continue; }
    if (holds(await store.get(id), note)) return key;
  }
  return null;
}

test('core: local note can be saved and is listed', async t => {
  const tr = tracker(t, { scrape: async () => result(900) });
  const p = tr.add({ url });
  assert.ok(updateLocal(tr, p.id, NOTE), 'note not stored');
  assert.ok(holds(tr.list().products[0], NOTE), 'note not in list()');
});
test('core: local saving a note keeps the price target', async t => {
  const tr = tracker(t, { scrape: async () => result(900) });
  const p = tr.add({ url, priceThreshold: 1000 });
  assert.ok(updateLocal(tr, p.id, NOTE));
  assert.equal(tr.find(p.id).priceThreshold, 1000);
});
test('core: local saving a target keeps the note', async t => {
  const tr = tracker(t, { scrape: async () => result(900) });
  const p = tr.add({ url });
  assert.ok(updateLocal(tr, p.id, NOTE));
  tr.update(p.id, { priceThreshold: 900 });
  assert.ok(holds(tr.find(p.id), NOTE));
  assert.equal(tr.find(p.id).priceThreshold, 900);
});
test('core: local state saved before notes existed still loads and accepts a note', async t => {
  const directory = tempDir(t);
  const product = { id: 'old', url, name: 'MacBook Pro', priceThreshold: 1000, createdAt: '2025-12-01T00:00:00.000Z',
    history: [{ price: 1099, currency: 'USD', at: '2025-12-01T01:00:00.000Z', source: 'old' }],
    lastAttemptAt: '2025-12-01T01:00:00.000Z', lastError: null, alertError: null, lastAlert: null };
  fs.writeFileSync(path.join(directory, 'tracker-state.json'), JSON.stringify({ version: 1, products: [product] }));
  const tr = tracker(t, { directory, scrape: async () => result(900) });
  assert.equal(tr.list().products.length, 1);
  assert.ok(updateLocal(tr, 'old', NOTE));
  assert.equal(tr.find('old').priceThreshold, 1000);
});
test('core: local oversized or non-text note is not stored as is', async t => {
  const tr = tracker(t, { scrape: async () => result(900) });
  const p = tr.add({ url });
  const key = updateLocal(tr, p.id, NOTE) || 'note';
  try { tr.update(p.id, { [key]: 'x'.repeat(10000) }); } catch { /* rejecting is fine */ }
  assert.ok(!Object.values(tr.find(p.id)).some(v => typeof v === 'string' && v.length >= 10000), 'stored a 10,000-character note');
  try { tr.update(p.id, { [key]: { evil: true } }); } catch { /* rejecting is fine */ }
  assert.ok(!Object.values(tr.find(p.id)).some(v => v && typeof v === 'object' && v.evil), 'stored an object as the note');
});
test('core: cloud saving a note keeps the target, and saving a target keeps the note', async t => {
  const c = await cloud(t, { threshold: 1000 });
  assert.ok(await updateCloud(c.store, c.product.id, NOTE), 'note not stored');
  assert.equal((await c.store.get(c.product.id)).priceThreshold, 1000);
  await c.store.update(c.product.id, { priceThreshold: 900 });
  const after = await c.store.get(c.product.id);
  assert.ok(holds(after, NOTE)); assert.equal(after.priceThreshold, 900);
  assert.ok((await c.store.list()).some(p => holds(p, NOTE)), 'note not in list()');
});
