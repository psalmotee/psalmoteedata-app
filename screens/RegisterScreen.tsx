import { useEffect, useState } from "react";
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

import theme from "../constants/theme";
import FormInput from "../components/FormInput";
import CountrySelector from "../components/CountrySelector";
import { authApi } from "../services/api";

import type {
  CountryOption,
  RegistrationCredentials,
  RegistrationResponse,
  RegistrationConfig,
} from "../types/auth";

import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [referral, setReferral] = useState("");

  const [bvnNinType, setBvnNinType] = useState<"bvn" | "nin">("bvn");
  const [bvnNinValue, setBvnNinValue] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [registrationConfig, setRegistrationConfig] =
    useState<RegistrationConfig | null>(null);

  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countryError, setCountryError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [registrationResult, setRegistrationResult] =
    useState<RegistrationResponse | null>(null);

  const loadCountries = async () => {
    setIsLoadingCountries(true);
    setCountryError(null);

    try {
      const response = await authApi.getCountries();

      setCountries(response.countries);

      if (response.countries.length === 1) {
        setSelectedCountry(response.countries[0].value);
      }
    } catch (err) {
      setCountryError(
        err instanceof Error
          ? err.message
          : "Unable to load available countries.",
      );
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const loadRegistrationConfig = async () => {
    setIsLoadingConfig(true);
    setConfigError(null);

    try {
      const response = await authApi.getRegistrationConfig();

      setRegistrationConfig(response.registration);
    } catch (err) {
      setConfigError(
        err instanceof Error
          ? err.message
          : "Unable to load registration settings.",
      );
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    void loadCountries();
    void loadRegistrationConfig();
  }, []);

  const handleRegister = async () => {
    setError(null);

    if (isLoadingCountries || isLoadingConfig) {
      setError("Please wait while registration settings load.");
      return;
    }

    if (countryError || !countries.length) {
      setError("Unable to load countries. Please try again.");
      return;
    }

    if (configError || !registrationConfig) {
      setError("Unable to load registration settings. Please try again.");
      return;
    }

    if (firstName.trim().length < 3) {
      setError("First name must contain at least 3 characters.");
      return;
    }

    if (lastName.trim().length < 3) {
      setError("Last name must contain at least 3 characters.");
      return;
    }

    if (!username.trim() || username.trim().length > 60) {
      setError("Please enter a valid username (maximum 60 characters).");
      return;
    }

    const emailValue = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!selectedCountry) {
      setError("Please select your country.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!/^[1-9][0-9]{3}$/.test(pin)) {
      setError(
        "Your transaction PIN must contain 4 digits and cannot start with zero.",
      );
      return;
    }

    if (
      registrationConfig.request_bvn_nin &&
      registrationConfig.request_bvn_nin_required &&
      !bvnNinValue.trim()
    ) {
      setError(`Please enter your ${bvnNinType.toUpperCase()}.`);
      return;
    }

    const credentials: RegistrationCredentials = {
      username: username.trim(),
      email: emailValue,
      password,
      password_confirmation: confirmPassword,
      phone: phone.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      pin,
      country: selectedCountry,
    };

    if (referral.trim()) {
      credentials.referral = referral.trim();
    }

    if (registrationConfig.request_bvn_nin && bvnNinValue.trim()) {
      credentials.bvn_nin_type = bvnNinType;
      credentials.bvn_nin_value = bvnNinValue.trim();
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.register(credentials);

      setRegistrationResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSuccess = () => {
    if (!registrationResult) return null;

    let message = registrationResult.message;

    if (
      registrationResult.verification_required &&
      registrationResult.email_sent
    ) {
      message =
        "Your account has been created successfully. We have sent an activation code to your email address. Please check your inbox to continue.";
    } else if (
      registrationResult.verification_required &&
      !registrationResult.email_sent
    ) {
      message =
        "Your account was created, but we could not send your activation email. Please contact support for assistance.";
    } else {
      message =
        "Your account has been created successfully. You can now sign in.";
    }

    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={54}
            color={theme.colors.success}
          />
        </View>

        <Text style={styles.successTitle}>Account Created</Text>

        <Text style={styles.successMessage}>{message}</Text>

        <Text style={styles.registeredEmail}>
          {registrationResult.user.email}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (registrationResult.verification_required) {
              navigation.navigate("Activation", {
                username: registrationResult.user.username,
                email: registrationResult.user.email,
              });
            } else {
              navigation.navigate("Login");
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {registrationResult.verification_required
              ? "Verify Account"
              : "Continue to Sign In"}
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    );
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
          <Text style={styles.brandName}>PsalmoteeData</Text>

          <Text style={styles.subtitle}>
            Create your account and get started.
          </Text>
        </View>

        <View style={styles.formCard}>
          {registrationResult ? (
            renderSuccess()
          ) : (
            <>
              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.description}>
                Enter your details below to register.
              </Text>

              <Text style={styles.sectionTitle}>Personal Information</Text>

              <FormInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                autoCapitalize="words"
              />

              <FormInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                autoCapitalize="words"
              />

              <FormInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                maxLength={60}
                autoCapitalize="none"
                autoComplete="username"
                textContentType="username"
              />

              <FormInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <CountrySelector
                countries={countries}
                selectedValue={selectedCountry}
                onSelect={(country) => setSelectedCountry(country.value)}
                loading={isLoadingCountries}
                error={countryError || undefined}
                onRetry={loadCountries}
              />

              {configError ? (
                <View style={styles.configError}>
                  <Text style={styles.errorText}>{configError}</Text>

                  <TouchableOpacity onPress={loadRegistrationConfig}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {registrationConfig?.request_bvn_nin && (
                <>
                  <Text style={styles.sectionTitle}>Identity Verification</Text>

                  <View style={styles.identityOptions}>
                    <TouchableOpacity
                      style={[
                        styles.identityOption,
                        bvnNinType === "bvn" && styles.identityOptionActive,
                      ]}
                      onPress={() => {
                        setBvnNinType("bvn");
                        setBvnNinValue("");
                      }}
                    >
                      <Text
                        style={[
                          styles.identityOptionText,
                          bvnNinType === "bvn" &&
                            styles.identityOptionTextActive,
                        ]}
                      >
                        BVN
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.identityOption,
                        bvnNinType === "nin" && styles.identityOptionActive,
                      ]}
                      onPress={() => {
                        setBvnNinType("nin");
                        setBvnNinValue("");
                      }}
                    >
                      <Text
                        style={[
                          styles.identityOptionText,
                          bvnNinType === "nin" &&
                            styles.identityOptionTextActive,
                        ]}
                      >
                        NIN
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <FormInput
                    label={`${bvnNinType.toUpperCase()} Number`}
                    value={bvnNinValue}
                    onChangeText={setBvnNinValue}
                    placeholder={`Enter your ${bvnNinType.toUpperCase()}`}
                    keyboardType="numeric"
                    autoCapitalize="none"
                  />

                  {!registrationConfig.request_bvn_nin_required && (
                    <Text style={styles.helperText}>
                      This information is optional.
                    </Text>
                  )}
                </>
              )}

              <Text style={styles.sectionTitle}>Account Security</Text>

              <View>
                <FormInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((previous) => !previous)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color={theme.colors.muted}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <FormInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                >
                  <MaterialCommunityIcons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={21}
                    color={theme.colors.muted}
                  />
                </TouchableOpacity>
              </View>

              <FormInput
                label="Transaction PIN"
                value={pin}
                onChangeText={(value) =>
                  setPin(value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Create a 4-digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                autoCapitalize="none"
                helperText="Your PIN must contain 4 digits and cannot start with zero."
              />

              <Text style={styles.sectionTitle}>Referral</Text>

              <FormInput
                label="Referral ID (Optional)"
                value={referral}
                onChangeText={setReferral}
                placeholder="Enter referral ID if available"
                keyboardType="numeric"
              />

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

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Create Account</Text>

                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color={theme.colors.white}
                    />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Already have an account?
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    marginBottom: theme.spacing["2xl"],
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

  sectionTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  passwordToggle: {
    position: "absolute",
    right: theme.spacing.md,
    top: 38,
    padding: 5,
  },

  identityOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  identityOption: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  identityOptionActive: {
    backgroundColor: theme.colors.glow,
    borderColor: theme.colors.primary,
  },

  identityOptionText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },

  identityOptionTextActive: {
    color: theme.colors.primary,
  },

  helperText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginBottom: theme.spacing.md,
  },

  configError: {
    marginBottom: theme.spacing.lg,
  },

  retryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: theme.spacing.xs,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.10)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  errorText: {
    flex: 1,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 18,
  },

  primaryButton: {
    minHeight: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

  disabledButton: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },

  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xl,
  },

  loginPromptText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
  },

  loginLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  successContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },

  successIcon: {
    marginBottom: theme.spacing.lg,
  },

  successTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: theme.spacing.md,
  },

  successMessage: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 23,
    textAlign: "center",
  },

  registeredEmail: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: theme.spacing.md,
  },

  bottomText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    marginTop: theme.spacing["3xl"],
  },
});
