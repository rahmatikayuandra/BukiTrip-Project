// app/profile/account/change-password.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changePassword } from "../../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
};

const ChangePasswordScreen: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (raw) setUser(JSON.parse(raw));
    })();
  }, []);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Oops", "User tidak ditemukan, silakan login ulang.");
      return;
    }
    if (!oldPw || !newPw || !confirmPw) {
      Alert.alert("Oops", "Semua field wajib diisi.");
      return;
    }
    if (newPw.length < 6) {
      Alert.alert("Oops", "Password baru minimal 6 karakter.");
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert("Oops", "Konfirmasi password baru tidak sama.");
      return;
    }

    setSaving(true);
    try {
      const res = await changePassword({
        user_id: user.user_id,
        old_password: oldPw,
        new_password: newPw,
      });

      if (res.status === "success") {
        Alert.alert("Berhasil", res.message, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Gagal", res.message);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Terjadi kesalahan saat mengubah password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.replace("/profile/account")}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ganti Password</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Password saat ini</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={oldPw}
          onChangeText={setOldPw}
          placeholder="Masukkan password lama"
        />

        <Text style={styles.label}>Password baru</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPw}
          onChangeText={setNewPw}
          placeholder="Password baru"
        />

        <Text style={styles.label}>Konfirmasi password baru</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPw}
          onChangeText={setConfirmPw}
          placeholder="Ulangi password baru"
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 28 : 16,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#F9F4F5",
  },
  headerBack: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
    textAlign: "center",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  label: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6C6EA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#502F4C",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});