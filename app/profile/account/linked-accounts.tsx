import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const LinkedAccountsScreen: React.FC = () => {
  const router = useRouter();

  const Row = ({ label, status }: { label: string; status: string }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.rowStatus}>{status}</Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>Akun Terkait</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.infoText}>
          Untuk saat ini pengaturan akun terkait masih dummy (belum terhubung ke
          Google / Apple / Facebook sungguhan).
        </Text>

        <Row label="Google" status="Terhubung" />
        <Row label="Apple" status="Belum terhubung" />
        <Row label="Facebook" status="Belum terhubung" />
      </View>
    </View>
  );
};

export default LinkedAccountsScreen;

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
  infoText: { fontSize: 13, color: "#70587C", marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rowText: { fontSize: 14, color: "#502F4C" },
  rowStatus: { fontSize: 13, color: "#70587C" },
});