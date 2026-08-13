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
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.lg,
  },
  gridRow: {
    gap: spacing.md,
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
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
  },
  retryText: {
    ...textStyles.button,
  },
  notificationButton: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.round,
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
});
