import { ChannelHandler } from './channel-handler.interface';
import { Alert } from '../models/alert.model';
import { NotificationChannel } from '../models/channel.model';

export class EmailChannelHandler implements ChannelHandler {
  readonly channelInfo: NotificationChannel = {
    id: 'email',
    name: 'Email Notification',
    icon: 'email',
    enabled: true,
    configFields: [
      { key: 'recipientEmail', label: 'Recipient Email', type: 'email', required: true }
    ]
  };

  async sendAlert(alert: Alert, config?: Record<string, any>): Promise<boolean> {
    console.log(`[Email Handler] Dispatching alert "${alert.title}" to ${config?.['recipientEmail'] || 'default user'}`);
    return true; // Mock success
  }
}