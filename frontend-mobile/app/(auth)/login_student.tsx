import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "@/src/components/ui/CustomInput";
import { Colors } from "@/src/constants/theme";
import { loginStudent } from "@/src/services/authService";

export default function StudentLogin() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      setError("សូមបំពេញអត្តលេខ និង លេខសម្ងាត់");
      return;
    }
    setError("");
    setLoading(true);

    const result = await loginStudent(studentId.trim(), password);
    setLoading(false);
    if (result.success) {
      router.replace("/students/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("@/assets/images/image.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.titleKh}>សម្រាប់និស្សិត</Text>
                <Text style={styles.titleEn}>STUDENT PORTAL</Text>
              </View>

              <View style={styles.formCard}>
                <CustomInput
                  label="អត្តលេខនិស្សិត / Student ID"
                  placeholder="ឧទាហរណ៍: S001"
                  value={studentId}
                  onChangeText={(text) => {
                    setStudentId(text);
                    setError("");
                  }}
                  autoCapitalize="characters"
                />

                <CustomInput
                  label="លេខសម្ងាត់ / Password"
                  placeholder="បញ្ចូលលេខសម្ងាត់"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                />

                {error !== "" && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                  </View>
                )}

                {/* ✅ បន្ថែមជួរ Remember Me & Forgot Password */}
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    style={styles.rememberMe}
                    activeOpacity={0.7}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && {
                          backgroundColor: Colors?.primary || "#007AFF",
                          borderColor: Colors?.primary || "#007AFF",
                        },
                      ]}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.rememberText}>ចងចាំខ្ញុំ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.forgotPass}>
                    <Text
                      style={[
                        styles.forgotText,
                        { color: Colors?.primary || "#007AFF" },
                      ]}
                    >
                      ភ្លេចលេខសម្ងាត់?
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginBtn,
                    { backgroundColor: Colors?.primary || "#007AFF" },
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginBtnText}>ចូលប្រព័ន្ធ</Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Text style={styles.backText}>← ត្រឡប់ក្រោយ</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 30, 80, 0.55)",
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

  // ✅ Styles ថ្មីសម្រាប់ Row Actions
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
});
