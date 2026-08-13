import { StyleSheet } from 'react-native';

import { colors, sizes, spacing, textStyles } from '../../theme';

export default StyleSheet.create({
  header: {
    minHeight: sizes.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.white,
  },
  title: {
    ...textStyles.screenTitle,
  },
});
