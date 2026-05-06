import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/image.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.uniName}>សាកលវិទ្យាល័យអង្គរ</Text>
            <Text style={styles.uniNameEn}>ANGKOR UNIVERSITY</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>
              ប្រព័ន្ធគ្រប់គ្រងកាលវិភាគសិក្សា​ និង​សម្រង់វត្តមាននិសិត្ស
            </Text>
          </View>

          {/* Button Section — Glass Style */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.glassBtn}
              onPress={() => router.push("/(auth)/login")}
              activeOpacity={0.75}
            >
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>
                  {t("welcome.loginBtn") || "ចូលប្រើប្រាស់"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>{t("welcome.footer")}</Text>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 30, 80, 0.55)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 50,
    paddingHorizontal: 40,
  },

  // Logo
  logoContainer: { alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 16 },
  uniName: {
    fontFamily: "MoulRegular",
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 40,
  },
  uniNameEn: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 4,
    marginTop: 6,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#FFD700",
    marginVertical: 14,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },

  // Glass Buttons
  buttonContainer: {
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  glassBtn: {
    width: "75%",
    borderRadius: 30,
    overflow: "hidden",
    // Glass effect
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    // Shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  btnInner: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    // top highlight line (glass effect)
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.5)",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  footer: {
    color: "#ffffff88",
    fontSize: 12,
  },
});
