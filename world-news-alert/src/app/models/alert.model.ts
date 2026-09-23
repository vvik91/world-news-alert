// models/alert.model.ts

/** EventType is dynamic so admins can add custom event types at runtime */
export type EventType = string;

export interface EventTypeOption {
  id: EventType;
  label: string;
  isCustom?: boolean;
}

/** Predefined default event types available out of the box */
export const DEFAULT_EVENT_TYPES: EventTypeOption[] = [
  { id: 'breaking_news', label: 'Breaking News' },
  { id: 'market_movement', label: 'Market Movements' },
  { id: 'natural_disaster', label: 'Natural Disasters' }
];

export type AlertStatus = 'active' | 'inactive';
export type DispatchStatus = 'success' | 'failed';

export interface DispatchLog {
  channelId: string;
  timestamp: Date;
  status: DispatchStatus;
  errorMessage?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  status: AlertStatus;
  createdAt: Date;
  channels: string[]; // List of channel IDs (e.g. ['email', 'slack'])
  dispatchLogs: DispatchLog[];
}

export type CreateAlertPayload = Omit<Alert, 'id' | 'createdAt' | 'dispatchLogs'>;