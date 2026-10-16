import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "../theme";

// Glyphs drawn with Views, as in the Figma files. Each takes `style` for
// placement; sizes are the Figma sizes.

type IconProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
};

// Handset glyph exported from the Figma `btn_call` icon (24 × 24, @2x/@3x).
const phoneIconImage = require("../../assets/icons/phone.png");

export function MenuIcon({ color = colors.text.primary, style }: IconProps) {
  const line = [styles.menuLine, { backgroundColor: color }];

  return (
    <View style={[styles.menuIcon, style]}>
      <View style={line} />
      <View style={[line, styles.menuLineShort]} />
      <View style={line} />
    </View>
  );
}

export function CloseIcon({
  color = colors.text.primary,
  lineLength,
  size = 18,
  style,
}: IconProps & { size?: number; lineLength?: number }) {
  const length = lineLength ?? size - 1;
  const line = [
    styles.closeLine,
    { backgroundColor: color, left: (size - length) / 2, width: length },
  ];

  return (
    <View style={[styles.closeIcon, { height: size, width: size }, style]}>
      <View style={[line, styles.rotateForward]} />
      <View style={[line, styles.rotateBack]} />
    </View>
  );
}

export function ChatIcon({ style }: Pick<IconProps, "style">) {
  return (
    <View style={[styles.chatIcon, style]}>
      <View style={styles.chatTail} />
      <View style={styles.chatDot} />
      <View style={styles.chatDot} />
      <View style={styles.chatDot} />
    </View>
  );
}

export function PhoneIcon({ style }: Pick<IconProps, "style">) {
  return (
    <View style={[styles.phoneIcon, style]}>
      <Image
        accessibilityElementsHidden
        importantForAccessibility="no"
        source={phoneIconImage}
        style={styles.phoneGlyph}
        testID="phone-icon"
      />
    </View>
  );
}

export function SearchIcon({ color = colors.brand.primary, style }: IconProps) {
  return (
    <View style={[styles.searchIcon, style]}>
      <View style={[styles.searchCircle, { borderColor: color }]} />
      <View style={[styles.searchHandle, { backgroundColor: color }]} />
    </View>
  );
}

/** A place in a list: grey disc, yellow when selected. */
export function PlaceIcon({
  selected = false,
  style,
}: Pick<IconProps, "style"> & { selected?: boolean }) {
  return (
    <View style={[styles.placeIcon, selected ? styles.placeIconSelected : null, style]}>
      <View style={styles.placeIconHole} />
    </View>
  );
}

export function CrosshairIcon({ color = colors.text.primary, style }: IconProps) {
  return (
    <View style={[styles.crosshairIcon, style]}>
      <View style={[styles.crosshairRing, { borderColor: color }]} />
      <View style={[styles.crosshairVertical, { backgroundColor: color }]} />
      <View style={[styles.crosshairHorizontal, { backgroundColor: color }]} />
      <View style={[styles.crosshairDot, { backgroundColor: color }]} />
    </View>
  );
}

/** Pickup dot, line and arrow down to the drop-off, beside two address rows. */
export function RouteGlyph({
  lineLength = 39,
  style,
}: Pick<IconProps, "style"> & { lineLength?: number }) {
  return (
    <View style={[styles.routeGlyph, style]}>
      <View style={styles.routeGlyphDot} />
      <View style={[styles.routeGlyphLine, { height: lineLength }]} />
      <View style={styles.routeGlyphArrow} />
    </View>
  );
}

export function MapLinkIcon({ style }: Pick<IconProps, "style">) {
  return (
    <View style={[styles.mapLinkIcon, style]}>
      <View style={styles.mapLinkDot} />
      <View style={styles.mapLinkLine} />
    </View>
  );
}

/** Row disclosure arrow. */
export function ChevronRightIcon({ color = colors.text.muted, style }: IconProps) {
  return (
    <View style={[styles.chevronIcon, style]}>
      <View style={[styles.chevronTop, { backgroundColor: color }]} />
      <View style={[styles.chevronBottom, { backgroundColor: color }]} />
    </View>
  );
}

export function CheckIcon({ color = colors.text.primary, style }: IconProps) {
  return (
    <View style={[styles.checkIcon, style]}>
      <View style={[styles.checkShort, { backgroundColor: color }]} />
      <View style={[styles.checkLong, { backgroundColor: color }]} />
    </View>
  );
}

/** Plus in a ring, for "add photo" style slots. */
export function AddIcon({ style }: Pick<IconProps, "style">) {
  return (
    <View style={[styles.addIcon, style]}>
      <View style={styles.addHorizontal} />
      <View style={styles.addVertical} />
    </View>
  );
}

const styles = StyleSheet.create({
  addHorizontal: {
    backgroundColor: colors.text.primary,
    borderRadius: radius.pill,
    height: 2,
    position: "absolute",
    width: 14,
  },
  addIcon: {
    alignItems: "center",
    borderColor: colors.border.default,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  addVertical: {
    backgroundColor: colors.text.primary,
    borderRadius: radius.pill,
    height: 14,
    position: "absolute",
    width: 2,
  },
  chatDot: {
    backgroundColor: colors.text.primary,
    borderRadius: radius.pill,
    height: 4,
    width: 4,
  },
  chatIcon: {
    alignItems: "center",
    borderColor: colors.text.primary,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.xxs,
    height: 28,
    justifyContent: "center",
    width: 31,
  },
  chatTail: {
    backgroundColor: colors.surface.base,
    borderBottomColor: colors.text.primary,
    borderBottomWidth: 2,
    borderLeftColor: colors.text.primary,
    borderLeftWidth: 2,
    bottom: -4,
    height: 9,
    left: 3,
    position: "absolute",
    transform: [{ rotate: "-25deg" }],
    width: 9,
  },
  checkIcon: {
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  checkLong: {
    borderRadius: radius.pill,
    height: 2,
    transform: [{ rotate: "-45deg" }, { translateX: 2 }],
    width: 14,
  },
  checkShort: {
    borderRadius: radius.pill,
    height: 2,
    transform: [{ rotate: "45deg" }, { translateX: -4 }, { translateY: 4 }],
    width: 8,
  },
  chevronBottom: {
    borderRadius: radius.pill,
    height: 2,
    transform: [{ rotate: "-45deg" }, { translateX: -3 }],
    width: 10,
  },
  chevronIcon: {
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  chevronTop: {
    borderRadius: radius.pill,
    height: 2,
    marginBottom: spacing.xs,
    transform: [{ rotate: "45deg" }, { translateX: -3 }],
    width: 10,
  },
  closeIcon: {
    justifyContent: "center",
  },
  closeLine: {
    borderRadius: radius.pill,
    height: 2,
    position: "absolute",
  },
  crosshairDot: {
    borderRadius: radius.pill,
    height: 5,
    position: "absolute",
    width: 5,
  },
  crosshairHorizontal: {
    height: 2,
    position: "absolute",
    width: 24,
  },
  crosshairIcon: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  crosshairRing: {
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 18,
    position: "absolute",
    width: 18,
  },
  crosshairVertical: {
    height: 24,
    position: "absolute",
    width: 2,
  },
  mapLinkDot: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  mapLinkIcon: {
    alignItems: "center",
    height: 30,
    width: 30,
  },
  mapLinkLine: {
    backgroundColor: colors.text.primary,
    height: 13,
    opacity: 0.62,
    width: 1,
  },
  menuIcon: {
    gap: spacing.xxs,
  },
  menuLine: {
    borderRadius: radius.pill,
    height: 2,
    width: 16,
  },
  menuLineShort: {
    width: 11,
  },
  phoneGlyph: {
    height: 24,
    width: 24,
  },
  phoneIcon: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  placeIcon: {
    alignItems: "center",
    backgroundColor: colors.border.default,
    borderRadius: radius.pill,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  placeIconHole: {
    backgroundColor: colors.surface.base,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  placeIconSelected: {
    backgroundColor: colors.brand.primary,
  },
  rotateBack: {
    transform: [{ rotate: "-45deg" }],
  },
  rotateForward: {
    transform: [{ rotate: "45deg" }],
  },
  routeGlyph: {
    alignItems: "center",
    justifyContent: "center",
    width: 18,
  },
  routeGlyphArrow: {
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    borderRightColor: "transparent",
    borderRightWidth: 4,
    borderTopColor: colors.text.primary,
    borderTopWidth: 5,
    height: 0,
    marginTop: -1,
    opacity: 0.78,
    width: 0,
  },
  routeGlyphDot: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  routeGlyphLine: {
    backgroundColor: colors.text.muted,
    marginVertical: 2,
    opacity: 0.75,
    width: 1,
  },
  searchCircle: {
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 13,
    width: 13,
  },
  searchHandle: {
    borderRadius: radius.pill,
    height: 2,
    marginLeft: 11,
    marginTop: -2,
    transform: [{ rotate: "45deg" }],
    width: 8,
  },
  searchIcon: {
    height: 22,
    justifyContent: "center",
    width: 22,
  },
});
