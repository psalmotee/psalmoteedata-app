import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import theme from "../constants/theme";

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

        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>N</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet Card */}
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>Available Balance</Text>
          <Text style={styles.walletSymbol}>₦</Text>
        </View>

        <Text style={styles.balance}>₦25,000.00</Text>

        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.fundButton}>
            <Text style={styles.fundButtonText}>+ Fund Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <Text style={styles.sectionSubtitle}>View all</Text>
        </View>

        <View style={styles.servicesGrid}>
          {[
            { name: "Airtime", icon: "A", color: "#0EA5C6" },
            { name: "Data", icon: "D", color: "#2563EB" },
            { name: "Electricity", icon: "E", color: "#F59E0B" },
            { name: "Cable TV", icon: "C", color: "#F97316" },
          ].map((service) => (
            <TouchableOpacity key={service.name} style={styles.serviceItem}>
              <View
                style={[
                  styles.serviceIcon,
                  { backgroundColor: `${service.color}20` },
                ]}
              >
                <Text
                  style={[styles.serviceIconText, { color: service.color }]}
                >
                  {service.icon}
                </Text>
              </View>

              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Text style={styles.sectionSubtitle}>See all</Text>
        </View>

        <View style={styles.transactionCard}>
          <View style={styles.transactionIcon}>
            <Text style={styles.transactionIconText}>D</Text>
          </View>

          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Data Purchase</Text>
            <Text style={styles.transactionDate}>Today, 10:30 AM</Text>
          </View>

          <View style={styles.transactionAmount}>
            <Text style={styles.amount}>-₦1,500</Text>
            <Text style={styles.success}>Successful</Text>
          </View>
        </View>

        <View style={styles.transactionCard}>
          <View style={styles.transactionIcon}>
            <Text style={styles.transactionIconText}>A</Text>
          </View>

          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Airtime Purchase</Text>
            <Text style={styles.transactionDate}>Yesterday</Text>
          </View>

          <View style={styles.transactionAmount}>
            <Text style={styles.amount}>-₦500</Text>
            <Text style={styles.success}>Successful</Text>
          </View>
        </View>
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
  },

  username: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
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

  notificationIcon: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 18,
  },

  walletCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing["3xl"],
  },

  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
  },

  walletSymbol: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: "700",
  },

  balance: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginVertical: theme.spacing.lg,
  },

  walletActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },

  fundButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },

  fundButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },

  historyButton: {
    flex: 1,
    backgroundColor: theme.colors.cardSecondary,
    paddingVertical: 13,
    borderRadius: theme.radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  historyButtonText: {
    color: theme.colors.text,
    fontWeight: "600",
  },

  section: {
    marginBottom: theme.spacing["3xl"],
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceItem: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  serviceIconText: {
    fontSize: 19,
    fontWeight: "700",
  },

  serviceName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: "center",
    justifyContent: "center",
  },

  transactionIconText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },

  transactionDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },

  transactionName: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.fontSize.sm,
  },

  transactionDate: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 5,
  },

  transactionAmount: {
    alignItems: "flex-end",
  },

  amount: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.fontSize.sm,
  },

  success: {
    color: theme.colors.success,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 5,
  },
});
