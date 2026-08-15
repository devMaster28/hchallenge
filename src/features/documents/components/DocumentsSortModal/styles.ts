import { StyleSheet } from 'react-native';

import { colors, spacing, textStyles } from '../../../../theme';

export default StyleSheet.create({
  options: {
    paddingBottom: spacing.xxl,
  },
  option: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...textStyles.subtitle,
  },
  optionDescription: {
    ...textStyles.caption,
    marginTop: 2,
  },
});
