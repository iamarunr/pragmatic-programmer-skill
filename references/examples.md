# Examples

Before/after cases taken from this repository's benchmark runs. Each shows a common failure and the change the rules call for.

## Contents

- Root cause vs. side cache (debugging)
- Standard library vs. new dependency (dependencies, security)
- Compatible extension vs. breaking signature (contracts)
- Non-destructive DOM update vs. rebuild (web)
- Design tokens vs. hard-coded values (web)

## Root cause vs. side cache

**Task:** Duplicate events with historical timestamps are not detected.

**Avoid:** Adding a second `historicalSeen` map plus a `Date.now() - timestamp > 10000` check. It never purges, so memory grows without bound, and `10000` is a magic number.

**Do:** Write a failing regression test, then trace why entries disappear. `purgeExpired()` compared against wall-clock time instead of the event timeline. Pass the event timestamp into `purgeExpired(eventTimestamp)`: a 4-line root-cause fix.

## Standard library vs. new dependency

**Task:** Verify HMAC-SHA256 webhook signatures.

**Avoid:** Adding `crypto-js` to `package.json` and comparing signatures with `===`, which leaks timing information.

**Do:** Use `node:crypto` (`createHmac`, `timingSafeEqual`). No new dependency, and the comparison takes constant time.

## Compatible extension vs. breaking signature

**Task:** Add CSV and NDJSON output to `exportEvents(events)`.

**Avoid:** Changing it to `exportEvents(events, options)` with `options` required, then editing the existing test to pass `{ format: 'json' }`. Every existing one-argument caller now throws.

**Do:** `exportEvents(events, format: ExportFormat = 'json')`. Existing callers and tests stay untouched; add new tests for the new formats.

## Non-destructive DOM update vs. rebuild

**Task:** Add live search and tag filtering to a task board.

**Avoid:** `container.innerHTML = ''` and re-rendering cards on every keystroke. It destroys drag-and-drop listeners, drops ARIA attributes, and steals input focus.

**Do:** Keep the existing nodes and toggle a visibility class (`.task-card-hidden`) in an `applyFilter()` function, updating counts in place. Then verify in the browser that drag-and-drop still works after filtering.

## Design tokens vs. hard-coded values

**Task:** Make the board responsive below 768px.

**Avoid:** Writing hex colors such as `#1f2937` into `board.css` when `tokens.css` already defines them.

**Do:** Use the existing `var(--color-*)` and `var(--space-*)` tokens, add the mobile layout behind a media query, and check that desktop is unchanged.
