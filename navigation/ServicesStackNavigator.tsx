import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ServicesScreen from "../screens/ServicesScreen";
import AirtimePurchaseScreen from "../screens/AirtimePurchaseScreen";
import DataPurchaseScreen from "../screens/DataPurchaseScreen";
import TransactionConfirmationScreen from "../screens/TransactionConfirmationScreen";
import TransactionSuccessScreen from "../screens/TransactionSuccessScreen";

export type ServicesStackParamList = {
  ServicesHome: undefined;
  AirtimePurchase: undefined;
  DataPurchase: undefined;
  TransactionConfirmation: {
    serviceType: "Airtime" | "Data";
    network: string;
    phoneNumber: string;
    description: string;
    amount: number;
    discount: number;
    providerBonus: number;
    serviceBonus: number;
    tieredBonus: number;
    totalAmount: number;
  };

  TransactionSuccess: {
    serviceType: "Airtime" | "Data";
    network: string;
    phoneNumber: string;
    description: string;
    amount: number;
    discount: number;
    providerBonus: number;
    serviceBonus: number;
    tieredBonus: number;
    totalAmount: number;
    transactionReference: string;
    completedAt: string;
  };
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#0B1220",
        },
      }}
    >
      <Stack.Screen name="ServicesHome" component={ServicesScreen} />

      <Stack.Screen name="AirtimePurchase" component={AirtimePurchaseScreen} />

      <Stack.Screen name="DataPurchase" component={DataPurchaseScreen} />

      <Stack.Screen
        name="TransactionConfirmation"
        component={TransactionConfirmationScreen}
      />

      <Stack.Screen
        name="TransactionSuccess"
        component={TransactionSuccessScreen}
      />
    </Stack.Navigator>
  );
}
