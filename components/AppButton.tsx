import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconSize?: number;
  disabled?: boolean;
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  iconSize = 20,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  const iconColor = isPrimary ? theme.colors.white : theme.colors.primary;

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
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={iconColor}
            />
          )}

          <Text
            style={[
              styles.text,
              isPrimary ? styles.primaryText : styles.secondaryText,
            ]}
          >
            {title}
          </Text>
        </View>
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

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
  },

  secondaryButton: {
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  outlintButton: {

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
