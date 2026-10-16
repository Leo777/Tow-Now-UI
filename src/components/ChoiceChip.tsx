import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "../theme";
import { typography } from "../typography";

export type ChoiceChipProps = Omit<PressableProps, "style" | "children"> & {
  label: string;
  selected?: boolean;
  leftIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ChoiceChip({
  disabled,
  label,
  leftIcon,
  selected = false,
  style,
  ...pressableProps
}: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={spacing.xxs}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      {leftIcon}
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  disabled: {
    opacity: 0.72,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text.primary,
  },
  pressed: {
    opacity: 0.78,
  },
  selected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  unselected: {
    backgroundColor: colors.surface.muted,
    borderColor: colors.border.default,
  },
});
