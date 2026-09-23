export interface ChannelConfigField {
  key: string;
  label: string;
  type: 'text' | 'url' | 'password' | 'email';
  required: boolean;
}

export interface NotificationChannel {
  id: string;
  name: string;
  icon: string;
  enabled: boolean; // Managed by Admin
  configFields?: ChannelConfigField[];
}