// app/profile/edit.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile, updateProfile, UserProfile } from "../../../constants/api";

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"" | "Laki-laki" | "Perempuan" | "Lainnya">("");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (!raw) {
        setLoading(false);
        return;
      }
      const base = JSON.parse(raw) as { user_id: number };

      const res = await getProfile(base.user_id);
      if (res.status === "success") {
        setProfile(res.user);
        setName(res.user.name);
        setEmail(res.user.email);
        setPhone(res.user.phone_number || "");
        setGender((res.user.gender as any) || "");
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    if (!name.trim() || !email.trim()) {
      Alert.alert("Oops", "Nama dan email tidak boleh kosong.");
      return;
    }

    setSaving(true);
    const res = await updateProfile({
      user_id: profile.user_id,
      name: name.trim(),
      email: email.trim(),
      phone_number: phone.trim(),
      gender,
    });

    setSaving(false);

    if (res.status === "success") {
      // update nama & email di AsyncStorage biar konsisten
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (raw) {
        const old = JSON.parse(raw);
        await AsyncStorage.setItem(
          "bukitrip_user",
          JSON.stringify({ ...old, name: name.trim(), email: email.trim() })
        );
      }

      Alert.alert("Berhasil", "Profil diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Gagal", res.message);
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={styles.headerAction}>
            {saving ? "..." : "Simpan"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* avatar static dulu */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#B7A3D4" />
          </View>
          <TouchableOpacity
            style={styles.avatarEdit}
            onPress={() =>
              Alert.alert(
                "Coming soon",
                "Upload foto profil akan ditambahkan nanti 😊"
              )
            }
          >
            <Ionicons name="create-outline" size={16} color="#502F4C" />
          </TouchableOpacity>
        </View>

        {/* form */}
        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <Text style={styles.label}>HP</Text>
        <TextInput
          style={styles.input}
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Jenis Kelamin</Text>
        <View style={styles.genderRow}>
          {(["Laki-laki", "Perempuan", "Lainnya"] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderChip,
                gender === g && styles.genderChipActive,
              ]}
              onPress={() => setGender(g)}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.genderTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: Platform.OS === "ios" ? 28 : 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#502F4C" },
  headerAction: { fontSize: 14, fontWeight: "600", color: "#502F4C" },
  content: { padding: 16 },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E5DAF2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEdit: {
    marginTop: -20,
    marginLeft: 50,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3D6F0",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    color: "#502F4C",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8CBEF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#502F4C",
  },
  genderRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8CBEF",
    backgroundColor: "#FFFFFF",
  },
  genderChipActive: {
    backgroundColor: "#502F4C",
    borderColor: "#502F4C",
  },
  genderText: { fontSize: 12, color: "#502F4C" },
  genderTextActive: { color: "#FFFFFF", fontWeight: "600" },
});