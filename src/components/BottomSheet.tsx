import { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { uiText } from "../i18n";
import { colors, radius, screen, shadow, spacing } from "../theme";
import {
  isSheetDrag,
  SHEET_DRAG_SLOP,
  sheetDragOffset,
  sheetExpandedAfterDrag,
} from "./sheetSnap";

export type BottomSheetProps = {
  children: ReactNode;
  floating?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  showHandle?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Makes the sheet collapsible: with `onExpandedChange`, a tap on the handle
   * toggles it and a vertical drag on the handle snaps it compact or expanded.
   * Leave both out for the static sheet.
   */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Shown instead of `children` while the sheet is compact. */
  compactContent?: ReactNode;
  /** Overrides the handle's spoken label ("Show details" / "Hide details"). */
  handleAccessibilityLabel?: string;
};

export function BottomSheet({
  children,
  compactContent,
  contentStyle,
  expanded = true,
  floating = true,
  handleAccessibilityLabel,
  onExpandedChange,
  onLayout,
  showHandle = true,
  style,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const collapsible = onExpandedChange !== undefined;
  const showCompact = collapsible && !expanded && compactContent !== undefined;

  return (
    <SheetFrame
      collapsible={collapsible}
      expanded={expanded}
      floating={floating}
      handleAccessibilityLabel={handleAccessibilityLabel}
      onExpandedChange={onExpandedChange}
      onLayout={onLayout}
      showHandle={showHandle}
      style={style}
    >
      <View
        style={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, screen.bottomActionPadding) },
          contentStyle,
        ]}
      >
        {showCompact ? compactContent : children}
      </View>
    </SheetFrame>
  );
}

function SheetFrame({
  children,
  collapsible,
  expanded,
  floating,
  handleAccessibilityLabel,
  onExpandedChange,
  onLayout,
  showHandle,
  style,
}: {
  children: ReactNode;
  collapsible: boolean;
  expanded: boolean;
  floating: boolean;
  handleAccessibilityLabel?: string;
  onExpandedChange?: (expanded: boolean) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  showHandle: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const offset = useRef(new Animated.Value(0)).current;
  // The responder is made once; these keep it reading the latest props.
  const expandedRef = useRef(expanded);
  const onChangeRef = useRef(onExpandedChange);

  useEffect(() => {
    expandedRef.current = expanded;
    onChangeRef.current = onExpandedChange;
  }, [expanded, onExpandedChange]);

  const panResponder = useMemo(() => {
    const settle = () =>
      Animated.spring(offset, {
        bounciness: 0,
        speed: 18,
        toValue: 0,
        useNativeDriver: true,
      }).start();

    return PanResponder.create({
      // The handle owns every touch that starts on it: a short touch is a tap
      // (toggle), a vertical move is a drag. Pressable can't be used here, as it
      // overrides the responder move/release handlers.
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_event, gesture) => isSheetDrag(gesture.dx, gesture.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_event, gesture) => {
        offset.setValue(sheetDragOffset(gesture.dy, expandedRef.current));
      },
      onPanResponderRelease: (_event, gesture) => {
        if (!isSheetDrag(gesture.dx, gesture.dy) && Math.abs(gesture.dx) <= SHEET_DRAG_SLOP) {
          onChangeRef.current?.(!expandedRef.current);
          settle();
          return;
        }

        const next = sheetExpandedAfterDrag(gesture.dy, gesture.vy, expandedRef.current);

        if (next !== expandedRef.current) {
          onChangeRef.current?.(next);
        }

        settle();
      },
      onPanResponderTerminate: settle,
    });
  }, [offset]);

  const sheetStyle = [styles.sheet, floating ? styles.floating : null, style];

  if (!collapsible) {
    return (
      <View onLayout={onLayout} style={sheetStyle}>
        {showHandle ? <View style={styles.handle} /> : null}
        {children}
      </View>
    );
  }

  return (
    <Animated.View onLayout={onLayout} style={[sheetStyle, { transform: [{ translateY: offset }] }]}>
      <View
        {...panResponder.panHandlers}
        accessibilityActions={[{ name: "activate" }]}
        accessibilityLabel={
          handleAccessibilityLabel ?? uiText(expanded ? "sheetCollapse" : "sheetExpand")
        }
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        hitSlop={{ bottom: spacing.sm, left: 0, right: 0, top: spacing.sm }}
        accessible
        onAccessibilityAction={() => onExpandedChange?.(!expanded)}
        style={styles.handleArea}
        testID="bottom-sheet-handle"
      >
        {showHandle ? <View style={styles.handleBar} /> : null}
      </View>
      {children}
    </Animated.View>
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
  // Full-width strip around the bar, so the drag is easy to start.
  handleArea: {
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: screen.minTapTarget - spacing.md,
    paddingTop: spacing.md,
  },
  handleBar: {
    backgroundColor: colors.border.default,
    borderRadius: radius.pill,
    height: 5,
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
