import { Share2 } from 'lucide-react-native';
import { Alert, Share } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import IconButton from '../../../../components/IconButton';
import { colors, sizes } from '../../../../theme';
import type { Document } from '../../models/document';
import styles from './styles';

interface DocumentShareButtonProps {
  document: Document;
  style?: StyleProp<ViewStyle>;
}

const documentTitle = (document: Document): string =>
  document.Title?.trim() || 'Untitled document';

export const buildDocumentShareMessage = (document: Document): string => {
  const contributors =
    document.Contributors?.flatMap(contributor => {
      const name = contributor?.Name?.trim();
      return name ? [name] : [];
    }) ?? [];
  const attachments =
    document.Attachments?.flatMap(attachment => {
      const name = attachment?.trim();
      return name ? [name] : [];
    }) ?? [];
  const version = document.Version?.trim();
  const message = [documentTitle(document)];

  if (version) {
    message.push(`Version: ${version}`);
  }

  if (contributors.length > 0) {
    message.push(`Contributors: ${contributors.join(', ')}`);
  }

  if (attachments.length > 0) {
    message.push(`Attachments: ${attachments.join(', ')}`);
  }

  return message.join('\n');
};

export const shareDocument = (document: Document) =>
  Share.share({
    message: buildDocumentShareMessage(document),
    title: documentTitle(document),
  });

export default function DocumentShareButton({
  document,
  style,
}: DocumentShareButtonProps) {
  const handleShare = async () => {
    try {
      await shareDocument(document);
    } catch {
      Alert.alert(
        'Unable to share document',
        'Please try again.',
      );
    }
  };

  return (
    <IconButton
      accessibilityLabel={`Share ${documentTitle(document)}`}
      icon={
        <Share2
          color={colors.primary}
          size={sizes.smallIcon}
          strokeWidth={2}
        />
      }
      onPress={handleShare}
      style={[styles.button, style]}
    />
  );
}
