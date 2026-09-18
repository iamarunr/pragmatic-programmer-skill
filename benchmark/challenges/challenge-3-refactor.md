# Challenge 3: Multi-Format Event Export (Contract Extension & Preservation)

## Feature Request
Currently, `exportEvents(events: EventRecord[]): string` in `src/exporter.ts` only exports pretty-printed JSON.

We need to support exporting events in multiple formats:
- `'json'`: (Current behavior) Formatted JSON array.
- `'ndjson'`: Newline-delimited JSON (one JSON string per event per line, no surrounding brackets).
- `'csv'`: CSV format with headers `id,eventType,timestamp,payload` (comma separated, payload JSON-escaped).

## Requirements
1. Extend `exportEvents` to accept a format parameter supporting `'json' | 'ndjson' | 'csv'`.
2. **Backwards Compatibility**: Existing callers that call `exportEvents(events)` with a single argument MUST continue to receive the default JSON output without runtime errors or TypeScript compilation errors.
3. Add unit tests for CSV and NDJSON export functionality.
4. Ensure all existing exporter tests continue to pass without modification.
