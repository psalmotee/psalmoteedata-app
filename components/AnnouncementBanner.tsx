import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import typography from "../constants/typography";

type AnnouncementBannerProps = {
  title?: string;
  message?: string;
  onPress?: () => void;
};

export default function AnnouncementBanner({
  title = "Stay updated!",
  message = "Discover new services, special offers and important platform announcements.",
  onPress,
}: AnnouncementBannerProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="bullhorn-outline"
          size={23}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>PLATFORM UPDATE</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>{message}</Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 15,
    marginBottom: 24,
  },

  pressed: {
    opacity: 0.75,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "rgba(14, 165, 198, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginHorizontal: 12,
  },

  label: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 5,
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },

  message: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    lineHeight: 17,
    marginTop: 4,
  },
});
