import { parseObject, parseOptionalString } from '../../../utils/validation';
import type { DocumentNotification } from '../models/notification';

export const parseDocumentNotificationDto = (
  data: unknown,
): DocumentNotification => {
  if (typeof data !== 'string') {
    throw new Error('Notification message must be a string');
  }

  let value: unknown;

  try {
    value = JSON.parse(data);
  } catch {
    throw new Error('Notification message must contain valid JSON');
  }

  const notification = parseObject(value, 'notification');

  return {
    Timestamp: parseOptionalString(
      notification.Timestamp,
      'notification.Timestamp',
    ),
    UserID: parseOptionalString(notification.UserID, 'notification.UserID'),
    UserName: parseOptionalString(
      notification.UserName,
      'notification.UserName',
    ),
    DocumentID: parseOptionalString(
      notification.DocumentID,
      'notification.DocumentID',
    ),
    DocumentTitle: parseOptionalString(
      notification.DocumentTitle,
      'notification.DocumentTitle',
    ),
  };
};
