import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "../theme";
import { fontFamily } from "../typography";

export type CardBrand = "mastercard" | "visa";
export type PaymentMethodKind = "card" | "cash";

type MarkProps = {
  style?: StyleProp<ViewStyle>;
};

/** Card network logo, centred in a 42 × 30 frame (pass `style` to resize it). */
export function CardBrandMark({ brand, style }: MarkProps & { brand: CardBrand }) {
  return (
    <View style={[styles.frame, style]}>
      {brand === "visa" ? (
        <Text style={styles.visaText}>VISA</Text>
      ) : (
        <View style={styles.mastercard}>
          <View style={[styles.mastercardCircle, styles.mastercardRed]} />
          <View style={[styles.mastercardCircle, styles.mastercardYellow]} />
        </View>
      )}
    </View>
  );
}

export function CashMark({ style }: MarkProps) {
  return (
    <View style={[styles.frame, style]}>
      <View style={styles.cashSlot} />
      <View style={styles.cashBody}>
        <View style={styles.cashDot} />
      </View>
    </View>
  );
}

/** Brand string as stored on a payment method ("Visa", "Mastercard", ...). */
export function cardBrandFrom(brand: string | undefined): CardBrand {
  return brand?.toLowerCase() === "visa" ? "visa" : "mastercard";
}

export function PaymentMethodMark({
  brand,
  kind,
  style,
}: MarkProps & { brand?: string; kind: PaymentMethodKind }) {
  return kind === "cash" ? (
    <CashMark style={style} />
  ) : (
    <CardBrandMark brand={cardBrandFrom(brand)} style={style} />
  );
}

const styles = StyleSheet.create({
  cashBody: {
    alignItems: "center",
    borderColor: colors.text.primary,
    borderRadius: radius.xs,
    borderWidth: 2,
    height: 16,
    justifyContent: "center",
    width: 24,
  },
  cashDot: {
    borderColor: colors.text.primary,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 7,
    width: 7,
  },
  cashSlot: {
    backgroundColor: colors.text.primary,
    borderRadius: radius.pill,
    height: 2,
    marginBottom: spacing.xxs,
    width: 22,
  },
  frame: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 42,
  },
  mastercard: {
    height: 16,
    width: 26,
  },
  mastercardCircle: {
    borderRadius: radius.pill,
    height: 16,
    position: "absolute",
    top: 0,
    width: 16,
  },
  mastercardRed: {
    backgroundColor: "#EB001B",
    left: 0,
  },
  mastercardYellow: {
    backgroundColor: "#F79E1B",
    opacity: 0.9,
    right: 0,
  },
  visaText: {
    color: "#172B85",
    fontFamily: fontFamily.bold,
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "700",
    lineHeight: 16,
  },
});
