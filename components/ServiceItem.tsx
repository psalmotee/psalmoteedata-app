import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

type ServiceItemProps = {
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  onPress?: () => void;
};

export default function ServiceItem({
  name,
  icon,
  color,
  onPress,
}: ServiceItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      </View>

      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  name: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
