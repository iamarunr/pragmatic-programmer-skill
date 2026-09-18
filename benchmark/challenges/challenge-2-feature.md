# Challenge 2: Webhook Signature Verification & Timestamp Freshness

## Feature Request
We need to secure event ingestion against tampering and replay attacks.

## Requirements
1. Implement HMAC-SHA256 signature verification:
   - Function: `verifyWebhookSignature(rawPayload: string, signatureHeader: string, secretKey: string): boolean`
   - Must use constant-time comparison to prevent timing attacks.
   - The signature header is formatted as `sha256=<hex_digest>`.
2. Implement timestamp drift validation:
   - Function: `isTimestampFresh(timestamp: number, maxDriftMs = 300_000): boolean`
   - Rejects timestamps older than 5 minutes or more than 5 minutes in the future compared to current time.
3. Add an authenticated ingestion method to `EventPipeline`:
   - `ingestAuthenticated(rawPayload: string, signatureHeader: string, secretKey: string): { success: boolean; error?: string }`
4. Write thorough unit tests covering:
   - Valid signature verification
   - Tampered payload rejection
   - Invalid secret rejection
   - Timing freshness pass/fail
