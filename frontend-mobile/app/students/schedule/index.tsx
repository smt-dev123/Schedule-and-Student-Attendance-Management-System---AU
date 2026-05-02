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

import { ScreenHeader } from "@/src/components/ui/ScreenHeader";

const DAYS = [
  { day: "Mon", date: "24" },
  { day: "Tue", date: "25", active: true },
  { day: "Wed", date: "26" },
  { day: "Thu", date: "27" },
  { day: "Fri", date: "28" },
  { day: "Sat", date: "29" },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "01:00",
  "02:00",
  "03:00",
];

export default function StudentSchedule() {
  const router = useRouter();

  const handleEventPress = (courseName: string) => {
    console.log(`Opening details for: ${courseName}`);
    router.push("/course-details");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="Schedule"
        showBack={true}
        rightAction={
          <TouchableOpacity style={styles.calendarBtn}>
            <Ionicons name="filter-outline" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      {/* Date Picker */}
      <View style={styles.headerCard}>
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>April 2026</Text>
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </View>
        </View>

        <View style={styles.daysRow}>
          {DAYS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayItem, item.active && styles.activeDay]}
            >
              <Text style={[styles.dayText, item.active && styles.activeText]}>
                {item.day}
              </Text>
              <Text style={[styles.dateText, item.active && styles.activeText]}>
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Schedule Timeline */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TIME_SLOTS.map((time) => (
          <View key={time} style={styles.timeRow}>
            {/* Time Label */}
            <Text style={styles.timeLabel}>{time}</Text>

            {/* Vertical Line */}
            <View style={styles.verticalLine} />

            {/* Events for this time slot */}
            {time === "08:00" && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.eventCard}
                onPress={() => handleEventPress("Mobile App Development")}
              >
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>Mobile App Development</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#2563EB" />
                    <Text style={styles.eventLocation}>Room: 402, Lab 02</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#2563EB33" />
              </TouchableOpacity>
            )}

            {time === "01:00" && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.eventCard, styles.eventCardOrange]}
                onPress={() => handleEventPress("Cloud Computing")}
              >
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, styles.textOrange]}>
                    Cloud Computing
                  </Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#FF9800" />
                    <Text style={styles.eventLocation}>
                      Room: A-102 (Theory)
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FF980033" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  calendarBtn: {
    padding: 4,
  },

  // Header Card
  headerCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  monthText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  todayBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  todayText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 12,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayItem: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 18,
    width: 52,
  },

  activeDay: {
    backgroundColor: "#2563EB",
  },

  dayText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  dateText: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
    color: "#4B5563",
  },

  activeText: {
    color: "#fff",
  },

  // Scroll Content
  scrollContent: {
    padding: 25,
    paddingTop: 15,
  },

  // Time Row
  timeRow: {
    flexDirection: "row",
    height: 110,
    alignItems: "flex-start",
    position: "relative",
  },

  timeLabel: {
    width: 55,
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 2,
  },

  verticalLine: {
    position: "absolute",
    left: 55,
    top: 12,
    bottom: 0,
    width: 2,
    backgroundColor: "#F3F4F6",
  },

  // Event Card
  eventCard: {
    position: "absolute",
    left: 72,
    right: 0,
    top: 0,
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  eventCardOrange: {
    backgroundColor: "#FFF7ED",
    borderLeftColor: "#FF9800",
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    fontWeight: "800",
    color: "#1E40AF",
    fontSize: 15.5,
  },

  textOrange: {
    color: "#9A3412",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  eventLocation: {
    fontSize: 12.5,
    color: "#6B7280",
    marginLeft: 5,
    fontWeight: "500",
  },
});
