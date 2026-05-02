import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ ប្តូរ Key សម្រាប់ទុកទិន្នន័យសិស្ស
const STORAGE_KEY = "student_profile";

export default function EditStudentProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("Vitou");
  const [studentId, setStudentId] = useState("ST-2026001");
  const [major, setMajor] = useState("Computer Science");
  const [year, setYear] = useState("Year 4");
  const [phone, setPhone] = useState("+855 96 123 456");
  const [email, setEmail] = useState("vitou.student@university.edu");
  const [address, setAddress] = useState("Phnom Penh, Cambodia");
  const [dob, setDob] = useState("January 01, 2004");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.fullName) setFullName(data.fullName);
          if (data.studentId) setStudentId(data.studentId);
          if (data.major) setMajor(data.major);
          if (data.year) setYear(data.year);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
          if (data.address) setAddress(data.address);
          if (data.dob) setDob(data.dob);
          if (data.photoUri) setPhotoUri(data.photoUri);
        }
      } catch (e) {
        console.log("Load error:", e);
      } finally {
        setLoadingData(false);
      }
    };
    loadProfile();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission", "សូម allow access ទៅ Camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("ប្ដូររូបភាព", "ជ្រើសរើស", [
      { text: "📷 ថតរូប", onPress: handleTakePhoto },
      { text: "🖼️ ជ្រើសពី Gallery", onPress: handlePickImage },
      { text: "បោះបង់", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!fullName.trim() || !studentId.trim() || !major.trim()) {
      Alert.alert("⚠️ Error", "សូមបំពេញ Name, ID និង Major");
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        fullName,
        studentId,
        major,
        year,
        phone,
        email,
        address,
        dob,
        photoUri,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      Alert.alert("✅ រួចរាល់", "ព័ត៌មានត្រូវបានរក្សាទុករួចហើយ!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("❌ Error", "មិនអាចរក្សាទុកបាន — " + e);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header - Student Color (Blue) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Student Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          onPress={handleChangePhoto}
          style={styles.avatarWrapper}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.cameraOverlay}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleChangePhoto}
          style={styles.changePhotoBtn}
        >
          <Text style={styles.changePhotoText}>ប្ដូររូបភាព</Text>
        </TouchableOpacity>
      </View>

      {/* Academic Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="school-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>Academic Information</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Student ID *</Text>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="ST-XXXXXXX"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, { flex: 1.5, marginRight: 10 }]}>
            <Text style={styles.fieldLabel}>Major *</Text>
            <TextInput
              style={styles.input}
              value={major}
              onChangeText={setMajor}
              placeholder="e.g. IT"
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Year</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Year 4"
            />
          </View>
        </View>
      </View>

      {/* Personal Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter name"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
          />
        </View>
      </View>

      {/* Contact Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="call-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>Contact Information</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="096XXXXXXX"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="student@example.com"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Address</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            placeholder="Current address"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>💾 រក្សាទុកព័ត៌មាន</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>បោះបង់</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loadingScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#00529B",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#00529B",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: { fontSize: 40, fontWeight: "bold", color: "#00529B" },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10B981",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhotoBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  changePhotoText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#00529B" },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FAFAFA",
  },
  inputMultiline: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  saveBtn: {
    backgroundColor: "#00529B",
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelBtnText: { color: "#888", fontSize: 15 },
});
