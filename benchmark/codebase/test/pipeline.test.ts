import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EventPipeline } from '../src/pipeline.ts';

describe('EventPipeline', () => {
  let pipeline: EventPipeline;

  beforeEach(() => {
    pipeline = new EventPipeline(5000);
  });

  it('successfully ingests and validates valid events', () => {
    const res = pipeline.ingest({
      id: 'evt-100',
      eventType: 'user.signup',
      timestamp: Date.now(),
      payload: { userId: 'u-1', email: 'alice@example.com' },
    });

    assert.equal(res.success, true);
    assert.equal(pipeline.getEvents().length, 1);
    const stats = pipeline.getStats();
    assert.equal(stats.ingested, 1);
    assert.equal(stats.processed, 1);
    assert.equal(stats.failed, 0);
    assert.equal(stats.duplicates, 0);
  });

  it('rejects invalid event schemas and tracks failure stats', () => {
    const res = pipeline.ingest({
      id: '',
      eventType: 'invalid.type',
      timestamp: -1,
      payload: 'not-an-object',
    });

    assert.equal(res.success, false);
    assert.match(res.error || '', /Field "id"/);
    const stats = pipeline.getStats();
    assert.equal(stats.failed, 1);
    assert.equal(stats.processed, 0);
  });

  it('rejects duplicate events within the window', () => {
    const now = Date.now();
    const event = {
      id: 'evt-dup',
      eventType: 'payment.processed',
      timestamp: now,
      payload: { amount: 49.99 },
    };

    const first = pipeline.ingest(event);
    assert.equal(first.success, true);

    const second = pipeline.ingest({ ...event, timestamp: now + 500 });
    assert.equal(second.success, false);
    assert.match(second.error || '', /Duplicate event/);

    const stats = pipeline.getStats();
    assert.equal(stats.ingested, 2);
    assert.equal(stats.duplicates, 1);
    assert.equal(stats.processed, 1);
  });
});
