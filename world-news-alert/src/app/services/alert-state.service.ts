import { Injectable, signal, computed } from '@angular/core';
import { Alert, AlertStatus, CreateAlertPayload, DispatchLog, EventTypeOption, DEFAULT_EVENT_TYPES } from '../models/alert.model';
import { NotificationChannel } from '../models/channel.model';
import { ChannelHandler } from '../handlers/channel-handler.interface';
import { EmailChannelHandler } from '../handlers/email-channel.handler';
import { SlackChannelHandler } from '../handlers/slack-channel.handler';

@Injectable({
  providedIn: 'root'
})
export class AlertStateService {
  // Central reactive state
  private readonly _alerts = signal<Alert[]>([]);
  private readonly _handlers = signal<Map<string, ChannelHandler>>(new Map());
  private readonly _globalAlertCreationEnabled = signal<boolean>(true);
  private readonly _eventTypes = signal<EventTypeOption[]>(DEFAULT_EVENT_TYPES);

  // Read-only computed signals
  readonly alerts = this._alerts.asReadonly();
  readonly globalAlertCreationEnabled = this._globalAlertCreationEnabled.asReadonly();
  
  readonly channels = computed<NotificationChannel[]>(() => 
    Array.from(this._handlers().values()).map(h => h.channelInfo)
  );

  readonly activeChannels = computed<NotificationChannel[]>(() =>
    this.channels().filter(c => c.enabled)
  );

  constructor() {
    // Register initial default channels
    this.registerChannel(new EmailChannelHandler());
    this.registerChannel(new SlackChannelHandler());
  }

  /** Dynamic registration of new channel handlers */
  registerChannel(handler: ChannelHandler): void {
    const current = new Map(this._handlers());
    current.set(handler.channelInfo.id, handler);
    this._handlers.set(current);
  }

  /** Admin feature: Enable or disable a channel globally */
  toggleChannelStatus(channelId: string, enabled: boolean): void {
    const handler = this._handlers().get(channelId);
    if (handler) {
      handler.channelInfo.enabled = enabled;
      // Trigger signal update
      this._handlers.set(new Map(this._handlers()));
    }
  }

  /** Admin feature: Toggle global alert creation */
  setGlobalAlertCreation(enabled: boolean): void {
    this._globalAlertCreationEnabled.set(enabled);
  }

  /** Add a new alert and trigger dispatching through configured handlers */
  async createAlert(payload: CreateAlertPayload): Promise<Alert> {
    if (!this._globalAlertCreationEnabled()) {
      throw new Error('Alert creation is currently disabled globally by the administrator.');
    }

    const newAlert: Alert = {
      ...payload,
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      dispatchLogs: []
    };

    // Dispatch alert through active selected channels
    const logs: DispatchLog[] = [];
    for (const channelId of newAlert.channels) {
      const handler = this._handlers().get(channelId);
      if (handler && handler.channelInfo.enabled) {
        try {
          const success = await handler.sendAlert(newAlert);
          logs.push({
            channelId,
            timestamp: new Date(),
            status: success ? 'success' : 'failed'
          });
        } catch (err: any) {
          logs.push({
            channelId,
            timestamp: new Date(),
            status: 'failed',
            errorMessage: err?.message || 'Unknown error'
          });
        }
      }
    }

    newAlert.dispatchLogs = logs;
    this._alerts.update(alerts => [newAlert, ...alerts]);
    return newAlert;
  }

  /** Toggle active / inactive status of an alert */
  toggleAlertStatus(alertId: string): void {
    this._alerts.update(alerts =>
      alerts.map(a => {
        if (a.id === alertId) {
          const newStatus: AlertStatus = a.status === 'active' ? 'inactive' : 'active';
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  }

  /** Delete an alert */
  deleteAlert(alertId: string): void {
    this._alerts.update(alerts => alerts.filter(a => a.id !== alertId));
  }

  /** Seed mock data into state */
  setAlerts(alerts: Alert[]): void {
    this._alerts.set(alerts);
  }

  /** Admin feature: Add a new dynamic event type */
  addEventType(label: string): EventTypeOption {
      const id = label.toLowerCase().trim().replace(/\s+/g, '_');
      const existing = this._eventTypes().find(e => e.id === id);
      if (existing) return existing;

      const newOption: EventTypeOption = { id, label, isCustom: true };
      this._eventTypes.update(types => [...types, newOption]);
      return newOption;
  }
}