import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import theme from "../constants/theme";
import AppButton from "./AppButton";

type WalletCardProps = {
  balance: string;
  packageName: string;
  onFundWallet: () => void;
  onViewHistory: () => void;
};

export default function WalletCard({
  balance,
  packageName,
  onFundWallet,
  onViewHistory,
}: WalletCardProps) {
  return (
    <LinearGradient
      colors={["#0284A8", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Available Balance</Text>

        <View style={styles.packageBadge}>
          <Text style={styles.packageText}>{packageName}</Text>
        </View>
      </View>

      <Text style={styles.balance}>{balance}</Text>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <AppButton
            title="+ Fund Wallet"
            variant="primary"
            onPress={onFundWallet}
          />
        </View>

        <View style={styles.actionButton}>
          <AppButton
            title="History"
            variant="secondary"
            onPress={onViewHistory}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
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

  packageBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },

  packageText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
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

  actionButton: {
    flex: 1,
  },
});
