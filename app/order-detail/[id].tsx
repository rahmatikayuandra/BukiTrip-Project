// app/order-detail/[id].tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
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

const OrderDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (val: number | string) =>
    "Rp " +
    Number(val || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        if (!orderId) throw new Error("Order ID tidak valid");

        const res = await getOrderDetail(orderId);
        if (res.status === "success") {
          setOrder(res.order);
        }

        const raw = await AsyncStorage.getItem("bukitrip_user");
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const visitDateLabel = useMemo(() => {
    if (!order) return "-";
    const d = new Date(order.visit_date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [order]);

  const adultQty = order ? order.adult_quantity : 0;
  const childQty = order ? order.child_quantity : 0;
  const subtotal = order ? Number(order.subtotal || 0) : 0;
  const discount = order ? Number(order.discount_amount || 0) : 0;
  const total = order ? Number(order.total_amount || 0) : 0;

  if (loading || !order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Memuat detail pesanan...
        </Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* DESTINATION CARD */}
        <View style={styles.destCard}>
          <View style={styles.destRow}>
            {order.image_url ? (
              <Image source={{ uri: order.image_url }} style={styles.destImage} />
            ) : (
              <View style={[styles.destImage, styles.destImagePlaceholder]} />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.destName} numberOfLines={2}>
                {order.destination_name}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color="#70587C"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.address} numberOfLines={2}>
                  {order.address}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* TANGGAL KUNJUNGAN */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Tanggal Kunjungan</Text>
          <Text style={styles.blockValue}>{visitDateLabel}</Text>
        </View>

        {/* JUMLAH TIKET */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Jumlah Tiket</Text>
          <View style={styles.ticketBox}>
            <Row label="Dewasa" value={adultQty} />
            <Row label="Anak - anak" value={childQty} />
          </View>
        </View>

        {/* DATA PEMESAN */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Data Pemesan</Text>
          <View style={styles.bookingCard}>
            <Text style={styles.bookingName}>
              {(user?.name || "").toUpperCase() || "NAMA PEMESAN"}
            </Text>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.bookingLabel}>e-mail</Text>
              <Text style={styles.bookingValue}>{user?.email || "-"}</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.bookingLabel}>HP</Text>
              <Text style={styles.bookingValue}>
                {user?.phone_number || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* METODE PEMBAYARAN */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentBox}>
            <Text style={styles.paymentText}>{order.payment_method}</Text>
          </View>
        </View>

        {/* RINGKASAN HARGA */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Ringkasan Harga</Text>
          <View style={styles.summaryCard}>
            <SummaryRow
              label={`Dewasa (${adultQty}x)`}
              value={formatRupiah(subtotal - discount)} // simpel: semuanya di subtotal
            />
            <SummaryRow
              label={`Anak - anak (${childQty}x)`}
              value="" // kalau mau detail, boleh dibagi, tapi sementara kosong
            />
            <SummaryRow
              label="Voucher"
              value={discount > 0 ? "- " + formatRupiah(discount) : "-"}
            />
            <View style={styles.summaryDivider} />
            <SummaryRow
              label="Total"
              value={formatRupiah(total)}
              isTotal
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.ticketRow}>
    <Text style={styles.ticketLabel}>{label}</Text>
    <Text style={styles.ticketValue}>{value}</Text>
  </View>
);

const SummaryRow = ({
  label,
  value,
  isTotal,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
}) => (
  <View style={styles.summaryRow}>
    <Text style={isTotal ? styles.summaryTotalLabel : styles.summaryLabel}>
      {label}
    </Text>
    <Text style={isTotal ? styles.summaryTotalValue : styles.summaryValue}>
      {value}
    </Text>
  </View>
);

export default OrderDetailScreen;

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
  destCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  destRow: { flexDirection: "row", alignItems: "center" },
  destImage: { width: 72, height: 72, borderRadius: 12 },
  destImagePlaceholder: { backgroundColor: "#E3D6F0" },
  destName: { fontSize: 15, fontWeight: "700", color: "#502F4C" },
  locationRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 4 },
  address: { flex: 1, fontSize: 11, color: "#70587C" },
  block: { marginHorizontal: 16, marginTop: 16 },
  blockTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 8,
  },
  blockValue: { fontSize: 13, color: "#502F4C" },
  ticketBox: {
    backgroundColor: "#FBEFF7",
    borderRadius: 16,
    padding: 12,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ticketLabel: { fontSize: 13, color: "#502F4C" },
  ticketValue: { fontSize: 13, color: "#502F4C" },
  bookingCard: {
    backgroundColor: "#FBEFF7",
    borderRadius: 16,
    padding: 12,
  },
  bookingName: { fontSize: 14, fontWeight: "700", color: "#502F4C" },
  bookingLabel: { fontSize: 11, color: "#A48FBF", marginTop: 4 },
  bookingValue: { fontSize: 12, color: "#502F4C" },
  paymentBox: {
    backgroundColor: "#FBEFF7",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  paymentText: { fontSize: 13, color: "#502F4C" },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 12, color: "#70587C" },
  summaryValue: { fontSize: 12, color: "#502F4C" },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E3D6F0",
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
  summaryTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
});