import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

import type {
  LocalNotification,
  LocalNotificationsService,
} from './LocalNotificationsService';

const DOCUMENTS_CHANNEL_ID = 'document-updates-silent-v2';

export class NotifeeLocalNotificationsService
  implements LocalNotificationsService
{
  private initialization: Promise<boolean> | null = null;

  initialize(): Promise<boolean> {
    if (!this.initialization) {
      this.initialization = this.configure().catch(error => {
        this.initialization = null;
        throw error;
      });
    }

    return this.initialization;
  }

  async display(notification: LocalNotification): Promise<void> {
    const isAuthorized = await this.initialize();

    if (!isAuthorized) {
      return;
    }

    await notifee.displayNotification({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      android: {
        channelId: DOCUMENTS_CHANNEL_ID,
        onlyAlertOnce: true,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
      },
      ios: {
        foregroundPresentationOptions: {
          badge: false,
          banner: false,
          list: true,
          sound: false,
        },
      },
    });
  }

  private async configure(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    const isAuthorized =
      settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;

    if (!isAuthorized) {
      return false;
    }

    await notifee.createChannel({
      id: DOCUMENTS_CHANNEL_ID,
      name: 'Document updates',
      description: 'Notifications when another user creates a document',
      importance: AndroidImportance.LOW,
    });

    return true;
  }
}

export const notifeeLocalNotificationsService =
  new NotifeeLocalNotificationsService();
