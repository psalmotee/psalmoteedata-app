import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

import VirtualAccountsList from "../components/VirtualAccountsList";
import { MOCK_VIRTUAL_ACCOUNTS } from "../data/virtualAccounts";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "FundWallet">;

export default function FundWalletScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Fund Wallet</Text>

        <Text style={styles.subtitle}>
          Transfer money to any of your virtual accounts to fund your wallet.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.notice}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={theme.colors.primary}
          />

          <Text style={styles.noticeText}>
            Transfer to any of the account numbers below. Your wallet will be
            credited automatically once your payment is confirmed.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Virtual Accounts</Text>

          <Text style={styles.accountCount}>
            {MOCK_VIRTUAL_ACCOUNTS.length} Accounts
          </Text>
        </View>

        <VirtualAccountsList accounts={MOCK_VIRTUAL_ACCOUNTS} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },

  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },

  scrollContent: {
    paddingBottom: theme.spacing["3xl"],
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(14,165,198,0.09)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  noticeText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 19,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
  },

  accountCount: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
