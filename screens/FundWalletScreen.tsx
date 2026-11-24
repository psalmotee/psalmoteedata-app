import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";
import { useVirtualAccounts } from "../context/VirtualAccountContext";

import VirtualAccountsList from "../components/VirtualAccountsList";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "FundWallet">;

export default function FundWalletScreen({ navigation }: Props) {
  const {
    accounts,
    generationResults,
    isLoading,
    isRefreshing,
    isGenerating,
    error,
    fetchAccounts,
    refreshAccounts,
    generateAccounts,
  } = useVirtualAccounts();

  const handleGenerateAccounts = async () => {
    try {
      await generateAccounts();
    } catch {
      // The context already stores the error for display on this screen.
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success":
        return "Generated successfully";

      case "already_exists":
        return "Account already exists";

      case "profile_required":
        return "Profile information required";

      case "failed":
        return "Generation failed";

      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "already_exists":
        return theme.colors.success;

      case "profile_required":
        return theme.colors.accent;

      case "failed":
        return theme.colors.error;

      default:
        return theme.colors.muted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAccounts}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Funding Notice */}
        <View style={styles.notice}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={theme.colors.primary}
          />

          <Text style={styles.noticeText}>
            Transfer to any of your virtual account numbers below. Your wallet
            will be credited automatically once your payment is confirmed.
          </Text>
        </View>

        {/* Account Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Virtual Accounts</Text>

          <Text style={styles.accountCount}>
            {accounts.length} {accounts.length === 1 ? "Account" : "Accounts"}
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && accounts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />

            <Text style={styles.loadingText}>
              Loading your virtual accounts...
            </Text>
          </View>
        ) : (
          <VirtualAccountsList accounts={accounts} />
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={21}
              color={theme.colors.error}
            />

            <View style={styles.errorContent}>
              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity onPress={fetchAccounts} activeOpacity={0.7}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Generation Results */}
        {generationResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Account Generation Results</Text>

            {generationResults.map((result, index) => (
              <View
                key={`${result.gateway}-${index}`}
                style={styles.resultItem}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.gatewayName}>
                    {result.gateway.toUpperCase()}
                  </Text>

                  <Text
                    style={[
                      styles.resultStatus,
                      { color: getStatusColor(result.status) },
                    ]}
                  >
                    {getStatusLabel(result.status)}
                  </Text>
                </View>

                <Text style={styles.resultMessage}>{result.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Generate Accounts Button */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.disabledButton]}
          onPress={handleGenerateAccounts}
          disabled={isGenerating || isLoading}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons
              name="bank-plus"
              size={20}
              color="#FFFFFF"
            />
          )}

          <Text style={styles.generateButtonText}>
            {isGenerating
              ? "Checking Available Accounts..."
              : "Generate Virtual Accounts"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.generateHint}>
          We'll check all supported payment gateways and generate accounts
          you're eligible for. Existing accounts will not be duplicated.
        </Text>
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

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
  },

  loadingText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 12,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },

  errorContent: {
    flex: 1,
  },

  errorText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 19,
  },

  retryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: 8,
  },

  resultsContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  resultsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: 12,
  },

  resultItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  gatewayName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  resultStatus: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  resultMessage: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 18,
  },

  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.xl,
  },

  disabledButton: {
    opacity: 0.6,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  generateHint: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
