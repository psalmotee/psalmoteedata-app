import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";

import theme from "../constants/theme";
import NetworkSelector from "../components/NetworkSelector";
import PhoneNumberInput from "../components/PhoneNumberInput";
import PurchaseSummary from "../components/PurchaseSummary";
import AppButton from "../components/AppButton";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ServicesStackParamList } from "../navigation/ServicesStackNavigator";

// Available networks
const networks = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#E31E24" },
  { id: "glo", name: "Glo", color: "#00A859" },
  { id: "9mobile", name: "9mobile", color: "#008751" },
];

// Sample data plans
const dataPlans = [
  {
    id: "mtn-500mb",
    network: "mtn",
    size: "500 MB",
    validity: "30 days",
    price: 150,
  },
  {
    id: "mtn-1gb",
    network: "mtn",
    size: "1 GB",
    validity: "30 days",
    price: 350,
  },
  {
    id: "mtn-2gb",
    network: "mtn",
    size: "2 GB",
    validity: "30 days",
    price: 700,
  },

  {
    id: "airtel-500mb",
    network: "airtel",
    size: "500 MB",
    validity: "30 days",
    price: 150,
  },
  {
    id: "airtel-1gb",
    network: "airtel",
    size: "1 GB",
    validity: "30 days",
    price: 300,
  },

  {
    id: "glo-1gb",
    network: "glo",
    size: "1 GB",
    validity: "30 days",
    price: 300,
  },

  {
    id: "9mobile-1gb",
    network: "9mobile",
    size: "1 GB",
    validity: "30 days",
    price: 500,
  },
];

type Props = NativeStackScreenProps<ServicesStackParamList, "DataPurchase">;

export default function DataPurchaseScreen({ navigation }: Props) {
  const [selectedNetwork, setSelectedNetwork] = useState("mtn");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Get selected network details
  const selectedNetworkDetails = networks.find(
    (network) => network.id === selectedNetwork,
  );

  // Get plans belonging to the selected network
  const availablePlans = dataPlans.filter(
    (plan) => plan.network === selectedNetwork,
  );

  // Get selected plan details
  const selectedPlanDetails = dataPlans.find(
    (plan) => plan.id === selectedPlan,
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

    if (!selectedPlanDetails) {
      Alert.alert(
        "Select Data Plan",
        "Please select a data plan before continuing.",
      );
      return;
    }

    navigation.navigate("TransactionConfirmation", {
      serviceType: "Data",
      network: selectedNetworkDetails?.name ?? "Unknown",
      phoneNumber,
      description: `${selectedPlanDetails.size} (${selectedPlanDetails.validity})`,
      amount: selectedPlanDetails.price,
      discount: 0,
      providerBonus: 0,
      serviceBonus: 0,
      tieredBonus: 0,
      totalAmount: selectedPlanDetails.price,
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
        <Text style={styles.title}>Buy Data</Text>

        <Text style={styles.subtitle}>
          Choose a data plan that works for you.
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
            setSelectedPlan(null);
          }}
        />
      </View>

      {/* Data Bundle Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Data Plan</Text>

        {availablePlans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={[styles.planCard, isSelected && styles.selectedPlanCard]}
            >
              <View style={styles.planDetails}>
                <Text style={styles.planSize}>{plan.size}</Text>

                <Text style={styles.planValidity}>
                  Valid for {plan.validity}
                </Text>
              </View>

              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>
                  ₦{plan.price.toLocaleString("en-NG")}
                </Text>

                {isSelected && (
                  <View style={styles.planCheckmark}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Phone Number Input */}
      <PhoneNumberInput value={phoneNumber} onChangeText={setPhoneNumber} />

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
          {
            label: "Data Plan",
            value: selectedPlanDetails
              ? selectedPlanDetails.size
              : "Not selected",
          },
          {
            label: "Validity",
            value: selectedPlanDetails?.validity ?? "Not selected",
          },
        ]}
        amount={`₦${(selectedPlanDetails?.price ?? 0).toLocaleString("en-NG")}`}
        discount="−₦0.00"
        providerBonus="₦0.00"
        serviceBonus="₦0.00"
        tieredBonus="₦0.00"
        totalLabel="Total Amount to Pay"
        totalAmount={`₦${(selectedPlanDetails?.price ?? 0).toLocaleString("en-NG")}`}
      />

      {/* Continue Button */}
      <AppButton
        title="Continue"
        onPress={() => {
          handleContinue();
        }}
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

  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  selectedPlanCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.cardSecondary,
  },

  planDetails: {
    flex: 1,
  },

  planSize: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  planValidity: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.xs,
  },

  planPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  planPrice: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },

  planCheckmark: {
    width: 22,
    height: 22,
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
});
