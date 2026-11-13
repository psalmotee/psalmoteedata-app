import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import theme from "../constants/theme";

type NotificationType = "wallet" | "transaction" | "announcement" | "account";

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Wallet Funding Successful",
    message: "Your wallet has been credited with ₦5,000.00.",
    date: "Today, 10:30 AM",
    type: "wallet",
    isRead: false,
  },
  {
    id: "2",
    title: "Data Purchase Successful",
    message: "Your MTN 1GB data purchase was successful.",
    date: "Today, 9:15 AM",
    type: "transaction",
    isRead: false,
  },
  {
    id: "3",
    title: "Welcome to PsalmoteeData",
    message:
      "Thank you for choosing PsalmoteeData. Enjoy our digital services.",
    date: "Yesterday",
    type: "announcement",
    isRead: true,
  },
  {
    id: "4",
    title: "Account Information",
    message:
      "Your account is ready. You can now explore our available services.",
    date: "12 Nov 2026",
    type: "account",
    isRead: true,
  },
];

const notificationIcons: Record<
  NotificationType,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  wallet: "wallet-outline",
  transaction: "swap-horizontal",
  announcement: "bullhorn-outline",
  account: "account-circle-outline",
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);

    Alert.alert(notification.title, notification.message);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <Pressable
      onPress={() => handleNotificationPress(item)}
      style={({ pressed }) => [
        styles.notificationCard,
        !item.isRead && styles.unreadCard,
        pressed && styles.pressedCard,
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={notificationIcons[item.type]}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <Text style={styles.notificationTitle}>{item.title}</Text>

          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.notificationMessage}>{item.message}</Text>

        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Notifications</Text>

          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "You're all caught up"}
          </Text>
        </View>

        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bell-check-outline"
            size={48}
            color={theme.colors.muted}
          />

          <Text style={styles.emptyTitle}>No notifications</Text>

          <Text style={styles.emptyMessage}>
            You're all caught up. New updates will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },

  heading: {
    color: theme.colors.text,
    fontSize: 25,
    fontFamily: theme.typography.fontFamily.heading,
  },

  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 5,
  },

  markAllText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 30,
  },

  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  unreadCard: {
    backgroundColor: theme.colors.cardSecondary,
    borderColor: theme.colors.primary,
  },

  pressedCard: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(14, 165, 198, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semibold,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },

  notificationMessage: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 5,
  },

  notificationDate: {
    color: theme.colors.muted,
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.body,
    marginTop: 9,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: 15,
  },

  emptyMessage: {
    color: theme.colors.muted,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },
});
