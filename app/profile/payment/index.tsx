// app/profile/payment/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { PaymentMethod } from "../../../constants/api";

const STORAGE_KEY = "bukitrip_payment_method";

const METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  note: string;
}[] = [
  {
    id: "QRIS",
    title: "QRIS",
    subtitle: "Scan QR saat pembayaran",
    note: "Kode QR dummy: BTQR123456",
  },
  {
    id: "e-wallet",
    title: "e-Wallet",
    subtitle: "Pembayaran lewat e-wallet populer",
    note: "Nomor e-wallet dummy: 0812 0000 1234",
  },
  {
    id: "Bank Transfer",
    title: "Bank Transfer",
    subtitle: "Transfer ke rekening virtual",
    note: "Rekening dummy: 1234 5678 90 a.n. BukiTrip",
  },
  {
    id: "COD",
    title: "Bayar di tempat",
    subtitle: "Pembayaran saat kunjungan",
    note: "Cocok untuk pembayaran langsung di lokasi.",
  },
];

const PaymentMethodsScreen: React.FC = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentMethod>("QRIS");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load preferensi dari AsyncStorage
  useEffect(() => {
    const loadPref = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSelected(saved as PaymentMethod);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadPref();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, selected);
      Alert.alert("Tersimpan", "Metode pembayaran utama disimpan di aplikasi.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  const renderRow = (m: (typeof METHODS)[number]) => {
    const active = selected === m.id;
    return (
      <TouchableOpacity
        key={m.id}
        style={[styles.methodCard, active && styles.methodCardActive]}
        onPress={() => setSelected(m.id)}
        activeOpacity={0.85}
      >
        <View style={styles.methodLeft}>
          <View style={styles.iconCircle}>
            {m.id === "QRIS" && (
              <Ionicons name="qr-code-outline" size={18} color="#502F4C" />
            )}
            {m.id === "e-wallet" && (
              <Ionicons name="wallet-outline" size={18} color="#502F4C" />
            )}
            {m.id === "Bank Transfer" && (
              <Ionicons name="card-outline" size={18} color="#502F4C" />
            )}
            {m.id === "COD" && (
              <Ionicons name="cash-outline" size={18} color="#502F4C" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>{m.title}</Text>
            <Text style={styles.methodSubtitle}>{m.subtitle}</Text>
            <Text style={styles.methodNote}>{m.note}</Text>
          </View>
        </View>

        <Ionicons
          name={active ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={active ? "#502F4C" : "#C8B8DC"}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Memuat pengaturan...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.replace("/(tabs)/profile")}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.infoText}>
          Pengaturan ini masih dummy dan hanya disimpan di perangkatmu. Belum
          terhubung ke bank atau e-wallet sungguhan.
        </Text>

        {METHODS.map(renderRow)}

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Menyimpan..." : "Simpan sebagai default"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#70587C",
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E3D6F0",
  },
  methodCardActive: {
    borderColor: "#502F4C",
    backgroundColor: "#F3E7FF",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E9DEF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
  },
  methodSubtitle: {
    fontSize: 12,
    color: "#70587C",
    marginTop: 2,
  },
  methodNote: {
    fontSize: 11,
    color: "#A48FBF",
    marginTop: 4,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 11,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});