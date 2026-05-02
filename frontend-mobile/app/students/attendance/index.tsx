import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenHeader } from "@/src/components/ui/ScreenHeader";

// ==================== DATA ====================
const ATTENDANCE_HISTORY = [
  {
    id: "1",
    date: "05 April 2026",
    subject: "Mobile App Development",
    status: "present",
  },
  {
    id: "2",
    date: "03 April 2026",
    subject: "Cloud Computing",
    status: "late",
  },
  {
    id: "3",
    date: "01 April 2026",
    subject: "Network Security",
    status: "present",
  },
  {
    id: "4",
    date: "30 March 2026",
    subject: "Mobile App Development",
    status: "absent",
  },
  {
    id: "5",
    date: "28 March 2026",
    subject: "Professional Ethics",
    status: "present",
  },
];

const STATUS_THEME = {
  present: {
    label: "Present",
    color: "#10B981",
    bg: "#ECFDF5",
    icon: "checkmark-circle",
  },
  late: {
    label: "Late",
    color: "#F59E0B",
    bg: "#FFFBEB",
    icon: "time",
  },
  absent: {
    label: "Absent",
    color: "#EF4444",
    bg: "#FEF2F2",
    icon: "close-circle",
  },
};

// ==================== MAIN SCREEN ====================
export default function StudentAttendance() {
  const router = useRouter();

  // Calculate Statistics
  const total = ATTENDANCE_HISTORY.length;
  const present = ATTENDANCE_HISTORY.filter(
    (i) => i.status === "present",
  ).length;
  const late = ATTENDANCE_HISTORY.filter((i) => i.status === "late").length;
  const absent = ATTENDANCE_HISTORY.filter((i) => i.status === "absent").length;
  const rate = Math.round(((present + late * 0.5) / total) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="Attendance"
        showBack={true}
        rightAction={
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.rateCircle}>
            <Text style={styles.rateNumber}>{rate}%</Text>
            <Text style={styles.rateSubText}>Attendance Rate</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: "#10B981" }]}>
                {present}
              </Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>

            <View style={[styles.statBox, styles.statBorder]}>
              <Text style={[styles.statNum, { color: "#F59E0B" }]}>{late}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: "#EF4444" }]}>
                {absent}
              </Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance List */}
        {ATTENDANCE_HISTORY.map((item) => {
          const theme = STATUS_THEME[item.status as keyof typeof STATUS_THEME];
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.historyCard}
              onPress={() =>
                router.push({
                  pathname: "/(student)/attendance-detail",
                  params: {
                    subject: item.subject,
                    date: item.date,
                    status: item.status,
                  },
                })
              }
            >
              <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
                <Ionicons
                  name={theme.icon as any}
                  size={22}
                  color={theme.color}
                />
              </View>

              <View style={styles.historyInfo}>
                <Text style={styles.subjectText} numberOfLines={1}>
                  {item.subject}
                </Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={styles.rightContent}>
                <Text style={[styles.statusText, { color: theme.color }]}>
                  {theme.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  headerBtn: { padding: 5 },
  scrollBody: { padding: 20 },

  // Summary Card
  summaryCard: {
    backgroundColor: "#00529B",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    marginBottom: 30,
    elevation: 8,
    shadowColor: "#00529B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  rateCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  rateNumber: { fontSize: 32, fontWeight: "900", color: "#fff" },
  rateSubText: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 18,
    width: "100%",
  },
  statBox: { flex: 1, alignItems: "center" },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#F1F5F9",
  },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "600",
  },

  // List Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  viewAllText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: { flex: 1, marginLeft: 15 },
  subjectText: { fontSize: 15, fontWeight: "700", color: "#334155" },
  dateText: { fontSize: 12, color: "#94A3B8", marginTop: 4 },

  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    marginRight: 8,
  },
});
