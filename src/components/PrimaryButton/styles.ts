import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  sizes,
  spacing,
  textStyles,
} from '../../theme';

export default StyleSheet.create({
  button: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.minimumTouchTarget,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  label: {
    ...textStyles.button,
    fontSize: 18,
  },
});
