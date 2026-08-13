import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  shadows,
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
    justifyContent: 'center',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.title,
  },
  version: {
    ...textStyles.caption,
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
