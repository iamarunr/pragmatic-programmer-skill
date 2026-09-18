export interface EventRecord {
  id: string;
  eventType: string;
  timestamp: number;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface PipelineStats {
  ingested: number;
  duplicates: number;
  processed: number;
  failed: number;
}
