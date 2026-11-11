import { View, Text, StyleSheet } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

type TransactionItemProps = {
  name: string;
  date: string;
  amount: string;
  status: "Successful" | "Pending" | "Failed";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function TransactionItem({
  name,
  date,
  amount,
  status,
  icon,
}: TransactionItemProps) {
  const statusColor = {
    Successful: theme.colors.success,
    Pending: theme.colors.accent,
    Failed: theme.colors.error,
  }[status];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{amount}</Text>

        <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: "center",
    justifyContent: "center",
  },

  details: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },

  name: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
  },

  date: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 5,
    fontFamily: theme.typography.fontFamily.body,
  },

  amountContainer: {
    alignItems: "flex-end",
  },

  amount: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
  },

  status: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 5,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
