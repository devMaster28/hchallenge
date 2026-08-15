import { ArrowUpDown, ChevronDown, Grid2X2, List } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, sizes } from '../../../../theme';
import { DocumentSortOption, ViewMode } from '../../models/document';
import DocumentsSortModal, {
  getDocumentSortLabel,
} from '../DocumentsSortModal';
import styles from './styles';

interface DocumentsToolbarProps {
  sortOption: DocumentSortOption;
  viewMode: ViewMode;
  onSortOptionChange: (option: DocumentSortOption) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
}

export default function DocumentsToolbar({
  sortOption,
  viewMode,
  onSortOptionChange,
  onViewModeChange,
}: DocumentsToolbarProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const sortLabel = getDocumentSortLabel(sortOption);

  return (
    <>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityLabel={`Sort documents, ${getDocumentSortLabel(
            sortOption,
          )} selected`}
          accessibilityRole="button"
          onPress={() => setIsSortModalOpen(true)}
          style={({ pressed }) => [
            styles.sortButton,
            pressed && styles.sortButtonPressed,
          ]}
        >
          <View style={styles.sortLabel}>
            <ArrowUpDown
              color={colors.primary}
              size={sizes.icon}
              strokeWidth={2}
            />
            <Text numberOfLines={1} style={styles.sortText}>
              {sortLabel}
            </Text>
          </View>
          <View style={styles.sortChevron}>
            <ChevronDown
              color={colors.gray}
              size={sizes.icon}
              strokeWidth={2}
            />
          </View>
        </Pressable>

        <View accessibilityRole="tablist" style={styles.modeSwitch}>
          <Pressable
            accessibilityLabel="List view"
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === ViewMode.List }}
            onPress={() => onViewModeChange(ViewMode.List)}
            style={[
              styles.modeButton,
              styles.listModeButton,
              viewMode === ViewMode.List && styles.modeButtonSelected,
            ]}
          >
            <List
              color={viewMode === ViewMode.List ? colors.primary : colors.gray}
              size={sizes.icon}
              strokeWidth={2}
            />
          </Pressable>

          <Pressable
            accessibilityLabel="Grid view"
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === ViewMode.Grid }}
            onPress={() => onViewModeChange(ViewMode.Grid)}
            style={[
              styles.modeButton,
              styles.gridModeButton,
              viewMode === ViewMode.Grid && styles.modeButtonSelected,
            ]}
          >
            <Grid2X2
              color={viewMode === ViewMode.Grid ? colors.primary : colors.gray}
              size={sizes.icon}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>

      <DocumentsSortModal
        onClose={() => setIsSortModalOpen(false)}
        onSelect={onSortOptionChange}
        selectedOption={sortOption}
        visible={isSortModalOpen}
      />
    </>
  );
}
