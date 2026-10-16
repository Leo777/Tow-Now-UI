import type { ViewStyle } from "react-native";

export const colors = {
  brand: {
    primary: "#EFBF00",
    primaryPressed: "#D8AB00",
    primarySoft: "#FFF6D1",
  },
  text: {
    primary: "#3E4958",
    muted: "#5F7380",
    inverse: "#FFFFFF",
  },
  border: {
    default: "#D5DDE0",
    disabled: "#D5DDE0",
  },
  surface: {
    base: "#FFFFFF",
    muted: "#F7F8F9",
    elevated: "#FFFFFF",
  },
  feedback: {
    danger: "#D94D48",
    success: "#26885D",
  },
  overlay: "rgba(62, 73, 88, 0.45)",
} as const;

export const spacing = {
  none: 0,
  xxxs: 2,
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  button: 14,
  xl: 20,
  bottomSheet: 30,
  pill: 999,
} as const;

export const screen = {
  figmaWidth: 375,
  figmaHeight: 812,
  horizontalPadding: spacing.xxl,
  compactHorizontalPadding: spacing.lg,
  bottomActionPadding: spacing.xxl,
  minTapTarget: 44,
} as const;

export const shadow = {
  bottomSheet: {
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  } satisfies ViewStyle,
  card: {
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  } satisfies ViewStyle,
} as const;

export const theme = {
  colors,
  radius,
  screen,
  shadow,
  spacing,
} as const;

export type AppTheme = typeof theme;
