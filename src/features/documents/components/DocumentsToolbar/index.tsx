import {
  ArrowUpDown,
  ChevronDown,
  Grid2X2,
  List,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors, sizes } from '../../../../theme';
import styles from './styles';
import { ViewMode } from '../../models/document';

interface DocumentsToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
}

export default function DocumentsToolbar({
  viewMode,
  onViewModeChange,
}: DocumentsToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <Pressable
        accessibilityLabel="Sort documents"
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.sortButton}>
        <View style={styles.sortLabel}>
          <ArrowUpDown color={colors.gray} size={sizes.icon} strokeWidth={2} />
          <Text style={styles.sortText}>Sort by</Text>
        </View>
        <View style={styles.sortChevron}>
          <ChevronDown color={colors.gray} size={sizes.icon} strokeWidth={2} />
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
          ]}>
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
          ]}>
          <Grid2X2
            color={viewMode === ViewMode.Grid ? colors.primary : colors.gray}
            size={sizes.icon}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
}
