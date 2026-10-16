import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, shadow } from "../theme";
import { typography } from "../typography";

export type CircleActionProps = {
  accessibilityLabel: string;
  /** Short count or mark in a yellow badge, e.g. unread messages. */
  badge?: string;
  icon: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** 65 pt round action on a card shadow (call, chat, cancel). */
export function CircleAction({
  accessibilityLabel,
  badge,
  icon,
  onPress,
  style,
}: CircleActionProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed ? styles.pressed : null, style]}
    >
      {icon}
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    ...shadow.card,
    alignItems: "center",
    backgroundColor: colors.surface.base,
    borderRadius: radius.pill,
    height: 65,
    justifyContent: "center",
    width: 65,
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: -2,
    top: -5,
    width: 24,
  },
  badgeText: {
    ...typography.bodyStrong,
    color: colors.text.inverse,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.78,
  },
});
