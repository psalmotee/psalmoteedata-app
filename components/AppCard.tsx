import { View, StyleSheet, type ViewProps } from "react-native";

import theme from "../constants/theme";

type AppCardProps = ViewProps & {
  children: React.ReactNode;
};

export default function AppCard({ children, style, ...rest }: AppCardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
});
