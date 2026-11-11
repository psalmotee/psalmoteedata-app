import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ServicesScreen from "../screens/ServicesScreen";
import AirtimePurchaseScreen from "../screens/AirtimePurchaseScreen";

export type ServicesStackParamList = {
  ServicesHome: undefined;
  AirtimePurchase: undefined;
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
    </Stack.Navigator>
  );
}
