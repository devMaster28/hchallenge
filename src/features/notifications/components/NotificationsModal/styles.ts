import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  spacing,
  textStyles,
} from '../../../../theme';

export default StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.xxl,
  },
  emptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.lg,
  },
  notification: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  documentTitle: {
    ...textStyles.title,
  },
  message: {
    ...textStyles.base,
    marginTop: spacing.sm,
  },
  timestamp: {
    ...textStyles.caption,
    marginTop: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyTitle: {
    ...textStyles.title,
    textAlign: 'center',
  },
  emptyMessage: {
    ...textStyles.base,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
