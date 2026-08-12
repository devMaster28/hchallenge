import { Text, View } from 'react-native';

import { Document } from '../../models/document';
import styles from './styles';

interface DocumentCardProps {
  document: Document;
}

const EMPTY_VALUE = '—';

export default function DocumentCard({ document }: DocumentCardProps) {
  const contributors = document.Contributors?.filter(
    (contributor): contributor is NonNullable<typeof contributor> =>
      contributor !== null,
  ) ?? [];
  const attachments = document.Attachments?.filter(
    (attachment): attachment is string => typeof attachment === 'string',
  ) ?? [];

  return (
    <View
      accessibilityLabel={document.Title ?? 'Untitled document'}
      style={styles.card}>
      <View style={styles.heading}>
        <Text numberOfLines={2} style={styles.title}>
          {document.Title ?? 'Untitled document'}
        </Text>
        <Text style={styles.version}>
          {document.Version ? `Version ${document.Version}` : 'No version'}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Contributors</Text>
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
          <Text style={styles.sectionTitle}>Attachments</Text>
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
    </View>
  );
}
