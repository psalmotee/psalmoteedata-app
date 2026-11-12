import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionItem from "../components/TransactionItem";
import { useTransactions } from "../context/TransactionContext";
import { TransactionServiceType } from "../types/transaction";
import theme from "../constants/theme";
import { Transaction } from "../types/transaction";
import TransactionDetailsModal from "../components/TransactionDetailsModal";

type FilterType = "All" | TransactionServiceType;

const filters: FilterType[] = ["All", "Airtime", "Data"];

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { transactions } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (activeFilter === "All") return true;

      return transaction.serviceType === activeFilter;
    })
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (
    serviceType: TransactionServiceType,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    return serviceType === "Airtime" ? "cellphone" : "sim";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>View your transaction activities.</Text>
        </View>

        <View style={styles.filterContainer}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterButton,
                  isActive && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          <Text style={styles.transactionCount}>
            {filteredTransactions.length} records
          </Text>
        </View>

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              name={`${transaction.network} ${transaction.serviceType}`}
              date={`${transaction.phoneNumber} • ${formatDate(
                transaction.completedAt,
              )}`}
              amount={formatCurrency(transaction.totalAmount)}
              status={transaction.status}
              icon={getTransactionIcon(transaction.serviceType)}
              onPress={() => setSelectedTransaction(transaction)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={42}
              color={theme.colors.muted}
            />

            <Text style={styles.emptyTitle}>No transactions found</Text>

            <Text style={styles.emptyDescription}>
              Your {activeFilter.toLowerCase()} transactions will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing["4xl"],
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.fontSize["3xl"],
  },

  subtitle: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 5,
    marginBottom: theme.spacing.xl,
  },

  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },

  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },

  filterText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },

  activeFilterText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
  },

  transactionCount: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["4xl"],
  },

  emptyTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    marginTop: theme.spacing.md,
  },

  emptyDescription: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});
