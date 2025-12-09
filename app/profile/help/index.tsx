import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HelpCenterScreen = () => {
  const router = useRouter();

  const items = [
    { label: "Tentang Aplikasi BukiTrip", icon: "information-circle-outline" },
    { label: "Cara Pemesanan Tiket", icon: "ticket-outline" },
    { label: "Pembayaran & Refund", icon: "card-outline" },
    { label: "Akun & Keamanan", icon: "shield-checkmark-outline" },
    { label: "Favorit & Wishlist", icon: "heart-outline" },
    { label: "Event & Promo", icon: "pricetag-outline" },
    { label: "Masalah Teknis", icon: "bug-outline" },
    { label: "Hubungi Kami", icon: "call-outline" },
  ];

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Butuh Bantuan?</Text>
        <Text style={styles.sectionSubtitle}>
          Temukan jawaban untuk pertanyaan umum.
        </Text>

        <View style={styles.card}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.row,
                index === items.length - 1 && styles.lastRow,
              ]}
              onPress={() => {
                // Nanti bisa diarahkan ke detail FAQ
                router.push("/profile/faq"); // sementara static
              }}
            >
              <View style={styles.rowLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color="#502F4C"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#A48FBF" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>
          Jika kamu tidak menemukan jawaban yang kamu cari,  
          hubungi tim support kami kapan saja 
        </Text>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 10,
  },
  headerIconBtn: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },

  content: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#502F4C",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#70587C",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE3F5",
    justifyContent: "space-between",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    color: "#502F4C",
    fontWeight: "500",
  },

  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#A48FBF",
    textAlign: "center",
  },
});