import { FlatList, Text, View } from 'react-native';

import BottomSheet from '../../../../components/BottomSheet';
import type { DocumentNotification } from '../../models/notification';
import styles from './styles';

interface NotificationsModalProps {
  notifications: DocumentNotification[];
  visible: boolean;
  onClose: () => void;
}

const NotificationSeparator = () => <View style={styles.separator} />;

const formatTimestamp = (timestamp?: string | null): string | null => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
};

export default function NotificationsModal({
  notifications,
  visible,
  onClose,
}: NotificationsModalProps) {
  return (
    <BottomSheet
      headerDivider
      onClose={onClose}
      sheetHeight="70%"
      title="Notifications"
      visible={visible}>
      <FlatList
        contentContainerStyle={
          notifications.length === 0
            ? styles.emptyContent
            : styles.listContent
        }
        data={notifications}
        ItemSeparatorComponent={NotificationSeparator}
        keyExtractor={(notification, index) =>
          `${notification.DocumentID ?? 'notification'}-${
            notification.Timestamp ?? index
          }`
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              New document notifications will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const timestamp = formatTimestamp(item.Timestamp);

          return (
            <View style={styles.notification}>
              <Text style={styles.documentTitle}>
                {item.DocumentTitle || 'New document'}
              </Text>
              <Text style={styles.message}>
                Created by {item.UserName || 'another user'}
              </Text>
              {timestamp && (
                <Text style={styles.timestamp}>{timestamp}</Text>
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </BottomSheet>
  );
}
