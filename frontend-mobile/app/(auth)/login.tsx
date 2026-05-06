import "@/styles/unistyles";
import CustomInput from "@/components/ui/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REMEMBER_ME_KEY = "remember_user_id";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useUnistyles();
  
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadSavedId = async () => {
      try {
        const savedId = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (savedId) {
          setUserId(savedId);
          setRememberMe(true);
        }
      } catch (err) {
        console.log("Error loading saved ID", err);
      }
    };
    loadSavedId();
  }, []);

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      setError(t("login.errorEmpty") || "សូមបំពេញអត្តលេខ និង លេខសម្ងាត់");
      return;
    }
    
    setLoading(true);
    try {
      // For now, simulate success
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, userId.trim());
      } else {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      setError("មានបញ្ហាបច្ចេកទេស");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={stylesheet.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("@/assets/images/image.png")}
        style={stylesheet.bgImage}
        resizeMode="cover"
      >
        <View style={stylesheet.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={stylesheet.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={stylesheet.header}>
                <View style={stylesheet.logoWrapper}>
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={stylesheet.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={stylesheet.titleKh}>{t("login.title") || "ចូលប្រើប្រាស់"}</Text>
                <Text style={stylesheet.titleEn}>USER LOGIN</Text>
              </View>

              <View style={stylesheet.formCard}>
                <CustomInput
                  label={t("login.userId") || "អត្តលេខ / User ID"}
                  placeholder={t("login.idPlaceholder") || "ឧទាហរណ៍: 001"}
                  value={userId}
                  onChangeText={(text) => {
                    setUserId(text);
                    setError("");
                  }}
                  autoCapitalize="characters"
                />

                <CustomInput
                  label={t("login.password") || "លេខសម្ងាត់ / Password"}
                  placeholder={t("login.password") || "បញ្ចូលលេខសម្ងាត់"}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                />

                {error !== "" && (
                  <View style={stylesheet.errorBox}>
                    <Text style={stylesheet.errorText}>⚠️ {error}</Text>
                  </View>
                )}

                {/* ✅ បន្ថែមជួរ Remember Me & Forgot Password */}
                <View style={stylesheet.rowActions}>
                  <TouchableOpacity
                    style={stylesheet.rememberMe}
                    activeOpacity={0.7}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      style={[
                        stylesheet.checkbox,
                        rememberMe && {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.primary,
                        },
                      ]}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      )}
                    </View>
                    <Text style={stylesheet.rememberText}>
                      {t("login.rememberMe") || "ចងចាំខ្ញុំ"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={stylesheet.forgotPass}>
                    <Text
                      style={[stylesheet.forgotText, { color: theme.colors.primary }]}
                    >
                      {t("login.forgotPassword")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    stylesheet.loginBtn,
                    { backgroundColor: theme.colors.primary },
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={stylesheet.loginBtnText}>
                      {t("login.loginBtn")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                style={stylesheet.backBtn}
              >
                <Text style={stylesheet.backText}>{t("login.back")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  container: { flex: 1 },
  bgImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 30 },
  logoWrapper: {
    backgroundColor: "#fff",
    borderRadius: 60,
    padding: 5,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logo: { width: 100, height: 100 },
  titleKh: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  titleEn: {
    fontSize: 14,
    color: "#eee",
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  errorBox: {
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
  },
  errorText: { color: "#CC0000", fontSize: 13, textAlign: "center" },

  rowActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  rememberText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  forgotPass: { alignSelf: "center" },
  forgotText: { fontSize: 13, fontWeight: "600" },

  loginBtn: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#aaaaaa", fontSize: 15, fontWeight: "500" },
}));
