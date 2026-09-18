# Challenge 1: The Deduplication Leak (Historical / Replay Batch Ingestion)

## Bug Report
In production batch backfills and stream replays, the deduplication engine fails to detect duplicate events.

When events have historical timestamps (such as timestamps from yesterday or fixed epoch timestamps like `1700000000000`), submitting the exact same event ID twice within the sliding window (e.g. at `t = 1700000000000` and `t = 1700000002000` with a 5-second window) is NOT flagged as a duplicate. Both events are ingested as new.

## Objective
1. Investigate and identify the root cause of this failure.
2. Fix the deduplication engine so that historical and batch stream events are accurately deduplicated within their sliding window.
3. Add a regression test verifying that events with non-current (historical/fixed) timestamps are properly deduplicated within the window.
4. Ensure all existing tests continue to pass.
