import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "student_profile";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const STATS = [
  {
    label: "Attendance",
    value: "95%",
    icon: "calendar",
    color: "#10B981",
  },
  {
    label: "Subjects",
    value: "6",
    icon: "book",
    color: "#2563EB",
  },
  {
    label: "Today's Classes",
    value: "03",
    icon: "time",
    color: "#6366F1", // Indigo
    subLabel: "Remaining: 01",
  },
  {
    label: "Completed",
    value: "85%",
    icon: "checkmark-done-circle",
    color: "#F59E0B", // Amber/Gold
    subLabel: "12/15 Weeks",
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [greeting] = useState(getGreeting());

  const [studentData, setStudentData] = useState({
    fullName: "Vitou",
    studentId: "ST-2026001",
    photoUri: null as string | null,
  });

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved) {
            const data = JSON.parse(saved);
            setStudentData({
              fullName: data.fullName || "Vitou",
              studentId: data.studentId || "ST-2026001",
              photoUri: data.photoUri || null,
            });
          }
        } catch (e) {
          console.log("Load error:", e);
        }
      };
      loadProfile();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.studentName}>{studentData.fullName}!</Text>
            <Text style={styles.idText}>ID: {studentData.studentId}</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/(student)/profile")}>
            <View style={styles.avatarWrapper}>
              {studentData.photoUri ? (
                <Image
                  source={{ uri: studentData.photoUri }}
                  style={styles.avatarImg}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {studentData.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Stats Grid ── */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View
                style={[styles.iconCircle, { backgroundColor: s.color + "15" }]}
              >
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
                {s.subLabel && (
                  <Text style={styles.subLabelText}>{s.subLabel}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* ── Next Class Card ── */}
        <View style={styles.currentCard}>
          <View style={styles.currentCardTop}>
            <View>
              <Text style={styles.currentTitle}>Next Class</Text>
              <Text style={styles.currentSub}>Starts in 15 mins</Text>
            </View>
            <View style={styles.currentIconBox}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </View>
          </View>
          <Text style={styles.subjectName}>Mobile App Development</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#ffffffcc" />
            <Text style={styles.classInfo}>Room 402, Lab 02</Text>
          </View>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/(student)/attendance-detail")}
          >
            <Text style={styles.actionBtnText}>Check Details</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Menu ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Menu</Text>
        </View>

        <View style={styles.menuGrid}>
          {[
            {
              label: "Schedule",
              icon: "time",
              color: "#6366F1",
              path: "/(student)/schedule",
            },
            {
              label: "Attendance",
              icon: "checkmark-circle",
              color: "#10B981",
              path: "/(student)/attendance",
            },
            {
              label: "Grades",
              icon: "ribbon",
              color: "#EC4899",
              path: "/(student)/grades",
            },
            {
              label: "Library",
              icon: "library",
              color: "#F59E0B",
              path: "/(student)/library",
            },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              onPress={() => item.path && router.push(item.path as any)}
            >
              <View
                style={[
                  styles.menuIconCircle,
                  { backgroundColor: item.color + "10" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  greeting: { fontSize: 14, color: "#64748B", fontWeight: "500" },
  studentName: { fontSize: 24, fontWeight: "800", color: "#1E293B" },
  idText: { fontSize: 12, color: "#94A3B8", marginTop: 2 },

  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statTextContainer: { alignItems: "flex-start" },
  statValue: { fontSize: 20, fontWeight: "900", color: "#1E293B" },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },
  subLabelText: { fontSize: 10, color: "#94A3B8", marginTop: 4 },

  // Main Card
  currentCard: {
    backgroundColor: "#2563EB",
    borderRadius: 28,
    padding: 22,
    marginVertical: 10,
    elevation: 8,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  currentCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  currentTitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  currentSub: { fontSize: 12, color: "#34D399", fontWeight: "700" },
  currentIconBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 8,
  },
  subjectName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  classInfo: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginLeft: 6 },
  actionBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionBtnText: { color: "#2563EB", fontWeight: "800", fontSize: 15 },

  // Quick Menu
  sectionHeader: { marginTop: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "23%",
    alignItems: "center",
  },
  menuIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 8,
  },
  menuLabel: { fontSize: 11, fontWeight: "700", color: "#64748B" },
});
