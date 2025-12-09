import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ManageAccountScreen: React.FC = () => {
  const router = useRouter();
  const [reason, setReason] = React.useState("");

  const handleDelete = () => {
    Alert.alert(
      "Hapus Akun",
      "Untuk saat ini penghapusan akun belum terhubung ke server. Nanti proses ini akan kita pindahkan ke web admin atau endpoint khusus.",
      [{ text: "OK" }]
    );
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Nonaktifkan Akun",
      "Fitur nonaktifkan akun masih dummy dulu ya 😊",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.replace("/profile/account")}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hapus / Nonaktifkan Akun</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Alasan (opsional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tulis alasanmu di sini..."
          multiline
          value={reason}
          onChangeText={setReason}
        />

        <TouchableOpacity style={styles.deactivateBtn} onPress={handleDeactivate}>
          <Text style={styles.deactivateText}>Nonaktifkan Akun</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Hapus Akun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageAccountScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 28 : 16,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#F9F4F5",
  },
  headerBack: { paddingRight: 8, paddingVertical: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },
  container: { padding: 16 },
  label: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 6,
  },
  textArea: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6C6EA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  deactivateBtn: {
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFE8D1",
    marginBottom: 10,
  },
  deactivateText: {
    color: "#C76A1F",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteBtn: {
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FDE0E0",
  },
  deleteText: {
    color: "#D62828",
    fontSize: 14,
    fontWeight: "700",
  },
});