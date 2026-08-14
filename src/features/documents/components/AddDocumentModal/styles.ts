import { StyleSheet } from 'react-native';

import {
  colors,
  radii,
  spacing,
  textStyles,
} from '../../../../theme';

export default StyleSheet.create({
  form: {
    padding: spacing.xxl,
  },
  subtitle: {
    ...textStyles.title,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    ...textStyles.subtitle,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
  },
  fileButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  fileButtonText: {
    ...textStyles.subtitle,
    maxWidth: 240,
    color: colors.primary,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.black,
    marginTop: spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
