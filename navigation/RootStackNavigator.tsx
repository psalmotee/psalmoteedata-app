import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import FundWalletScreen from "../screens/FundWalletScreen";

export type RootStackParamList = {
  Main: undefined;
  FundWallet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#0B1220",
        },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="FundWallet" component={FundWalletScreen} />
    </Stack.Navigator>
  );
}
