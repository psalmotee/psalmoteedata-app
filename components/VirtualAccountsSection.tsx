import { useEffect, useState } from "react";

import {
  ActivityIndicator,
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

import { useVirtualAccounts } from "../context/VirtualAccountContext";

type Props = {
  onPressViewAll: () => void;
};

export default function VirtualAccountsSection({ onPressViewAll }: Props) {
  const { accounts, isLoading, error, fetchAccounts } = useVirtualAccounts();

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  // Keep the selected account valid when accounts are loaded or updated.
  useEffect(() => {
    if (accounts.length === 0) {
      setSelectedAccountId(null);
      return;
    }

    const selectedAccountExists = accounts.some(
      (account) => account.id === selectedAccountId,
    );

    if (!selectedAccountExists) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  const handleCopyAccount = async () => {
    if (!selectedAccount) return;

    try {
      await Clipboard.setStringAsync(selectedAccount.account_number);

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

      {/* Loading state */}
      {isLoading && accounts.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.stateText}>Loading your virtual accounts...</Text>
        </View>
      ) : accounts.length === 0 ? (
        /* Empty state */
        <AppCard style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="bank-outline"
            size={38}
            color={colors.muted}
          />

          <Text style={styles.emptyTitle}>No Virtual Accounts Yet</Text>

          <Text style={styles.emptyText}>
            Generate your virtual bank accounts to start funding your wallet
            through bank transfers.
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={error ? fetchAccounts : onPressViewAll}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {error ? "Try Again" : "Get Virtual Accounts"}
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={17}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </AppCard>
      ) : (
        <>
          {/* Horizontal bank selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bankSelector}
          >
            {accounts.map((account) => {
              const isSelected = selectedAccountId === account.id;

              return (
                <TouchableOpacity
                  key={account.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAccountId(account.id)}
                  style={[styles.bankTab, isSelected && styles.activeBankTab]}
                >
                  <Text
                    style={[
                      styles.bankTabText,
                      isSelected && styles.activeBankTabText,
                    ]}
                  >
                    {account.bank_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Selected account details */}
          {selectedAccount && (
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

                  <View style={styles.bankInfo}>
                    <Text style={styles.selectedBankName}>
                      {selectedAccount.bank_name}
                    </Text>

                    <Text style={styles.accountType}>Virtual Account</Text>
                  </View>
                </View>

                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />

                  <Text style={styles.statusText}>Available</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.label}>ACCOUNT NAME</Text>

              <Text style={styles.detailValue}>
                {selectedAccount.account_name}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.label}>ACCOUNT NUMBER</Text>

              <View style={styles.accountNumberRow}>
                <Text style={styles.accountNumber}>
                  {selectedAccount.account_number}
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

              <Text style={styles.label}>GATEWAY</Text>

              <Text style={styles.detailValue}>
                {selectedAccount.gateway.toUpperCase()}
              </Text>

              {/* Automated funding notice */}
              <View style={styles.fundingNotice}>
                <View style={styles.noticeHeading}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={19}
                    color={colors.primary}
                  />

                  <Text style={styles.noticeTitle}>Automated Funding</Text>
                </View>

                <Text style={styles.noticeText}>
                  Transfer money to this unique account number. Your wallet will
                  be credited automatically once your payment is confirmed.
                </Text>
              </View>
            </AppCard>
          )}

          {/* View all accounts */}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={onPressViewAll}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>View All Virtual Accounts</Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        </>
      )}
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
    flex: 1,
  },

  bankInfo: {
    flex: 1,
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

  stateContainer: {
    alignItems: "center",
    paddingVertical: 35,
  },

  stateText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    marginTop: 12,
  },

  emptyCard: {
    alignItems: "center",
    padding: 22,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    marginTop: 12,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textAlign: "center",
    marginTop: 10,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    marginTop: 8,
  },

  viewAllText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
  },
});
