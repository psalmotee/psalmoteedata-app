import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ServicesStackNavigator from "./ServicesStackNavigator";
import type { ServicesStackParamList } from "./ServicesStackNavigator";
import TransactionsScreen from "../screens/TransactionsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import theme from "../constants/theme";

export type RootTabParamList = {
  Home: undefined;
  Services: NavigatorScreenParams<ServicesStackParamList>;
  Transactions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-grid-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="receipt-text-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
