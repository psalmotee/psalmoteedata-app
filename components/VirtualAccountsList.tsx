import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import colors from "../constants/colors";
import typography from "../constants/typography";
import AppCard from "./AppCard";

import type { VirtualAccount } from "../types/virtualAccount";

type Props = {
  accounts: VirtualAccount[];
};

export default function VirtualAccountsList({ accounts }: Props) {
  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await Clipboard.setStringAsync(accountNumber);

      Alert.alert("Copied", "Account number copied successfully.");
    } catch {
      Alert.alert(
        "Copy failed",
        "Unable to copy the account number. Please try again.",
      );
    }
  };

  if (accounts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="bank-outline"
          size={36}
          color={colors.muted}
        />

        <Text style={styles.emptyTitle}>No Virtual Accounts Available</Text>

        <Text style={styles.emptyText}>
          Your virtual bank accounts will appear here when available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {accounts.map((account) => (
        <AppCard key={account.id} style={styles.accountCard}>
          <View style={styles.cardHeader}>
            <View style={styles.bankHeading}>
              <View style={styles.bankIcon}>
                <MaterialCommunityIcons
                  name="bank"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{account.bank_name}</Text>

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

          <Text style={styles.detailValue}>{account.account_name}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>ACCOUNT NUMBER</Text>

          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumber}>{account.account_number}</Text>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopyAccount(account.account_number)}
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

          <View style={styles.additionalDetails}>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>GATEWAY</Text>

              <Text style={styles.detailValue}>
                {account.gateway.toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailColumn}>
              <Text style={styles.label}>ACCOUNT TYPE</Text>

              <Text style={styles.detailValue}>Virtual</Text>
            </View>
          </View>
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  accountCard: {
    padding: 17,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bankHeading: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(14,165,198,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  bankInfo: {
    marginLeft: 12,
    flex: 1,
  },

  bankName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },

  accountType: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    marginTop: 4,
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  accountNumber: {
    flex: 1,
    color: colors.primary,
    fontSize: 21,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 1,
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

  additionalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailColumn: {
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: colors.card,
    borderRadius: 16,
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
    marginTop: 7,
    lineHeight: 19,
  },
});
