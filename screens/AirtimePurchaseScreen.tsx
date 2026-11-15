import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";

import { useState } from "react";
import theme from "../constants/theme";
import NetworkSelector from "../components/NetworkSelector";
import PhoneNumberInput from "../components/PhoneNumberInput";
import PurchaseSummary from "../components/PurchaseSummary";
import AppButton from "../components/AppButton";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
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
  const selectedNetworkDetails = networks.find(
    (network) => network.id === selectedNetwork,
  );

  // Handle Continue Button Press
 const handleContinue = () => {
   if (!/^0\d{10}$/.test(phoneNumber)) {
     Alert.alert(
       "Invalid Phone Number",
       "Please enter a valid 11-digit Nigerian phone number.",
     );
     return;
   }

   if (!amount || Number(amount) <= 0) {
     Alert.alert("Invalid Amount", "Please enter a valid airtime amount.");
     return;
   }

   navigation.navigate("TransactionConfirmation", {
     serviceType: "Airtime",
     network: selectedNetworkDetails?.name ?? "Unknown",
     phoneNumber,
     description: "Airtime Purchase",
     amount: Number(amount),
     discount: 0,
     providerBonus: 0,
     serviceBonus: 0,
     tieredBonus: 0,
     totalAmount: Number(amount),
   });
  };
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Buy Airtime</Text>
        <Text style={styles.subtitle}>
          Recharge your mobile line instantly.
        </Text>
      </View>

      {/* Network Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Network</Text>

        <NetworkSelector
          networks={networks}
          selectedNetwork={selectedNetwork}
          onSelectNetwork={(networkId) => {
            setSelectedNetwork(networkId);
            setAmount("");
          }}
        />
      </View>

      {/* Phone Number */}
      <PhoneNumberInput value={phoneNumber} onChangeText={setPhoneNumber} />

      {/* Amount */}
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

        {/* Quick Amounts */}
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
                onPress={() => setAmount(String(value))}
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

      {/* Purchase Summary */}
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
        amount={`₦${Number(amount || 0).toLocaleString("en-NG")}`}
        discount="−₦0.00"
        providerBonus="₦0.00"
        serviceBonus="₦0.00"
        tieredBonus="₦0.00"
        totalLabel="Total Amount to Pay"
        totalAmount={`₦${Number(amount || 0).toLocaleString("en-NG")}`}
      />

      {/* Continue Button */}
      <AppButton title="Continue" onPress={handleContinue} />
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

  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing["2xl"],
  },

  summaryTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.lg,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  summaryLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  summaryValue: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },

  totalLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  totalAmount: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },

  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing["2xl"],
  },

  continueButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
