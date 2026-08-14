import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  sizes,
  spacing,
  textStyles,
} from '../../../../theme';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.black,
    opacity: 0.32,
  },
  sheet: {
    height: '70%',
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  heading: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...textStyles.screenTitle,
    fontSize: 28,
    lineHeight: 34,
  },
  closeButton: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
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
