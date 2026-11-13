import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import colors from "../constants/colors";
import typography from "../constants/typography";
import AppCard from "./AppCard";

type VirtualAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  gateway: string;
  charges: string;
};

const MOCK_ACCOUNTS: VirtualAccount[] = [
  {
    id: "1",
    bankName: "Wema Bank",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "1234567890",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
  {
    id: "2",
    bankName: "Sterling Bank",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "0987654321",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
  {
    id: "3",
    bankName: "Moniepoint",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "1122334455",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
];

export default function VirtualAccountsSection() {
  const [selectedAccount, setSelectedAccount] = useState<VirtualAccount>(
    MOCK_ACCOUNTS[0],
  );

  const handleCopyAccount = async () => {
    try {
      await Clipboard.setStringAsync(selectedAccount.accountNumber);

      Alert.alert("Copied", "Account number copied successfully.");
    } catch {
      Alert.alert(
        "Copy failed",
        "Unable to copy the account number. Please try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Section heading */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Virtual Accounts</Text>
          <Text style={styles.subtitle}>
            Select a bank to view your account details.
          </Text>
        </View>

        <MaterialCommunityIcons
          name="bank-outline"
          size={24}
          color={colors.primary}
        />
      </View>

      {/* Horizontal bank selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bankSelector}
      >
        {MOCK_ACCOUNTS.map((account) => {
          const isSelected = selectedAccount.id === account.id;

          return (
            <TouchableOpacity
              key={account.id}
              activeOpacity={0.8}
              onPress={() => setSelectedAccount(account)}
              style={[styles.bankTab, isSelected && styles.activeBankTab]}
            >
              <Text
                style={[
                  styles.bankTabText,
                  isSelected && styles.activeBankTabText,
                ]}
              >
                {account.bankName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected account details */}
      <AppCard style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <View style={styles.bankHeading}>
            <View style={styles.bankIcon}>
              <MaterialCommunityIcons
                name="bank"
                size={21}
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={styles.selectedBankName}>
                {selectedAccount.bankName}
              </Text>
              <Text style={styles.accountType}>Virtual Account</Text>
            </View>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bank name */}
        <Text style={styles.label}>BANK NAME</Text>
        <Text style={styles.detailValue}>{selectedAccount.bankName}</Text>

        <View style={styles.divider} />

        {/* Account name */}
        <Text style={styles.label}>ACCOUNT NAME</Text>
        <Text style={styles.detailValue}>{selectedAccount.accountName}</Text>

        <View style={styles.divider} />

        {/* Account number and copy button */}
        <Text style={styles.label}>ACCOUNT NUMBER</Text>

        <View style={styles.accountNumberRow}>
          <Text style={styles.accountNumber}>
            {selectedAccount.accountNumber}
          </Text>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyAccount}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={16}
              color={colors.primary}
            />

            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Gateway and charges */}
        <Text style={styles.label}>GATEWAY</Text>
        <Text style={styles.detailValue}>{selectedAccount.gateway}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>CHARGES</Text>
        <Text style={styles.gatewayCharges}>{selectedAccount.charges}</Text>

        {/* Automated funding notice */}
        <View style={styles.fundingNotice}>
          <View style={styles.noticeHeading}>
            <MaterialCommunityIcons
              name="information-outline"
              size={19}
              color={colors.primary}
            />

            <Text style={styles.noticeTitle}>Automated Funding 👇👇👇</Text>
          </View>

          <Text style={styles.noticeText}>
            Make a transfer to this unique Account Number given to you, and your
            wallet will be credited immediately.
          </Text>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: colors.text,
    fontSize: 19,
    fontFamily: typography.fontFamily.heading,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    marginTop: 4,
  },

  bankSelector: {
    gap: 10,
    paddingBottom: 14,
  },

  bankTab: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeBankTab: {
    backgroundColor: "rgba(14,165,198,0.12)",
    borderColor: colors.primary,
  },

  bankTabText: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },

  activeBankTabText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },

  detailsCard: {
    padding: 17,
  },

  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bankHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  bankIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(14,165,198,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedBankName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },

  accountType: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34,197,94,0.10)",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.success,
  },

  statusText: {
    color: colors.success,
    fontSize: 10,
    fontFamily: typography.fontFamily.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },

  label: {
    color: colors.muted,
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    marginBottom: 7,
  },

  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },

  accountNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  accountNumber: {
    flex: 1,
    color: colors.primary,
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 1.2,
  },

  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "rgba(14,165,198,0.12)",
  },

  copyText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
  },

  gatewayCharges: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },

  fundingNotice: {
    backgroundColor: "rgba(14,165,198,0.09)",
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    borderRadius: 11,
    marginTop: 19,
  },

  noticeHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },

  noticeTitle: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
  },

  noticeText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 19,
  },
});
