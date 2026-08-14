import { Bell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors, sizes } from '../../../../theme';
import styles from './styles';

interface NotificationBellProps {
  unreadCount: number;
  onPress: () => void;
}

export default function NotificationBell({
  unreadCount,
  onPress,
}: NotificationBellProps) {
  const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <Pressable
      accessibilityLabel={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}>
      <Bell color={colors.gray} size={sizes.icon} strokeWidth={2} />
      {unreadCount > 0 && (
        <View style={styles.badge} testID="notifications-badge">
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}
