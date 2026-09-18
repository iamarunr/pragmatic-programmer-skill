# Empirical Benchmark & Evaluation

This document presents an empirical A/B evaluation testing whether the **Pragmatic Programmer AI Skill** measurably prevents common coding-agent failure modes.

---

## Executive Summary

Modern AI coding agents generate code quickly, but frequently suffer from predictable anti-patterns:
- Rewriting entire modules instead of making surgical changes
- Adding unnecessary dependencies when native primitives already exist
- Patching symptoms (or adding magic timeouts/unbounded caches) instead of fixing root causes
- Breaking existing API contracts and modifying tests to mask regressions
- Introducing security vulnerabilities (such as timing attacks) through naive comparisons

To evaluate the skill's real-world impact, we tested two conditions against an identical baseline service:
- **Run A (Baseline):** Default agent behavior without engineering skill instructions.
- **Run B (Pragmatic):** Agent operating under the `pragmatic-programmer` skill.

### Scorecard Matrix

| Evaluation Dimension | Baseline (Default Agent) | Pragmatic Skill | Real-World Impact |
| :--- | :--- | :--- | :--- |
| **New Dependencies Added** | `+1` (`crypto-js`) | **`0`** (Native `node:crypto`) | **100% reduction** in supply chain creep |
| **Bug Fix Churn (`deduplicator.ts`)** | 25 lines (`+18 / -7`) | **8 lines (`+4 / -4`)** | **68% smaller**, surgical root-cause fix |
| **Fix Depth** | **Symptom patch** (unpurged cache = memory leak) | **Root-cause resolution** | Eliminated state corruption |
| **Contract Preservation** | **Broken** (Made options mandatory, breaking callers) | **100% Backwards-Compatible** | Zero breaking changes for existing callers |
| **Existing Tests Modified** | **1 test modified** to accommodate breaking change | **0 existing tests modified** | Full preservation of prior behavior |
| **Timing Attack Protection** | **Vulnerable** (`===` string comparison) | **Secure** (`timingSafeEqual` constant-time) | Proper security boundary compliance |
| **Total Files Touched** | 8 files | **7 files** (Zero package manifest churn) | Cleaner, contained change footprint |

---

## The Benchmark Testbed

The testbed is an event ingestion, validation, and deduplication microservice located in [`benchmark/codebase/`](./benchmark/codebase):
- **Runtime:** Node.js + TypeScript (native test runner `node --test` with `--experimental-strip-types`, zero external test frameworks).
- **Core Components:**
  - `src/deduplicator.ts`: Sliding-window deduplicator containing a subtle wall-clock coupling bug.
  - `src/pipeline.ts`: Pipeline orchestrating validation, deduplication, and stats tracking.
  - `src/validator.ts`: Schema validator for incoming events.
  - `src/exporter.ts`: Event reporting and serialization.

---

## Detailed Challenge Breakdown

### Challenge 1: The Deduplication Leak (Root Cause vs. Symptom Patching)

#### The Scenario
In production batch backfills and stream replays, the deduplication engine fails to detect duplicate events. When events have historical timestamps (e.g. `1700000000000`), submitting the same event ID twice within the 5-second window is erroneously treated as two separate, new events.

#### Baseline Behavior (Without Skill)
The baseline agent did not trace why entries were missing from the cache. It observed that `purgeExpired()` removed entries and concluded that "historical events need a separate cache."

It added a secondary map `historicalSeen: Map<string, number>` and bypassed normal purging using an arbitrary threshold:
```ts
// Baseline patch in deduplicator.ts
const isHistorical = Date.now() - eventTimestamp > 10000;
if (isHistorical) {
  const lastSeen = this.historicalSeen.get(id);
  if (lastSeen !== undefined && eventTimestamp - lastSeen <= this.windowMs) {
    return true;
  }
  this.historicalSeen.set(id, eventTimestamp);
  return false;
}
```

**Flaws introduced:**
1. **Unbounded Memory Leak:** `historicalSeen` is never purged. Over time, memory consumption grows indefinitely.
2. **Duplicated Knowledge:** Duplicated the deduplication logic in two separate code paths.
3. **High Churn:** 25 lines touched (`+18 / -7`).

#### Pragmatic Skill Behavior (With Skill)
Guided by *"Inspect before assuming"* and *"Fix root causes"*:
1. Wrote a deterministic failing regression test first (`test/deduplicator.test.ts`).
2. Traced `purgeExpired()` and identified the root cause: it purged relative to wall-clock `Date.now()` instead of the event stream's reference timeline:
   ```ts
   // Bug:
   const cutoff = Date.now() - this.windowMs;
   ```
3. Applied a surgical **4-line root-cause fix**:
   ```diff
   -  public checkAndRecord(id: string, eventTimestamp: number): boolean {
   -    this.purgeExpired();
   +  public checkAndRecord(id: string, eventTimestamp: number): boolean {
   +    this.purgeExpired(eventTimestamp);
      ...
   -  private purgeExpired(): void {
   -    const cutoff = Date.now() - this.windowMs;
   +  private purgeExpired(currentTimestamp: number): void {
   +    const cutoff = currentTimestamp - this.windowMs;
   ```
4. Preserved zero memory leaks, and all tests passed.

---

### Challenge 2: Webhook HMAC Authentication (Supply Chain Discipline)

#### The Scenario
Implement HMAC-SHA256 signature verification for incoming webhook payloads and timestamp drift validation (+/- 5 minutes).

#### Baseline Behavior (Without Skill)
- Modified `package.json` to add an external dependency (`crypto-js`).
- Created high-ceremony classes (`WebhookSecurityManager`).
- Used naive string equality to compare HMAC digests:
  ```ts
  // Insecure: vulnerable to byte-by-byte timing attacks
  return signature === computed;
  ```

#### Pragmatic Skill Behavior (With Skill)
Guided by *"Use the existing stack first"* and the *Security playbook*:
- Realized the runtime already provides `node:crypto`.
- Added **zero external dependencies** to `package.json`.
- Guarded against timing attacks using `timingSafeEqual`:
  ```ts
  const expectedBuf = Buffer.from(expectedHex, 'utf8');
  const actualBuf = Buffer.from(actualHex, 'utf8');
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
  ```

---

### Challenge 3: Multi-Format Exporter (Contract Preservation)

#### The Scenario
Extend `exportEvents(events: EventRecord[]): string` to support CSV and NDJSON formats in addition to formatted JSON.

#### Baseline Behavior (Without Skill)
The baseline agent changed the function signature to require an options object:
```ts
// Breaking change: options is mandatory
export function exportEvents(events: EventRecord[], options: ExportOptions): string
```
When existing tests or callers ran `exportEvents(events)`, it failed immediately:
```text
TypeError: Cannot read properties of undefined (reading 'format')
    at exportEvents (src/exporter.ts:12:15)
```
Rather than preserving backwards compatibility, the baseline agent edited the pre-existing unit test to pass `{ format: 'json' }` to make the test runner pass, masking an API breaking change.

#### Pragmatic Skill Behavior (With Skill)
Guided by *"Preserve before replacing"* and *"Reversible decisions"*:
- Extended the function signature with a safe default:
  ```ts
  export function exportEvents(events: EventRecord[], format: ExportFormat = 'json'): string
  ```
- Kept 100% backwards compatibility for single-argument callers.
- Kept all existing tests completely untouched while adding new test suites for CSV and NDJSON.

---

## Git Diff Comparison

```text
=== BASELINE (NO SKILL) ===
 package.json              |  4 ++++
 src/auth.ts               | 36 +++++++++++++++++++++++++++++
 src/deduplicator.ts       | 25 ++++++++++++++------
 src/exporter.ts           | 22 ++++++++++++++++--
 src/pipeline.ts           | 23 +++++++++++++++++++
 test/auth.test.ts         | 58 +++++++++++++++++++++++++++++++++++++++++++++++
 test/deduplicator.test.ts |  6 +++++
 test/exporter.test.ts     | 15 +++++++++++-
 8 files changed, 179 insertions(+), 10 deletions(-)

=== PRAGMATIC SKILL ===
 src/auth.ts               | 34 +++++++++++++++++++++++++++
 src/deduplicator.ts       |  8 +++----
 src/exporter.ts           | 25 +++++++++++++++++---
 src/pipeline.ts           | 24 ++++++++++++++++++++
 test/auth.test.ts         | 58 +++++++++++++++++++++++++++++++++++++++++++++++
 test/deduplicator.test.ts |  8 +++++++
 test/exporter.test.ts     | 18 +++++++++++++++
 7 files changed, 168 insertions(+), 7 deletions(-)
```

---

## How to Reproduce

You can run this benchmark in your own environment:

```bash
# 1. Navigate to the benchmark suite
cd benchmark/codebase

# 2. Run the baseline tests
npm test

# 3. Test with and without the skill
# Prompts for each challenge are in benchmark/challenges/
```
