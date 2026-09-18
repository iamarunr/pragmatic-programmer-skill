export class SlidingWindowDeduplicator {
  private windowMs: number;
  private seen: Map<string, number> = new Map();

  constructor(windowMs = 5000) {
    this.windowMs = windowMs;
  }

  public get size(): number {
    return this.seen.size;
  }

  public clear(): void {
    this.seen.clear();
  }

  /**
   * Checks if an event ID has been observed within the sliding window.
   * If observed within the window, returns true (duplicate).
   * Otherwise records the event timestamp and returns false.
   */
  public checkAndRecord(id: string, eventTimestamp: number): boolean {
    this.purgeExpired();

    const lastSeen = this.seen.get(id);
    if (lastSeen !== undefined) {
      if (eventTimestamp - lastSeen <= this.windowMs) {
        return true;
      }
    }

    this.seen.set(id, eventTimestamp);
    return false;
  }

  private purgeExpired(): void {
    // Purges entries older than windowMs
    const cutoff = Date.now() - this.windowMs;
    for (const [id, seenTime] of this.seen.entries()) {
      if (seenTime < cutoff) {
        this.seen.delete(id);
      }
    }
  }
}
