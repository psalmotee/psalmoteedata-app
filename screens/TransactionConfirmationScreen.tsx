import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import theme from "../constants/theme";
import PurchaseSummary from "../components/PurchaseSummary";
import PinInput from "../components/PinInput";
import AppButton from "../components/AppButton";

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
  } = route.params;

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;

  const handleConfirmPayment = () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "Please enter your 4-digit transaction PIN.");
      return;
    }

    Alert.alert(
      "Demo Transaction",
      "Your PIN has been accepted for this demonstration. Actual payment processing will be implemented later.",
      [
        {
          text: "OK",
          onPress: () => {
            setPin("");
            navigation.popToTop();
          },
        },
      ],
    );
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

      <PinInput value={pin} onChangeText={setPin} />

      <AppButton
        title="Confirm Payment"
        onPress={handleConfirmPayment}
        disabled={pin.length !== 4}
      />

      <View style={styles.cancelButton}>
        <AppButton
          title="Cancel Transaction"
          variant="secondary"
          onPress={() => navigation.goBack()}
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
