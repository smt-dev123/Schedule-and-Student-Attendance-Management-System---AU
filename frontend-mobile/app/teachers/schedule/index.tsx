import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// ប្រើ SafeAreaView ពីទីនេះដើម្បីបាត់ Warning
import { SafeAreaView } from "react-native-safe-area-context";

const CLASSES: Record<string, any[]> = {
  "2026-03-23": [
    {
      title: "Mobile App Development",
      room: "Room 402 (Bld A)",
      batch: "Y3-S1 (G1)",
      color: "#3B82F6",
      start: "07:30",
      end: "09:45",
    },
    {
      title: "Advanced C# & .NET",
      room: "Lab 05",
      batch: "Y4-S2 (G2)",
      color: "#3B82F6",
      start: "09:45",
      end: "11:00",
    },
    {
      title: "UI/UX Design",
      room: "Design Studio",
      batch: "Y1-S2 (G1)",
      color: "#3B82F6",
      start: "18:00",
      end: "19:30",
    },
    {
      title: "C# Programming",
      room: "Design Studio",
      batch: "Y1-S2 (G1)",
      color: "#3B82F6",
      start: "19:30",
      end: "21:00",
    },
  ],
  "2026-03-24": [
    {
      title: "Network Security",
      room: "Auditorium 1",
      batch: "Y2-S2 (All)",
      color: "#3B82F6",
      start: "09:00",
      end: "11:30",
    },
  ],
  "2026-03-25": [
    {
      title: "Database Systems",
      room: "Lab 02",
      batch: "Y2-S1 (G3)",
      color: "#3B82F6",
      start: "08:00",
      end: "10:30",
    },
  ],
};

function getWeekDates(refDate: Date) {
  const day = refDate.getDay();
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() - ((day + 6) % 7));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ScheduleScreen() {
  const [refDate, setRefDate] = useState(new Date("2026-03-23"));
  const weekDates = getWeekDates(refDate);
  const selectedDateKey = toKey(refDate);
  const classesForDay = CLASSES[selectedDateKey] || [];

  const changeWeek = (offset: number) => {
    const newDate = new Date(refDate);
    newDate.setDate(refDate.getDate() + offset);
    setRefDate(newDate);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Lecture Schedule" showBack />

      <View style={styles.calendarContainer}>
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>
            {refDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <View style={styles.navGroup}>
            <TouchableOpacity
              onPress={() => changeWeek(-7)}
              style={styles.navIcon}
            >
              <Ionicons name="chevron-back" size={18} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeWeek(7)}
              style={styles.navIcon}
            >
              <Ionicons name="chevron-forward" size={18} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateBar}>
          {weekDates.map((date, i) => {
            const isSelected = toKey(date) === selectedDateKey;
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dateCard, isSelected && styles.dateCardActive]}
                onPress={() => setRefDate(new Date(date))}
              >
                <Text style={[styles.dateDay, isSelected && styles.textWhite]}>
                  {days[i]}
                </Text>
                <Text style={[styles.dateNum, isSelected && styles.textWhite]}>
                  {date.getDate()}
                </Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {classesForDay.length > 0 ? (
          classesForDay.map((item, index) => (
            <View key={index} style={styles.classItem}>
              <View style={styles.timeSide}>
                <Text style={styles.startTime}>{item.start}</Text>
                <View
                  style={[styles.verticalLine, { backgroundColor: item.color }]}
                />
                <Text style={styles.endTime}>{item.end}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.mainCard, { borderLeftColor: item.color }]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.classTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.batchSubText}>
                      Batch/Group: {item.batch}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.color + "15" },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: item.color }]}>
                      Active
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={styles.infoText}>{item.room}</Text>
                  </View>
                  <View style={[styles.infoRow, { marginLeft: "auto" }]}>
                    <Ionicons name="people-outline" size={14} color="#64748B" />
                    <Text style={styles.infoText}>35 Students</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={50} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No Schedule</Text>
            <Text style={styles.emptySubText}>
              You have no lectures scheduled for today.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  calendarContainer: {
    backgroundColor: "#FFF",
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  monthText: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  navGroup: { flexDirection: "row", gap: 10 }, // កែពី div មក View រួចរាល់
  navIcon: { padding: 8, backgroundColor: "#F1F5F9", borderRadius: 12 },
  dateBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
  },
  dateCard: {
    alignItems: "center",
    paddingVertical: 12,
    width: 62,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
  },
  dateCardActive: { backgroundColor: "#1E293B" },
  dateDay: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "600",
  },
  dateNum: { fontSize: 17, fontWeight: "800", color: "#1E293B" },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFF",
    marginTop: 3,
  },
  textWhite: { color: "#FFF" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  classItem: { flexDirection: "row", marginBottom: 20 },
  timeSide: { width: 55, alignItems: "center", paddingVertical: 4 },
  startTime: { fontSize: 14, fontWeight: "800", color: "#1E293B" },
  endTime: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 6,
    borderRadius: 1,
    opacity: 0.4,
  },
  mainCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 16,
    marginLeft: 12,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 2,
  },
  batchSubText: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "800" },
  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    alignItems: "center",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
