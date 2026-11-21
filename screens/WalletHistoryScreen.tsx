import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import theme from "../constants/theme";
import { walletApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";

import type { WalletTransaction } from "../types/wallet";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "WalletHistory">;

const PAGE_SIZE = 20;

export default function WalletHistoryScreen({ navigation }: Props) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = useCallback(async (page: number, refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);

      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await walletApi.getHistory(token, page, PAGE_SIZE);

      if (!response.success) {
        throw new Error("Unable to retrieve wallet history.");
      }

      setTransactions((previous) =>
        page === 1
          ? response.transactions
          : [
              ...previous,
              ...response.transactions.filter(
                (item) => !previous.some((existing) => existing.id === item.id),
              ),
            ],
      );

      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve wallet history.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void fetchHistory(1);
  }, [fetchHistory]);

  const handleRefresh = () => {
    void fetchHistory(1, true);
  };

  const handleLoadMore = () => {
    if (
      !isLoading &&
      !isRefreshing &&
      !isLoadingMore &&
      currentPage < totalPages
    ) {
      void fetchHistory(currentPage + 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${Math.abs(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(" ", "T"));

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

  const getTransactionDirection = (transaction: WalletTransaction) => {
    return transaction.balance_after >= transaction.balance_before
      ? "credit"
      : "debit";
  };

  const getStatusDisplay = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized.includes("success") || normalized.includes("complete")) {
      return {
        label: "Successful",
        color: theme.colors.success,
      };
    }

    if (normalized.includes("pending")) {
      return {
        label: "Pending",
        color: theme.colors.accent,
      };
    }

    if (normalized.includes("failed") || normalized.includes("reject")) {
      return {
        label: "Failed",
        color: theme.colors.error,
      };
    }

    return {
      label: status || "Unknown",
      color: theme.colors.muted,
    };
  };

  const renderTransaction = ({ item }: { item: WalletTransaction }) => {
    const direction = getTransactionDirection(item);
    const status = getStatusDisplay(item.status);

    const isCredit = direction === "credit";

    return (
      <View style={styles.transactionItem}>
        <View
          style={[
            styles.iconContainer,
            isCredit ? styles.creditIcon : styles.debitIcon,
          ]}
        >
          <MaterialCommunityIcons
            name={isCredit ? "arrow-down" : "arrow-up"}
            size={22}
            color={isCredit ? theme.colors.success : theme.colors.error}
          />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName} numberOfLines={1}>
            {item.name || item.type || "Wallet Transaction"}
          </Text>

          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>

          <Text style={[styles.transactionStatus, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              { color: isCredit ? theme.colors.success : theme.colors.text },
            ]}
          >
            {isCredit ? "+" : "-"}
            {formatCurrency(item.amount)}
          </Text>

          <Text style={styles.balanceText}>
            Balance: {formatCurrency(item.balance_after)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.footerText}>Loading more transactions...</Text>
        </View>
      );
    }

    if (currentPage < totalPages) {
      return (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          activeOpacity={0.7}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.container} >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Wallet History</Text>
          <Text style={styles.subtitle}>
            View your wallet credits and debits.
          </Text>
        </View>
      </View>

      {isLoading && transactions.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.message}>Loading wallet history...</Text>
        </View>
      ) : error && transactions.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={42}
            color={theme.colors.error}
          />

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void fetchHistory(1)}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {error && (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{error}</Text>
              <TouchableOpacity onPress={handleRefresh}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransaction}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={48}
                  color={theme.colors.muted}
                />

                <Text style={styles.emptyTitle}>No Wallet Transactions</Text>

                <Text style={styles.message}>
                  Your wallet transactions will appear here.
                </Text>
              </View>
            }
            ListFooterComponent={renderFooter}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    paddingTop: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
    marginTop: theme.spacing["2xl"],
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 4,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing["3xl"],
  },

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  creditIcon: {
    backgroundColor: "rgba(34,197,94,0.10)",
  },

  debitIcon: {
    backgroundColor: "rgba(239,68,68,0.10)",
  },

  transactionDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },

  transactionName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  transactionDate: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 4,
  },

  transactionStatus: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 4,
  },

  amountContainer: {
    alignItems: "flex-end",
    marginLeft: theme.spacing.sm,
  },

  amount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },

  balanceText: {
    color: theme.colors.muted,
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 5,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  message: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },

  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
    marginTop: theme.spacing.md,
  },

  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },

  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
  },

  retryText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  inlineError: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },

  inlineErrorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    flex: 1,
  },

  footer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },

  footerText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.sm,
  },

  loadMoreButton: {
    alignSelf: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },

  loadMoreText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
