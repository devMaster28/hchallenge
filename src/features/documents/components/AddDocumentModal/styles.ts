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
    maxHeight: '88%',
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  form: {
    padding: spacing.xxl,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
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
  subtitle: {
    ...textStyles.title,
    marginBottom: spacing.xxl,
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
