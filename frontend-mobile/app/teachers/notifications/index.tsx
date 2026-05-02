import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ទិន្នន័យការជូនដំណឹងគំរូ
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "leave" | "schedule" | "admin";
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "សិស្សសុំច្បាប់ឈប់",
    description:
      "និស្សិត ម៉ាត្រា បានផ្ញើសំណើសុំច្បាប់ឈប់សម្រាកសម្រាប់ថ្ងៃស្អែក។",
    time: "2 នាទីមុន",
    type: "leave",
    isRead: false,
  },
  {
    id: "2",
    title: "ការផ្លាស់ប្តូរម៉ោងសិក្សា",
    description: "ម៉ោងសិក្សា Mathematics 101 ត្រូវបានប្តូរទៅម៉ោង 03:00 PM វិញ។",
    time: "1 ម៉ោងមុន",
    type: "schedule",
    isRead: true,
  },
  {
    id: "3",
    title: "ការជូនដំណឹងពីសាលា",
    description:
      "នឹងមានការប្រជុំបុគ្គលិកនៅថ្ងៃសុក្របសប្តាហ៍ក្រោយ វេលាម៉ោង ០៩:០០ ព្រឹក។",
    time: "5 ម៉ោងមុន",
    type: "admin",
    isRead: true,
  },
];

export default function TeacherNotifications() {
  const router = useRouter();

  interface IconConfig {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
  }

  const getIcon = (type: Notification["type"]): IconConfig => {
    switch (type) {
      case "leave":
        return { name: "document-text", color: "#FF9800" };
      case "schedule":
        return { name: "time", color: "#2196F3" };
      default:
        return { name: "notifications", color: "#4CAF50" };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notiCard, !item.isRead && styles.unreadCard]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIcon(item.type).color + "20" },
        ]}
      >
        <Ionicons
          name={getIcon(item.type).name}
          size={24}
          color={getIcon(item.type).color}
        />
      </View>

      <View style={styles.notiContent}>
        <View style={styles.notiHeader}>
          <Text style={styles.notiTitle}>{item.title}</Text>
          <Text style={styles.notiTime}>{item.time}</Text>
        </View>
        <Text style={styles.notiDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/teachers/dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ការជូនដំណឹង</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>អានទាំងអស់</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>មិនទាន់មានការជូនដំណឹងនៅឡើយទេ</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#00529B",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  markReadText: { color: "#E0E0E0", fontSize: 13 },

  listPadding: { padding: 15 },
  notiCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  unreadCard: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#D1E8FF",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  notiContent: { flex: 1, marginLeft: 15 },
  notiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  notiTitle: { fontWeight: "bold", fontSize: 15, color: "#333" },
  notiTime: { fontSize: 11, color: "#999" },
  notiDesc: { fontSize: 13, color: "#666", lineHeight: 18 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00529B",
    marginLeft: 5,
  },

  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "#999", fontSize: 16 },
});
