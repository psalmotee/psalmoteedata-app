import { View, Text, Pressable, StyleSheet } from "react-native";

import theme from "../constants/theme";

export type Network = {
  id: string;
  name: string;
  color: string;
};

type NetworkSelectorProps = {
  networks: Network[];
  selectedNetwork: string;
  onSelectNetwork: (networkId: string) => void;
};

export default function NetworkSelector({
  networks,
  selectedNetwork,
  onSelectNetwork,
}: NetworkSelectorProps) {
  return (
    <View style={styles.container}>
      {networks.map((network) => {
        const isSelected = selectedNetwork === network.id;

        return (
          <Pressable
            key={network.id}
            onPress={() => onSelectNetwork(network.id)}
            style={[styles.networkCard, isSelected && styles.selectedNetwork]}
          >
            <View
              style={[styles.networkLogo, { backgroundColor: network.color }]}
            >
              <Text style={styles.networkInitial}>
                {network.name === "9mobile" ? "9" : network.name.charAt(0)}
              </Text>
            </View>

            <Text style={styles.networkName}>{network.name}</Text>

            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  networkCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    position: "relative",
  },

  selectedNetwork: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.cardSecondary,
  },

  networkLogo: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  networkInitial: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },

  networkName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
