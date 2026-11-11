import { View, Text, StyleSheet, ScrollView } from "react-native";

import theme from "../constants/theme";

import SectionHeader from "../components/SectionHeader";
import ServiceItem from "../components/ServiceItem";

const services = [
  {
    name: "Airtime",
    icon: "cellphone",
    color: "#0EA5C6",
    description: "Recharge your mobile line",
  },
  {
    name: "Data",
    icon: "wifi",
    color: "#2563EB",
    description: "Buy data bundles",
  },
  {
    name: "Electricity",
    icon: "lightning-bolt",
    color: "#F59E0B",
    description: "Pay electricity bills",
  },
  {
    name: "Cable TV",
    icon: "television",
    color: "#F97316",
    description: "Renew your TV subscription",
  },
] as const;

export default function ServicesScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Services</Text>

        <Text style={styles.subtitle}>
          Everything you need, all in one place.
        </Text>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <SectionHeader title="Available Services" />

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <View key={service.name} style={styles.serviceWrapper}>
              <ServiceItem
                name={service.name}
                icon={service.icon}
                color={service.color}
              />

              <Text style={styles.description}>{service.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Information */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fast and Convenient</Text>

        <Text style={styles.infoDescription}>
          Enjoy convenient access to essential digital services from the comfort
          of your device.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    marginBottom: theme.spacing["3xl"],
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize["3xl"],
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: theme.spacing.sm,
  },

  section: {
    marginBottom: theme.spacing["2xl"],
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceWrapper: {
    width: "48%",
    marginBottom: theme.spacing.md,
  },

  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: -theme.spacing.sm,
    marginLeft: theme.spacing.lg,
  },

  infoCard: {
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },

  infoTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.sm,
  },

  infoDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    lineHeight: 22,
  },
});
