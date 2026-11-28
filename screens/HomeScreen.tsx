import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
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
import TransactionDetailsModal from "../components/TransactionDetailsModal";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootTabParamList } from "../navigation/TabNavigator";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

import { useTransactions } from "../context/TransactionContext";
import type { ServiceTransaction } from "../types/serviceTransaction";

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

  const {
    history,
    isLoading: transactionsLoading,
    isRefreshing: transactionsRefreshing,
    error: transactionsError,
    refreshHistory,
  } = useTransactions();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<ServiceTransaction | null>(null);
  const recentTransactions = history.slice(0, 3);

  const handleTransactionPress = (transaction: ServiceTransaction) => {
    setSelectedTransaction(transaction);
  };

  const formatBalance = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unavailable";

    const normalizedDate = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T");

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatService = (service: string) =>
    service.charAt(0).toUpperCase() + service.slice(1).toLowerCase();

  const getStatus = (status: string): "Successful" | "Pending" | "Failed" => {
    const normalized = status.toLowerCase();

    if (normalized.includes("success") || normalized.includes("complete")) {
      return "Successful";
    }

    if (
      normalized.includes("fail") ||
      normalized.includes("reject") ||
      normalized.includes("cancel")
    ) {
      return "Failed";
    }

    return "Pending";
  };

  const getTransactionIcon = (
    service: string,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (service.toLowerCase()) {
      case "airtime":
        return "cellphone";
      case "data":
        return "sim";
      case "electricity":
        return "flash";
      case "cable":
      case "cable tv":
        return "television";
      default:
        return "receipt";
    }
  };

  recentTransactions.map((transaction) => (
    <TransactionItem
      key={transaction.id}
      name={formatService(transaction.service)}
      date={`${transaction.recipient} • ${formatDate(transaction.date)}`}
      amount={formatCurrency(transaction.amount)}
      status={getStatus(transaction.status)}
      icon={getTransactionIcon(transaction.service)}
      onPress={() => handleTransactionPress(transaction)}
    />
  ));

  const displayedBalance =
    walletError && balance === 0
      ? "Unavailable"
      : walletLoading && balance === 0
        ? "Loading..."
        : formatBalance(balance);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([refreshBalance(), refreshHistory()]);
    } finally {
      setIsRefreshing(false);
    }
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
            refreshing={
              isRefreshing || (transactionsRefreshing && !isRefreshing)
            }
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

        {/* Dashboard Cards */}
        <View style={styles.section}>
          <DashboardCardsCarousel
            balance={displayedBalance}
            packageName="Customer"
            commissions={0}
            onFundWallet={() => navigation.navigate("FundWallet")}
            onViewHistory={() => navigation.navigate("WalletHistory")}
          />

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
        <VirtualAccountsSection
          onPressViewAll={() => navigation.navigate("FundWallet")}
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

          {transactionsLoading && history.length === 0 ? (
            <View style={styles.transactionState}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
              <Text style={styles.emptyText}>
                Loading recent transactions...
              </Text>
            </View>
          ) : transactionsError && history.length === 0 ? (
            <View style={styles.transactionState}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={28}
                color={theme.colors.error}
              />

              <Text style={styles.emptyText}>
                Unable to load recent transactions.
              </Text>

              <TouchableOpacity
                onPress={() => void refreshHistory()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                name={formatService(transaction.service)}
                date={`${transaction.recipient} • ${formatDate(
                  transaction.date,
                )}`}
                amount={formatCurrency(transaction.amount)}
                status={getStatus(transaction.status)}
                icon={getTransactionIcon(transaction.service)}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No transactions yet. Your recent purchases will appear here.
            </Text>
          )}
          <TransactionDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        </View>

        {/* Help & Support */}
        <HelpSupportSection
          onHelpPress={handleHelpPress}
          onSupportPress={handleSupportPress}
          onCommunityPress={handleCommunityPress}
        />
      </ScrollView>

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

  transactionState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
  },
});
