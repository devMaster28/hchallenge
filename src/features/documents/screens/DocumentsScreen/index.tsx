import { useEffect, useState } from 'react';
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
import AddDocumentModal from '../../components/AddDocumentModal';
import DocumentCard from '../../components/DocumentCard';
import DocumentsToolbar from '../../components/DocumentsToolbar';
import { useGetDocuments } from '../../hooks/useGetDocuments';
import { Document, ViewMode } from '../../models/document';
import { useDocuments } from '../../state/DocumentsProvider';
import { colors, sizes } from '../../../../theme';
import styles from './styles';

const ListSeparator = () => <View style={styles.separator} />;

export default function DocumentsScreen() {
  const [viewMode, setViewMode] = useState(ViewMode.List);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const { response: remoteDocuments, isLoading, error, refetch } =
    useGetDocuments();
  const {
    documents,
    isHydrating,
    addLocalDocument,
    setRemoteDocuments,
  } = useDocuments();

  useEffect(() => {
    if (!isLoading && !error) {
      setRemoteDocuments(remoteDocuments);
    }
  }, [error, isLoading, remoteDocuments, setRemoteDocuments]);

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

        {(isHydrating || isLoading) && documents.length === 0 ? (
          <View style={styles.feedback} testID="documents-loading">
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.feedbackText}>Loading documents…</Text>
          </View>
        ) : !isHydrating && error && documents.length === 0 ? (
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
            ItemSeparatorComponent={ListSeparator}
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
          icon={<Plus color={colors.white} size={sizes.icon} strokeWidth={2} />}
          label="Add document"
          onPress={() => setIsAddDocumentOpen(true)}
        />
      </View>

      <AddDocumentModal
        onClose={() => setIsAddDocumentOpen(false)}
        onSubmit={addLocalDocument}
        visible={isAddDocumentOpen}
      />
    </SafeAreaView>
  );
}
