import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

type Status = "present" | "absent" | "late" | null;

interface AttendanceStudent {
  id: string;
  name: string;
  class: string;
  status: Status;
}

interface AttendanceSession {
  id: string;
  date: string;
  time: string;
  students: AttendanceStudent[];
}

const ATTENDANCE_HISTORY_KEY = "teacher_attendance_history";

export default function AttendanceHistory() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [history, setHistory] = useState<AttendanceSession[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(ATTENDANCE_HISTORY_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        setHistory(parsed);
      } catch (error) {
        console.error("Load attendance history", error);
      }
    };
    loadHistory();
  }, []);

  const statusColor = (status: Status) => {
    if (status === "present") return "#4CAF50";
    if (status === "absent") return "#E24B4A";
    if (status === "late") return "#FF9800";
    return "#999";
  };

  const searchQuery = search.trim().toLowerCase();

  const filteredHistory = searchQuery
    ? history.filter((session) =>
        session.students.some((s) =>
          s.name.toLowerCase().includes(searchQuery),
        ),
      )
    : history;

  const filteredStudents = history.flatMap((session) =>
    session.students.filter(
      (s) => searchQuery === "" || s.name.toLowerCase().includes(searchQuery),
    ),
  );

  const presentCount = filteredStudents.filter(
    (s) => s.status === "present",
  ).length;
  const absentCount = filteredStudents.filter(
    (s) => s.status === "absent",
  ).length;
  const lateCount = filteredStudents.filter((s) => s.status === "late").length;

  const renderSession = ({ item }: { item: AttendanceSession }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionDate}>{item.date}</Text>
        <Text style={styles.sessionTime}>{item.time}</Text>
      </View>
      {item.students.map((student) => (
        <View key={student.id} style={styles.studentRow}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            {/* កែប្រែពី Class មកជា Year */}
            <Text style={styles.studentClass}>Year: {student.class}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(student.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColor(student.status) },
              ]}
            >
              {student.status ? student.status.toUpperCase() : "NOT MARKED"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <ScreenHeader
          title={t("attendance.history", "Attendance History")}
          showBack
          onBack={() => router.push("/(tabs)/attendance")}
        />

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={16}
            color="#aaa"
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("attendance.searchNames", "Search names...")}
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            {
              label: t("attendance.present", "Present"),
              count: presentCount,
              color: "#4CAF50",
            },
            {
              label: t("attendance.absent", "Absent"),
              count: absentCount,
              color: "#E24B4A",
            },
            {
              label: t("attendance.late", "Late"),
              count: lateCount,
              color: "#FF9800",
            },
          ].map((s, i) => (
            <View key={i} style={styles.statsCard}>
              <Text style={styles.statsLabel}>{s.label}</Text>
              <Text style={[styles.statsCount, { color: s.color }]}>
                {s.count}
              </Text>
            </View>
          ))}
        </View>

        {/* List */}
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#ddd" />
            <Text style={styles.emptyText}>
              {t("attendance.noHistory", "No attendance history yet.")}
            </Text>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {t("attendance.noResults", "No records found for")} "{search}"
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={renderSession}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  listContent: { padding: 20 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: "#E5E5E5",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statsLabel: { fontSize: 12, color: "#666", marginBottom: 6 },
  statsCount: { fontSize: 18, fontWeight: "700" },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionDate: { fontSize: 13, color: "#888" },
  sessionTime: { fontSize: 13, color: "#555", fontWeight: "600" },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  studentInfo: { flex: 1, paddingRight: 12 },
  studentName: { fontSize: 14, fontWeight: "700", color: "#111" },
  studentClass: { fontSize: 12, color: "#666", marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 90,
    alignItems: "center",
  },
  statusText: { fontSize: 12, fontWeight: "bold" },
  localeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  localeText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  emptyText: { color: "#666", fontSize: 15, textAlign: "center" },
});
