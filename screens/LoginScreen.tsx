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
  Image,
} from "react-native";

import PsalmoteeDataLogo from "../assets/images/psalmoteedata-logo.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        username: username.trim(),
        password,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <View style={styles.logoContainer}>
            <Image source={PsalmoteeDataLogo} style={styles.logo} />
          </View>

          <Text style={styles.brandName}>PsalmoteeData</Text>

          <Text style={styles.subtitle}>
            Welcome back! Sign in to continue.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>Sign In</Text>

          <Text style={styles.description}>
            Enter your account details to access your dashboard.
          </Text>

          <FormInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />

          <View>
            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword((previous) => !previous)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={19}
                color="#F87171"
              />

              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>

                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Securely access your PsalmoteeData account.
          </Text>
        </View>

        <Text style={styles.bottomText}>
          © {new Date().getFullYear()} PsalmoteeData
        </Text>
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
    paddingVertical: theme.spacing["3xl"],
  },

  header: {
    alignItems: "center",
    marginBottom: theme.spacing["3xl"],
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(14,165,198,0.12)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  brandName: {
    color: theme.colors.text,
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },

  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },

  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 21,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },

  passwordToggle: {
    position: "absolute",
    right: theme.spacing.md,
    top: 38,
    padding: 5,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248,113,113,0.10)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  errorText: {
    flex: 1,
    color: "#F87171",
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 18,
  },

  loginButton: {
    minHeight: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },

  disabledButton: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },

  footerText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },

  bottomText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing["3xl"],
  },
});
