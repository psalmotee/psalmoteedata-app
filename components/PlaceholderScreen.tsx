import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

type PlaceholderScreenProps = {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function PlaceholderScreen({
  title,
  description,
  icon,
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={42}
          color={theme.colors.primary}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing["2xl"],
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: theme.spacing.sm,
  },

  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 22,
  },
});
