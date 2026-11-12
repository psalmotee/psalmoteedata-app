import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import theme from "../constants/theme";
import AppButton from "../components/AppButton";
import PurchaseSummary from "../components/PurchaseSummary";

import type { ServicesStackParamList } from "../navigation/ServicesStackNavigator";

import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../types/transaction";
import type { RootTabParamList } from "../navigation/TabNavigator";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  ServicesStackParamList,
  "TransactionSuccess"
>;

export default function TransactionSuccessScreen({ route, navigation }: Props) {
  type TransactionSuccessNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<ServicesStackParamList, "TransactionSuccess">,
    NativeStackNavigationProp<RootTabParamList>
    >;
  
  const {
    serviceType,
    network,
    phoneNumber,
    description,
    amount,
    discount,
    providerBonus,
    serviceBonus,
    tieredBonus,
    totalAmount,
    transactionReference,
    completedAt,
  } = route.params;

  const { addTransaction } = useTransactions();

  useEffect(() => {
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
    })}`;

  // State to manage the loading state of PDF generation and sharing
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Function to create the receipt PDF
  const createReceipt = async () => {
    return generateReceiptPdf({
      serviceType,
      network,
      phoneNumber,
      description,
      amount,
      totalAmount,
      transactionReference,
      completedAt,
    });
  };

  // Handle the download or sharing of the receipt PDF
  const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true);

      const receipt = await createReceipt();

      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permission.granted) {
        return;
      }

      const file = await FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        receipt.fileName,
        "application/pdf",
      );

      await FileSystem.writeAsStringAsync(file, receipt.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert(
        "Receipt Saved",
        `${receipt.fileName} was saved successfully.`,
      );
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

  // Handle the sharing of the receipt PDF
  const handleShareReceipt = async () => {
    try {
      setIsSharing(true);

      const receipt = await createReceipt();

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Unavailable", "Sharing is not available on this device.");
        return;
      }

      const receiptUri = `${FileSystem.cacheDirectory}${receipt.fileName}`;

      await FileSystem.writeAsStringAsync(receiptUri, receipt.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(receiptUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PsalmoteeData Receipt",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Receipt sharing error:", error);

      Alert.alert(
        "Sharing Failed",
        "Unable to share your receipt. Please try again.",
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Success indicator */}
      <View style={styles.successIcon}>
        <MaterialCommunityIcons
          name="check"
          size={42}
          color={theme.colors.white}
        />
      </View>

      <Text style={styles.heading}>Transaction Successful!</Text>

      <Text style={styles.subtitle}>
        Your {serviceType.toLowerCase()} purchase has been completed.
      </Text>

      {/* Amount paid */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount Paid</Text>
        <Text style={styles.amount}>{formatCurrency(totalAmount)}</Text>
      </View>

      {/* Transaction details */}
      <PurchaseSummary
        title="Transaction Receipt"
        rows={[
          { label: "Transaction Type", value: serviceType },
          { label: "Network", value: network },
          { label: "Phone Number", value: phoneNumber },
          {
            label: serviceType === "Data" ? "Data Plan" : "Description",
            value: description,
          },
          { label: "Transaction Reference", value: transactionReference },
          { label: "Date", value: completedAt },
        ]}
        amount={formatCurrency(amount)}
        discount={formatCurrency(-discount)}
        providerBonus={formatCurrency(providerBonus)}
        serviceBonus={formatCurrency(serviceBonus)}
        tieredBonus={formatCurrency(tieredBonus)}
        totalLabel="Total Paid"
        totalAmount={formatCurrency(totalAmount)}
      />

      {/* Download Receipt Button */}
      <AppButton
        title={isGenerating ? "Preparing Receipt..." : "Download Receipt (PDF)"}
        onPress={handleDownloadReceipt}
        loading={isGenerating}
        disabled={isGenerating || isSharing}
      />

      {/* Share Receipt Button */}
      <View style={styles.secondaryButton}>
        <AppButton
          title={isSharing ? "Preparing Receipt..." : "Share Receipt"}
          variant="secondary"
          onPress={handleShareReceipt}
          loading={isSharing}
          disabled={isGenerating || isSharing}
        />
      </View>

      {/* Actions */}
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
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },
  heading: {
    color: theme.colors.success,
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
});
