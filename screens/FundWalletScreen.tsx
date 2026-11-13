import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";
import AppButton from "../components/AppButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";
import { useWallet } from "../context/WalletContext";

type Props = NativeStackScreenProps<RootStackParamList, "FundWallet">;

const suggestedAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const paymentMethods = [
  {
    id: "card",
    title: "Debit Card",
    description: "Pay with your ATM card",
    icon: "credit-card-outline" as const,
  },
  {
    id: "transfer",
    title: "Bank Transfer",
    description: "Transfer from your bank account",
    icon: "bank-outline" as const,
  },
];

export default function FundWalletScreen({ navigation }: Props) {
  const { addFunds } = useWallet();

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");

  const numericAmount = Number(amount.replace(/,/g, ""));

  // Handle the "Continue" button press
  const handleContinue = () => {
    if (!amount.trim() || !Number.isFinite(numericAmount)) {
      Alert.alert("Invalid Amount", "Please enter a valid funding amount.");
      return;
    }

    if (numericAmount < 100) {
      Alert.alert(
        "Minimum Amount",
        "The minimum wallet funding amount is ₦100.",
      );
      return;
    }

    const paymentMethod =
      selectedMethod === "card" ? "Debit Card" : "Bank Transfer";

    Alert.alert(
      "Confirm Wallet Funding",
      `You are about to fund your wallet with ₦${numericAmount.toLocaleString(
        "en-NG",
      )} using ${paymentMethod}.\n\nDo you want to continue?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm Payment",
          onPress: () => {
            // Simulate successful payment.
            addFunds(numericAmount);

            Alert.alert(
              "Funding Successful",
              `₦${numericAmount.toLocaleString(
                "en-NG",
              )} has been added to your wallet.`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setAmount(sanitizedValue);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Fund Wallet</Text>
        <Text style={styles.subtitle}>
          Add money to your PsalmoteeData wallet.
        </Text>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.label}>Enter Amount</Text>

        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>

          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            maxLength={9}
          />
        </View>

        <Text style={styles.helperText}>Minimum funding amount: ₦100</Text>

        <View style={styles.amountGrid}>
          {suggestedAmounts.map((value) => {
            const isSelected = amount === String(value);

            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.amountOption,
                  isSelected && styles.selectedAmount,
                ]}
                onPress={() => setAmount(String(value))}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.amountOptionText,
                    isSelected && styles.selectedAmountText,
                  ]}
                >
                  ₦{value.toLocaleString("en-NG")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                isSelected && styles.selectedPayment,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentIcon}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{method.title}</Text>
                <Text style={styles.paymentDescription}>
                  {method.description}
                </Text>
              </View>

              <MaterialCommunityIcons
                name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={isSelected ? theme.colors.primary : theme.colors.muted}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!amount.trim()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },

  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing["2xl"],
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
    marginBottom: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.xs,
  },

  amountCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },

  label: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },

  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  currencySymbol: {
    color: theme.colors.text,
    fontSize: 30,
    fontFamily: theme.typography.fontFamily.heading,
    marginRight: theme.spacing.sm,
  },

  amountInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 30,
    fontFamily: theme.typography.fontFamily.heading,
    padding: 0,
  },

  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },

  amountOption: {
    width: "31%",
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  selectedAmount: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(14, 165, 198, 0.12)",
  },

  amountOptionText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },

  selectedAmountText: {
    color: theme.colors.primary,
  },

  paymentSection: {
    marginTop: theme.spacing["2xl"],
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: theme.spacing.md,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  selectedPayment: {
    borderColor: theme.colors.primary,
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },

  paymentTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  paymentDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 3,
  },

  footer: {
    marginTop: "auto",
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
});
