import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme";

export type BackArrowIconProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function BackArrowIcon({
  color = colors.text.primary,
  style,
}: BackArrowIconProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.chevron, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    borderBottomWidth: 2.4,
    borderLeftWidth: 2.4,
    height: 11,
    transform: [{ rotate: "45deg" }],
    width: 11,
  },
  container: {
    alignItems: "center",
    height: 20,
    justifyContent: "center",
    width: 20,
  },
});
