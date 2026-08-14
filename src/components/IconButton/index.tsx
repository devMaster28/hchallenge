import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

import styles from './styles';

interface IconButtonProps {
  accessibilityLabel: string;
  icon: ReactNode;
  onPress: () => void;
}

export default function IconButton({
  accessibilityLabel,
  icon,
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
        pressed && styles.buttonPressed,
      ]}>
      {icon}
    </Pressable>
  );
}
