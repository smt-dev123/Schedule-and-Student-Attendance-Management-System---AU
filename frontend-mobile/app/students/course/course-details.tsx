import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import ScreenHeader របស់អ្នក
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";

export default function CourseDetails() {
  const router = useRouter();

  const courseInfo = {
    title: "Mobile App Development",
    code: "CS305",
    instructor: "Dr. Kimsour",
    room: "Lab 02, Building C",
    attendance: "92%",
    credits: 3,
  };

  const sessions = [
    {
      id: 1,
      title: "Introduction to React Native",
      date: "Mar 20, 2026",
      status: "Present",
    },
    {
      id: 2,
      title: "Components & Styling",
      date: "Mar 27, 2026",
      status: "Present",
    },
    {
      id: 3,
      title: "State & Props Management",
      date: "Apr 03, 2026",
      status: "Present",
    },
    {
      id: 4,
      title: "Navigation & Routing",
      date: "Apr 10, 2026",
      status: "Upcoming",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ✅ ប្រើ ScreenHeader ជំនួស Header ចាស់ */}
      <ScreenHeader
        title="Course Details"
        subtitle={courseInfo.code}
        showBack={true}
        rightAction={
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Course Hero Card (កែពណ៌ឱ្យស៊ីជាមួយ ScreenHeader) */}
        <View style={styles.heroCard}>
          <Text style={styles.courseTitle}>{courseInfo.title}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{courseInfo.credits} Credits</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#10B981" }]}>
              <Text style={styles.badgeText}>Active Course</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="person-circle-outline" size={18} color="#fff" />
              <Text style={styles.infoLabel}>{courseInfo.instructor}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={18} color="#fff" />
              <Text style={styles.infoLabel}>{courseInfo.room}</Text>
            </View>
          </View>
        </View>

        {/* Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{courseInfo.attendance}</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={[styles.statBox, styles.statBorder]}>
              <Text style={styles.statValue}>A</Text>
              <Text style={styles.statLabel}>Grade Prediction</Text>
            </View>
          </View>
        </View>

        {/* Sessions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Syllabus & Sessions</Text>
            <Text style={styles.sessionCount}>{sessions.length} Sessions</Text>
          </View>

          {sessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      session.status === "Present" ? "#10B981" : "#CBD5E1",
                  },
                ]}
              />
              <View style={styles.sessionContent}>
                <Text style={styles.sessionTitleText}>{session.title}</Text>
                <Text style={styles.sessionDate}>{session.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      session.status === "Present" ? "#ECFDF5" : "#F1F5F9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        session.status === "Present" ? "#10B981" : "#64748B",
                    },
                  ]}
                >
                  {session.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainBtn} activeOpacity={0.8}>
          <Ionicons name="cloud-download-outline" size={20} color="#fff" />
          <Text style={styles.mainBtnText}>Download Course Materials</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerBtn: { padding: 5 },
  scrollPadding: { paddingBottom: 20 },

  heroCard: {
    backgroundColor: "#00529B", // ប្តូរពណ៌ឱ្យដូច ScreenHeader របស់អ្នក (ពណ៌ខៀវដិត)
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: "#00529B",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  courseTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 15,
  },
  badgeRow: { flexDirection: "row", gap: 10 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 20,
  },
  infoGrid: { flexDirection: "row", justifyContent: "space-between" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { color: "#fff", fontSize: 13, fontWeight: "600" },

  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  sessionCount: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    flexDirection: "row",
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
  },
  statBox: { flex: 1, alignItems: "center" },
  statBorder: { borderLeftWidth: 1, borderLeftColor: "#F1F5F9" },
  statValue: { fontSize: 24, fontWeight: "900", color: "#00529B" },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },

  sessionItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 15 },
  sessionContent: { flex: 1 },
  sessionTitleText: { fontSize: 15, fontWeight: "700", color: "#334155" },
  sessionDate: { fontSize: 12, color: "#94A3B8", marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "800" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(248, 250, 252, 0.9)", // លាយពណ៌ Background ឱ្យមើលទៅថ្លាៗ
  },
  mainBtn: {
    backgroundColor: "#00529B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    gap: 10,
    elevation: 8,
    shadowColor: "#00529B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mainBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
