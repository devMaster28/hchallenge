import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#202A3A',
  gray: '#747E8F',
  lightGray: '#F4F5F7',
} as const;

export const spacing = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  md: 8,
} as const;

export const sizes = {
  headerHeight: 104,
  minimumTouchTarget: 44,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
} as const;

export const textStyles = StyleSheet.create({
  base: {
    color: colors.gray,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  title: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  caption: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  screenTitle: {
    color: colors.black,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  button: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});
