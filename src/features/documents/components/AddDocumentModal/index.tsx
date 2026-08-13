import {
  errorCodes,
  isErrorWithCode,
  pick,
} from '@react-native-documents/picker';
import { FileText, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import PrimaryButton from '../../../../components/PrimaryButton';
import { colors, sizes } from '../../../../theme';
import { CreateDocumentInput } from '../../models/document';
import styles from './styles';

interface AddDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (document: CreateDocumentInput) => void;
}

export default function AddDocumentModal({
  visible,
  onClose,
  onSubmit,
}: AddDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setTitle('');
      setVersion('');
      setAttachmentName('');
      setFileError(null);
    }
  }, [visible]);

  const handleChooseFile = async () => {
    try {
      const [file] = await pick();
      setAttachmentName(file.name ?? 'Selected file');
      setFileError(null);
    } catch (error) {
      if (
        !isErrorWithCode(error) ||
        error.code !== errorCodes.OPERATION_CANCELED
      ) {
        setFileError('Unable to select the file. Please try again.');
      }
    }
  };

  const trimmedTitle = title.trim();
  const trimmedVersion = version.trim();
  const canSubmit =
    trimmedTitle.length > 0 &&
    trimmedVersion.length > 0 &&
    attachmentName.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      version: trimmedVersion,
      attachmentName,
    });
    onClose();
  };

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
          accessibilityLabel="Close add document modal"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled">
            <View style={styles.heading}>
              <Text accessibilityRole="header" style={styles.title}>
                Add document
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

            <Text style={styles.subtitle}>Document information</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                accessibilityLabel="Document name"
                autoCapitalize="sentences"
                onChangeText={setTitle}
                placeholder="Document name"
                placeholderTextColor={colors.gray}
                returnKeyType="next"
                style={styles.input}
                value={title}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Version</Text>
              <TextInput
                accessibilityLabel="Document version"
                autoCapitalize="none"
                onChangeText={setVersion}
                placeholder="1.0.0"
                placeholderTextColor={colors.gray}
                returnKeyType="done"
                style={styles.input}
                value={version}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>File</Text>
              <Pressable
                accessibilityLabel="Choose file"
                accessibilityRole="button"
                onPress={handleChooseFile}
                style={styles.fileButton}>
                <FileText
                  color={colors.primary}
                  size={sizes.icon}
                  strokeWidth={2}
                />
                <Text numberOfLines={1} style={styles.fileButtonText}>
                  {attachmentName || 'Choose file'}
                </Text>
              </Pressable>
              {fileError && <Text style={styles.errorText}>{fileError}</Text>}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton
              disabled={!canSubmit}
              label="Submit"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
