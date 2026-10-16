import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, shadow, spacing } from "../theme";

type IconButtonVariant = "surface" | "primary" | "ghost" | "danger";
type IconButtonSize = "nav" | "default" | "large";

export type IconButtonProps = Omit<PressableProps, "style" | "children"> & {
  accessibilityLabel: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  disabled,
  icon,
  size = "default",
  style,
  variant = "surface",
  ...pressableProps
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={spacing.xxs}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.pill,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.78,
  },
});

const sizeStyles = StyleSheet.create({
  default: {
    height: 50,
    width: 50,
  },
  large: {
    height: 60,
    width: 60,
  },
  nav: {
    height: 36,
    width: 36,
  },
});

const variantStyles = StyleSheet.create({
  danger: {
    backgroundColor: colors.feedback.danger,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  primary: {
    backgroundColor: colors.brand.primary,
  },
  surface: {
    ...shadow.card,
    backgroundColor: colors.surface.base,
  },
});
