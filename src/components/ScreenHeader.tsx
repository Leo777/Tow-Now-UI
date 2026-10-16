import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, screen, spacing } from "../theme";
import { typography } from "../typography";
import { uiText } from "../i18n";

import { IconButton } from "./IconButton";

export type ScreenHeaderProps = {
  title?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
  onLeftPress?: () => void;
  leftAccessibilityLabel?: string;
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  floating = true,
  leftAccessibilityLabel = uiText("back"),
  leftIcon,
  onLeftPress,
  rightAccessory,
  style,
  title,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.header,
        floating ? styles.floating : null,
        { paddingTop: Math.max(insets.top, spacing.xxl) },
        style,
      ]}
    >
      <View style={styles.leftSlot}>
        {leftIcon ? (
          <IconButton
            accessibilityLabel={leftAccessibilityLabel}
            icon={leftIcon}
            onPress={onLeftPress}
            size="nav"
          />
        ) : null}
      </View>
      {title ? (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : null}
      <View style={styles.rightSlot}>{rightAccessory}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 70,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  leftSlot: {
    alignItems: "flex-start",
    minWidth: screen.minTapTarget,
  },
  rightSlot: {
    alignItems: "flex-end",
    minWidth: screen.minTapTarget,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.text.primary,
    flex: 1,
    textAlign: "center",
  },
});
