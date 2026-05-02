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

// ទិន្នន័យការជូនដំណឹងគំរូសម្រាប់និស្សិត
const studentNotifications = [
  {
    id: "1",
    title: "វត្តមានត្រូវបានកត់ត្រា",
    description: "អ្នកបានចុះវត្តមានក្នុងមុខវិជ្ជា Mathematics 101 បានជោគជ័យ។",
    time: "៥ នាទីមុន",
    type: "check-in",
    isRead: false,
  },
  {
    id: "2",
    title: "ការផ្លាស់ប្តូរបន្ទប់សិក្សា",
    description:
      "មុខវិជ្ជា English Literature ត្រូវបានប្តូរពីបន្ទប់ A-102 ទៅ B-204 វិញ។",
    time: "២ ម៉ោងមុន",
    type: "room-change",
    isRead: true,
  },
  {
    id: "3",
    title: "របាយការណ៍វត្តមានប្រចាំខែ",
    description:
      "របាយការណ៍វត្តមានប្រចាំខែសីហារបស់អ្នកមានអត្រា ៩១%។ រក្សាសកម្មភាពល្អនេះបន្តទៀត!",
    time: "១ ថ្ងៃមុន",
    type: "report",
    isRead: true,
  },
];

export default function StudentNotifications() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return { name: "checkmark-circle", color: "#4CAF50" };
      case "room-change":
        return { name: "business", color: "#FF9800" };
      case "report":
        return { name: "stats-chart", color: "#00529B" };
      default:
        return { name: "notifications", color: "#666" };
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notiCard, !item.isRead && styles.unreadCard]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIcon(item.type).color + "15" },
        ]}
      >
        <Ionicons
          name={getIcon(item.type).name as any}
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ការជូនដំណឹង</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>អានទាំងអស់</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={studentNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
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
    backgroundColor: "#F0F9F4",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notiContent: { flex: 1, marginLeft: 12 },
  notiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notiTitle: { fontWeight: "bold", fontSize: 15, color: "#333" },
  notiTime: { fontSize: 11, color: "#999" },
  notiDesc: { fontSize: 13, color: "#666", lineHeight: 18 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginLeft: 5,
  },
  markReadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
