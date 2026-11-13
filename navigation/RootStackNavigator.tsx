import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import FundWalletScreen from "../screens/FundWalletScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import AccountFeatureScreen from "../screens/AccountFeatureScreen";
import UpdateAccountScreen from "../screens/UpdateAccountScreen";

export type RootStackParamList = {
  Main: undefined;
  FundWallet: undefined;
  Notifications: undefined;

  AccountFeature: {
    title: string;
    description: string;
    icon: string;
  };

  UpdateAccount: undefined;
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
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AccountFeature" component={AccountFeatureScreen} />
      <Stack.Screen
        name="UpdateAccount"
        component={UpdateAccountScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
