import { SlidingWindowDeduplicator } from './deduplicator.ts';
import { validateEvent } from './validator.ts';
import type { EventRecord, PipelineStats } from './types.ts';

export class EventPipeline {
  private deduplicator: SlidingWindowDeduplicator;
  private processedEvents: EventRecord[] = [];
  private stats: PipelineStats = {
    ingested: 0,
    duplicates: 0,
    processed: 0,
    failed: 0,
  };

  constructor(windowMs = 5000) {
    this.deduplicator = new SlidingWindowDeduplicator(windowMs);
  }

  public ingest(event: unknown): { success: boolean; error?: string } {
    this.stats.ingested += 1;

    const validation = validateEvent(event);
    if (!validation.valid) {
      this.stats.failed += 1;
      return { success: false, error: validation.errors?.join('; ') };
    }

    const record = event as EventRecord;
    const isDuplicate = this.deduplicator.checkAndRecord(record.id, record.timestamp);

    if (isDuplicate) {
      this.stats.duplicates += 1;
      return { success: false, error: `Duplicate event detected for id: ${record.id}` };
    }

    this.processedEvents.push(record);
    this.stats.processed += 1;
    return { success: true };
  }

  public getStats(): Readonly<PipelineStats> {
    return { ...this.stats };
  }

  public getEvents(): ReadonlyArray<EventRecord> {
    return [...this.processedEvents];
  }

  public reset(): void {
    this.processedEvents = [];
    this.deduplicator.clear();
    this.stats = { ingested: 0, duplicates: 0, processed: 0, failed: 0 };
  }
}
