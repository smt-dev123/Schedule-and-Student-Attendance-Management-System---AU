import "@/styles/unistyles";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Status = "present" | "absent" | "late" | null;

interface Student {
  id: string;
  name: string;
  class: string;
  status: Status;
}

const ATTENDANCE_HISTORY_KEY = "teacher_attendance_history";

const initialStudents: Student[] = [
  { id: "STU001", name: "Emma Wilson", class: "Year 4", status: null },
  { id: "STU002", name: "Michael Chen", class: "Year 4", status: null },
  { id: "STU003", name: "Sara Nguyen", class: "Year 4", status: null },
  { id: "STU004", name: "James Park", class: "Year 4", status: null },
  { id: "STU005", name: "Lily Pham", class: "Year 4", status: null },
  { id: "STU006", name: "David Kim", class: "Year 4", status: null },
  { id: "STU007", name: "Anna Sok", class: "Year 4", status: null },
  { id: "STU008", name: "Tom Rath", class: "Year 4", status: null },
];

export default function AttendanceScreen() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const { theme } = useUnistyles();

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, students],
  );

  const setStatus = (id: string, status: Status) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === status ? null : status } : s,
      ),
    );
    setSaved(false);
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "present" })));
    setSaved(false);
  };

  const clearAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: null })));
    setSaved(false);
  };

  const handleSaveAttendance = async () => {
    const now = new Date();
    const session = {
      id: `session-${now.getTime()}`,
      date: now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      students: students.map((s) => ({ ...s })),
    };

    try {
      const existing = await AsyncStorage.getItem(ATTENDANCE_HISTORY_KEY);
      const history = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem(
        ATTENDANCE_HISTORY_KEY,
        JSON.stringify([session, ...history]),
      );
      setSaved(true);
    } catch (error) {
      console.error("Failed to save attendance history", error);
    }
  };

  const total = students.length;
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const late = students.filter((s) => s.status === "late").length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={stylesheet.safe}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title={t("attendance.recordTitle") || "Attendance"} showBack />
      <ScrollView style={stylesheet.container} showsVerticalScrollIndicator={false}>
        <View style={stylesheet.header}>
          <View style={stylesheet.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={stylesheet.className}>
                Mobile App Development - Year 4
              </Text>
            </View>
          </View>
          <View style={stylesheet.headerDateRow}>
            <Text style={stylesheet.dateText}>Record attendance for {dateStr}</Text>
            <Text style={stylesheet.timeText}>{timeStr}</Text>
          </View>
        </View>

        <View style={stylesheet.searchBox}>
          <Ionicons
            name="search-outline"
            size={16}
            color={theme.colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={stylesheet.searchInput}
            placeholder="Search students by name or ID..."
            placeholderTextColor={theme.colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={stylesheet.actionRow}>
          <TouchableOpacity style={stylesheet.btnPresent} onPress={markAllPresent}>
            <Ionicons name="checkmark" size={16} color={theme.colors.success} />
            <Text style={stylesheet.btnPresentText}>Mark All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesheet.btnClear} onPress={clearAll}>
            <Ionicons name="close" size={16} color={theme.colors.error} />
            <Text style={stylesheet.btnClearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={stylesheet.card}>
          <Text style={stylesheet.cardTitle}>Student List</Text>
          {filtered.length === 0 ? (
            <View style={stylesheet.noResult}>
              <Text style={stylesheet.noResultText}>
                No students matched your search.
              </Text>
            </View>
          ) : (
            filtered.map((student, index) => (
              <View key={student.id}>
                {index > 0 && <View style={stylesheet.divider} />}
                <View style={stylesheet.studentRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={stylesheet.studentName}>{student.name}</Text>
                    <Text style={stylesheet.studentMeta}>
                      ID: {student.id} Year: {student.class}
                    </Text>
                    <View style={stylesheet.statusRow}>
                      {(["present", "absent", "late"] as Status[]).map((s) => (
                        <TouchableOpacity
                          key={s as string}
                          style={stylesheet.checkItem}
                          onPress={() => setStatus(student.id, s)}
                        >
                          <View
                            style={[
                              stylesheet.checkbox,
                              student.status === s &&
                                (s === "present"
                                  ? stylesheet.checkPresent
                                  : s === "absent"
                                    ? stylesheet.checkAbsent
                                    : stylesheet.checkLate),
                            ]}
                          >
                            {student.status === s && (
                              <Ionicons
                                name="checkmark"
                                size={11}
                                color="white"
                              />
                            )}
                          </View>
                          <Text style={stylesheet.checkLabel}>
                            {s === "present"
                              ? "Present"
                              : s === "absent"
                                ? "Absent"
                                : "Late"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={stylesheet.card}>
          <Text style={stylesheet.cardTitle}>Attendance Summary</Text>
          <View style={stylesheet.summaryGrid}>
            <View style={stylesheet.summaryItem}>
              <Text style={[stylesheet.summaryNum, { color: theme.colors.primary }]}>
                {total}
              </Text>
              <Text style={stylesheet.summaryLabel}>Total Students</Text>
            </View>
            <View style={stylesheet.summaryItem}>
              <Text style={[stylesheet.summaryNum, { color: theme.colors.success }]}>
                {present}
              </Text>
              <Text style={stylesheet.summaryLabel}>Present</Text>
            </View>
            <View style={stylesheet.summaryItem}>
              <Text style={[stylesheet.summaryNum, { color: theme.colors.error }]}>
                {absent}
              </Text>
              <Text style={stylesheet.summaryLabel}>Absent</Text>
            </View>
            <View style={stylesheet.summaryItem}>
              <Text style={[stylesheet.summaryNum, { color: theme.colors.warning }]}>
                {late}
              </Text>
              <Text style={stylesheet.summaryLabel}>Late</Text>
            </View>
          </View>
          <View style={stylesheet.rateDivider} />
          <View style={stylesheet.rateRow}>
            <Text style={stylesheet.rateLabel}>Attendance Rate</Text>
            <Text
              style={[
                stylesheet.rateValue,
                { color: rate >= 80 ? theme.colors.success : theme.colors.error },
              ]}
            >
              {rate}%
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={stylesheet.historyBtn}
          onPress={() => router.push("/(tabs)/attendance/attendance-history")}
        >
          <Text style={stylesheet.historyBtnText}>Record History</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[stylesheet.saveBtn, saved && stylesheet.saveBtnDone]}
          onPress={handleSaveAttendance}
        >
          <Ionicons
            name={saved ? "checkmark-circle" : "checkmark-circle-outline"}
            size={18}
            color="white"
          />
          <Text style={stylesheet.saveBtnText}>
            {saved ? "Attendance Saved!" : "Save Attendance"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  safe: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  container: { 
    flex: 1 
  },
  header: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  headerTop: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  className: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: theme.colors.text 
  },
  headerDateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { 
    fontSize: 12, 
    color: theme.colors.textSecondary, 
    flex: 1 
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.error,
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 14, 
    color: theme.colors.text 
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  btnPresent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.success + "22",
    borderRadius: 10,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: theme.colors.success + "55",
  },
  btnPresentText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: theme.colors.success 
  },
  btnClear: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.error + "22",
    borderRadius: 10,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: theme.colors.error + "55",
  },
  btnClearText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: theme.colors.error 
  },
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
  },
  divider: { 
    height: 0.5, 
    backgroundColor: theme.colors.border, 
    marginVertical: 10 
  },
  noResult: { 
    paddingVertical: 24, 
    alignItems: "center" 
  },
  noResultText: { 
    color: theme.colors.textSecondary, 
    fontSize: 13 
  },
  studentRow: { 
    flexDirection: "row" 
  },
  studentName: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: theme.colors.text 
  },
  studentMeta: { 
    fontSize: 11, 
    color: theme.colors.textSecondary, 
    marginTop: 2 
  },
  statusRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
    alignItems: "center",
  },
  checkItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 5 
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkPresent: { 
    backgroundColor: theme.colors.success, 
    borderColor: theme.colors.success 
  },
  checkAbsent: { 
    backgroundColor: theme.colors.error, 
    borderColor: theme.colors.error 
  },
  checkLate: { 
    backgroundColor: theme.colors.warning, 
    borderColor: theme.colors.warning 
  },
  checkLabel: { 
    fontSize: 12, 
    color: theme.colors.text 
  },
  summaryGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8 
  },
  summaryItem: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  summaryNum: { 
    fontSize: 28, 
    fontWeight: "700" 
  },
  summaryLabel: { 
    fontSize: 11, 
    color: theme.colors.textSecondary, 
    marginTop: 2 
  },
  rateDivider: { 
    height: 0.5, 
    backgroundColor: theme.colors.border, 
    marginVertical: 12 
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: { 
    fontSize: 13, 
    color: theme.colors.textSecondary 
  },
  rateValue: { 
    fontSize: 15, 
    fontWeight: "700" 
  },
  saveBtn: {
    marginHorizontal: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnDone: { 
    backgroundColor: theme.colors.success 
  },
  saveBtnText: { 
    color: "white", 
    fontSize: 15, 
    fontWeight: "700" 
  },
  historyBtn: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  historyBtnText: {
    flex: 1,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
}));
