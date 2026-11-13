import { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import typography from "../constants/typography";

const WHATSAPP_URL = "https://wa.me/2348058461612";

export default function RetailerPromotionCard() {
  const [isOpening, setIsOpening] = useState(false);

  const handleViewDetails = async () => {
    if (isOpening) return;

    setIsOpening(true);

    try {
      await Linking.openURL(WHATSAPP_URL);
    } catch {
      Alert.alert("Unable to open link", "Please try again later.");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <LinearGradient
      colors={["#9A3412", "#C2410C", "#EA580C"]}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={21}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.newBadge}>★ NEW</Text>
      </View>

      <Text style={styles.title}>Own a Retailer Website</Text>

      <Text style={styles.description}>
        Retail our services, including data and airtime, with your own website.
        You can also earn through our referral programme.
      </Text>

      <Pressable
        onPress={handleViewDetails}
        disabled={isOpening}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          {isOpening ? "Opening..." : "View details"}
        </Text>

        <MaterialCommunityIcons
          name="arrow-top-right"
          size={15}
          color="#FFFFFF"
        />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  newBadge: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: typography.fontFamily.heading,
    marginTop: 12,
  },

  description: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    lineHeight: 19,
    marginTop: 8,
  },

  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginTop: 12,
  },

  linkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
  },
});
