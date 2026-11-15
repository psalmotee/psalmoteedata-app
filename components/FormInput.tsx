import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import theme from "../constants/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoComplete?: "off" | "username" | "current-password";
  textContentType?: "none" | "username" | "password";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onFocus?: () => void;
};

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  maxLength,
  multiline = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoComplete = "off",
  textContentType = "none",
  autoCapitalize = "sentences",
  onFocus,
}: Props) {

  const { recordActivity } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={(text) => {
          recordActivity();
          onChangeText(text);
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        onFocus={() => {
          recordActivity();
          onFocus?.();
        }}
        style={[styles.input, multiline && styles.multilineInput]}
      />

      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.sm,
  },

  input: {
    minHeight: 50,
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  multilineInput: {
    minHeight: 110,
    paddingTop: theme.spacing.md,
  },

  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
});
