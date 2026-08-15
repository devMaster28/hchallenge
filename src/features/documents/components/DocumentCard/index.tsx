import { Paperclip, UsersRound } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors, sizes } from '../../../../theme';
import { formatRelativeDate } from '../../../../utils/date';
import { ViewMode } from '../../models/document';
import type { Document } from '../../models/document';
import DocumentShareButton from '../DocumentShareButton';
import styles from './styles';

interface DocumentCardProps {
  document: Document;
  variant?: ViewMode;
}

const EMPTY_VALUE = '—';

export default function DocumentCard({
  document,
  variant = ViewMode.List,
}: DocumentCardProps) {
  const contributors = document.Contributors?.filter(
    (contributor): contributor is NonNullable<typeof contributor> =>
      contributor !== null,
  ) ?? [];
  const attachments = document.Attachments?.filter(
    (attachment): attachment is string => typeof attachment === 'string',
  ) ?? [];
  const relativeDate =
    formatRelativeDate(document.CreatedAt) ?? 'Date unavailable';

  return (
    <View
      accessibilityLabel={document.Title ?? 'Untitled document'}
      style={[styles.card, variant === ViewMode.Grid && styles.gridCard]}>
      {variant === ViewMode.List && (
        <DocumentShareButton
          document={document}
          style={styles.listShareButton}
        />
      )}

      <View
        style={[
          styles.heading,
          variant === ViewMode.List && styles.listHeading,
        ]}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {document.Title ?? 'Untitled document'}
          </Text>
          {variant === ViewMode.List && (
            <Text style={styles.version}>
              {document.Version
                ? `Version ${document.Version}`
                : 'No version'}
            </Text>
          )}
        </View>
        {variant === ViewMode.List && (
          <Text style={styles.relativeDate}>{relativeDate}</Text>
        )}
      </View>

      {variant === ViewMode.Grid && (
        <View style={styles.gridFooter}>
          <View style={styles.gridMetadata}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              numberOfLines={1}
              style={styles.version}>
              {document.Version
                ? `Version ${document.Version}`
                : 'No version'}
            </Text>
            <Text numberOfLines={1} style={styles.relativeDate}>
              {relativeDate}
            </Text>
          </View>
          <DocumentShareButton
            document={document}
            style={styles.gridShareButton}
          />
        </View>
      )}

      {variant === ViewMode.List && (
        <View style={styles.details}>
          <View style={styles.column}>
            <View style={styles.sectionHeading}>
              <UsersRound
                color={colors.gray}
                size={sizes.icon}
                strokeWidth={2}
              />
              <Text style={styles.sectionTitle}>Contributors</Text>
            </View>
            {contributors.length > 0 ? (
              contributors.map((contributor, index) => (
                <Text
                  key={contributor.ID ?? `contributor-${index}`}
                  style={styles.value}>
                  {contributor.Name ?? 'Unknown contributor'}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>{EMPTY_VALUE}</Text>
            )}
          </View>

          <View style={styles.column}>
            <View style={styles.sectionHeading}>
              <Paperclip
                color={colors.gray}
                size={sizes.icon}
                strokeWidth={2}
              />
              <Text style={styles.sectionTitle}>Attachments</Text>
            </View>
            {attachments.length > 0 ? (
              attachments.map((attachment, index) => (
                <Text key={`${attachment}-${index}`} style={styles.value}>
                  {attachment}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>{EMPTY_VALUE}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
