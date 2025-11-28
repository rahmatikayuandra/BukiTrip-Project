// app/privacy.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PrivacyScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>BukiTrip - Privacy Policy</Text>

        <Text style={styles.paragraph}>
          1. Data pribadi seperti nama, email, dan informasi pemesanan disimpan
          untuk keperluan pengelolaan tiket dan riwayat transaksi.
        </Text>

        <Text style={styles.paragraph}>
          2. Kami tidak membagikan data pribadi pengguna kepada pihak ketiga
          tanpa izin, kecuali jika diwajibkan oleh hukum.
        </Text>

        <Text style={styles.paragraph}>
          3. Pengguna bertanggung jawab menjaga kerahasiaan akun dan password.
        </Text>

        <Text style={styles.paragraph}>
          4. Kebijakan privasi ini bersifat contoh dan dapat diperbarui
          seiring dengan pengembangan fitur BukiTrip.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#F9F4F5",
  },
  backBtn: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#502F4C",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#502F4C",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 8,
    lineHeight: 20,
  },
});