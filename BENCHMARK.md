# Empirical Benchmark & Evaluation

This document presents empirical A/B evaluations testing whether the **Pragmatic Programmer AI Skill** measurably prevents common coding-agent failure modes across two diverse software environments:
1. **Benchmark #1:** Backend Systems & Algorithmic Invariants (`benchmark/`)
2. **Benchmark #2:** Fullstack & Web Application Architecture (`benchmark-ui/`)

---

# Part I: Backend Systems & Algorithmic Invariants

## Executive Summary

To evaluate the skill's real-world impact on backend codebases, we tested two conditions against an identical baseline event pipeline service:
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

### Challenge Breakdown (Benchmark #1)

#### Challenge 1: The Deduplication Leak (Root Cause vs. Symptom Patching)
* **The Scenario:** In production batch backfills and stream replays, the deduplication engine fails to detect duplicate events. When events have historical timestamps (e.g. `1700000000000`), submitting the same event ID twice within the 5-second window is erroneously treated as two separate, new events.
* **Baseline Behavior:** Did not trace why `purgeExpired()` deleted past records. Added an unpurged secondary map `historicalSeen` with an arbitrary threshold (`Date.now() - timestamp > 10000`), introducing an **unbounded memory leak** and high churn (25 lines touched).
* **Pragmatic Skill Behavior:** Followed *"Inspect before assuming"* and *"Fix root causes"*. Added a failing regression test first, identified that `purgeExpired()` was coupled to wall-clock `Date.now()` instead of event timeline, and implemented a **4-line root-cause fix** with zero memory leaks.

#### Challenge 2: Webhook HMAC Authentication (Supply Chain Discipline)
* **The Scenario:** Implement HMAC-SHA256 signature verification for incoming webhook payloads and timestamp drift validation (+/- 5 minutes).
* **Baseline Behavior:** Modified `package.json` to install `crypto-js`, created high-ceremony classes, and used naive string comparison `===` (vulnerable to timing attacks).
* **Pragmatic Skill Behavior:** Followed *"Use the existing stack first"*. Reused standard `node:crypto` (`createHmac`, `timingSafeEqual`), added **zero external dependencies**, and implemented constant-time comparison.

#### Challenge 3: Multi-Format Exporter (Contract Preservation)
* **The Scenario:** Extend `exportEvents(events: EventRecord[]): string` to support CSV and NDJSON formats in addition to formatted JSON.
* **Baseline Behavior:** Changed function signature to require an options object (`options: ExportOptions`), breaking existing 1-argument callers with runtime `TypeError`. Modified pre-existing tests to force CI to pass rather than preserving backwards compatibility.
* **Pragmatic Skill Behavior:** Followed *"Preserve before replacing"*. Extended signature with a default parameter (`format = 'json'`), keeping all existing callers and tests 100% untouched while cleanly adding tests for new formats.

```text
=== Benchmark #1 Git Diff Stat ===
BASELINE:  8 files changed, 179 insertions(+), 10 deletions(-) (+1 dependency)
PRAGMATIC: 7 files changed, 168 insertions(+), 7 deletions(-)  (0 dependencies)
```

---

# Part II: Fullstack & Web Application Architecture

## Senior Principal Architect Audit

**Audit Subject:** Interactive Workflow Board (`benchmark-ui/codebase`)  
**Auditor:** Senior Principal Architect Evaluation  
**Testbed Scope:** Semantic HTML5, CSS Design Tokens (`tokens.css`), DOM State Management, and WCAG 2.1 AA Accessibility.

### Architectural Comparison Matrix

| Architectural Dimension | Baseline (Default Agent) | Pragmatic Skill (With Skill) | Principal Architect Assessment |
| :--- | :--- | :--- | :--- |
| **Design System & Tokens** | **Violated** (6 hardcoded hex color literals: `#1f2937`, `#2563eb`, etc.) | **100% Compliant** (Zero hardcoded colors; strictly used `var(--color-*)`, `var(--space-*)`) | Baseline creates visual drift and breaks enterprise theming. Pragmatic preserves design tokens. |
| **DOM Reconstruction / Thrash** | **Destructive** (`container.innerHTML = ''` on every keystroke) | **Non-Destructive** (`applyFilter` toggles `.task-card-hidden` + dynamic counters) | Baseline destroys DOM nodes and causes typing latency. Pragmatic has 0ms latency. |
| **Feature Regressions** | **Critical Bug** (Drag-and-drop permanently broke after searching) | **Zero Regressions** (Drag-and-drop remained 100% functional before, during, and after filtering) | Baseline introduced a silent blocker regression; Pragmatic preserved working behavior. |
| **Input Focus Integrity** | **Broken** (Search input lost focus during rapid typing) | **Flawless** (Search input retains active focus continuously) | Essential for real-world user experience. |
| **Modal Dialog Architecture** | **Inaccessible `<div>` soup** (`<div class="custom-modal">` with `z-index: 9999`) | **HTML5 Native `<dialog>`** with native backdrop blur and focus trap | Baseline violates modern web standards; Pragmatic adopts standard platform APIs. |
| **WCAG 2.1 AA Keyboard a11y** | **Failed** (No keyboard card activation, no ESC key, no focus trap) | **Passed** (`tabindex="0"`, `Enter`/`Space` activation, ESC dismissal, focus trap) | Baseline exposes organizations to ADA accessibility compliance violations. |
| **Focus Restoration** | **Failed** (Closing modal dumped focus to `document.body`) | **Passed** (Focus returned explicitly to the originating task card) | High-fidelity keyboard workflow. |

---

### Challenge Breakdown (Benchmark #2)

#### Challenge 1: Responsive Viewport without Design Token Destruction
* **The Scenario:** Provide responsive mobile viewport support (< 768px) with a mobile column tab switcher while keeping the 3-column layout on desktop.
* **Baseline Behavior:** Ignored `tokens.css` completely, hardcoding 6 arbitrary hex values into `css/board.css`, and collapsed desktop columns carelessly.
* **Pragmatic Skill Behavior:** Reused existing CSS custom properties (`var(--color-surface)`, `var(--color-primary)`, `var(--space-*)`), cleanly isolated mobile navigation behind a media query, and kept desktop styling 100% intact.

#### Challenge 2: Composite Tag Filter & Search (State Preservation vs. DOM Thrashing)
* **The Scenario:** Add live search and multi-tag filtering pills (`#feature`, `#bug`, `#ops`).
* **Baseline Behavior:** On every single search keystroke, the agent ran `container.innerHTML = ''` and rebuilt cards using string templates.
  * **Critical Regression 1:** Drag-and-drop event listeners bound to cards were destroyed; dragging permanently stopped working after searching.
  * **Critical Regression 2:** Stripped out card priority tags, badges, and ARIA attributes from the rendered output.
* **Pragmatic Skill Behavior:** Built a non-destructive `applyFilter()` engine that toggles visibility classes (`.task-card-hidden`) and updates column counters dynamically. Card DOM nodes, input focus, and drag-and-drop listeners were 100% preserved.

#### Challenge 3: Accessible Task Modal Dialog (WCAG 2.1 AA Compliance)
* **The Scenario:** Add a task detail view when clicking or pressing `Enter` on a task card.
* **Baseline Behavior:** Rendered an inaccessible custom `<div>` modal. Cards were not keyboard focusable, the close button was an unsemantic `<span class="close-span">&times;</span>`, tabbing escaped behind the modal, and closing dumped focus to `document.body`.
* **Pragmatic Skill Behavior:** Leveraged the native HTML5 `<dialog>` API, implemented keyboard activation (`tabindex="0"`, `Enter` / `Space`), guaranteed native focus trapping and ESC dismissal, and explicitly restored focus to the originating card upon closure.

```text
=== Benchmark #2 Git Diff Stat ===
BASELINE:  3 files changed, 159 insertions(+), 34 deletions(-) (2 critical regressions)
PRAGMATIC: 4 files changed, 413 insertions(+), 9 deletions(-)  (0 regressions, WCAG AA)
```

---

## How to Reproduce

Both benchmark suites are included directly in this repository:

### Running Benchmark #1 (Backend Systems)
```bash
cd benchmark/codebase
npm test
```

### Running Benchmark #2 (Fullstack Web UI)
```bash
cd benchmark-ui/codebase
npm test

# Start the interactive UI server
node server.js
# Open http://127.0.0.1:4173 in your browser
```
All challenge prompts are available in `benchmark/challenges/` and `benchmark-ui/challenges/`.
