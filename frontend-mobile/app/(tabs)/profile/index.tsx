import "@/styles/unistyles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const PLACEHOLDER_IMAGE = require("@/assets/icons/user.png");

const STORAGE_KEY = "user_profile";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={stylesheet.infoRow}>
    <Text style={stylesheet.label}>{label}</Text>
    <Text style={stylesheet.value}>{value}</Text>
  </View>
);

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useUnistyles();
  const [profile, setProfile] = useState({
    fullName: "Mr. Seung Sreang",
    phone: "+855 12 345 678",
    email: "sreang@university.edu",
    address: "123 University Ave, PP",
    dob: "March 15, 1985",
    photoUri: null as string | null,
  });

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
    Alert.alert(t("dashboard.signOut"), t("dashboard.signOutConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("dashboard.signOut"),
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <ScrollView style={stylesheet.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={stylesheet.profileHeader}>
        <View style={stylesheet.headerTop}>
          <TouchableOpacity
            style={stylesheet.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={stylesheet.avatarContainer}>
          <Image
            source={
              profile.photoUri ? { uri: profile.photoUri } : PLACEHOLDER_IMAGE
            }
            style={stylesheet.avatar}
          />
        </View>
        <Text style={stylesheet.userName}>{profile.fullName}</Text>
        <Text style={stylesheet.userRole}>Associate Professor</Text>
      </View>

      {/* Basic Information */}
      <View style={stylesheet.card}>
        <View style={stylesheet.cardHeader}>
          <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={stylesheet.cardTitle}>{t("profile.basicInfo")}</Text>
        </View>
        <InfoRow label={t("profile.fullName")} value={profile.fullName} />
        <InfoRow label={t("profile.dob")} value={profile.dob} />
        <InfoRow label={t("profile.employeeId")} value="EMP-2023001" />
      </View>

      {/* Contact Information */}
      <View style={stylesheet.card}>
        <View style={stylesheet.cardHeader}>
          <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
          <Text style={stylesheet.cardTitle}>{t("profile.contactInfo")}</Text>
        </View>
        <InfoRow label={t("profile.phone")} value={profile.phone} />
        <InfoRow label={t("profile.email")} value={profile.email} />
        <InfoRow label={t("profile.address")} value={profile.address} />
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={stylesheet.btnEdit}
        onPress={() => router.push("/(tabs)/profile/edit-profile")}
      >
        <Text style={stylesheet.btnEditText}>{t("profile.editProfile")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={stylesheet.logoutBtn} onPress={handleLogout}>
        <Text style={stylesheet.logoutText}>{t("profile.logout")}</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  profileHeader: {
    backgroundColor: theme.colors.primary,
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
  avatarContainer: { 
    position: "relative", 
    marginBottom: 15 
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "bold" 
  },
  userRole: { 
    color: "#E0E0E0", 
    fontSize: 14, 
    marginTop: 5 
  },
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: theme.colors.primary 
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: { 
    color: theme.colors.textSecondary, 
    fontSize: 14 
  },
  value: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  btnEdit: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnEditText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.error,
    alignItems: "center",
  },
  logoutText: { 
    color: theme.colors.error, 
    fontWeight: "bold" 
  },
}));
