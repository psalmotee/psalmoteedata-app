import { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import theme from "../constants/theme";
import PurchaseSummary from "../components/PurchaseSummary";
import PinInput from "../components/PinInput";
import AppButton from "../components/AppButton";

import { airtimeApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";

import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { useTransactions } from "../context/TransactionContext";

import type { ServicesStackParamList } from "../navigation/ServicesStackNavigator";

type Props = NativeStackScreenProps<
  ServicesStackParamList,
  "TransactionConfirmation"
>;

export default function TransactionConfirmationScreen({
  route,
  navigation,
}: Props) {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestIdRef = useRef<string | null>(null);

  const { recordActivity } = useAuth();
  const { refreshBalance } = useWallet();
  const { refreshHistory } = useTransactions();

  const {
    serviceType,
    network,
    networkId,
    airtimeType,
    portedNumber,
    phoneNumber,
    description,
    amount,
    discount,
    providerBonus,
    serviceBonus,
    tieredBonus,
    totalAmount,
  } = route.params;

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const refreshAccountData = async () => {
    try {
      await Promise.all([refreshBalance(), refreshHistory()]);
    } catch (error) {
      console.error("Account refresh error:", error);
    }
  };

  const handleConfirmPayment = async () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "Please enter your 4-digit transaction PIN.");
      return;
    }

    if (isSubmitting) return;

    recordActivity();
    setIsSubmitting(true);

    try {
      /**
       * AIRTIME: Submit the actual purchase to the backend.
       */
      if (serviceType === "Airtime") {
        if (!networkId || !airtimeType) {
          Alert.alert(
            "Invalid Transaction",
            "The Airtime network or type is missing. Please go back and try again.",
          );
          return;
        }

        const token = await getAuthToken();

        if (!token) {
          Alert.alert(
            "Session Expired",
            "Please log in again before making a purchase.",
          );
          return;
        }

        /**
         * Keep the same request ID if the user retries this
         * particular submission after an uncertain response.
         */
        if (!requestIdRef.current) {
          const timestamp = Date.now().toString(36).toUpperCase();

          const randomPart = Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase();

          requestIdRef.current = `${timestamp}${randomPart}`;
        }

        const response = await airtimeApi.purchase(token, {
          pin,
          network: networkId,
          type: airtimeType,
          phone_number: phoneNumber,
          amount,
          request_id: requestIdRef.current,
          ported_number: portedNumber ?? false,
        });

        if (!response.success || !response.transaction) {
          throw new Error(
            response.message || "Unable to process your Airtime purchase.",
          );
        }

        const transaction = response.transaction;

        /**
         * The backend status determines the result.
         * Do not assume that a successful API response
         * means the Airtime transaction itself succeeded.
         */
        await refreshAccountData();

        setPin("");

        navigation.replace("TransactionSuccess", {
          ...route.params,
          transactionReference: transaction.reference,
          completedAt: new Date().toISOString(),
          transactionStatus: transaction.status,
          transactionMessage: response.message,
          chargedAmount: transaction.charged_amount ?? undefined,
          isApiTransaction: true,
        });

        return;
      }

      /**
       * DATA: Preserve the existing simulated purchase flow.
       * We will connect this to its own backend endpoint later.
       */
      const transactionReference = `PTD-${Date.now()}`;
      const completedAt = new Date().toISOString();

      navigation.replace("TransactionSuccess", {
        ...route.params,
        transactionReference,
        completedAt,
      });

      setPin("");
    } catch (error) {
      console.error("Transaction submission error:", error);

      Alert.alert(
        "Transaction Could Not Be Confirmed",
        error instanceof Error
          ? `${error.message}\n\nIf this request may have reached the provider, check your transaction history before trying again.`
          : "We could not confirm the transaction. Check your transaction history before trying again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Confirm Transaction</Text>

      <Text style={styles.subtitle}>
        Review your {serviceType.toLowerCase()} purchase details before
        proceeding.
      </Text>

      <PurchaseSummary
        title="Transaction Details"
        rows={[
          { label: "Service", value: serviceType },
          { label: "Network", value: network },
          { label: "Phone Number", value: phoneNumber },
          {
            label: serviceType === "Data" ? "Data Plan" : "Purchase",
            value: description,
          },
        ]}
        amount={formatCurrency(amount)}
        discount={formatCurrency(-discount)}
        providerBonus={formatCurrency(providerBonus)}
        serviceBonus={formatCurrency(serviceBonus)}
        tieredBonus={formatCurrency(tieredBonus)}
        totalLabel="Amount to Pay"
        totalAmount={formatCurrency(totalAmount)}
      />

      <PinInput
        value={pin}
        onChangeText={(value) => {
          recordActivity();
          setPin(value);
        }}
      />

      <AppButton
        title={isSubmitting ? "Processing Transaction..." : "Confirm Payment"}
        onPress={handleConfirmPayment}
        disabled={pin.length !== 4 || isSubmitting}
        loading={isSubmitting}
      />

      <View style={styles.cancelButton}>
        <AppButton
          title="Cancel Transaction"
          variant="secondary"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
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
  heading: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 22,
    marginBottom: theme.spacing["2xl"],
  },
  cancelButton: {
    marginTop: theme.spacing.md,
  },
});
