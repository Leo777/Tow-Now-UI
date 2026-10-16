import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius } from "../theme";
import { typography } from "../typography";

export type AvatarProps = {
  name: string;
  size?: "default" | "large";
  style?: StyleProp<ViewStyle>;
};

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Initials in a dark disc: 52 pt, or 70 pt when `large`. */
export function Avatar({ name, size = "default", style }: AvatarProps) {
  const large = size === "large";

  return (
    <View style={[styles.avatar, large ? styles.avatarLarge : null, style]}>
      <Text style={[styles.text, large ? styles.textLarge : null]}>
        {initialsOf(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.text.primary,
    borderRadius: radius.pill,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  avatarLarge: {
    height: 70,
    width: 70,
  },
  text: {
    ...typography.bodyStrong,
    color: colors.text.inverse,
  },
  textLarge: {
    fontSize: 20,
    lineHeight: 28,
  },
});
