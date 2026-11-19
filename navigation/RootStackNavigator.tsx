import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "../screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import FundWalletScreen from "../screens/FundWalletScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import AccountFeatureScreen from "../screens/AccountFeatureScreen";
import UpdateAccountScreen from "../screens/UpdateAccountScreen";
import LoginScreen from "../screens/LoginScreen";

import { useAuth } from "../context/AuthContext";
import theme from "../constants/theme";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
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
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />

          <Stack.Screen name="FundWallet" component={FundWalletScreen} />

          <Stack.Screen name="Notifications" component={NotificationsScreen} />

          <Stack.Screen
            name="AccountFeature"
            component={AccountFeatureScreen}
          />

          <Stack.Screen name="UpdateAccount" component={UpdateAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.md,
  },
});
