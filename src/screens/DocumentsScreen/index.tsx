import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import AddDocumentModal from '../../features/documents/components/AddDocumentModal';
import DocumentCard from '../../features/documents/components/DocumentCard';
import DocumentsToolbar from '../../features/documents/components/DocumentsToolbar';
import { useGetDocuments } from '../../features/documents/hooks/useGetDocuments';
import {
  DocumentSortOption,
  ViewMode,
} from '../../features/documents/models/document';
import type { Document } from '../../features/documents/models/document';
import { useDocuments } from '../../features/documents/state/DocumentsProvider';
import { sortDocuments } from '../../features/documents/utils/sortDocuments';
import NotificationBell from '../../features/notifications/components/NotificationBell';
import NotificationsModal from '../../features/notifications/components/NotificationsModal';
import { useNotifications } from '../../features/notifications/state/NotificationsProvider';
import { colors, sizes } from '../../theme';
import styles from './styles';

const ListSeparator = () => <View style={styles.separator} />;

export default function DocumentsScreen() {
  const [viewMode, setViewMode] = useState(ViewMode.List);
  const [sortOption, setSortOption] = useState(DocumentSortOption.Date);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { documents, isHydrating, addLocalDocument, setRemoteDocuments } =
    useDocuments();
  const shouldFetchDocuments = !isHydrating && documents.length === 0;
  const {
    response: remoteDocuments,
    isLoading,
    hasFetched,
    error,
    refetch,
  } = useGetDocuments({ enabled: shouldFetchDocuments });
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (hasFetched && !isLoading && !error) {
      setRemoteDocuments(remoteDocuments);
    }
  }, [error, hasFetched, isLoading, remoteDocuments, setRemoteDocuments]);

  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isNotificationsOpen) {
      markAllAsRead();
    }
  }, [isNotificationsOpen, notifications.length, markAllAsRead]);

  const renderDocument = ({ item }: { item: Document }) => (
    <DocumentCard document={item} variant={viewMode} />
  );

  const sortedDocuments = useMemo(
    () => sortDocuments(documents, sortOption),
    [documents, sortOption],
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
  };
  const showInitialLoading =
    documents.length === 0 && (isHydrating || (isLoading && !isRefreshing));

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Header
        rightElement={
          <NotificationBell
            onPress={() => setIsNotificationsOpen(true)}
            unreadCount={unreadCount}
          />
        }
        title="Documents"
      />

      <View style={styles.content}>
        <DocumentsToolbar
          onSortOptionChange={setSortOption}
          onViewModeChange={setViewMode}
          sortOption={sortOption}
          viewMode={viewMode}
        />

        {showInitialLoading ? (
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
              style={styles.retryButton}
            >
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
            data={sortedDocuments}
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
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                tintColor={colors.primary}
              />
            }
            renderItem={renderDocument}
            numColumns={viewMode === ViewMode.Grid ? 2 : 1}
            showsVerticalScrollIndicator={false}
            testID={`documents-${viewMode}`}
          />
        )}
      </View>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PrimaryButton
          icon={<Plus color={colors.white} size={sizes.icon} strokeWidth={2} />}
          label="Add document"
          onPress={() => setIsAddDocumentOpen(true)}
        />
      </SafeAreaView>

      <AddDocumentModal
        onClose={() => setIsAddDocumentOpen(false)}
        onSubmit={addLocalDocument}
        visible={isAddDocumentOpen}
      />

      <NotificationsModal
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        visible={isNotificationsOpen}
      />
    </SafeAreaView>
  );
}
