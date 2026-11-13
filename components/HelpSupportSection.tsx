import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import typography from "../constants/typography";

type SupportItem = {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
};

type HelpSupportSectionProps = {
  onHelpPress: () => void;
  onSupportPress: () => void;
  onCommunityPress: () => void;
};

export default function HelpSupportSection({
  onHelpPress,
  onSupportPress,
  onCommunityPress,
}: HelpSupportSectionProps) {
  const supportItems: SupportItem[] = [
    {
      title: "Help Centre",
      description: "FAQs and user guides",
      icon: "help-circle-outline",
      onPress: onHelpPress,
    },
    {
      title: "Customer Support",
      description: "We're here to help",
      icon: "headset",
      onPress: onSupportPress,
    },
    {
      title: "Community",
      description: "Connect with other users",
      icon: "account-group-outline",
      onPress: onCommunityPress,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Help & Support</Text>

        <Text style={styles.subheading}>
          Need assistance? We're always here to help.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {supportItems.map((item) => (
          <Pressable
            key={item.title}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.supportCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.muted}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  headingContainer: {
    marginBottom: 14,
  },

  heading: {
    color: colors.text,
    fontSize: 19,
    fontFamily: typography.fontFamily.heading,
  },

  subheading: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    marginTop: 5,
  },

  cardsContainer: {
    gap: 10,
  },

  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    minHeight: 75,
  },

  pressedCard: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "rgba(14, 165, 198, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },

  cardDescription: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    marginTop: 4,
  },
});
