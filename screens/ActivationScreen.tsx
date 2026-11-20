import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import FormInput from "../components/FormInput";
import theme from "../constants/theme";
import { authApi } from "../services/api";

import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Activation">;

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visibleCharacters = Math.min(2, name.length);

  return `${name.slice(0, visibleCharacters)}${"*".repeat(
    Math.max(3, name.length - visibleCharacters),
  )}@${domain}`;
};

export default function ActivationScreen({ navigation, route }: Props) {
  const { username, email } = route.params ?? {};

  const isRegistrationFlow = Boolean(username && email);

  const [identifier, setIdentifier] = useState(username ?? "");
  const [activationCode, setActivationCode] = useState("");

  const [isActivating, setIsActivating] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleActivation = async () => {
    setError(null);
    setSuccess(null);

    if (!identifier.trim()) {
      setError("Please enter your username or email address.");
      return;
    }

    if (!/^[0-9]{5}$/.test(activationCode)) {
      setError("Please enter a valid five-digit activation code.");
      return;
    }

    setIsActivating(true);

    try {
      const response = await authApi.activateAccount(
        identifier.trim(),
        activationCode,
      );

      setSuccess(response.message);
      setActivationCode("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to activate your account. Please try again.",
      );
    } finally {
      setIsActivating(false);
    }
  };

  const handleResendActivation = async () => {
    setError(null);
    setSuccess(null);

    if (!identifier.trim()) {
      setError("Please enter your username or email address.");
      return;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendActivation(identifier.trim());

      setSuccess(response.message);
      setActivationCode("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend activation email. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const isBusy = isActivating || isResending;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brandName}>PsalmoteeData</Text>

          <Text style={styles.subtitle}>
            Complete your account verification.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="email-check-outline"
              size={52}
              color={theme.colors.primary}
            />
          </View>

          <Text style={styles.title}>Verify Your Email</Text>

          <Text style={styles.description}>
            {isRegistrationFlow
              ? "We've sent an activation code to your registered email address. Enter the code below to activate your account."
              : "Enter your username or email address to request an activation code. Once received, enter the code below to activate your account."}
          </Text>

          {!isRegistrationFlow && (
            <FormInput
              label="Username or Email Address"
              placeholder="Enter your username or email"
              value={identifier}
              onChangeText={(value) => {
                setIdentifier(value);
                setError(null);
                setSuccess(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}

          {isRegistrationFlow && email && (
            <View style={styles.emailContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={theme.colors.primary}
              />

              <Text style={styles.emailText}>{maskEmail(email)}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={19}
                color={theme.colors.error}
              />

              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={19}
                color={theme.colors.success}
              />

              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          <FormInput
            label="Activation Code"
            value={activationCode}
            onChangeText={(value) => {
              setActivationCode(value.replace(/\D/g, "").slice(0, 5));
              setError(null);
            }}
            placeholder="Enter your five-digit code"
            keyboardType="numeric"
            maxLength={5}
            autoCapitalize="none"
            helperText="Enter the five-digit activation code sent to your email."
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (isBusy || !identifier.trim() || activationCode.length !== 5) &&
                styles.disabledButton,
            ]}
            onPress={handleActivation}
            disabled={
              isBusy || !identifier.trim() || activationCode.length !== 5
            }
            activeOpacity={0.8}
          >
            {isActivating ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Activate Account</Text>

                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color={theme.colors.white}
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the activation code?
            </Text>

            <TouchableOpacity
              onPress={handleResendActivation}
              disabled={isBusy || !identifier.trim()}
              activeOpacity={0.7}
            >
              {isResending ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text
                  style={[
                    styles.resendButtonText,
                    !identifier.trim() && styles.disabledText,
                  ]}
                >
                  Resend Activation Email
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => navigation.navigate("Support")}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="headset"
              size={19}
              color={theme.colors.primary}
            />

            <Text style={styles.supportButtonText}>
              Forgot your username or email? Contact Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
            disabled={isBusy}
          >
            <Text style={styles.loginButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  brandName: {
    color: theme.colors.primary,
    fontSize: 30,
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },

  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },

  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  emailText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },

  errorText: {
    flex: 1,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginLeft: theme.spacing.sm,
  },

  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },

  successText: {
    flex: 1,
    color: theme.colors.success,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginLeft: theme.spacing.sm,
  },

  primaryButton: {
    minHeight: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },

  disabledButton: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    marginRight: theme.spacing.sm,
  },

  resendContainer: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },

  resendText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginBottom: theme.spacing.sm,
  },

  resendButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  disabledText: {
    opacity: 0.5,
  },

  supportButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },

  supportButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    textAlign: "center",
  },

  loginButton: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },

  loginButtonText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
