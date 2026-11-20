import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

import SectionHeader from "../components/SectionHeader";
import ServiceItem from "../components/ServiceItem";
import AnnouncementBanner from "../components/AnnouncementBanner";
import DashboardCardsCarousel from "../components/DashboardCardsCarousel";
import VirtualAccountsSection from "../components/VirtualAccountsSection";
import { useWallet } from "../context/WalletContext";
import HelpSupportSection from "../components/HelpSupportSection";
import TransactionItem from "../components/TransactionItem";

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
  const {
    balance,
    isLoading: walletLoading,
    error: walletError,
    refreshBalance,
  } = useWallet();

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

  /**
   * Display the actual balance when available.
   * Avoid showing ₦0.00 while the initial request is pending.
   */
  const displayedBalance =
    walletError && balance === 0
      ? "Unavailable"
      : walletLoading && balance === 0
        ? "Loading..."
        : formatBalance(balance);

  const handleRefresh = async () => {
    await refreshBalance();
  };

  const handleHelpPress = () => {
    Alert.alert(
      "Help Centre",
      "FAQs and user guides will be available here soon.",
    );
  };

  const handleSupportPress = () => {
    Alert.alert(
      "Customer Support",
      "Customer support options will be available here soon.",
    );
  };

  const handleCommunityPress = () => {
    Alert.alert("Community", "Our community link will be available here soon.");
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={walletLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
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
            onPress={() => navigation.navigate("Notifications")}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={23}
              color={theme.colors.text}
            />

            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Announcement Banner */}
        <AnnouncementBanner
          title="Welcome to PsalmoteeData!"
          message="Enjoy convenient access to airtime, data and other digital services."
          onPress={() =>
            Alert.alert(
              "Platform Updates",
              "More announcements and platform updates will be available here soon.",
            )
          }
        />

        {/* Dashboard Cards Carousel */}
        <View style={styles.section}>
          <DashboardCardsCarousel
            balance={displayedBalance}
            packageName="Customer"
            commissions={0}
            onFundWallet={() => navigation.navigate("FundWallet")}
            onViewHistory={() => navigation.navigate("WalletHistory")}
          />

          {/* Wallet Error */}
          {walletError && (
            <View style={styles.walletErrorContainer}>
              <View style={styles.walletErrorContent}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color={theme.colors.error}
                />

                <Text style={styles.walletErrorText}>
                  Unable to update your wallet balance.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => void refreshBalance()}
                disabled={walletLoading}
                activeOpacity={0.7}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  {walletLoading ? "Retrying..." : "Retry"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Virtual Accounts */}
        <VirtualAccountsSection />

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

        {/* Help & Support */}
        <HelpSupportSection
          onHelpPress={handleHelpPress}
          onSupportPress={handleSupportPress}
          onCommunityPress={handleCommunityPress}
        />
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

  walletErrorContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
  },

  walletErrorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  walletErrorText: {
    flex: 1,
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  retryButton: {
    alignSelf: "flex-end",
    marginTop: theme.spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  retryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.heading,
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
