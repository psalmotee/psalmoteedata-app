import { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionItem from "../components/TransactionItem";
import TransactionDetailsModal from "../components/TransactionDetailsModal";

import { useTransactions } from "../context/TransactionContext";

import type { ServiceTransaction } from "../types/serviceTransaction";

import theme from "../constants/theme";

type FilterType = "All" | "Airtime" | "Data";

const filters: FilterType[] = ["All", "Airtime", "Data"];

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState<ServiceTransaction | null>(null);

  const {
    history,
    pagination,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refreshHistory,
    loadMoreHistory,
  } = useTransactions();

  const filteredTransactions = history.filter((transaction) => {
    if (activeFilter === "All") return true;

    return transaction.service.toLowerCase() === activeFilter.toLowerCase();
  });

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unavailable";

    const normalizedDate = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T");

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatService = (service: string) =>
    service.charAt(0).toUpperCase() + service.slice(1).toLowerCase();

 const getStatus = (status: string): "Successful" | "Pending" | "Failed" => {
   const normalized = status.toLowerCase();

   if (normalized.includes("success") || normalized.includes("complete")) {
     return "Successful";
   }

   if (
     normalized.includes("fail") ||
     normalized.includes("reject") ||
     normalized.includes("cancel")
   ) {
     return "Failed";
   }

   return "Pending";
 };

  const getTransactionIcon = (
    service: string,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (service.toLowerCase()) {
      case "airtime":
        return "cellphone";
      case "data":
        return "sim";
      case "electricity":
        return "flash";
      case "cable":
        return "television";
      default:
        return "receipt";
    }
  };

  function formatStatus(status: string) {
    const normalized = status.toLowerCase();

    if (normalized.includes("success") || normalized.includes("complete")) {
      return "Successful";
    }

    if (
      normalized.includes("fail") ||
      normalized.includes("reject") ||
      normalized.includes("cancel")
    ) {
      return "Failed";
    }

    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshHistory}
            tintColor={theme.colors.primary}
          />
        }
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

        {isLoading && history.length === 0 ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.stateText}>Loading transactions...</Text>
          </View>
        ) : error && history.length === 0 ? (
          <View style={styles.stateContainer}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={42}
              color={theme.colors.error}
            />

            <Text style={styles.emptyTitle}>Unable to load transactions</Text>

            <Text style={styles.emptyDescription}>{error}</Text>

            <Pressable style={styles.retryButton} onPress={refreshHistory}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <>
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                name={formatService(transaction.service)}
                date={`${transaction.recipient} • ${formatDate(
                  transaction.date,
                )}`}
                amount={formatCurrency(transaction.amount)}
                status={getStatus(transaction.status)}
                icon={getTransactionIcon(transaction.service)}
                onPress={() => setSelectedTransaction(transaction)}
              />
            ))}

            {pagination && pagination.current_page < pagination.total_pages && (
              <Pressable
                style={styles.loadMoreButton}
                onPress={loadMoreHistory}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.loadMoreText}>
                    Load More Transactions
                  </Text>
                )}
              </Pressable>
            )}

            {error && <Text style={styles.paginationError}>{error}</Text>}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={42}
              color={theme.colors.muted}
            />

            <Text style={styles.emptyTitle}>No transactions found</Text>

            <Text style={styles.emptyDescription}>
              {activeFilter === "All"
                ? "Your transactions will appear here."
                : `Your ${activeFilter.toLowerCase()} transactions will appear here.`}
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
    paddingTop: 55,
    flexGrow: 1,
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

  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["4xl"],
  },

  stateText: {
    color: theme.colors.muted,
    marginTop: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.body,
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

  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
  },

  retryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },

  loadMoreText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  paginationError: {
    color: theme.colors.error,
    textAlign: "center",
    marginVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.xs,
  },
});
