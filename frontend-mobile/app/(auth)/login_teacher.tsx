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
import { loginTeacher } from "@/src/services/authService";

export default function TeacherLogin() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!teacherId.trim() || !password.trim()) {
      setError("សូមបំពេញអត្តលេខ និង លេខសម្ងាត់");
      return;
    }
    setError("");
    setLoading(true);
    const result = await loginTeacher(teacherId.trim(), password);
    setLoading(false);
    if (result.success) {
      router.replace("/teachers/dashboard");
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.titleKh}>សម្រាប់គ្រូបង្រៀន</Text>
                <Text style={styles.titleEn}>TEACHER PORTAL</Text>
              </View>

              <View style={styles.formCard}>
                <CustomInput
                  label="អត្តលេខគ្រូ / Teacher ID"
                  placeholder="ឧទាហរណ៍: T001"
                  value={teacherId}
                  onChangeText={(t) => {
                    setTeacherId(t);
                    setError("");
                  }}
                  autoCapitalize="characters"
                />

                <CustomInput
                  label="លេខសម្ងាត់ / Password"
                  placeholder="បញ្ចូលលេខសម្ងាត់"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setError("");
                  }}
                />

                <View style={styles.rowActions}>
                  <View style={styles.rememberMe}>
                    <View style={styles.checkbox} />
                    <Text style={styles.rememberText}>ចងចាំខ្ញុំ</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>ភ្លេចពាក្យសម្ងាត់?</Text>
                  </TouchableOpacity>
                </View>

                {error !== "" && (
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                )}

                <TouchableOpacity
                  style={[styles.loginBtn, loading && { opacity: 0.7 }]}
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
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
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
    fontWeight: "600",
    color: "#eee",
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
  rowActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  rememberText: { fontSize: 13, color: "#666" },
  forgotText: { fontSize: 13, color: "#2668ad", fontWeight: "600" },

  loginBtn: {
    backgroundColor: "#2668ad",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 13,
  },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#aaaaaa", fontSize: 15, fontWeight: "500" },
});
