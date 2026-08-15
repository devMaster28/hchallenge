import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import styles from './styles';

interface IconButtonProps {
  accessibilityLabel: string;
  icon: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function IconButton({
  accessibilityLabel,
  icon,
  style,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.buttonPressed,
      ]}>
      {icon}
    </Pressable>
  );
}
