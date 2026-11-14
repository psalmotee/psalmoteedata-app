import { useState } from "react";

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

import theme from "../constants/theme";
import { useAuth } from "../context/AuthContext";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootTabParamList } from "../navigation/TabNavigator";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

const accountOptions = [
  {
    title: "Update Account",
    description: "Manage your personal information and security.",
    icon: "account-edit-outline" as const,
  },
  {
    title: "Upgrade Account",
    description: "Explore available plans and upgrade your account.",
    icon: "arrow-up-bold-circle-outline" as const,
  },
  {
    title: "Verify Account",
    description: "Verify your identity to access more services.",
    icon: "shield-check-outline" as const,
  },
  {
    title: "Statistics",
    description: "View your transactions, referrals and earnings.",
    icon: "chart-box-outline" as const,
  },
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName =
    user?.display_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "User";

  const initials = getInitials(fullName);
  const email = user?.email || "Email not available";

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      Alert.alert(
        "Signed out on this device",
        "Your local session has been cleared, but the server could not confirm the sign-out. Your previous server token may remain valid until it expires.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your PsalmoteeData account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            void handleLogout();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Account</Text>

        <Text style={styles.pageSubtitle}>
          Manage your profile and account activities.
        </Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{fullName}</Text>

          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.accountBadge}>
            <MaterialCommunityIcons
              name="account-check-outline"
              size={13}
              color={theme.colors.primary}
            />

            <Text style={styles.accountBadgeText}>Customer Account</Text>
          </View>
        </View>

        <MaterialCommunityIcons
          name="account-circle-outline"
          size={25}
          color={theme.colors.primary}
        />
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <Text style={styles.sectionSubtitle}>
          Choose an option to manage your account.
        </Text>

        <View style={styles.optionsContainer}>
          {accountOptions.map((option) => (
            <TouchableOpacity
              key={option.title}
              activeOpacity={0.75}
              style={styles.optionCard}
              onPress={() => {
                if (option.title === "Update Account") {
                  navigation.navigate("UpdateAccount");
                  return;
                }

                navigation.navigate("AccountFeature", {
                  title: option.title,
                  description: option.description,
                  icon: option.icon,
                });
              }}
            >
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={23}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>

                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={23}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.disabledButton]}
          activeOpacity={0.75}
          onPress={confirmLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#F87171" />
          ) : (
            <>
              <MaterialCommunityIcons name="logout" size={21} color="#F87171" />

              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
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
    paddingTop: theme.spacing["3xl"],
    paddingBottom: theme.spacing["4xl"],
  },

  pageHeader: {
    marginBottom: theme.spacing.xl,
  },

  pageTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },

  pageSubtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.xs,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing["2xl"],
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(14,165,198,0.15)",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },

  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },

  userName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  userEmail: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 4,
  },

  accountBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "rgba(14,165,198,0.10)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    marginTop: 8,
  },

  accountBadgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  section: {
    marginTop: theme.spacing.sm,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
  },

  sectionSubtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 5,
    marginBottom: theme.spacing.lg,
  },

  optionsContainer: {
    gap: theme.spacing.md,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },

  optionIcon: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(14,165,198,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  optionInfo: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },

  optionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  optionDescription: {
    color: theme.colors.muted,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 17,
    marginTop: 4,
  },

  logoutSection: {
    marginTop: theme.spacing["3xl"],
  },

  logoutButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: "rgba(248,113,113,0.08)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },

  logoutButtonText: {
    color: "#F87171",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
