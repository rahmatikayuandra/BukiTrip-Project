import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// enable animation (Android)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  const faqList = [
    {
      q: "Bagaimana cara memesan tiket?",
      a: "Pilih destinasi, tentukan tanggal kunjungan, jumlah tiket, metode pembayaran, lalu konfirmasi pesanan.",
    },
    {
      q: "Bagaimana cara melihat tiket saya?",
      a: "Masuk ke menu ‘Pesanan’ kemudian pilih pesanan yang sedang berlangsung dan tekan ‘Cetak Tiket’.",
    },
    {
      q: "Apakah bisa refund?",
      a: "Saat ini refund belum tersedia. Kamu bisa membatalkan pesanan sebelum diproses oleh admin.",
    },
    {
      q: "Bagaimana jika metode pembayaran gagal?",
      a: "Coba ulangi pembayaran, atau gunakan metode pembayaran lain seperti QRIS atau transfer bank.",
    },
    {
      q: "Di mana saya bisa melihat riwayat pesanan?",
      a: "Pergi ke Profil → Riwayat Pemesanan untuk melihat semua pesanan yang sudah selesai.",
    },
    {
      q: "Bagaimana cara mengganti password?",
      a: "Masuk ke Profil → Akun → Ganti Password, kemudian ikuti instruksi di layar.",
    },
    {
      q: "Apakah BukiTrip menyediakan layanan CS?",
      a: "Ya! Kamu bisa menghubungi kami melalui halaman Help Center → Hubungi Kami.",
    },
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

        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {faqList.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => toggle(index)}
              >
                <Text style={styles.question}>{item.q}</Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#70587C"
                />
              </TouchableOpacity>

              {isOpen && <Text style={styles.answer}>{item.a}</Text>}
            </View>
          );
        })}

        <Text style={styles.footerText}>
          Tidak menemukan jawaban? Hubungi tim support BukiTrip 
        </Text>
      </ScrollView>
    </View>
  );
};

export default FAQScreen;

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
    paddingBottom: 12,
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    flex: 1,
    paddingRight: 10,
  },
  answer: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#70587C",
  },

  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#A48FBF",
    textAlign: "center",
    paddingBottom: 40,
  },
});