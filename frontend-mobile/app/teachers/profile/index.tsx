import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE = require("@/assets/icons/user.png");

const STORAGE_KEY = "teacher_profile";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: "Mr. Seung Sreang",
    phone: "+855 12 345 678",
    email: "sreang@university.edu",
    address: "123 University Ave, PP",
    dob: "March 15, 1985",
    photoUri: null as string | null,
  });

  // ✅ Reload data រាល់ពេល screen focus (បន្ទាប់ពី edit)
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved) {
            const data = JSON.parse(saved);
            setProfile((prev) => ({ ...prev, ...data }));
          }
        } catch (e) {
          console.log("Load error:", e);
        }
      };
      loadProfile();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert("ចាកចេញ", "តើអ្នកពិតជាចង់ចាកចេញ?", [
      { text: "បោះបង់", style: "cancel" },
      {
        text: "ចាកចេញ",
        style: "destructive",
        onPress: () => router.replace("/(auth)"),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push("/teachers/dashboard")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={
              profile.photoUri ? { uri: profile.photoUri } : PLACEHOLDER_IMAGE
            }
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>{profile.fullName}</Text>
        <Text style={styles.userRole}>Associate Professor</Text>
      </View>

      {/* Basic Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={24} color="#00529B" />
          <Text style={styles.cardTitle}>Basic Information</Text>
        </View>
        <InfoRow label="Full Name" value={profile.fullName} />
        <InfoRow label="Date of Birth" value={profile.dob} />
        <InfoRow label="Employee ID" value="EMP-2023001" />
      </View>

      {/* Contact Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="call-outline" size={24} color="#00529B" />
          <Text style={styles.cardTitle}>Contact Information</Text>
        </View>
        <InfoRow label="Phone" value={profile.phone} />
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Address" value={profile.address} />
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.btnEdit}
        onPress={() => router.push("/(teacher)/edit-profile")}
      >
        <Text style={styles.btnEditText}> Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  profileHeader: {
    backgroundColor: "#00529B",
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarFallbackText: { fontSize: 40, fontWeight: "bold", color: "#00529B" },
  userName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  userRole: { color: "#E0E0E0", fontSize: 14, marginTop: 5 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#00529B" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: { color: "#888", fontSize: 14 },
  value: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  btnEdit: {
    backgroundColor: "#00529B",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnEditText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F44336",
    alignItems: "center",
  },
  logoutText: { color: "#F44336", fontWeight: "bold" },
});
