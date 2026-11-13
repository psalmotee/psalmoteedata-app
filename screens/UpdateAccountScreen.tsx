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

import theme from "../constants/theme";
import FormInput from "../components/FormInput";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

import * as Clipboard from "expo-clipboard";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateAccount">;

export default function UpdateAccountScreen({ navigation }: Props) {
  const [aboutMe, setAboutMe] = useState("");

  const [apiKey, setApiKey] = useState("ptd_live_8f3a92c7b1d64e5a");
  const [newPassword, setNewPassword] = useState("");
  const [transactionPin, setTransactionPin] = useState("");

  // 
  const handleImageUpload = () => {
    Alert.alert(
      "Profile Picture",
      "Image selection will be implemented in a later step.",
    );
  };

  // 
  const handleCopyApiKey = async () => {
    try {
      await Clipboard.setStringAsync(apiKey);
      Alert.alert("Copied", "API key copied to clipboard.");
    } catch {
      Alert.alert(
        "Copy Failed",
        "Unable to copy the API key. Please try again.",
      );
    }
  };
  
  // 
  const handleGenerateApiKey = () => {
    Alert.alert(
      "Generate New API Key",
      "Generating a new key may invalidate your existing API key. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Generate",
          style: "destructive",
          onPress: () => {
            const newKey = `ptd_live_${Math.random()
              .toString(36)
              .substring(2, 18)}`;

            setApiKey(newKey);

            Alert.alert(
              "API Key Generated",
              "A new demonstration API key has been generated.",
            );
          },
        },
      ],
    );
  };

// 
  const [accountDetails, setAccountDetails] = useState({
    firstName: "Moradeyo",
    lastName: "Samson",
    brandName: "",
    email: "psalmoteetelecoms@gmail.com",
    phoneNumber: "",
    billingAddress: "",
    bvn: "",
    nin: "",
  });

  const updateField = (field: keyof typeof accountDetails, value: string) => {
    setAccountDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    const { firstName, lastName, email, bvn, nin } = accountDetails;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert(
        "Missing Information",
        "First Name, Last Name and Email Address are required.",
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (bvn && !/^\d{11}$/.test(bvn)) {
      Alert.alert("Invalid BVN", "BVN must contain exactly 11 digits.");
      return;
    }

    if (nin && !/^\d{11}$/.test(nin)) {
      Alert.alert("Invalid NIN", "NIN must contain exactly 11 digits.");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      Alert.alert(
        "Weak Password",
        "Your new password must contain at least 8 characters.",
      );
      return;
    }

    if (transactionPin && !/^\d{4}$/.test(transactionPin)) {
      Alert.alert(
        "Invalid Transaction PIN",
        "Transaction PIN must contain exactly 4 digits.",
      );
      return;
    }

    Alert.alert(
      "Changes Validated",
      "Your information has passed validation. Backend integration is required to save these changes permanently.",
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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

        <View style={styles.headerInfo}>
          <Text style={styles.title}>Update Account</Text>
          <Text style={styles.subtitle}>
            Manage your personal information and account details.
          </Text>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Information</Text>

        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {`${accountDetails.firstName} ${accountDetails.lastName}`.trim()}
            </Text>

            <Text style={styles.userEmail}>{accountDetails.email}</Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={16}
                color={theme.colors.primary}
              />

              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <FormInput
          label="About Me"
          value={aboutMe}
          onChangeText={setAboutMe}
          placeholder="Tell us a little about yourself..."
          multiline
        />
      </View>

      {/* API Key */}
      <View style={styles.card}>
        <View style={styles.apiHeader}>
          <View style={styles.apiTitleContainer}>
            <MaterialCommunityIcons
              name="key-outline"
              size={21}
              color={theme.colors.primary}
            />

            <Text style={styles.cardTitle}>API Key</Text>
          </View>

          <View style={styles.apiBadge}>
            <Text style={styles.apiBadgeText}>Active</Text>
          </View>
        </View>

        <Text style={styles.apiDescription}>
          Use your API key to authenticate requests to the PsalmoteeData API.
        </Text>

        <View style={styles.apiKeyContainer}>
          <Text style={styles.apiKeyText} numberOfLines={1}>
            {apiKey}
          </Text>

          <TouchableOpacity
            onPress={handleCopyApiKey}
            style={styles.copyButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={19}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleGenerateApiKey}
          style={styles.generateButton}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color={theme.colors.primary}
          />

          <Text style={styles.generateButtonText}>Generate New Key</Text>
        </TouchableOpacity>

        <View style={styles.apiWarning}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={17}
            color={theme.colors.accent}
          />

          <Text style={styles.apiWarningText}>
            Keep your API key private. Anyone with access to it may be able to
            use your account's API services.
          </Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={22}
            color={theme.colors.primary}
          />

          <Text style={styles.cardTitle}>Account Settings</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Keep your personal and business information up to date.
        </Text>

        <FormInput
          label="First Name"
          value={accountDetails.firstName}
          onChangeText={(value) => updateField("firstName", value)}
          placeholder="Enter first name"
        />

        <FormInput
          label="Last Name"
          value={accountDetails.lastName}
          onChangeText={(value) => updateField("lastName", value)}
          placeholder="Enter last name"
        />

        <FormInput
          label="Brand Name"
          value={accountDetails.brandName}
          onChangeText={(value) => updateField("brandName", value)}
          placeholder="Enter your brand or business name"
        />

        <FormInput
          label="Email Address"
          value={accountDetails.email}
          onChangeText={(value) => updateField("email", value)}
          placeholder="Enter email address"
          keyboardType="email-address"
          helperText="Changing this will update your login email."
        />

        <FormInput
          label="Phone Number"
          value={accountDetails.phoneNumber}
          onChangeText={(value) => updateField("phoneNumber", value)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <FormInput
          label="Home / Billing Address"
          value={accountDetails.billingAddress}
          onChangeText={(value) => updateField("billingAddress", value)}
          placeholder="Enter your home or billing address"
          multiline
          helperText="Required for virtual card issuance."
        />

        <FormInput
          label="BVN (Bank Verification Number)"
          value={accountDetails.bvn}
          onChangeText={(value) => updateField("bvn", value)}
          placeholder="Enter your 11-digit BVN"
          keyboardType="numeric"
          maxLength={11}
        />

        <FormInput
          label="NIN (National Identity Number)"
          value={accountDetails.nin}
          onChangeText={(value) => updateField("nin", value)}
          placeholder="Enter your 11-digit NIN"
          keyboardType="numeric"
          maxLength={11}
        />
      </View>

      {/* Security */}
      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={22}
            color={theme.colors.primary}
          />

          <Text style={styles.cardTitle}>Security</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Update your password and transaction PIN to keep your account secure.
        </Text>

        <FormInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Leave empty to keep current"
          secureTextEntry
        />

        <FormInput
          label="Transaction PIN"
          value={transactionPin}
          onChangeText={setTransactionPin}
          placeholder="Enter your transaction PIN"
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="content-save-outline"
          size={20}
          color={theme.colors.white}
        />

        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
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

  header: {
    marginBottom: theme.spacing.xl,
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

  headerInfo: {
    gap: theme.spacing.xs,
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
    lineHeight: 21,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: theme.spacing.lg,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(14,165,198,0.15)",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xl,
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

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "rgba(14,165,198,0.10)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
  },

  uploadButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },

  apiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },

  apiTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  apiBadge: {
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },

  apiBadgeText: {
    color: theme.colors.success,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  apiDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 19,
    marginBottom: theme.spacing.lg,
  },

  apiKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    minHeight: 52,
    paddingLeft: theme.spacing.md,
  },

  apiKeyText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },

  copyButton: {
    width: 48,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },

  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
  },

  generateButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  apiWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    backgroundColor: "rgba(245,158,11,0.08)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  apiWarningText: {
    flex: 1,
    color: theme.colors.muted,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 17,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  sectionDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 19,
    marginBottom: theme.spacing.xl,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    minHeight: 54,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
  },

  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
