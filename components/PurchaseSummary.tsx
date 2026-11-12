import { View, Text, StyleSheet } from "react-native";

import theme from "../constants/theme";

type PurchaseSummaryProps = {
  title?: string;
  rows: {
    label: string;
    value: string;
  }[];
  amount?: string;
  discount?: string;
  providerBonus?: string;
  serviceBonus?: string;
  tieredBonus?: string;
  totalLabel?: string;
  totalAmount: string;
};

export default function PurchaseSummary({
  title = "Purchase Summary",
  rows,
  amount,
  discount,
  providerBonus,
  serviceBonus,
  tieredBonus,
  totalLabel = "Total Amount to Pay",
  totalAmount,
}: PurchaseSummaryProps) {
  const hasBreakdown =
    amount !== undefined ||
    discount !== undefined ||
    providerBonus !== undefined ||
    serviceBonus !== undefined ||
    tieredBonus !== undefined;

  const breakdownItems = [
    { label: "Amount", value: amount },
    { label: "Discount", value: discount },
    { label: "Provider Bonus", value: providerBonus },
    { label: "Service Bonus", value: serviceBonus },
    { label: "Tiered Bonus", value: tieredBonus },
  ].filter((item) => item.value !== undefined);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Transaction details */}
      {rows.map((row, index) => (
        <View key={`${row.label}-${index}`} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}

      {/* Payment breakdown */}
      {hasBreakdown && (
        <>
          <View style={styles.divider} />

          {breakdownItems.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text
                style={[
                  styles.value,
                  item.label === "Discount" && styles.discount,
                  item.label.includes("Bonus") && styles.bonus,
                  item.label.includes("tiered") && styles.bonus,
                ]}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </>
      )}

      <View style={styles.divider} />

      {/* Final amount */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalAmount}>{totalAmount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing["2xl"],
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    flexShrink: 1,
    marginRight: theme.spacing.md,
  },
  value: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
    flexShrink: 1,
  },
  discount: {
    color: theme.colors.success,
  },
  bonus: {
    color: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
    flexShrink: 1,
    marginRight: theme.spacing.md,
  },
  totalAmount: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
