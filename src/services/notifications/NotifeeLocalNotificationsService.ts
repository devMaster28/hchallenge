import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

import type {
  LocalNotification,
  LocalNotificationsService,
} from './LocalNotificationsService';

const DOCUMENTS_CHANNEL_ID = 'document-updates';

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
      title: notification.title,
      body: notification.body,
      data: notification.data,
      android: {
        channelId: DOCUMENTS_CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          list: true,
          sound: true,
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
      importance: AndroidImportance.DEFAULT,
      sound: 'default',
    });

    return true;
  }
}

export const notifeeLocalNotificationsService =
  new NotifeeLocalNotificationsService();
