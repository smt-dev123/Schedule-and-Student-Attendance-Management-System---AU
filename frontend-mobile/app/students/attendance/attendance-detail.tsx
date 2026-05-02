import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";

export default function AttendanceDetail() {
  const router = useRouter();
  const { subject, history } = useLocalSearchParams();

  // បម្លែង JSON String មកជា Array វិញ
  const attendanceList = history ? JSON.parse(history as string) : [];

  const getStatusTheme = (s: string) => {
    switch (s) {
      case "present":
        return {
          label: "មកសិក្សា",
          color: "#10B981",
          bg: "#ECFDF5",
          icon: "checkmark-circle",
        };
      case "late":
        return { label: "យឺត", color: "#F59E0B", bg: "#FFFBEB", icon: "time" };
      case "absent":
        return {
          label: "អវត្តមាន",
          color: "#EF4444",
          bg: "#FEF2F2",
          icon: "close-circle",
        };
      default:
        return {
          label: "N/A",
          color: "#64748B",
          bg: "#F1F5F9",
          icon: "help-circle",
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="ប្រវត្តិវត្តមានតាមមុខវិជ្ជា" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card បង្ហាញឈ្មោះមុខវិជ្ជា */}
        <View style={styles.subjectCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="book" size={30} color="#2563EB" />
          </View>
          <Text style={styles.subjectName}>{subject}</Text>
          <Text style={styles.semesterText}>ឆមាសទី ២ • ឆ្នាំទី ៤</Text>
        </View>

        <Text style={styles.sectionTitle}>
          កាលបរិច្ឆេទសិក្សា ({attendanceList.length})
        </Text>

        {/* បង្ហាញបញ្ជីថ្ងៃនីមួយៗ */}
        {attendanceList.map((item: any, index: number) => {
          const theme = getStatusTheme(item.status);
          return (
            <View key={index} style={styles.dateRow}>
              <View style={styles.dateInfo}>
                <Ionicons name="calendar-outline" size={18} color="#64748B" />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
                <View style={[styles.dot, { backgroundColor: theme.color }]} />
                <Text style={[styles.statusLabel, { color: theme.color }]}>
                  {theme.label}
                </Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>ត្រឡប់ក្រោយ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20 },

  // Subject Header
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  semesterText: { fontSize: 13, color: "#64748B", marginTop: 5 },

  // List Style
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 15,
    marginLeft: 5,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dateInfo: { flexDirection: "row", alignItems: "center" },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 10,
  },

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusLabel: { fontSize: 12, fontWeight: "700" },

  backBtn: {
    marginTop: 20,
    backgroundColor: "#F1F5F9",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  backBtnText: { color: "#475569", fontWeight: "700", fontSize: 15 },
});
