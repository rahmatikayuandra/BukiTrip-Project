// app/terms.tsx
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

const TermsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>BukiTrip - Terms of Use</Text>

        <Text style={styles.paragraph}>
          1. Penggunaan aplikasi ini ditujukan untuk pemesanan tiket destinasi
          wisata di Bukittinggi.
        </Text>

        <Text style={styles.paragraph}>
          2. Data yang kamu masukkan (seperti nama, email, dan riwayat pemesanan)
          hanya digunakan untuk keperluan operasional aplikasi.
        </Text>

        <Text style={styles.paragraph}>
          3. Dilarang menyalahgunakan aplikasi untuk aktivitas yang melanggar
          hukum atau merugikan pihak lain.
        </Text>

        <Text style={styles.paragraph}>
          4. Ketentuan ini bersifat contoh dan dapat diubah sewaktu-waktu
          sesuai kebutuhan pengembangan aplikasi.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48, // biar aman dari notch
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
