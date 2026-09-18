import type { EventRecord, ValidationResult } from './types.ts';

const ALLOWED_EVENT_TYPES = new Set(['user.signup', 'order.created', 'payment.processed', 'system.alert']);

export function validateEvent(event: unknown): ValidationResult {
  const errors: string[] = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be a non-null object'] };
  }

  const record = event as Partial<EventRecord>;

  if (typeof record.id !== 'string' || record.id.trim() === '') {
    errors.push('Field "id" must be a non-empty string');
  }

  if (typeof record.eventType !== 'string' || !ALLOWED_EVENT_TYPES.has(record.eventType)) {
    errors.push(`Field "eventType" must be one of: ${Array.from(ALLOWED_EVENT_TYPES).join(', ')}`);
  }

  if (typeof record.timestamp !== 'number' || isNaN(record.timestamp) || record.timestamp <= 0) {
    errors.push('Field "timestamp" must be a positive integer timestamp');
  }

  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) {
    errors.push('Field "payload" must be a valid key-value object');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
