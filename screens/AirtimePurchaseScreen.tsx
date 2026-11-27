import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import theme from "../constants/theme";
import NetworkSelector from "../components/NetworkSelector";
import PhoneNumberInput from "../components/PhoneNumberInput";
import PurchaseSummary from "../components/PurchaseSummary";
import AppButton from "../components/AppButton";
import OptionToggle from "../components/OptionToggle";

import { airtimeApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";
import { validateNetworkForPhone } from "../utils/networkValidation";

import type { AirtimePricing } from "../types/airtime";
import type { ServicesStackParamList } from "../navigation/ServicesStackNavigator";

const networks = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#E31E24" },
  { id: "glo", name: "Glo", color: "#00A859" },
  { id: "9mobile", name: "9mobile", color: "#008751" },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

type Props = NativeStackScreenProps<ServicesStackParamList, "AirtimePurchase">;

export default function AirtimePurchaseScreen({ navigation }: Props) {
  const { recordActivity } = useAuth();

  const [selectedNetwork, setSelectedNetwork] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [portedNumber, setPortedNumber] = useState(false);

  const [pricing, setPricing] = useState<AirtimePricing | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const selectedNetworkDetails = networks.find(
    (network) => network.id === selectedNetwork,
  );

  // Validate the phone number against the selected network.
  const networkValidation = validateNetworkForPhone(
    phoneNumber,
    selectedNetwork as "mtn" | "airtel" | "glo" | "9mobile",
    portedNumber,
  );

  const { isValidPhoneNumber, originalNetwork } = networkValidation;
  const networkMismatch = networkValidation.isNetworkMismatch;

  const networkMismatchMessage = networkMismatch
    ? originalNetwork === "unknown"
      ? "We couldn't identify the original network for this number. Verify the number or enable Ported Number if it has been moved to another network."
      : `This number appears to belong to ${
          networks.find((network) => network.id === originalNetwork)?.name ??
          originalNetwork
        }, not ${selectedNetworkDetails?.name}. Please correct the number or enable Ported Number if the line has been moved.`
    : "";

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Fetch Airtime pricing whenever the amount or network changes.
  useEffect(() => {
    let active = true;

    setPricing(null);
    setQuoteError("");

    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setIsQuoting(false);
      return;
    }

    setIsQuoting(true);

    const timer = setTimeout(async () => {
      try {
        const token = await getAuthToken();

        if (!token) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const response = await airtimeApi.quote(token, {
          network: selectedNetwork,
          type: "vtu",
          amount: numericAmount,
        });

        if (!active) return;

        if (!response.success || !response.pricing) {
          throw new Error(
            response.message || "Unable to calculate Airtime pricing.",
          );
        }

        setPricing(response.pricing);
        setQuoteError("");
      } catch (error) {
        if (!active) return;

        setPricing(null);
        setQuoteError(
          error instanceof Error
            ? error.message
            : "Unable to calculate Airtime pricing. Please try again.",
        );
      } finally {
        if (active) {
          setIsQuoting(false);
        }
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [amount, selectedNetwork]);

  const handleContinue = () => {
    if (!isValidPhoneNumber || networkMismatch) {
      return;
    }

    if (!pricing || isQuoting || quoteError) {
      return;
    }

    recordActivity();

    navigation.navigate("TransactionConfirmation", {
      serviceType: "Airtime",
      network: selectedNetworkDetails?.name ?? "Unknown",
      networkId: selectedNetwork,
      airtimeType: "vtu",
      portedNumber,
      phoneNumber,
      description: "Airtime Purchase",
      amount: pricing.original,
      discount: 0,
      providerBonus: pricing.provider_bonus,
      serviceBonus: pricing.service_bonus,
      tieredBonus: pricing.tiered_bonus,
      totalAmount: pricing.payable,
    });
  };

  const canContinue =
    isValidPhoneNumber &&
    !!pricing &&
    !isQuoting &&
    !quoteError &&
    !networkMismatch;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Buy Airtime</Text>
        <Text style={styles.subtitle}>
          Recharge your mobile line instantly.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Network</Text>

        <NetworkSelector
          networks={networks}
          selectedNetwork={selectedNetwork}
          onSelectNetwork={(networkId) => {
            recordActivity();
            setSelectedNetwork(networkId);
          }}
        />
      </View>

      <PhoneNumberInput
        value={phoneNumber}
        onChangeText={(value) => {
          recordActivity();
          setPhoneNumber(value);
        }}
      />

      {networkMismatch && (
        <View style={styles.networkError}>
          <Text style={styles.networkErrorText}>{networkMismatchMessage}</Text>
        </View>
      )}

      <OptionToggle
        title="Ported Number"
        description="Enable this if the phone number has been moved to another network."
        value={portedNumber}
        onValueChange={(value) => {
          recordActivity();
          setPortedNumber(value);
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount</Text>

        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>

          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(value) => {
              recordActivity();
              setAmount(value.replace(/[^0-9]/g, ""));
            }}
            onFocus={recordActivity}
          />
        </View>

        <Text style={styles.helperText}>
          Enter the amount you want to recharge.
        </Text>

        <View style={styles.quickAmounts}>
          {quickAmounts.map((value) => {
            const isSelected = amount === String(value);

            return (
              <Pressable
                key={value}
                style={[
                  styles.quickAmountButton,
                  isSelected && styles.selectedQuickAmount,
                ]}
                onPress={() => {
                  recordActivity();
                  setAmount(String(value));
                }}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    isSelected && styles.selectedQuickAmountText,
                  ]}
                >
                  ₦{value.toLocaleString("en-NG")}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isQuoting && (
        <View style={styles.quoteStatus}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.quoteStatusText}>
            Calculating Airtime pricing...
          </Text>
        </View>
      )}

      {!!quoteError && !isQuoting && (
        <View style={styles.quoteError}>
          <Text style={styles.quoteErrorText}>{quoteError}</Text>
        </View>
      )}

      {pricing && !isQuoting && !quoteError && (
        <PurchaseSummary
          rows={[
            {
              label: "Network",
              value: selectedNetworkDetails?.name ?? "Not selected",
            },
            {
              label: "Phone Number",
              value: phoneNumber || "Not entered",
            },
          ]}
          amount={formatCurrency(pricing.original)}
          discount={formatCurrency(0)}
          providerBonus={formatCurrency(pricing.provider_bonus)}
          serviceBonus={formatCurrency(pricing.service_bonus)}
          tieredBonus={formatCurrency(pricing.tiered_bonus)}
          totalLabel="Total Amount to Pay"
          totalAmount={formatCurrency(pricing.payable)}
        />
      )}

      {!pricing && !isQuoting && !quoteError && (
        <View style={styles.quotePlaceholder}>
          <Text style={styles.quotePlaceholderText}>
            Enter an Airtime amount to see your pricing and available bonuses.
          </Text>
        </View>
      )}

      <AppButton
        title={isQuoting ? "Calculating..." : "Continue"}
        onPress={handleContinue}
        disabled={!canContinue}
      />
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
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing["3xl"],
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["3xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing["2xl"],
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.lg,
  },
  networkError: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  networkErrorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 21,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
  },
  currencySymbol: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    marginRight: theme.spacing.sm,
  },
  amountInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    paddingVertical: theme.spacing.lg,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  quickAmountButton: {
    width: "31%",
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  selectedQuickAmount: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
  },
  quickAmountText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  selectedQuickAmountText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  quoteStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  quoteStatusText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },
  quoteError: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quoteErrorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },
  quotePlaceholder: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quotePlaceholderText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 22,
  },
});
