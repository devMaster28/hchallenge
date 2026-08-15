import type { DocumentNotification } from '../models/notification';

export const getNotificationMessage = (
  notification: DocumentNotification,
): string => {
  const userName = notification.UserName?.trim();
  const documentTitle = notification.DocumentTitle?.trim();

  if (userName && documentTitle) {
    return `${userName} created “${documentTitle}”`;
  }

  if (documentTitle) {
    return `A new document “${documentTitle}” was created`;
  }

  if (userName) {
    return `${userName} created a new document`;
  }

  return 'A new document was created';
};
