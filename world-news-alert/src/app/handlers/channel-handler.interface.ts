import { Alert } from '../models/alert.model';
import { NotificationChannel } from '../models/channel.model';

export interface ChannelHandler {
  /** Metadata describing the channel */
  readonly channelInfo: NotificationChannel;

  /** Process and send the alert through this specific channel */
  sendAlert(alert: Alert, config?: Record<string, any>): Promise<boolean>;

  /** Optional method to validate channel-specific configuration */
  validateConfig?(config: Record<string, any>): boolean;
}