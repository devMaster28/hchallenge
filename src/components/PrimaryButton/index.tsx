import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import styles from './styles';

interface PrimaryButtonProps {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
}

export default function PrimaryButton({
  label,
  icon,
  disabled = false,
  onPress,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
