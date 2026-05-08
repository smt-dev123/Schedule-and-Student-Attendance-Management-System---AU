import "@/styles/unistyles";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSession } from "@/lib/auth-client";
import { getDashboardSummaryMe } from "@/api/DashboardAPI";
import { getTeacherMe } from "@/api/TeacherAPI";
import { getStudentMe } from "@/api/StudentAPI";

function getGreeting(t: any) {
  const h = new Date().getHours();
  if (h < 12) return t("dashboard.greetingMorning");
  if (h < 17) return t("dashboard.greetingAfternoon");
  return t("dashboard.greetingEvening");
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

export default function Dashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const STATS = [
    {
      label: t("dashboard.totalSubjects"),
      value: stats?.totalSubjects?.toString() || "0",
      icon: STAT_ICONS.subjects,
      color: theme.colors.text,
      bg: theme.colors.card,
    },
    {
      label: t("dashboard.completed"),
      value: stats?.completed?.toString() || "0",
      icon: STAT_ICONS.completed,
      color: theme.colors.text,
      bg: theme.colors.card,
    },
    {
      label: t("dashboard.totalClasses"),
      value: stats?.totalClasses?.toString() || "0",
      icon: STAT_ICONS.classes,
      color: theme.colors.text,
      bg: theme.colors.card,
    },
    {
      label: t("dashboard.todayClasses"),
      value: stats?.todayClasses?.toString() || "0",
      icon: STAT_ICONS.today,
      color: theme.colors.text,
      bg: theme.colors.card,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (isSessionLoading) return;
        setLoading(true);
        try {
          const res = await getDashboardSummaryMe();
          if (res) {
            setStats(res.stats);
            setCurrentClass(res.currentClass);
          }

          if (session?.user) {
            const role = (session.user as any).role;
            let profileData;
            if (role === "teacher") {
              profileData = await getTeacherMe();
            } else if (role === "student") {
              profileData = await getStudentMe();
            }
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Dashboard fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [session, isSessionLoading]),
  );

  if (loading || isSessionLoading) {
    return (
      <SafeAreaView style={stylesheet.safe}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesheet.safe}>
      <ScrollView
        style={stylesheet.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={stylesheet.header}>
          <View style={stylesheet.headerLeft}>
            <Text style={stylesheet.greeting}>{getGreeting(t)},</Text>
            <Text style={stylesheet.userName}>{profile?.name || "User"}!</Text>
            <Text style={stylesheet.date}>{getCurrentDate()}</Text>
          </View>

          <View style={stylesheet.headerRight}>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              {profile?.image ? (
                <Image
                  source={{ uri: profile.image }}
                  style={stylesheet.avatarImg}
                />
              ) : (
                <View style={stylesheet.avatar}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {profile?.name?.substring(0, 2) || "U"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats Grid ── */}
        <View style={stylesheet.statsGrid}>
          {STATS.map((s, i) => (
            <View
              key={i}
              style={[stylesheet.statCard, { backgroundColor: s.bg }]}
            >
              <View style={stylesheet.statTop}>
                <Text style={stylesheet.statLabel}>{s.label}</Text>
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
                    style={stylesheet.statIconImg}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={[stylesheet.statValue, { color: s.color }]}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Current Class Card ── */}
        <View style={stylesheet.currentCard}>
          <View style={stylesheet.currentCardTop}>
            <View>
              <Text style={stylesheet.currentTitle}>
                {t("dashboard.currentClass")}
              </Text>
              <Text style={stylesheet.currentSub}>
                {currentClass ? t("dashboard.inProgress") : t("dashboard.noClass")}
              </Text>
            </View>
            <View style={stylesheet.currentIconBox}>
              <Text style={stylesheet.currentIcon}>🕐</Text>
            </View>
          </View>
          {currentClass ? (
            <>
              <Text style={stylesheet.subjectName}>{currentClass.name}</Text>
              <Text style={stylesheet.classInfo}>
                {currentClass.startTime} - {currentClass.endTime}{" "}
                {currentClass.building} {currentClass.room}
              </Text>
              <TouchableOpacity
                style={stylesheet.recordBtn}
                onPress={() => router.push("/attendance")}
              >
                <Text style={stylesheet.recordBtnText}>
                  ✓ {t("dashboard.recordAttendance")}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={stylesheet.subjectName}>{t("dashboard.freeTime")}</Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


const stylesheet = StyleSheet.create((theme) => ({
  safe: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  scroll: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    width: "47%",
  },
  greeting: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: theme.colors.textSecondary 
  },
  userName: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: theme.colors.text, 
    marginTop: 2 
  },
  date: { 
    fontSize: 12, 
    color: theme.colors.textSecondary, 
    marginTop: 4 
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
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
  statLabel: { 
    fontSize: 12, 
    color: theme.colors.textSecondary, 
    maxWidth: "70%" 
  },
  statIconImg: { 
    width: 22, 
    height: 22 
  },
  statValue: { 
    fontSize: 28, 
    fontWeight: "800" 
  },
  currentCard: {
    backgroundColor: theme.colors.primary,
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
  currentTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#fff" 
  },
  currentSub: { 
    fontSize: 12, 
    color: "#ffffffaa", 
    marginTop: 2 
  },
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
  classInfo: { 
    fontSize: 12, 
    color: "#ffffffcc", 
    marginBottom: 18 
  },
  recordBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  recordBtnText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
}));
