import type { EventRecord } from './types.ts';

/**
 * Serializes a list of event records into formatted JSON.
 */
export function exportEvents(events: EventRecord[]): string {
  return JSON.stringify(events, null, 2);
}
