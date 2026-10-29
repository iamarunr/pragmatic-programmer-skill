// Hidden checks for t2-percent-email. Each test name is one graded behavior.
const test = require('node:test');
const assert = require('node:assert/strict');
const { load, tracker, cloud, result, url, config } = require('./_helpers');

// Accept either reasonable baseline: previous check (4000 -> 3000 = 25%) or target (3500 -> 3000 = 14.3%).
const PERCENT = /\b(25|14\.3|14\.29)(\.0+)?\s?%/;
const BROKEN = /NaN|Infinity|undefined|null|-\d+(\.\d+)?\s?%/;

async function localEmails(t, prices) {
  const { sendAlertEmail } = load('lib/alerts');
  const emails = [];
  const resend = { emails: { send: async email => { emails.push(email); return { data: { id: 'id' } }; } } };
  let price;
  const tr = tracker(t, { scrape: async () => result(price), send: (p, value) => sendAlertEmail(resend, config, p, value) });
  const p = tr.add({ url, priceThreshold: 3500 });
  for (price of prices) await tr.check(p.id);
  return emails.map(e => `${e.subject}\n${e.text || ''}${e.html || ''}`);
}

async function cloudEmails(t, prices) {
  const { sendEmail } = await import(require('node:path').join(process.cwd(), 'cloudflare/jobs.mjs'));
  const emails = [];
  const fetcher = async (u, options) => { const b = JSON.parse(options.body); emails.push(`${b.subject}\n${b.text || ''}${b.html || ''}`); return Response.json({ id: 'id' }); };
  const c = await cloud(t, { threshold: 3500, send: (env, p, value, jobId) => sendEmail(env, p, value, jobId, fetcher) });
  for (const price of prices) await c.check(price);
  return emails;
}

test('core: local email shows the percentage drop', async t => {
  const [email] = await localEmails(t, [4000, 3000]);
  assert.match(email, PERCENT);
});
test('core: cloud email shows the percentage drop', async t => {
  const [email] = await cloudEmails(t, [4000, 3000]);
  assert.match(email, PERCENT);
});
test('core: local email with no earlier price is not broken', async t => {
  const [email] = await localEmails(t, [3000]);
  assert.ok(email); assert.doesNotMatch(email, BROKEN);
});
test('core: cloud email with no earlier price is not broken', async t => {
  const [email] = await cloudEmails(t, [3000]);
  assert.ok(email); assert.doesNotMatch(email, BROKEN);
});
test('core: local email after a price rise is not broken', async t => {
  // Raise the target after a rise so an alert fires on a price higher than the previous one.
  const { sendAlertEmail } = load('lib/alerts');
  const emails = [];
  const resend = { emails: { send: async email => { emails.push(`${email.subject}\n${email.text || ''}`); return { data: { id: 'id' } }; } } };
  let price;
  const tr = tracker(t, { scrape: async () => result(price), send: (p, value) => sendAlertEmail(resend, config, p, value) });
  const p = tr.add({ url });
  price = 3000; await tr.check(p.id);
  tr.update(p.id, { priceThreshold: 4000 });
  price = 3200; await tr.check(p.id);
  assert.equal(emails.length, 1); assert.doesNotMatch(emails[0], BROKEN);
});
