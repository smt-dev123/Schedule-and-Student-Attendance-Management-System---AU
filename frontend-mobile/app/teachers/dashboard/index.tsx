import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getCurrentDate() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

const STAT_ICONS = {
  subjects: require("@/assets/icons/subjects.png"),
  completed: require("@/assets/icons/completed.png"),
  classes: require("@/assets/icons/class.png"),
  today: require("@/assets/icons/todayclass.png"),
};

const STATS = [
  {
    label: "Total Subjects",
    value: "4",
    icon: STAT_ICONS.subjects,
    color: "#2e2e2e",
    bg: "#ffffff",
  },
  {
    label: "Completed",
    value: "2",
    icon: STAT_ICONS.completed,
    color: "#2e2e2e",
    bg: "#ffffff",
  },
  {
    label: "Total Classes",
    value: "12",
    icon: STAT_ICONS.classes,
    color: "#2e2e2e",
    bg: "#ffffff",
  },
  {
    label: "Today's Classes",
    value: "6",
    icon: STAT_ICONS.today,
    color: "#2e2e2e",
    bg: "#ffffff",
  },
];

const CURRENT_CLASS = {
  subject: "Mobile App",
  time: "06:00 - 9:15",
  code: "CS-2026  Lab 01",
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const saved = await AsyncStorage.getItem("teacher_profile");
          if (saved) {
            const data = JSON.parse(saved);
            setPhotoUri(data.photoUri ?? null);
          } else {
            setPhotoUri(null);
          }
        } catch {
          setPhotoUri(null);
        }
      };
      load();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          {/* ផ្នែកអក្សរខាងឆ្វេង */}
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.teacherName}>Mr. Sourng!</Text>
            <Text style={styles.date}>{getCurrentDate()}</Text>
          </View>

          {/* ផ្នែក Profile ខាងស្ដាំ (នឹងនៅស្មើជាមួយកាត Completed ខាងក្រោម) */}
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/(teacher)/profile")}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Sg</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats Grid ── */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <View style={styles.statTop}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    padding: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: s.color + "22",
                  }}
                >
                  <Image
                    source={s.icon}
                    style={styles.statIconImg}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Current Class Card ── */}
        <View style={styles.currentCard}>
          <View style={styles.currentCardTop}>
            <View>
              <Text style={styles.currentTitle}>Current Class</Text>
              <Text style={styles.currentSub}>In progress now</Text>
            </View>
            <View style={styles.currentIconBox}>
              <Text style={styles.currentIcon}>🕐</Text>
            </View>
          </View>
          <Text style={styles.subjectName}>{CURRENT_CLASS.subject}</Text>
          <Text style={styles.classInfo}>
            {CURRENT_CLASS.time} {CURRENT_CLASS.code}
          </Text>
          <TouchableOpacity
            style={styles.recordBtn}
            onPress={() => router.push("/(teacher)/attendance")}
          >
            <Text style={styles.recordBtnText}>✓ Record Attendance</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FA" },
  scroll: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ រុញឆ្វេង-ស្ដាំឱ្យដាច់ពីគ្នា
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1, // ឱ្យវាចាប់យកលំហរខាងឆ្វេង
  },
  headerRight: {
    // មិនបាច់ដាក់ flex ទេ ដើម្បីឱ្យវាផ្ដុំនៅខាងស្ដាំ
    alignItems: "flex-end",
    width: "47%", // ✅ កំណត់ Width ឱ្យស្មើនឹងកាត Stats ខាងក្រោម ដើម្បីឱ្យវា Align គ្នាស្អាត
  },

  greeting: { fontSize: 14, fontWeight: "500", color: "#888" },
  teacherName: { fontSize: 22, fontWeight: "800", color: "#111", marginTop: 2 },
  date: { fontSize: 12, color: "#aaa", marginTop: 4 },

  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // ✅ ធានាថាកាតឆ្វេងស្ដាំឃ្លាតគ្នាស្មើ Header
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%", // ✅ Width នេះត្រូវគ្នាជាមួយ headerRight
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statLabel: { fontSize: 12, color: "#646B7A", maxWidth: "70%" },
  statIconImg: { width: 22, height: 22 },
  statValue: { fontSize: 28, fontWeight: "800" },

  // Current Class
  currentCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  currentCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  currentTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  currentSub: { fontSize: 12, color: "#ffffffaa", marginTop: 2 },
  currentIconBox: {
    backgroundColor: "#ffffff22",
    borderRadius: 10,
    padding: 8,
  },
  currentIcon: { fontSize: 20 },
  subjectName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  classInfo: { fontSize: 12, color: "#ffffffcc", marginBottom: 18 },
  recordBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  recordBtnText: { color: "#2563EB", fontWeight: "700", fontSize: 15 },
});
