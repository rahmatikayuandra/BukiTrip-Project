// app/ticket/[id].tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrderDetail, OrderDetail } from "../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string | null;
};

const TicketScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderDetail(orderId);
        if (res.status === "success") setOrder(res.order);

        const raw = await AsyncStorage.getItem("bukitrip_user");
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    };
    if (orderId) load();
  }, [orderId]);

  const totalTiket = useMemo(
    () =>
      order ? Number(order.adult_quantity || 0) + Number(order.child_quantity || 0) : 0,
    [order]
  );

  if (loading || !order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>Memuat tiket...</Text>
      </View>
    );
  }

  const handlePrint = () => {
    Alert.alert("Cetak Tiket", "Fitur cetak tiket akan ditambahkan nanti 😊");
  };

  const payLabel =
    order.payment_method === "COD"
      ? "Bayar di Tempat"
      : `Bayar dengan ${order.payment_method}`;

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#502F4C"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Tiket</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticketCard}>
          <Text style={styles.destName}>{order.destination_name}</Text>

          {/* pemesan */}
          <View style={{ marginTop: 12 }}>
            <InfoRow label="Nama" value={user?.name || "-"} />
            <InfoRow label="e-mail" value={user?.email || "-"} />
            <InfoRow label="HP" value={user?.phone_number || "-"} />
          </View>

          {/* jumlah tiket */}
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionLabel}>Jumlah Tiket</Text>
            <Text style={styles.sectionValue}>
              {order.adult_quantity} Dewasa, {order.child_quantity} Anak - anak
            </Text>
          </View>

          {/* QR placeholder */}
          <View style={styles.qrBox}>
            <Text style={styles.qrText}>QR CODE DUMMY</Text>
            <Text style={styles.qrSubText}>Kode: BT-{order.order_id}</Text>
          </View>

          {/* tombol bayar */}
          <View style={{ marginTop: 12 }}>
            <View style={styles.payButton}>
              <Text style={styles.payButtonText}>{payLabel}</Text>
            </View>
          </View>

          {/* tombol cetak */}
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <View style={styles.printButton}>
              <Text style={styles.printButtonText} onPress={handlePrint}>
                Cetak
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default TicketScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 16,
    paddingBottom: 10,
    backgroundColor: "#F9F4F5",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F4F5",
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  destName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#502F4C",
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: { fontSize: 13, color: "#70587C" },
  infoValue: { fontSize: 13, color: "#502F4C" },
  sectionLabel: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 2,
  },
  sectionValue: {
    fontSize: 13,
    color: "#502F4C",
  },
  qrBox: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#E3D6F0",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: { fontSize: 16, fontWeight: "700", color: "#502F4C" },
  qrSubText: { fontSize: 12, color: "#70587C", marginTop: 4 },
  payButton: {
    backgroundColor: "#502F4C",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  payButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  printButton: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#6C4C8C",
  },
  printButtonText: { color: "#FFFFFF", fontSize: 14 },
});