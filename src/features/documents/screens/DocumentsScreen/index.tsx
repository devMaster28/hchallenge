import { useState } from 'react';
import { Bell, Plus } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../../components/Header';
import PrimaryButton from '../../../../components/PrimaryButton';
import DocumentCard from '../../components/DocumentCard';
import DocumentsToolbar from '../../components/DocumentsToolbar';
import { useGetDocuments } from '../../hooks/useGetDocuments';
import { Document, ViewMode } from '../../models/document';
import { colors, sizes } from '../../../../theme';
import styles from './styles';


const toTimestamp = (date?: string | null): number => {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

export default function DocumentsScreen() {
  const [viewMode, setViewMode] = useState(ViewMode.List);
  const { response, isLoading, error, refetch } = useGetDocuments();
  const documents = [...response].sort(
    (first, second) =>
      toTimestamp(second.CreatedAt) - toTimestamp(first.CreatedAt),
  );

  const renderDocument = ({ item }: { item: Document }) => (
    <DocumentCard document={item} variant={viewMode} />
  );

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Header
        rightElement={
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={styles.notificationButton}>
            <Bell color={colors.gray} size={sizes.icon} strokeWidth={2} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </Pressable>
        }
        title="Documents"
      />

      <View style={styles.content}>
        <DocumentsToolbar
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />

        {isLoading ? (
          <View style={styles.feedback} testID="documents-loading">
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.feedbackText}>Loading documents…</Text>
          </View>
        ) : error ? (
          <View style={styles.feedback} testID="documents-error">
            <Text style={styles.feedbackTitle}>Unable to load documents</Text>
            <Text style={styles.feedbackText}>
              Check that the server is running and try again.
            </Text>
            <Pressable
              accessibilityLabel="Try again"
              accessibilityRole="button"
              onPress={refetch}
              style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            columnWrapperStyle={
              viewMode === ViewMode.Grid ? styles.gridRow : undefined
            }
            contentContainerStyle={
              documents.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            data={documents}
            ItemSeparatorComponent={<View style={styles.separator} />}
            keyExtractor={(document, index) =>
              document.ID ?? `document-${index}`
            }
            key={viewMode}
            ListEmptyComponent={
              <View style={styles.feedback} testID="documents-empty">
                <Text style={styles.feedbackTitle}>No documents yet</Text>
                <Text style={styles.feedbackText}>
                  New documents will appear here.
                </Text>
              </View>
            }
            renderItem={renderDocument}
            numColumns={viewMode === ViewMode.Grid ? 2 : 1}
            showsVerticalScrollIndicator={false}
            testID={`documents-${viewMode}`}
          />
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          disabled
          icon={<Plus color={colors.white} size={sizes.icon} strokeWidth={2} />}
          label="Add document"
        />
      </View>
    </SafeAreaView>
  );
}
