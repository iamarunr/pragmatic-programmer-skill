import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { exportEvents } from '../src/exporter.ts';
import type { EventRecord } from '../src/types.ts';

describe('exportEvents', () => {
  const sampleEvents: EventRecord[] = [
    {
      id: 'evt-1',
      eventType: 'user.signup',
      timestamp: 1700000000000,
      payload: { username: 'john_doe' },
    },
    {
      id: 'evt-2',
      eventType: 'order.created',
      timestamp: 1700000005000,
      payload: { total: 100 },
    },
  ];

  it('exports events as valid formatted JSON by default', () => {
    const jsonOutput = exportEvents(sampleEvents);
    const parsed = JSON.parse(jsonOutput);
    assert.equal(Array.isArray(parsed), true);
    assert.equal(parsed.length, 2);
    assert.equal(parsed[0].id, 'evt-1');
    assert.equal(parsed[1].eventType, 'order.created');
  });
});
