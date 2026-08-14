import type { OptionalNullableFields } from '../../../types/utility';

interface DocumentNotificationContract {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
}

export type DocumentNotification = OptionalNullableFields<
  DocumentNotificationContract
>;

const optionalString = (
  value: unknown,
  property: string,
): string | null | undefined => {
  if (value === undefined || value === null || typeof value === 'string') {
    return value;
  }

  throw new Error(`Invalid notification property: ${property}`);
};

export const parseDocumentNotification = (
  data: unknown,
): DocumentNotification => {
  if (typeof data !== 'string') {
    throw new Error('Invalid notification message');
  }

  const value: unknown = JSON.parse(data);

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid notification message');
  }

  const notification = value as Record<string, unknown>;

  return {
    Timestamp: optionalString(notification.Timestamp, 'Timestamp'),
    UserID: optionalString(notification.UserID, 'UserID'),
    UserName: optionalString(notification.UserName, 'UserName'),
    DocumentID: optionalString(notification.DocumentID, 'DocumentID'),
    DocumentTitle: optionalString(
      notification.DocumentTitle,
      'DocumentTitle',
    ),
  };
};
