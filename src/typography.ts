import type { TextStyle } from "react-native";

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
} as const;

export const typography = {
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  heading2: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  heading3: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 28,
  },
} satisfies Record<string, TextStyle>;

export const figmaTextStyleMap = {
  "Heading 1": "heading1",
  "Heading 2": "heading2",
  "Heading 3": "heading3",
  "15_Text_Bold": "bodyStrong",
  "15_Text_Reg": "body",
  "13_Text_Reg": "bodySmall",
  "11_Text_Reg": "caption",
} as const;

export type TypographyToken = keyof typeof typography;
