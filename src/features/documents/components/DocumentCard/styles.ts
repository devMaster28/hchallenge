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
  card: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  gridCard: {
    flex: 1,
    minHeight: 118,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  listHeading: {
    marginBottom: spacing.lg,
    paddingRight: sizes.minimumTouchTarget,
  },
  listShareButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
  },
  title: {
    ...textStyles.title,
  },
  version: {
    ...textStyles.caption,
  },
  gridFooter: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 'auto',
  },
  gridVersion: {
    flex: 1,
  },
  gridShareButton: {
    width: 28,
    height: 28,
  },
  details: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  column: {
    flex: 1,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.subtitle,
  },
  value: {
    ...textStyles.base,
  },
});
