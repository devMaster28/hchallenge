import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  sizes,
  spacing,
  textStyles,
} from '../../../../theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    minHeight: sizes.headerHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.white,
  },
  headerTitle: {
    ...textStyles.screenTitle,
  },
  content: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  listContent: {
    padding: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.lg,
  },
  feedback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  feedbackTitle: {
    ...textStyles.title,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  feedbackText: {
    ...textStyles.base,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: sizes.minimumTouchTarget,
    justifyContent: 'center',
    marginTop: spacing.xl,
    borderRadius: radii.md,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.xxl,
  },
  retryText: {
    ...textStyles.button,
  },
});
