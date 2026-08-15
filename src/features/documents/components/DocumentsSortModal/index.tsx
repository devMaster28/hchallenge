import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import BottomSheet from '../../../../components/BottomSheet';
import { colors, sizes } from '../../../../theme';
import { DocumentSortOption } from '../../models/document';
import styles from './styles';

interface DocumentsSortModalProps {
  selectedOption: DocumentSortOption;
  visible: boolean;
  onClose: () => void;
  onSelect: (option: DocumentSortOption) => void;
}

const options = [
  {
    value: DocumentSortOption.Date,
    label: 'Date',
    description: 'Newest to oldest',
  },
  {
    value: DocumentSortOption.Version,
    label: 'Version',
    description: 'Highest to lowest',
  },
  {
    value: DocumentSortOption.Alphabetical,
    label: 'Alphabetical',
    description: 'Title A–Z',
  },
] as const;

export const getDocumentSortLabel = (option: DocumentSortOption): string =>
  options.find(item => item.value === option)?.label ?? 'Date';

export default function DocumentsSortModal({
  selectedOption,
  visible,
  onClose,
  onSelect,
}: DocumentsSortModalProps) {
  const handleSelect = (option: DocumentSortOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <BottomSheet
      headerDivider
      onClose={onClose}
      title="Sort documents"
      visible={visible}
    >
      <View style={styles.options}>
        {options.map(option => {
          const isSelected = option.value === selectedOption;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              {isSelected && (
                <Check
                  color={colors.primary}
                  size={sizes.icon}
                  strokeWidth={2.5}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
