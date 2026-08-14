import { StyleSheet } from 'react-native';

import { colors, radii, spacing, textStyles } from '../../theme';

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
    maxHeight: '88%',
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
    paddingHorizontal: spacing.xxl,
  },
  headingWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...textStyles.screenTitle,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    flexShrink: 1,
  },
  expandedBody: {
    flex: 1,
  },
});
