import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import theme from "../constants/theme";
import AppButton from "../components/AppButton";
import PurchaseSummary from "../components/PurchaseSummary";

import type { ServicesStackParamList } from "../navigation/ServicesStackNavigator";

import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../types/transaction";

import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { downloadReceipt, shareReceipt } from "../utils/receiptActions";

type Props = NativeStackScreenProps<
  ServicesStackParamList,
  "TransactionSuccess"
>;

export default function TransactionSuccessScreen({ route, navigation }: Props) {
  const {
    serviceType,
    network,
    phoneNumber,
    description,
    amount,
    totalAmount,
    transactionReference,
    completedAt,
    transactionStatus,
    transactionMessage,
    chargedAmount,
    isApiTransaction,
  } = route.params;

  const { addTransaction } = useTransactions();

  const status = transactionStatus ?? "successful";

 const isSuccessful = status === "successful";
 const isProcessing = status === "processing";
 const isFailed = status === "failed";
 const isUnknown = status === "unknown";

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Preserve the existing simulated Data purchase flow.
   *
   * API transactions are already recorded by the backend.
   */
  useEffect(() => {
    if (isApiTransaction) {
      return;
    }

    const transaction: Transaction = {
      id: transactionReference,
      serviceType,
      network,
      phoneNumber,
      description,
      amount,
      totalAmount,
      transactionReference,
      completedAt,
      status: "Successful",
    };

    addTransaction(transaction);
  }, [
    isApiTransaction,
    addTransaction,
    serviceType,
    network,
    phoneNumber,
    description,
    amount,
    totalAmount,
    transactionReference,
    completedAt,
  ]);

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

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

  const statusConfig = {
    successful: {
      icon: "check" as const,
      title: "Transaction Successful!",
      subtitle: `Your ${serviceType.toLowerCase()} purchase was completed.`,
      color: theme.colors.success,
    },
    processing: {
      icon: "clock-outline" as const,
      title: "Transaction Processing",
      subtitle: "Your transaction is still being processed.",
      color: theme.colors.primary,
    },
    failed: {
      icon: "close" as const,
      title: "Transaction Failed",
      subtitle: "Your transaction could not be completed.",
      color: theme.colors.muted,
    },
    unknown: {
      icon: "help-circle-outline" as const,
      title: "Transaction Status Unknown",
      subtitle: "We could not confirm the transaction result.",
      color: theme.colors.muted,
    },
  };

  const currentStatus = statusConfig[status];

  const createReceipt = async () => {
    return generateReceiptPdf({
      serviceType,
      network,
      phoneNumber,
      description,
      amount,
      totalAmount: chargedAmount ?? totalAmount,
      transactionReference,
      completedAt,
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

  const amountPaid = chargedAmount ?? totalAmount;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Transaction Status */}
      <View
        style={[styles.statusIcon, { backgroundColor: currentStatus.color }]}
      >
        <MaterialCommunityIcons
          name={currentStatus.icon}
          size={42}
          color={theme.colors.white}
        />
      </View>

      <Text style={[styles.heading, { color: currentStatus.color }]}>
        {currentStatus.title}
      </Text>

      <Text style={styles.subtitle}>
        {transactionMessage || currentStatus.subtitle}
      </Text>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>
          {isFailed ? "Transaction Amount" : "Amount"}
        </Text>

        <Text style={styles.amount}>{formatCurrency(amountPaid)}</Text>
      </View>

      {/* Transaction Details */}
      <PurchaseSummary
        title="Transaction Details"
        rows={[
          { label: "Transaction Type", value: serviceType },
          { label: "Network", value: network },
          { label: "Phone Number", value: phoneNumber },
          {
            label: serviceType === "Data" ? "Data Plan" : "Description",
            value: description,
          },
          {
            label: "Transaction Reference",
            value: transactionReference,
          },
          {
            label: "Date",
            value: formatDate(completedAt),
          },
          {
            label: "Status",
            value: status.toUpperCase(),
          },
        ]}
        amount={formatCurrency(amount)}
        totalLabel="Total Amount"
        totalAmount={formatCurrency(amountPaid)}
      />

      {/* Receipt Actions: Successful Transactions Only */}
      {isSuccessful && (
        <>
          <AppButton
            title={
              isGenerating ? "Preparing Receipt..." : "Download Receipt (PDF)"
            }
            onPress={handleDownloadReceipt}
            loading={isGenerating}
            disabled={isGenerating || isSharing}
          />

          <View style={styles.secondaryButton}>
            <AppButton
              title={isSharing ? "Preparing Receipt..." : "Share Receipt"}
              variant="secondary"
              onPress={handleShareReceipt}
              loading={isSharing}
              disabled={isGenerating || isSharing}
            />
          </View>
        </>
      )}

      {/* Additional Processing Information */}
      {isProcessing && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Please allow some time for this transaction to complete. Avoid
            making another purchase for the same request until you have checked
            your transaction history.
          </Text>
        </View>
      )}

      {/* Failed Transaction Information */}
      {isFailed && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            If your wallet was debited, check your wallet balance and
            transaction history for the refund status before trying again.
          </Text>
        </View>
      )}

      {/* unknown-status notice */}
      {isUnknown && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            We could not confirm the final result of this transaction. Please
            check your transaction history before attempting another purchase.
            If your wallet was debited, verify the transaction status before
            trying again.
          </Text>
        </View>
      )}

      {/* Navigation */}
      <AppButton title="Back to Home" onPress={() => navigation.popToTop()} />

      <View style={styles.secondaryButton}>
        <AppButton
          title="View Transaction History"
          onPress={() => {
            navigation.getParent()?.navigate("Transactions");
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing["3xl"],
    paddingBottom: theme.spacing["4xl"],
  },

  statusIcon: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },

  heading: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    textAlign: "center",
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },

  amountContainer: {
    alignItems: "center",
    marginVertical: theme.spacing["2xl"],
  },

  amountLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  amount: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["3xl"],
    fontFamily: theme.typography.fontFamily.bold,
    marginTop: theme.spacing.sm,
  },

  secondaryButton: {
    marginTop: theme.spacing.md,
  },

  notice: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  noticeText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 21,
  },
});
