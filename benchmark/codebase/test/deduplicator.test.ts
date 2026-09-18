import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SlidingWindowDeduplicator } from '../src/deduplicator.ts';

describe('SlidingWindowDeduplicator', () => {
  let dedup: SlidingWindowDeduplicator;

  beforeEach(() => {
    dedup = new SlidingWindowDeduplicator(2000); // 2 second window
  });

  it('records new events and returns false', () => {
    const now = Date.now();
    const isDup = dedup.checkAndRecord('evt-1', now);
    assert.equal(isDup, false);
    assert.equal(dedup.size, 1);
  });

  it('detects duplicates within the window', () => {
    const now = Date.now();
    dedup.checkAndRecord('evt-1', now);
    const isDup = dedup.checkAndRecord('evt-1', now + 500);
    assert.equal(isDup, true);
  });

  it('allows different event IDs without conflict', () => {
    const now = Date.now();
    assert.equal(dedup.checkAndRecord('evt-1', now), false);
    assert.equal(dedup.checkAndRecord('evt-2', now + 100), false);
    assert.equal(dedup.size, 2);
  });
});
