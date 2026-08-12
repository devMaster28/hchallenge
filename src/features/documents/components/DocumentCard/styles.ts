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
  sectionTitle: {
    ...textStyles.subtitle,
    marginBottom: spacing.sm,
  },
  value: {
    ...textStyles.base,
  },
});
