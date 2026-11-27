import { View, Text, Pressable, StyleSheet, Image } from "react-native";

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

const networkLogos: Record<string, any> = {
  mtn: require("../assets/images/networks/mtn.jpg"),
  airtel: require("../assets/images/networks/airtel.jpg"),
  glo: require("../assets/images/networks/glo.jpg"),
  "9mobile": require("../assets/images/networks/9mobile.jpg"),
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
        const logo = networkLogos[network.id];

        return (
          <Pressable
            key={network.id}
            onPress={() => onSelectNetwork(network.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={[styles.networkCard, isSelected && styles.selectedNetwork]}
          >
            <View style={styles.networkLogoContainer}>
              {logo ? (
                <Image
                  source={logo}
                  style={styles.networkLogo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.fallbackText}>{network.name}</Text>
              )}
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

  networkLogoContainer: {
    width: 64,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    padding: 5,
  },

  networkLogo: {
    width: "100%",
    height: "100%",
  },

  fallbackText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
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
