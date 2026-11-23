import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionItem from "../components/TransactionItem";
import { useTransactions } from "../context/TransactionContext";
import type { ServiceTransaction } from "../types/serviceTransaction";
import theme from "../constants/theme";

// Generate & share recipt
import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { downloadReceipt, shareReceipt } from "../utils/receiptActions";

type FilterType = "All" | "Airtime" | "Data";

const filters: FilterType[] = ["All", "Airtime", "Data"];

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState<ServiceTransaction | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

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

  const renderDetail = (label: string, value: string) => (
    <View style={styles.detailRow} key={label}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "Not available"}</Text>
    </View>
  );

  const renderTransactionDetails = () => {
    if (!selectedTransaction) return null;

    const transaction = selectedTransaction;

    return (
      <Modal
        visible={Boolean(selectedTransaction)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transaction Details</Text>

              <Pressable
                onPress={() => setSelectedTransaction(null)}
                hitSlop={10}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>

            <View style={styles.modalAmountContainer}>
              <Text style={styles.modalAmountLabel}>Amount</Text>
              <Text style={styles.modalAmount}>
                {formatCurrency(Number(transaction.amount))}
              </Text>

              <Text
                style={[
                  styles.statusBadge,
                  getStatus(transaction.status) === "Successful"
                    ? styles.successBadge
                    : getStatus(transaction.status) === "Failed"
                      ? styles.failedBadge
                      : styles.pendingBadge,
                ]}
              >
                {formatStatus(transaction.status)}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {renderDetail("Service", formatService(transaction.service))}
              {renderDetail("Recipient", transaction.recipient)}

              {transaction.plan &&
                renderDetail(
                  "Plan",
                  transaction.service.toLowerCase() === "airtime" &&
                    !Number.isNaN(Number(transaction.plan))
                    ? `${formatCurrency(Number(transaction.plan))} Airtime`
                    : transaction.plan,
                )}

              {transaction.provider &&
                renderDetail("Provider", transaction.provider.toUpperCase())}

              {transaction.type &&
                renderDetail("Type", transaction.type.toUpperCase())}

              {renderDetail("Reference", transaction.reference)}
              {renderDetail("Via", transaction.via)}
              {renderDetail("Date", formatDate(transaction.date))}
            </ScrollView>

            <Pressable
              style={styles.receiptButton}
              onPress={handleDownloadReceipt}
              disabled={isGenerating || isSharing}
            >
              {isGenerating ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="download"
                    size={20}
                    color={theme.colors.white}
                  />
                  <Text style={styles.receiptButtonText}>
                    Download Receipt (PDF)
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.shareButton}
              onPress={handleShareReceipt}
              disabled={isGenerating || isSharing}
            >
              {isSharing ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.shareButtonText}>Share Receipt</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedTransaction(null)}
              disabled={isGenerating || isSharing}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
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

  const handleDownloadReceipt = async () => {
    if (!selectedTransaction) return;

    try {
      setIsGenerating(true);

      const receipt = await generateReceiptPdf(selectedTransaction);
      const saved = await downloadReceipt(receipt);

      if (saved) {
        Alert.alert(
          "Receipt Saved",
          `${receipt.fileName} was saved successfully.`,
        );
      } else {
        Alert.alert(
          "Permission Required",
          "Please grant folder access to save your receipt.",
        );
      }
    } catch (error) {
      console.error("Receipt download error:", error);

      Alert.alert(
        "Download Failed",
        error instanceof Error
          ? error.message
          : "Unable to save your receipt. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReceipt = async () => {
    if (!selectedTransaction) return;

    try {
      setIsSharing(true);

      const receipt = await generateReceiptPdf(selectedTransaction);

      await shareReceipt(receipt);
    } catch (error) {
      console.error("Receipt sharing error:", error);

      Alert.alert(
        "Sharing Failed",
        error instanceof Error
          ? error.message
          : "Unable to share your receipt. Please try again.",
      );
    } finally {
      setIsSharing(false);
    }
  };

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

      {renderTransactionDetails()}
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  modalTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.fontSize.xl,
  },

  modalAmountContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
  },

  modalAmountLabel: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
  },

  modalAmount: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize["2xl"],
    marginVertical: theme.spacing.sm,
  },

  statusBadge: {
    overflow: "hidden",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  successBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    color: theme.colors.success,
  },

  failedBadge: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: theme.colors.error,
  },

  pendingBadge: {
    backgroundColor: "rgba(245,158,11,0.15)",
    color: theme.colors.accent,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border ?? theme.colors.muted,
    gap: theme.spacing.md,
  },

  detailLabel: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
  },

  detailValue: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
    textAlign: "right",
  },

  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },

  closeButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  receiptButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
  },

  receiptButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  shareButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  shareButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
