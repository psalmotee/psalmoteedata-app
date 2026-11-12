import { View, Text, TextInput, StyleSheet } from "react-native";

import theme from "../constants/theme";

type PinInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
};

export default function PinInput({
  value,
  onChangeText,
  length = 4,
}: PinInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transaction PIN</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) =>
          onChangeText(text.replace(/[^0-9]/g, "").slice(0, length))
        }
        keyboardType="number-pad"
        secureTextEntry
        maxLength={length}
        placeholder={`Enter your ${length}-digit PIN`}
        placeholderTextColor={theme.colors.muted}
        textAlign="center"
      />

      <Text style={styles.helperText}>
        Enter your transaction PIN to authorize this purchase.
      </Text>
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
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 12,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },
});
