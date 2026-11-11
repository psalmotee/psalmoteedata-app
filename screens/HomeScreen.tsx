import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import theme from "../constants/theme";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import SectionHeader from "../components/SectionHeader";
import ServiceItem from "../components/ServiceItem";
import TransactionItem from "../components/TransactionItem";
import WalletCard from "../components/WalletCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const transactions = [
  {
    name: "Data Purchase",
    date: "Today, 10:30 AM",
    amount: "-₦1,500",
    status: "Successful" as const,
    icon: "wifi" as const,
  },
  {
    name: "Airtime Purchase",
    date: "Yesterday",
    amount: "-₦500",
    status: "Successful" as const,
    icon: "cellphone" as const,
  },
];

export default function HomeScreen() {
  return (
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

        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={theme.colors.text}
          />

          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Wallet */}
      <WalletCard balance="₦25,000.00" />

      {/* Quick Services */}
      <View style={styles.section}>
        <SectionHeader title="Quick Services" actionLabel="View all" />

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceItem
              key={service.name}
              name={service.name}
              icon={service.icon}
              color={service.color}
            />
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <SectionHeader title="Recent Transactions" actionLabel="See all" />

        {transactions.map((transaction) => (
          <TransactionItem key={transaction.name} {...transaction} />
        ))}
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
});
