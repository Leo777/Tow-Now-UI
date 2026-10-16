import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";

import { colors, radius, shadow, spacing } from "../theme";
import { typography } from "../typography";

type TextFieldVariant = "field" | "search";

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: TextFieldVariant;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  containerStyle,
  editable = true,
  error,
  helperText,
  label,
  leftIcon,
  rightIcon,
  style,
  variant = "field",
  ...inputProps
}: TextFieldProps) {
  const supportingText = error ?? helperText;
  const {
    accessibilityHint,
    accessibilityLabel,
    placeholder,
    ...restInputProps
  } = inputProps;
  const defaultAccessibilityLabel =
    accessibilityLabel ??
    label ??
    (typeof placeholder === "string" ? placeholder : undefined);

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          variant === "search" ? styles.searchContainer : styles.fieldContainer,
          !editable ? styles.disabled : null,
          error ? styles.errorBorder : null,
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <View style={styles.textColumn}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <TextInput
            accessibilityHint={accessibilityHint ?? supportingText}
            accessibilityLabel={defaultAccessibilityLabel}
            editable={editable}
            placeholderTextColor={colors.text.muted}
            style={[
              styles.input,
              variant === "search" ? styles.searchInput : null,
              style,
            ]}
            placeholder={placeholder}
            {...restInputProps}
          />
        </View>
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
      {supportingText ? (
        <Text style={[styles.supportingText, error ? styles.errorText : null]}>
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  disabled: {
    opacity: 1,
  },
  errorBorder: {
    borderColor: colors.feedback.danger,
  },
  errorText: {
    color: colors.feedback.danger,
  },
  fieldContainer: {
    backgroundColor: colors.surface.base,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    minHeight: 24,
    padding: 0,
  },
  label: {
    ...typography.caption,
    color: colors.text.muted,
  },
  searchContainer: {
    ...shadow.card,
    backgroundColor: colors.surface.base,
    borderRadius: radius.xl,
    height: 44,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    minHeight: 20,
  },
  supportingText: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  textColumn: {
    flex: 1,
    justifyContent: "center",
  },
});
