import { View, Text, StyleSheet } from "react-native";
import theme from "../constants/theme";

export default function AirtimePurchaseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Airtime</Text>
      <Text style={styles.subtitle}>Recharge your mobile line.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: 55,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["3xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },
});
