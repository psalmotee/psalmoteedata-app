import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionItem from "../components/TransactionItem";
import { useTransactions } from "../context/TransactionContext";
import { TransactionServiceType } from "../types/transaction";
import theme from "../constants/theme";
import { Transaction } from "../types/transaction";
import AppButton from "../components/AppButton";
import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { downloadReceipt, shareReceipt } from "../utils/receiptActions";

type FilterType = "All" | TransactionServiceType;

const filters: FilterType[] = ["All", "Airtime", "Data"];

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { transactions } = useTransactions();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  // Function to create the receipt PDF for the selected transaction
  const createSelectedReceipt = async () => {
    if (!selectedTransaction) {
      throw new Error("No transaction selected.");
    }

    return generateReceiptPdf({
      serviceType: selectedTransaction.serviceType,
      network: selectedTransaction.network,
      phoneNumber: selectedTransaction.phoneNumber,
      description: selectedTransaction.description,
      amount: selectedTransaction.amount,
      totalAmount: selectedTransaction.totalAmount,
      transactionReference: selectedTransaction.transactionReference,
      completedAt: selectedTransaction.completedAt,
    });
  };

// Function to handle downloading the receipt PDF for the selected transaction
  const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true);

      const receipt = await createSelectedReceipt();
      const saved = await downloadReceipt(receipt);

      if (saved) {
        Alert.alert(
          "Receipt Saved",
          `${receipt.fileName} was saved successfully.`,
        );
      }
    } catch (error) {
      console.error("Receipt download error:", error);

      Alert.alert(
        "Download Failed",
        "Unable to save your receipt. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle sharing the receipt PDF
  const handleShareReceipt = async () => {
    try {
      setIsSharing(true);

      const receipt = await createSelectedReceipt();

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

      <Modal
        visible={selectedTransaction !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTransaction && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Transaction Details</Text>

                  <Pressable onPress={() => setSelectedTransaction(null)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </Pressable>
                </View>

                <View style={styles.modalStatus}>
                  <MaterialCommunityIcons
                    name={
                      selectedTransaction.status === "Successful"
                        ? "check-circle"
                        : selectedTransaction.status === "Pending"
                          ? "clock-outline"
                          : "close-circle"
                    }
                    size={32}
                    color={
                      selectedTransaction.status === "Successful"
                        ? theme.colors.success
                        : selectedTransaction.status === "Pending"
                          ? theme.colors.accent
                          : theme.colors.error
                    }
                  />

                  <Text style={styles.modalAmount}>
                    ₦
                    {selectedTransaction.totalAmount.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>

                  <Text style={styles.modalStatusText}>
                    {selectedTransaction.status}
                  </Text>
                </View>

                <View style={styles.modalDetails}>
                  {[
                    {
                      label: "Transaction Reference",
                      value: selectedTransaction.transactionReference,
                    },
                    {
                      label: "Service",
                      value: selectedTransaction.serviceType,
                    },
                    {
                      label: "Network",
                      value: selectedTransaction.network,
                    },
                    {
                      label: "Recipient",
                      value: selectedTransaction.phoneNumber,
                    },
                    {
                      label: "Description",
                      value: selectedTransaction.description,
                    },
                    {
                      label: "Date",
                      value: formatDate(selectedTransaction.completedAt),
                    },
                    {
                      label: "Amount Paid",
                      value: `₦${selectedTransaction.totalAmount.toLocaleString(
                        "en-NG",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`,
                    },
                  ].map((item) => (
                    <View key={item.label} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}</Text>

                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>

                <AppButton
                  title={
                    isGenerating
                      ? "Preparing Receipt..."
                      : "Download Receipt (PDF)"
                  }
                  onPress={handleDownloadReceipt}
                  loading={isGenerating}
                  disabled={isGenerating || isSharing}
                />

                <View style={{ marginTop: theme.spacing.md }}>
                  <AppButton
                    title={isSharing ? "Preparing Receipt..." : "Share Receipt"}
                    variant="secondary"
                    onPress={handleShareReceipt}
                    loading={isSharing}
                    disabled={isGenerating || isSharing}
                  />
                </View>

                <View style={{ marginTop: theme.spacing.md }}>
                  <AppButton
                    title="Close"
                    variant="secondary"
                    onPress={() => setSelectedTransaction(null)}
                    disabled={isGenerating || isSharing}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius["2xl"],
    borderTopRightRadius: theme.radius["2xl"],
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
    borderWidth: 1,
    borderColor: theme.colors.border,
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

  modalStatus: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  modalAmount: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize["3xl"],
    marginTop: theme.spacing.sm,
  },

  modalStatusText: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },

  modalDetails: {
    marginBottom: theme.spacing.xl,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  detailLabel: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    flex: 1,
  },

  detailValue: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    flex: 1,
    textAlign: "right",
  },
});
