import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

interface HeaderProps {
  title: string;
  rightElement?: ReactNode;
}

export default function Header({ title, rightElement }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {rightElement}
    </View>
  );
}
