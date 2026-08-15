import { StyleSheet } from 'react-native';

import { colors, radii, sizes, spacing, textStyles } from '../../../../theme';

export default StyleSheet.create({
  toolbar: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  sortButton: {
    minHeight: sizes.minimumTouchTarget,
    maxWidth: 176,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  sortButtonPressed: {
    backgroundColor: colors.background,
  },
  sortLabel: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sortText: {
    flexShrink: 1,
    ...textStyles.subtitle,
  },
  sortChevron: {
    minHeight: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  modeSwitch: {
    flexDirection: 'row',
  },
  modeButton: {
    width: 52,
    minHeight: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  listModeButton: {
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
  },
  gridModeButton: {
    marginLeft: -1,
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  modeButtonSelected: {
    backgroundColor: colors.white,
    zIndex: 1,
  },
});
