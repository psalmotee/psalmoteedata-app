import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import typography from "../constants/typography";

type CommissionCardProps = {
  commissions: number;
};

export default function CommissionCard({ commissions }: CommissionCardProps) {
  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <LinearGradient
      colors={["#064E3B", "#047857", "#059669"]}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="wallet-plus-outline"
            size={23}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.badge}>YOUR EARNINGS</Text>
      </View>

      <Text style={styles.title}>Total Commissions</Text>

      <Text style={styles.amount}>{formatCurrency(commissions)}</Text>

      <Text style={styles.description}>
        Earnings from your referrals and transactions.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    color: "#D1FAE5",
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 1,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: typography.fontFamily.heading,
    marginTop: 12,
  },

  amount: {
    color: "#FFFFFF",
    fontSize: 29,
    fontFamily: typography.fontFamily.bold,
    marginTop: 5,
  },

  description: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    lineHeight: 19,
    marginTop: 8,
  },
});
