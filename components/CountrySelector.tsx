import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import type { CountryOption } from "../types/auth";

type Props = {
  countries: CountryOption[];
  selectedValue: string;
  onSelect: (country: CountryOption) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};

export default function CountrySelector({
  countries,
  selectedValue,
  onSelect,
  loading = false,
  error,
  onRetry,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const { recordActivity } = useAuth();

  const selectedCountry = countries.find(
    (country) => country.value === selectedValue,
  );

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return countries;
    }

    return countries.filter((country) =>
      country.label.toLowerCase().includes(query),
    );
  }, [countries, search]);

  const openSelector = () => {
    recordActivity();
    setSearch("");
    setVisible(true);
  };

  const closeSelector = () => {
    setVisible(false);
    setSearch("");
  };

  const handleSelect = (country: CountryOption) => {
    onSelect(country);
    closeSelector();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Country</Text>

      <Pressable
        onPress={openSelector}
        disabled={loading || countries.length === 0}
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.pressed,
          (loading || countries.length === 0) && styles.disabled,
        ]}
      >
        <Text
          style={[styles.selectedText, !selectedCountry && styles.placeholder]}
        >
          {loading
            ? "Loading countries..."
            : selectedCountry?.label || "Select your country"}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color={theme.colors.muted}
          />
        )}
      </Pressable>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          {onRetry && (
            <Pressable onPress={onRetry}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={closeSelector}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={closeSelector} />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>

              <Pressable onPress={closeSelector} hitSlop={10}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={21}
                color={theme.colors.muted}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search countries..."
                placeholderTextColor={theme.colors.muted}
                autoCapitalize="none"
                style={styles.searchInput}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;

                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.countryItem,
                      isSelected && styles.selectedCountryItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countryText,
                        isSelected && styles.selectedCountryText,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No countries found.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.sm,
  },

  selector: {
    minHeight: 50,
    backgroundColor: theme.colors.cardSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  placeholder: {
    color: theme.colors.muted,
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.6,
  },

  errorContainer: {
    marginTop: theme.spacing.xs,
  },

  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.body,
  },

  retryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: theme.spacing.xs,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalContent: {
    maxHeight: "75%",
    backgroundColor: theme.colors.cardSecondary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing["3xl"],
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },

  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },

  searchContainer: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  countryItem: {
    minHeight: 50,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },

  selectedCountryItem: {
    backgroundColor: theme.colors.card,
  },

  countryText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
  },

  selectedCountryText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },

  emptyText: {
    color: theme.colors.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    paddingVertical: theme.spacing.xl,
  },
});
