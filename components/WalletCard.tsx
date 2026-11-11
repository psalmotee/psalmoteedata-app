import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import theme from "../constants/theme";
import AppButton from "./AppButton";

type WalletCardProps = {
  balance: string;
};

export default function WalletCard({ balance }: WalletCardProps) {
  return (
    <LinearGradient
      colors={["#0284A8", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Available Balance</Text>
        <Text style={styles.symbol}>₦</Text>
      </View>

      <Text style={styles.balance}>{balance}</Text>

      <View style={styles.actions}>
        <AppButton title="+ Fund Wallet" variant="primary" />

        <AppButton title="History" variant="secondary" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing["3xl"],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },

  symbol: {
    color: theme.colors.white,
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
  },

  balance: {
    color: theme.colors.white,
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.heading,
    marginVertical: theme.spacing.lg,
  },

  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
});
