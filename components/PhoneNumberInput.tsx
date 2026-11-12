import { View, Text, TextInput, StyleSheet } from "react-native";

import theme from "../constants/theme";

type PhoneNumberInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
};

export default function PhoneNumberInput({
  value,
  onChangeText,
  label = "Phone Number",
  placeholder = "Enter phone number",
  helperText = "Enter the 11-digit mobile number.",
}: PhoneNumberInputProps) {
  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "").slice(0, 11);
    onChangeText(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        keyboardType="phone-pad"
        maxLength={11}
        value={value}
        onChangeText={handleChange}
      />

      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing["2xl"],
  },

  label: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.lg,
  },

  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.body,
  },

  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },
});
