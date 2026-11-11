import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";

import { useState } from "react";
import theme from "../constants/theme";

const networks = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#E31E24" },
  { id: "glo", name: "Glo", color: "#00A859" },
  { id: "9mobile", name: "9mobile", color: "#008751" },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePurchaseScreen() {
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

    Alert.alert(
      "Details Verified",
      `Your ${selectedNetworkDetails?.name} airtime purchase details are valid.\n\nPhone: ${phoneNumber}\nAmount: ₦${Number(amount).toLocaleString("en-NG")}\n\nPayment processing will be implemented later.`,
    );
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

        <View style={styles.networkGrid}>
          {networks.map((network) => {
            const isSelected = selectedNetwork === network.id;

            return (
              <Pressable
                key={network.id}
                onPress={() => setSelectedNetwork(network.id)}
                style={[
                  styles.networkCard,
                  isSelected && styles.selectedNetwork,
                ]}
              >
                <View
                  style={[
                    styles.networkLogo,
                    { backgroundColor: network.color },
                  ]}
                >
                  <Text style={styles.networkInitial}>
                    {network.name === "9mobile" ? "9" : network.name.charAt(0)}
                  </Text>
                </View>

                <Text style={styles.networkName}>{network.name}</Text>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Number</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor={theme.colors.muted}
          keyboardType="phone-pad"
          maxLength={11}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.helperText}>
          Enter the 11-digit mobile number you want to recharge.
        </Text>
      </View>

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
              setAmount(value.replace(/[^0-9]/g, ""));
            }}
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
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Purchase Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Network</Text>
          <Text style={styles.summaryValue}>
            {selectedNetworkDetails?.name}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phone Number</Text>
          <Text style={styles.summaryValue}>
            {phoneNumber || "Not entered"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            ₦{Number(amount || 0).toLocaleString("en-NG")}
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
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
  networkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  networkCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    position: "relative",
  },
  selectedNetwork: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.cardSecondary,
  },
  networkLogo: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  networkInitial: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  networkName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.body,
  },

  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
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
