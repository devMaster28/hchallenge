import type { LocalNotification } from '../../../services/notifications';
import type { DocumentNotification } from '../models/notification';
import { getNotificationMessage } from './getNotificationMessage';

export const buildLocalNotification = (
  notification: DocumentNotification,
): LocalNotification => {
  const data: Record<string, string> = {};

  if (notification.DocumentID) {
    data.documentId = notification.DocumentID;
  }

  if (notification.UserID) {
    data.userId = notification.UserID;
  }

  return {
    title: 'New document',
    body: getNotificationMessage(notification),
    data,
  };
};
