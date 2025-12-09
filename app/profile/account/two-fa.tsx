import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TwoFAScreen: React.FC = () => {
  const router = useRouter();
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  const [emailEnabled, setEmailEnabled] = React.useState(true);

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
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.infoText}>
          Untuk sekarang ini masih dummy saja. Nantinya verifikasi kode bisa
          dikirim lewat SMS atau email.
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowText}>SMS</Text>
          <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Email</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
      </View>
    </View>
  );
};

export default TwoFAScreen;

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
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rowText: { fontSize: 14, color: "#502F4C" },
});