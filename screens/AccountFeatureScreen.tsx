import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AccountFeature">;

export default function AccountFeatureScreen({ navigation, route }: Props) {
  const { title, description, icon } = route.params;

  return (
    <View style={styles.container}>
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

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as "account-edit-outline"}
            size={42}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>

        <Text style={styles.comingSoon}>Content coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
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
    marginTop: theme.spacing.xl,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "rgba(14,165,198,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.heading,
    textAlign: "center",
  },

  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },

  comingSoon: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: theme.spacing.xl,
  },
});
