import { Bell, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import IconButton from '../../../../components/IconButton';
import { colors, sizes } from '../../../../theme';
import type { DocumentNotification } from '../../models/notification';
import { getNotificationMessage } from '../../utils/getNotificationMessage';
import styles from './styles';

export { getNotificationMessage } from '../../utils/getNotificationMessage';

const DISPLAY_DURATION = 5_000;

interface NotificationBannerProps {
  notification: DocumentNotification;
  onDismiss: () => void;
}

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
      testID="notification-banner"
    >
      <View style={styles.iconContainer}>
        <Bell color={colors.primary} size={sizes.icon} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>New document</Text>
        <Text numberOfLines={2} style={styles.message}>
          {getNotificationMessage(notification)}
        </Text>
      </View>
      <IconButton
        accessibilityLabel="Dismiss notification"
        icon={<X color={colors.gray} size={sizes.icon} strokeWidth={2} />}
        onPress={onDismiss}
      />
    </View>
  );
}
