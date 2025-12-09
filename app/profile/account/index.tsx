// app/profile/account/index.tsx
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

const AccountScreen: React.FC = () => {
  const router = useRouter();

  const Row = ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.rowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#70587C" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.replace("/(tabs)/profile")}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Akun</Text>
      </View>

      <View style={styles.container}>
        <Row
          label="Ganti Password"
          onPress={() => router.push("/profile/account/change-password")}
        />
        <Row
          label="Two-Factor Authentication"
          onPress={() => router.push("/profile/account/two-fa")}
        />
        <Row
          label="Akun Terkait"
          onPress={() => router.push("/profile/account/linked-accounts")}
        />
        <Row
          label="Hapus / Nonaktifkan Akun"
          onPress={() => router.push("/profile/account/manage-account")}
        />
      </View>
    </View>
  );
};

export default AccountScreen;

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
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  rowText: {
    fontSize: 14,
    color: "#502F4C",
  },
});