import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SupportContactCard from "../components/SupportContactCard";
import { SUPPORT } from "../constants/support";
import theme from "../constants/theme";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";


const supportTopics = [
  "Account Registration & Activation",
  "Login Problems",
  "Wallet Funding",
  "Airtime & Data Transactions",
  "Electricity & Cable TV Payments",
  "Transaction Complaints",
  "Other Enquiries",
];

type Props = NativeStackScreenProps<RootStackParamList, "Support">

export default function SupportScreen({ navigation }: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const openWhatsApp = async () => {
    if (!SUPPORT.whatsapp || SUPPORT.whatsapp === "YOUR_WHATSAPP_NUMBER") {
      Alert.alert(
        "Support unavailable",
        "Our WhatsApp support contact has not been configured yet.",
      );
      return;
    }

    const message = encodeURIComponent(
      "Hello PsalmoteeData Support Team, I need assistance with my account.",
    );

    const url = `https://wa.me/${SUPPORT.whatsapp}?text=${message}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to open WhatsApp",
        "Please try again or contact us through email.",
      );
    }
  };

  const openEmail = async () => {
    if (!SUPPORT.email || SUPPORT.email === "YOUR_SUPPORT_EMAIL") {
      Alert.alert(
        "Support unavailable",
        "Our support email has not been configured yet.",
      );
      return;
    }

    const subject = encodeURIComponent("PsalmoteeData Support Request");

    const body = encodeURIComponent(
      "Hello PsalmoteeData Support Team,\n\n" +
        "I need assistance with the following:\n\n" +
        "Account username (if applicable):\n" +
        "Issue description:\n\n",
    );

    const url = `mailto:${SUPPORT.email}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to open email",
        "Please check whether an email application is configured on your device.",
      );
    }
  };

  const openWebsite = async () => {
    try {
      await Linking.openURL(SUPPORT.website);
    } catch {
      Alert.alert("Unable to open website", "Please try again later.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="headset"
            size={34}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.heading}>How can we help you?</Text>

        <Text style={styles.subtitle}>
          Have a question or experiencing a problem? Our support team is here to
          help you.
        </Text>
      </View>

      {/* Contact options */}
      <Text style={styles.sectionTitle}>Get in touch</Text>

      <SupportContactCard
        title="WhatsApp Support"
        description="Chat directly with our support team."
        icon="whatsapp"
        iconColor="#25D366"
        onPress={openWhatsApp}
      />

      <SupportContactCard
        title="Email Support"
        description="Send us your questions or complaints."
        icon="email-outline"
        iconColor={theme.colors.primary}
        onPress={openEmail}
      />

      {/* Support availability */}
      <View style={styles.responseCard}>
        <View style={styles.responseIcon}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={22}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.responseContent}>
          <Text style={styles.responseTitle}>Support availability</Text>

          <Text style={styles.responseText}>{SUPPORT.responseTime}</Text>
        </View>
      </View>

      {/* Support topics */}
      <Text style={styles.sectionTitle}>What can we help you with?</Text>

      <View style={styles.topicsCard}>
        {supportTopics.map((topic, index) => (
          <View
            key={topic}
            style={[
              styles.topic,
              index === supportTopics.length - 1 && styles.lastTopic,
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={19}
              color={theme.colors.primary}
            />

            <Text style={styles.topicText}>{topic}</Text>
          </View>
        ))}
      </View>

      {/* Website */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Need more information? Visit our website.
        </Text>

        <TouchableOpacity onPress={openWebsite} activeOpacity={0.7}>
          <Text style={styles.website}>psalmoteedata.com.ng</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Thank you for choosing PsalmoteeData.
        </Text>
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
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing["4xl"],
    paddingTop: theme.spacing["6xl"]
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
    marginRight: theme.spacing.md,
    // marginTop: theme.spacing["2xl"],
  },

  header: {
    alignItems: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing["2xl"],
  },

  headerIcon: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  heading: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 22,
    color: theme.colors.muted,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },

  responseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },

  responseIcon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: `${theme.colors.primary}18`,
    justifyContent: "center",
    alignItems: "center",
  },

  responseContent: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },

  responseTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  responseText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    color: theme.colors.muted,
    lineHeight: 18,
  },

  topicsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
  },

  topic: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borderWidth.thin,
    borderBottomColor: theme.colors.border,
  },

  lastTopic: {
    borderBottomWidth: 0,
  },

  topicText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },

  footer: {
    alignItems: "center",
    marginTop: theme.spacing["2xl"],
  },

  footerText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    color: theme.colors.muted,
    textAlign: "center",
  },

  website: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },

  footerNote: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.lg,
  },
});
