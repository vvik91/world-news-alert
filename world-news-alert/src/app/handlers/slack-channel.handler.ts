import { ChannelHandler } from './channel-handler.interface';
import { Alert } from '../models/alert.model';
import { NotificationChannel } from '../models/channel.model';

export class SlackChannelHandler implements ChannelHandler {
  readonly channelInfo: NotificationChannel = {
    id: 'slack',
    name: 'Slack Webhook',
    icon: 'chat',
    enabled: true,
    configFields: [
      { key: 'webhookUrl', label: 'Slack Webhook URL', type: 'url', required: true }
    ]
  };

  async sendAlert(alert: Alert, config?: Record<string, any>): Promise<boolean> {
    console.log(`[Slack Handler] Dispatching alert "${alert.title}" via Webhook`);
    return true; // Mock success
  }
}