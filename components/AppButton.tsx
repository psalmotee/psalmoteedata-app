import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

import theme from "../constants/theme";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? theme.colors.white : theme.colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingVertical: 13,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },

  secondaryButton: {
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  text: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  primaryText: {
    color: theme.colors.white,
  },

  secondaryText: {
    color: theme.colors.text,
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },
});
