import { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppButton from "./AppButton";
import theme from "../constants/theme";

import type { Transaction } from "../types/transaction";

import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { downloadReceipt, shareReceipt } from "../utils/receiptActions";

type Props = {
  transaction: Transaction | null;
  onClose: () => void;
};

export default function TransactionDetailsModal({
  transaction,
  onClose,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = () => {
    switch (transaction?.status) {
      case "Successful":
        return theme.colors.success;

      case "Pending":
        return theme.colors.accent;

      case "Failed":
        return theme.colors.error;

      default:
        return theme.colors.muted;
    }
  };

  const getStatusIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (transaction?.status) {
      case "Successful":
        return "check-circle";

      case "Pending":
        return "clock-outline";

      case "Failed":
        return "close-circle";

      default:
        return "help-circle-outline";
    }
  };

  const createReceipt = async () => {
    if (!transaction) {
      throw new Error("No transaction selected.");
    }

    return generateReceiptPdf({
      serviceType: transaction.serviceType,
      network: transaction.network,
      phoneNumber: transaction.phoneNumber,
      description: transaction.description,
      amount: transaction.amount,
      totalAmount: transaction.totalAmount,
      transactionReference: transaction.transactionReference,
      completedAt: transaction.completedAt,
    });
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true);

      const receipt = await createReceipt();
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
        "Unable to save your receipt. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReceipt = async () => {
    try {
      setIsSharing(true);

      const receipt = await createReceipt();

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
    <Modal
      visible={transaction !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {transaction && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Transaction Details</Text>

                <Pressable
                  onPress={onClose}
                  disabled={isGenerating || isSharing}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.colors.text}
                  />
                </Pressable>
              </View>

              <View style={styles.modalStatus}>
                <MaterialCommunityIcons
                  name={getStatusIcon()}
                  size={32}
                  color={getStatusColor()}
                />

                <Text style={styles.modalAmount}>
                  {formatCurrency(transaction.totalAmount)}
                </Text>

                <Text
                  style={[styles.modalStatusText, { color: getStatusColor() }]}
                >
                  {transaction.status}
                </Text>
              </View>

              <View style={styles.modalDetails}>
                {[
                  {
                    label: "Transaction Reference",
                    value: transaction.transactionReference,
                  },
                  {
                    label: "Service",
                    value: transaction.serviceType,
                  },
                  {
                    label: "Network",
                    value: transaction.network,
                  },
                  {
                    label: "Recipient",
                    value: transaction.phoneNumber,
                  },
                  {
                    label: "Description",
                    value: transaction.description,
                  },
                  {
                    label: "Date",
                    value: formatDate(transaction.completedAt),
                  },
                  {
                    label: "Amount Paid",
                    value: formatCurrency(transaction.totalAmount),
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

              <View style={styles.buttonSpacing}>
                <AppButton
                  title={isSharing ? "Preparing Receipt..." : "Share Receipt"}
                  variant="secondary"
                  onPress={handleShareReceipt}
                  loading={isSharing}
                  disabled={isGenerating || isSharing}
                />
              </View>

              <View style={styles.buttonSpacing}>
                <AppButton
                  title="Close"
                  variant="secondary"
                  onPress={onClose}
                  disabled={isGenerating || isSharing}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

  buttonSpacing: {
    marginTop: theme.spacing.md,
  },
});
