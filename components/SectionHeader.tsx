import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import theme from "../constants/theme";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {actionLabel && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  action: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
