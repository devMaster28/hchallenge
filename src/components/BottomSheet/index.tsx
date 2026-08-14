import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { DimensionValue } from 'react-native';

import { colors, sizes } from '../../theme';
import IconButton from '../IconButton';
import styles from './styles';

interface BottomSheetProps {
  children: ReactNode;
  title: string;
  visible: boolean;
  footer?: ReactNode;
  headerDivider?: boolean;
  sheetHeight?: DimensionValue;
  onClose: () => void;
}

export default function BottomSheet({
  children,
  title,
  visible,
  footer,
  headerDivider = false,
  sheetHeight,
  onClose,
}: BottomSheetProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable
          accessibilityLabel={`Close ${title}`}
          onPress={onClose}
          style={styles.backdrop}
        />

        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            sheetHeight !== undefined && { height: sheetHeight },
          ]}>
          <View
            style={[
              styles.heading,
              headerDivider && styles.headingWithDivider,
            ]}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            <IconButton
              accessibilityLabel="Close"
              icon={
                <X color={colors.gray} size={sizes.icon} strokeWidth={2} />
              }
              onPress={onClose}
            />
          </View>

          <View
            style={[
              styles.body,
              sheetHeight !== undefined && styles.expandedBody,
            ]}>
            {children}
          </View>
          {footer}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
