import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, screen, shadow, spacing } from "../theme";

export type BottomSheetProps = {
  children: ReactNode;
  floating?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  showHandle?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function BottomSheet({
  children,
  contentStyle,
  floating = true,
  onLayout,
  showHandle = true,
  style,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      onLayout={onLayout}
      style={[styles.sheet, floating ? styles.floating : null, style]}
    >
      {showHandle ? <View style={styles.handle} /> : null}
      <View
        style={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, screen.bottomActionPadding) },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: screen.horizontalPadding,
    paddingTop: spacing.xxl,
  },
  floating: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.border.default,
    borderRadius: radius.pill,
    height: 5,
    marginTop: spacing.md,
    width: 61,
  },
  sheet: {
    ...shadow.bottomSheet,
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: radius.bottomSheet,
    borderTopRightRadius: radius.bottomSheet,
    overflow: "hidden",
  },
});
