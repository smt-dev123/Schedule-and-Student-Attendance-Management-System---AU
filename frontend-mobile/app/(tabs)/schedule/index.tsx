import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesheet } from "./schedule.style";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/lib/auth-client";
import { getCourses } from "@/api/CourseAPI";
import { getMySchedule } from "@/api/SchedulesAPI";
import type { CoursesType } from "@/types";

const DAY_MAP: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
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
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "";

  const [refDate, setRefDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CoursesType[]>([]);

  const weekDates = getWeekDates(refDate);
  const selectedDateKey = toKey(refDate);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (role === "student") {
          const res = await getMySchedule();
          if (res && res.courses) {
            setCourses(res.courses);
          }
        } else {
          const res = await getCourses();
          if (res && res.data) {
            setCourses(res.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchData();
    }
  }, [role]);

  const classesForDay = useMemo(() => {
    const dayName = DAY_MAP[refDate.getDay()];
    return courses
      .filter((c) => c.day === dayName)
      .map((c) => {
        const schedule = c.schedule;
        const sessionTime = schedule?.sessionTime;
        // In this system, day usually maps to a shift.
        // We need to decide if it's first or second session.
        // For simplicity, we can show both if they are defined.
        return {
          title: c.name,
          room: schedule?.classroom?.name || "N/A",
          batch: `${schedule?.academicLevel?.level || ""} Y${schedule?.year || ""} S${schedule?.semester || ""}`,
          color: "#3B82F6",
          start: sessionTime?.firstSessionStartTime || "00:00",
          end: sessionTime?.secondSessionEndTime || "00:00",
          faculty: schedule?.faculty?.name,
          department: schedule?.department?.name,
        };
      });
  }, [courses, refDate]);

  const changeWeek = (offset: number) => {
    const newDate = new Date(refDate);
    newDate.setDate(refDate.getDate() + offset);
    setRefDate(newDate);
  };

  return (
    <SafeAreaView style={stylesheet.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Lecture Schedule" showBack />

      <View style={stylesheet.calendarContainer}>
        <View style={stylesheet.monthRow}>
          <Text style={stylesheet.monthText}>
            {refDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <View style={stylesheet.navGroup}>
            <TouchableOpacity
              onPress={() => changeWeek(-7)}
              style={stylesheet.navIcon}
            >
              <Ionicons name="chevron-back" size={18} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeWeek(7)}
              style={stylesheet.navIcon}
            >
              <Ionicons name="chevron-forward" size={18} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={stylesheet.dateBar}>
          {weekDates.map((date, i) => {
            const isSelected = toKey(date) === selectedDateKey;
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            return (
              <TouchableOpacity
                key={i}
                style={[
                  stylesheet.dateCard,
                  isSelected && stylesheet.dateCardActive,
                ]}
                onPress={() => setRefDate(new Date(date))}
              >
                <Text
                  style={[
                    stylesheet.dateDay,
                    isSelected && stylesheet.textWhite,
                  ]}
                >
                  {days[i]}
                </Text>
                <Text
                  style={[
                    stylesheet.dateNum,
                    isSelected && stylesheet.textWhite,
                  ]}
                >
                  {date.getDate()}
                </Text>
                {isSelected && <View style={stylesheet.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={stylesheet.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={stylesheet.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={stylesheet.loadingText}>Loading schedule...</Text>
          </View>
        ) : classesForDay.length > 0 ? (
          classesForDay.map((item, index) => (
            <View key={index} style={stylesheet.classItem}>
              <View style={stylesheet.timeSide}>
                <Text style={stylesheet.startTime}>{item.start}</Text>
                <View
                  style={[
                    stylesheet.verticalLine,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={stylesheet.endTime}>{item.end}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[stylesheet.mainCard, { borderLeftColor: item.color }]}
              >
                <View style={stylesheet.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={stylesheet.classTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={stylesheet.batchSubText}>
                      Batch/Group: {item.batch}
                    </Text>
                  </View>
                  <View
                    style={[
                      stylesheet.statusBadge,
                      { backgroundColor: item.color + "15" },
                    ]}
                  >
                    <Text
                      style={[stylesheet.statusText, { color: item.color }]}
                    >
                      Active
                    </Text>
                  </View>
                </View>

                <View style={stylesheet.cardFooter}>
                  <View style={stylesheet.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={stylesheet.infoText}>{item.room}</Text>
                  </View>
                  <View style={[stylesheet.infoRow, { marginLeft: "auto" }]}>
                    <Ionicons name="school-outline" size={14} color="#64748B" />
                    <Text style={stylesheet.infoText}>{item.department}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={stylesheet.emptyContainer}>
            <View style={stylesheet.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={50} color="#CBD5E1" />
            </View>
            <Text style={stylesheet.emptyTitle}>No Schedule</Text>
            <Text style={stylesheet.emptySubText}>
              You have no lectures scheduled for today.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
