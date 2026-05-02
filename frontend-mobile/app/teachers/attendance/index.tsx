import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Attendance" showBack />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.className}>
                Mobile App Development - Year 4
              </Text>
            </View>
          </View>
          <View style={styles.headerDateRow}>
            <Text style={styles.dateText}>Record attendance for {dateStr}</Text>
            <Text style={styles.timeText}>{timeStr}</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={16}
            color="#aaa"
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students by name or ID..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnPresent} onPress={markAllPresent}>
            <Ionicons name="checkmark" size={16} color="#1D9E75" />
            <Text style={styles.btnPresentText}>Mark All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnClear} onPress={clearAll}>
            <Ionicons name="close" size={16} color="#E24B4A" />
            <Text style={styles.btnClearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student List</Text>
          {filtered.length === 0 ? (
            <View style={styles.noResult}>
              <Text style={styles.noResultText}>
                No students matched your search.
              </Text>
            </View>
          ) : (
            filtered.map((student, index) => (
              <View key={student.id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.studentRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentMeta}>
                      ID: {student.id} Year: {student.class}
                    </Text>
                    <View style={styles.statusRow}>
                      {(["present", "absent", "late"] as Status[]).map((s) => (
                        <TouchableOpacity
                          key={s as string}
                          style={styles.checkItem}
                          onPress={() => setStatus(student.id, s)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              student.status === s &&
                                (s === "present"
                                  ? styles.checkPresent
                                  : s === "absent"
                                    ? styles.checkAbsent
                                    : styles.checkLate),
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
                          <Text style={styles.checkLabel}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: "#185FA5" }]}>
                {total}
              </Text>
              <Text style={styles.summaryLabel}>Total Students</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: "#1D9E75" }]}>
                {present}
              </Text>
              <Text style={styles.summaryLabel}>Present</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: "#E24B4A" }]}>
                {absent}
              </Text>
              <Text style={styles.summaryLabel}>Absent</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: "#BA7517" }]}>
                {late}
              </Text>
              <Text style={styles.summaryLabel}>Late</Text>
            </View>
          </View>
          <View style={styles.rateDivider} />
          {/* កែប្រែពី <div> មកជា <View> វិញដើម្បីដោះស្រាយ Error */}
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Attendance Rate</Text>
            <Text
              style={[
                styles.rateValue,
                { color: rate >= 80 ? "#1D9E75" : "#E24B4A" },
              ]}
            >
              {rate}%
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.push("/(teacher)/attendance-history")}
        >
          <Text style={styles.historyBtnText}>Record History</Text>
          <Ionicons name="chevron-forward" size={18} color="#00529B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnDone]}
          onPress={handleSaveAttendance}
        >
          <Ionicons
            name={saved ? "checkmark-circle" : "checkmark-circle-outline"}
            size={18}
            color="white"
          />
          <Text style={styles.saveBtnText}>
            {saved ? "Attendance Saved!" : "Save Attendance"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },
  container: { flex: 1 },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  className: { fontSize: 18, fontWeight: "700", color: "#111" },
  headerDateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontSize: 12, color: "#888", flex: 1 },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E24B4A",
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: "#E5E5E5",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
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
    backgroundColor: "#EAF3DE",
    borderRadius: 10,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: "#9FE1CB",
  },
  btnPresentText: { fontSize: 13, fontWeight: "600", color: "#1D9E75" },
  btnClear: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FCEBEB",
    borderRadius: 10,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: "#F7C1C1",
  },
  btnClearText: { fontSize: 13, fontWeight: "600", color: "#E24B4A" },
  card: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#EBEBEB",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  divider: { height: 0.5, backgroundColor: "#F0F0F0", marginVertical: 10 },
  noResult: { paddingVertical: 24, alignItems: "center" },
  noResultText: { color: "#888", fontSize: 13 },
  studentRow: { flexDirection: "row" },
  studentName: { fontSize: 15, fontWeight: "600", color: "#111" },
  studentMeta: { fontSize: 11, color: "#aaa", marginTop: 2 },
  statusRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
    alignItems: "center",
  },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkPresent: { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
  checkAbsent: { backgroundColor: "#E24B4A", borderColor: "#E24B4A" },
  checkLate: { backgroundColor: "#BA7517", borderColor: "#BA7517" },
  checkLabel: { fontSize: 12, color: "#555" },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  summaryItem: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  summaryNum: { fontSize: 28, fontWeight: "700" },
  summaryLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  rateDivider: { height: 0.5, backgroundColor: "#F0F0F0", marginVertical: 12 },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: { fontSize: 13, color: "#888" },
  rateValue: { fontSize: 15, fontWeight: "700" },
  saveBtn: {
    marginHorizontal: 12,
    backgroundColor: "#00529B",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnDone: { backgroundColor: "#1D9E75" },
  saveBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  historyBtn: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#00529B",
  },
  historyBtnText: {
    flex: 1,
    color: "#00529B",
    fontSize: 14,
    fontWeight: "600",
  },
});
