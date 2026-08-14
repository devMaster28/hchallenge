import { Bell, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, sizes } from '../../../../theme';
import type { DocumentNotification } from '../../models/notification';
import styles from './styles';

const DISPLAY_DURATION = 5_000;

interface NotificationBannerProps {
  notification: DocumentNotification;
  onDismiss: () => void;
}

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

export default function NotificationBanner({
  notification,
  onDismiss,
}: NotificationBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, DISPLAY_DURATION);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={styles.banner}
      testID="notification-banner">
      <View style={styles.iconContainer}>
        <Bell color={colors.primary} size={sizes.icon} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>New document</Text>
        <Text numberOfLines={2} style={styles.message}>
          {getNotificationMessage(notification)}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Dismiss notification"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onDismiss}
        style={styles.closeButton}>
        <X color={colors.gray} size={sizes.icon} strokeWidth={2} />
      </Pressable>
    </View>
  );
}
