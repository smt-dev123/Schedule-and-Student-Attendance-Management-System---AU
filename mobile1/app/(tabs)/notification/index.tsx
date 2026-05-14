import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyNotifications, markNotificationAsRead } from "@/api/NotificationAPI";
import { stylesheet } from "./notification.style";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority?: "low" | "normal" | "high";
}

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHrs = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHrs / 24);

  if (diffInSec < 60) return "Just now";
  if (diffInMin < 60) return `${diffInMin}m ago`;
  if (diffInHrs < 24) return `${diffInHrs}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
}

export default function Notifications() {
  const { t } = useTranslation();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      // data is NotificationRecipient[]
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.notification.title,
        message: item.notification.message,
        createdAt: item.createdAt,
        isRead: item.isRead,
        priority: item.notification.priority,
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      await handleMarkAsRead(n.id);
    }
  };

  const getIcon = (priority?: string) => {
    switch (priority) {
      case "high":
        return { name: "alert-circle" as const, color: "#F44336" };
      case "normal":
        return { name: "notifications" as const, color: "#2196F3" };
      default:
        return { name: "information-circle" as const, color: "#4CAF50" };
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[stylesheet.notiCard, !item.isRead && stylesheet.unreadCard]}
      onPress={() => !item.isRead && handleMarkAsRead(item.id)}
    >
      <View
        style={[
          stylesheet.iconContainer,
          { backgroundColor: getIcon(item.priority).color + "20" },
        ]}
      >
        <Ionicons
          name={getIcon(item.priority).name}
          size={24}
          color={getIcon(item.priority).color}
        />
      </View>

      <View style={stylesheet.notiContent}>
        <View style={stylesheet.notiHeader}>
          <Text style={stylesheet.notiTitle}>{item.title}</Text>
          <Text style={stylesheet.notiTime}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <Text style={stylesheet.notiDesc} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.isRead && <View style={stylesheet.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={stylesheet.container}>
      {/* Header */}
      <View style={stylesheet.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={stylesheet.headerTitle}>
          {t("notification.title", "Notifications")}
        </Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={stylesheet.markReadText}>អានទាំងអស់</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={stylesheet.loadingContainer}>
          <ActivityIndicator size="large" color="#00529B" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={stylesheet.listPadding}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={stylesheet.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={80} color="#CCC" />
              <Text style={stylesheet.emptyText}>មិនទាន់មានការជូនដំណឹងនៅឡើយទេ</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// Internal styles removed in favor of stylesheet.ts

