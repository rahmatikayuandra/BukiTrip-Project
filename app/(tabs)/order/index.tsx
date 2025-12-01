import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getOrders, OrderSummary, updateOrderStatus } from "../../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
};

const OrdersTabScreen: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [statusTab, setStatusTab] = useState<"ongoing" | "finished">("ongoing");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await getOrders(user.user_id, statusTab);
      if (res.status === "success") {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, statusTab]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (raw) setUser(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, statusTab, load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const formatRupiah = (val: number | string) =>
    "Rp " +
    Number(val || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  const totalTicket = (o: OrderSummary) => o.adult_quantity + o.child_quantity;

  const handleCancel = async (orderId: number) => {
    const res = await updateOrderStatus(orderId, "cancelled");
    if (res.status === "success") {
      load();
    }
  };

  const renderItem = ({ item }: { item: OrderSummary }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({ pathname: "/order-detail/[id]", params: { id: item.order_id } })
      }
      activeOpacity={0.9}
    >
      <View style={styles.cardRow}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]} />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.destName} numberOfLines={2}>
            {item.destination_name}
          </Text>
          <Text style={styles.price}>{formatRupiah(item.total_amount)}</Text>
          <Text style={styles.ticketCount}>{totalTicket(item)} Tiket</Text>
        </View>
      </View>

      <View style={styles.cardButtonsRow}>
        {statusTab === "ongoing" ? (
          <>
            <TouchableOpacity
              style={styles.grayButton}
              onPress={() => handleCancel(item.order_id)}
            >
              <Text style={styles.grayButtonText}>Batalkan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() =>
                router.push({
                  pathname: "/ticket/[id]",
                  params: { id: item.order_id },
                })
              }
            >
              <Text style={styles.outlineButtonText}>Cetak tiket</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.grayButton}
              onPress={() =>
                router.push({
                  pathname: "/review/[id]",
                  params: { id: item.order_id },
                })
              }
            >
              <Text style={styles.grayButtonText}>Ulas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() =>
                router.push({
                  pathname: "/order/[id]",
                  params: { id: item.destination_id },
                })
              }
            >
              <Text style={styles.outlineButtonText}>Pesan lagi</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* header sederhana */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan</Text>
      </View>

      {/* segmented control */}
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[
            styles.segment,
            statusTab === "ongoing" && styles.segmentActive,
          ]}
          onPress={() => setStatusTab("ongoing")}
        >
          <Text
            style={[
              styles.segmentText,
              statusTab === "ongoing" && styles.segmentTextActive,
            ]}
          >
            Berlangsung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            statusTab === "finished" && styles.segmentActive,
          ]}
          onPress={() => setStatusTab("finished")}
        >
          <Text
            style={[
              styles.segmentText,
              statusTab === "finished" && styles.segmentTextActive,
            ]}
          >
            Selesai
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.order_id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada pesanan di tab ini.</Text>
        }
      />
    </View>
  );
};

export default OrdersTabScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#502F4C" },
  segmentRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    gap: 10,
  },
  segment: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E3D6F0",
  },
  segmentActive: {
    backgroundColor: "#502F4C",
  },
  segmentText: { fontSize: 13, color: "#70587C" },
  segmentTextActive: { color: "#FFFFFF", fontWeight: "600" },
  card: {
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 60, height: 60, borderRadius: 10 },
  thumbPlaceholder: { backgroundColor: "#E3D6F0" },
  destName: { fontSize: 13, fontWeight: "600", color: "#502F4C" },
  price: { fontSize: 12, color: "#70587C", marginTop: 2 },
  ticketCount: { fontSize: 11, color: "#A48FBF", marginTop: 2 },
  cardButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  grayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#E6E6E6",
  },
  grayButtonText: { fontSize: 12, color: "#555" },
  outlineButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#502F4C",
  },
  outlineButtonText: { fontSize: 12, color: "#502F4C", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    color: "#70587C",
  },
});