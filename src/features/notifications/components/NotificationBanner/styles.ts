import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  shadows,
  sizes,
  spacing,
  textStyles,
} from '../../../../theme';

export default StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    ...shadows.card,
  },
  iconContainer: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.round,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  title: {
    ...textStyles.subtitle,
  },
  message: {
    ...textStyles.caption,
    marginTop: 2,
  },
  closeButton: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
