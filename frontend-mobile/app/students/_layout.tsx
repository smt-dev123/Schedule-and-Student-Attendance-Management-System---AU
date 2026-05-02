import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const ICONS = {
  home: require("@/assets/icons/home.png"),
  schedule: require("@/assets/icons/Schedoule.png"),
  attendance: require("@/assets/icons/attendance.png"),
  user: require("@/assets/icons/user.png"),
  notification: require("@/assets/icons/notification.png"),
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

export default function StudentLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={ICONS.home} label="Home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
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
        name="attendance"
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
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={ICONS.user} label="Profile" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={ICONS.notification}
              label="notification"
              focused={focused}
            />
          ),
        }}
      />

      {/* Hidden from tab bar - លាក់ Route មិនឱ្យបង្ហាញលើ Tab */}
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="course-details" options={{ href: null }} />
      <Tabs.Screen name="grades" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="attendance-detail" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    height: 70, // បង្កើនកម្ពស់បន្តិចឱ្យស្រឡះ
    paddingBottom: 12,
    paddingTop: 10,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: { width: 22, height: 22 },
  label: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "500",
  },
  labelFocused: { color: "#2563EB", fontWeight: "700" },
});
