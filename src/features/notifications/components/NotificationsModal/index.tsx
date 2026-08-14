import { X } from 'lucide-react-native';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

import { colors, sizes } from '../../../../theme';
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
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close notifications"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={styles.title}>
              Notifications
            </Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}>
              <X color={colors.gray} size={sizes.icon} strokeWidth={2} />
            </Pressable>
          </View>

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
          />
        </View>
      </View>
    </Modal>
  );
}
