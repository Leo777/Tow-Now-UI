import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, screen, spacing } from "../theme";
import { typography } from "../typography";

export type ListRowProps = Omit<PressableProps, "style" | "children"> & {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({
  accessibilityLabel,
  disabled,
  leading,
  showDivider = true,
  style,
  subtitle,
  title,
  trailing,
  ...pressableProps
}: ListRowProps) {
  return (
    <Pressable
      accessibilityLabel={
        accessibilityLabel ?? [title, subtitle].filter(Boolean).join(", ")
      }
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={[styles.content, showDivider ? styles.divider : null]}>
        <View style={styles.textColumn}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    minHeight: 60,
    paddingVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.72,
  },
  divider: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leading: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    width: 30,
  },
  pressed: {
    opacity: 0.72,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 61,
    minWidth: screen.minTapTarget,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginTop: spacing.xxxs,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.text.primary,
  },
  trailing: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
});
