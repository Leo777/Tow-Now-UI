import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { colors, radius, screen, shadow, spacing } from "../theme";
import { typography } from "../typography";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "compact";

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  accessibilityLabel,
  disabled,
  leftIcon,
  loading = false,
  rightIcon,
  size = "default",
  style,
  textStyle,
  title,
  variant = "primary",
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = buttonVariantStyles[variant];
  const labelStyle = buttonTextVariantStyles[variant];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={size === "compact" ? spacing.xxs : undefined}
      style={({ pressed }) => [
        styles.base,
        size === "compact" ? styles.compact : styles.default,
        variantStyle,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.label, labelStyle, textStyle]} numberOfLines={1}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.button,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: screen.minTapTarget,
    paddingHorizontal: spacing.xl,
  },
  compact: {
    height: 48,
  },
  default: {
    height: 60,
  },
  disabled: {
    opacity: 0.72,
  },
  label: {
    ...typography.button,
    flexShrink: 1,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.82,
  },
});

const buttonVariantStyles = StyleSheet.create({
  danger: {
    backgroundColor: colors.feedback.danger,
    ...shadow.card,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  primary: {
    backgroundColor: colors.brand.primary,
    ...shadow.card,
  },
  secondary: {
    backgroundColor: colors.surface.base,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
});

const buttonTextVariantStyles = StyleSheet.create({
  danger: {
    color: colors.text.inverse,
  },
  ghost: {
    color: colors.text.primary,
  },
  primary: {
    color: colors.text.primary,
  },
  secondary: {
    color: colors.text.primary,
  },
});
