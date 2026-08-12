import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetDocuments } from '../../hooks/useGetDocuments';
import DocumentCard from '../../components/DocumentCard';
import { Document } from '../../models/document';
import { colors } from '../../../../theme';
import styles from './styles';

const ListSeparator = () => <View style={styles.separator} />;

const toTimestamp = (date?: string | null): number => {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

export default function DocumentsScreen() {
  const { response, isLoading, error, refetch } = useGetDocuments();
  const documents = [...response].sort(
    (first, second) =>
      toTimestamp(second.CreatedAt) - toTimestamp(first.CreatedAt),
  );

  const renderDocument = ({ item }: { item: Document }) => (
    <DocumentCard document={item} />
  );

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Documents
        </Text>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.feedback} testID="documents-loading">
            <ActivityIndicator color={colors.black} size="large" />
            <Text style={styles.feedbackText}>Loading documents…</Text>
          </View>
        ) : error ? (
          <View style={styles.feedback} testID="documents-error">
            <Text style={styles.feedbackTitle}>Unable to load documents</Text>
            <Text style={styles.feedbackText}>
              Check that the server is running and try again.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={refetch}
              style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={
              documents.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            data={documents}
            ItemSeparatorComponent={ListSeparator}
            keyExtractor={(document, index) =>
              document.ID ?? `document-${index}`
            }
            ListEmptyComponent={
              <View style={styles.feedback} testID="documents-empty">
                <Text style={styles.feedbackTitle}>No documents yet</Text>
                <Text style={styles.feedbackText}>
                  New documents will appear here.
                </Text>
              </View>
            }
            renderItem={renderDocument}
            showsVerticalScrollIndicator={false}
            testID="documents-list"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
