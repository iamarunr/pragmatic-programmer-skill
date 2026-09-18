# Pragmatic Programmer Skill — Empirical Evaluation Scorecard

This scorecard presents an empirical A/B comparison evaluating agent performance on identical software challenges:
- **Run A (Baseline):** Default agent behavior without engineering skill instructions.
- **Run B (Pragmatic):** Agent operating under the `pragmatic-programmer` skill.

---

## 1. Executive Summary & Scorecard Matrix

| Evaluation Dimension | Baseline (Without Skill) | Pragmatic Skill (With Skill) | Delta / Impact |
| :--- | :--- | :--- | :--- |
| **New Dependencies Added** | `+1` (`crypto-js`) | **`0`** (Leveraged `node:crypto`) | **100% reduction** in supply chain bloat |
| **Bug Fix Precision (`deduplicator.ts`)** | `+18 / -7` (25 lines churn) | **`+4 / -4` (8 lines churn)** | **68% smaller**, surgical root-cause fix |
| **Fix Depth (Root Cause vs Symptom)** | **Symptom patch** (added unpurged secondary cache, causing a silent memory leak) | **Root-cause resolution** (purged relative to event reference timeline) | Eliminated state leakage & race conditions |
| **Contract / Backwards Compatibility** | **Broken** (Made options mandatory, breaking 1-arg callers) | **Preserved** (Optional parameter with default fallback) | Zero regressions for existing callers |
| **Existing Test Modification** | **1 test modified** to accommodate breaking change | **0 existing tests modified** | Full preservation of prior behavior |
| **Timing Attack Vulnerability** | **Vulnerable** (Standard `===` string equality) | **Secure** (`timingSafeEqual` constant-time comparison) | Proper security boundary compliance |
| **Total Files Touched** | 8 files | **7 files** (Zero package manifest churn) | Cleaner, contained change footprint |

---

## 2. Challenge-by-Challenge Breakdown

### Challenge 1: The Deduplication Leak (Historical Batch Ingestion)
* **The Problem:** The in-memory sliding-window deduplicator purged entries against wall-clock `Date.now() - windowMs`. When historical logs or batch backfills arrived with timestamps in the past, `purgeExpired()` immediately deleted them, allowing duplicates to leak through.
* **Baseline Behavior (Without Skill):**
  - Did not trace why `purgeExpired()` deleted past records.
  - Added a secondary map `historicalSeen: Map<string, number>` and bypassed `purgeExpired()` with a magic check (`Date.now() - eventTimestamp > 10000`).
  - *Resulting Flaw:* `historicalSeen` never purges its entries, causing **unbounded memory growth** over time.
* **Pragmatic Skill Behavior (With Skill):**
  - Followed *"Inspect before assuming"* and *"Fix root causes"*.
  - Added a failing regression test first (`test/deduplicator.test.ts`).
  - Recognized that the state machine must track time relative to the event stream, not wall-clock time.
  - Fixed in 4 lines: passed `eventTimestamp` to `purgeExpired(eventTimestamp)`.
  - All tests passed with zero memory leaks.

---

### Challenge 2: Webhook HMAC Authentication (Supply Chain Discipline)
* **The Task:** Verify HMAC-SHA256 signatures on webhook payloads and validate timestamp freshness within +/- 5 minutes.
* **Baseline Behavior (Without Skill):**
  - Added `crypto-js` to `package.json`.
  - Created high-ceremony `WebhookSecurityManager` class wrappers.
  - Used standard string comparison `===` to check signatures (vulnerable to byte-by-byte timing attacks).
* **Pragmatic Skill Behavior (With Skill):**
  - Followed *"Use the existing stack first"* and *"When making a security decision"*.
  - Leveraged Node's native built-ins: `node:crypto` (`createHmac`, `timingSafeEqual`).
  - Added **zero dependencies** to `package.json`.
  - Implemented constant-time buffer comparison to prevent timing vulnerabilities.

---

### Challenge 3: Multi-Format Exporter (Preservation vs Destructive Refactoring)
* **The Task:** Support CSV and NDJSON export formats in addition to formatted JSON.
* **Baseline Behavior (Without Skill):**
  - Changed `exportEvents(events: EventRecord[], options: ExportOptions)` making `options` mandatory.
  - Calling `exportEvents(events)` threw a runtime error: `TypeError: Cannot read properties of undefined (reading 'format')`.
  - Modified the existing unit test in `test/exporter.test.ts` to pass `{ format: 'json' }` to make CI pass.
* **Pragmatic Skill Behavior (With Skill):**
  - Followed *"Preserve before replacing"* and *"Reversible decisions"*.
  - Added default argument: `exportEvents(events: EventRecord[], format: ExportFormat = 'json')`.
  - Kept all existing callers and tests 100% valid with zero breaking changes.
  - Added separate tests validating CSV and NDJSON outputs.

---

## 3. Git Diff Statistics Comparison

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

## 4. Key Takeaways & Empirical Verdict

The testbed clearly demonstrates that the `pragmatic-programmer` skill directly counters the most common autonomous agent antipatterns:

1. **Surgical Precision over Sweeping Rewrite:**
   Instead of masking the bug with secondary state and arbitrary magic numbers, the agent fixed the root cause in 4 lines.
2. **Zero Supply Chain Bloat:**
   The skill prevented adding unnecessary npm dependencies (`crypto-js`) by enforcing reuse of the native runtime capabilities (`node:crypto`).
3. **Contract Preservation:**
   The skill prevented a breaking API change that broke existing callers, maintaining backwards compatibility through safe defaults.
4. **Security Awareness:**
   The skill guided the agent to use `timingSafeEqual` rather than naive string comparisons.
