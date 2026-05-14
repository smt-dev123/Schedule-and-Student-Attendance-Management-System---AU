import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const ICONS = {
  home: require("../../assets/images/icons/home.png"),
  schedule: require("../../assets/images/icons/Schedoule.png"),
  attendance: require("../../assets/images/icons/attendance.png"),
  user: require("../../assets/images/icons/user.png"),
  Notification: require("../../assets/images/icons/notification.png"),
};

function TabIcon({
  source,
  label,
  focused,
}: {
  source: any;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      <Image
        source={source}
        style={[styles.icon, { tintColor: focused ? "#2563EB" : "#aaa" }]}
        resizeMode="contain"
      />
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
}

export default function TeacherLayout() {
  return (
    <Tabs
      initialRouteName="dashboard/index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={ICONS.home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={ICONS.schedule}
              label="Schedule"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={ICONS.attendance}
              label="Attendance"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={ICONS.Notification}
              label="Notifications"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={ICONS.user} label="Profile" focused={focused} />
          ),
        }}
      />

      {/* Hidden from tab bar */}
      <Tabs.Screen
        name="attendance/attendance-history"
        options={{ href: null }}
      />
      <Tabs.Screen name="profile/settings" options={{ href: null }} />
      <Tabs.Screen name="profile/edit-profile" options={{ href: null }} />

      {/* Deprecated/Old routes cleanup */}
      <Tabs.Screen name="record-attendance" options={{ href: null }} />
      <Tabs.Screen name="attendance-history" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  icon: { width: 24, height: 24 },
  label: {
    fontSize: 10,
    color: "#aaa",
    textAlign: "center",
    maxWidth: 72,
  },
  labelFocused: { color: "#2563EB", fontWeight: "700" },
});
