import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import theme from "../constants/theme";

import SectionHeader from "../components/SectionHeader";
import ServiceItem from "../components/ServiceItem";
import TransactionItem from "../components/TransactionItem";
import WalletCard from "../components/WalletCard";
import { useWallet } from "../context/WalletContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootTabParamList } from "../navigation/TabNavigator";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

import TransactionDetailsModal from "../components/TransactionDetailsModal";
import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../types/transaction";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const services = [
  {
    name: "Airtime",
    icon: "cellphone",
    color: "#0EA5C6",
  },
  {
    name: "Data",
    icon: "wifi",
    color: "#2563EB",
  },
  {
    name: "Electricity",
    icon: "lightning-bolt",
    color: "#F59E0B",
  },
  {
    name: "Cable TV",
    icon: "television",
    color: "#F97316",
  },
] as const;

export default function HomeScreen({ navigation }: Props) {
  const { balance } = useWallet();
  const { transactions } = useTransactions();
  const recentTransactions = transactions.slice(0, 3);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const formatBalance = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatCurrency = (amount: number) => {
    return `-₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening 👋</Text>
            <Text style={styles.username}>Welcome to PsalmoteeData</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={23}
              color={theme.colors.text}
            />

            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Wallet */}
        <WalletCard
          balance={formatBalance(balance)}
          packageName="Customer"
          onFundWallet={() => navigation.navigate("FundWallet")}
          onViewHistory={() =>
            Alert.alert("Wallet History", "Wallet history screen coming soon.")
          }
        />

        {/* Quick Services */}
        <View style={styles.section}>
          <SectionHeader
            title="Quick Services"
            actionLabel="View all"
            onActionPress={() =>
              navigation.navigate("Services", {
                screen: "ServicesHome",
              })
            }
          />

          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceItem
                key={service.name}
                name={service.name}
                icon={service.icon}
                color={service.color}
                onPress={() => {
                  if (service.name === "Airtime") {
                    navigation.navigate("Services", {
                      screen: "AirtimePurchase",
                    });
                  }

                  if (service.name === "Data") {
                    navigation.navigate("Services", {
                      screen: "DataPurchase",
                    });
                  }
                }}
              />
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent Transactions"
            actionLabel="See all"
            onActionPress={() => navigation.navigate("Transactions")}
          />

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                name={`${transaction.network} ${transaction.serviceType}`}
                date={`${formatDate(transaction.completedAt)} • ${transaction.phoneNumber}`}
                amount={formatCurrency(transaction.totalAmount)}
                status={transaction.status}
                icon={transaction.serviceType === "Data" ? "wifi" : "cellphone"}
                onPress={() => setSelectedTransaction(transaction)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No transactions yet. Your recent purchases will appear here.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing["2xl"],
  },

  greeting: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  username: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
    marginTop: 5,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },

  section: {
    marginBottom: theme.spacing["3xl"],
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emptyText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    paddingVertical: theme.spacing.xl,
  },
});
