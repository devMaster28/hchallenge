export interface LocalNotification {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface LocalNotificationsService {
  initialize: () => Promise<boolean>;
  display: (notification: LocalNotification) => Promise<void>;
}
