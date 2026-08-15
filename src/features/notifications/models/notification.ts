import type { OptionalNullableFields } from '../../../types/utility';

interface DocumentNotificationContract {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
}

export type DocumentNotification =
  OptionalNullableFields<DocumentNotificationContract>;
