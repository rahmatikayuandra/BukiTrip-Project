import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrders, OrderSummary } from "../../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
};

const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const res = await getOrders(user.user_id, "finished");
        if (res.status === "success") {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const formatRupiah = (val: number | string) =>
    "Rp " +
    Number(val || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  const totalTicket = (o: OrderSummary) =>
    o.adult_quantity + o.child_quantity;

  const renderItem = ({ item }: { item: OrderSummary }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]} />
        )}

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.destName}>{item.destination_name}</Text>
          <Text style={styles.price}>{formatRupiah(item.total_amount)}</Text>
          <Text style={styles.ticketCount}>{totalTicket(item)} Tiket</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.reorderBtn}
        onPress={() =>
          router.push({
            pathname: "/order/[id]",
            params: { id: item.destination_id },
          })
        }
      >
        <Text style={styles.reorderText}>Pesan lagi</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Pemesanan</Text>
      </View>

      {/* Jika kosong */}
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#70587C", fontSize: 13 }}>
            Belum ada riwayat pesanan.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.order_id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 12,
    backgroundColor: "#F9F4F5",
    borderBottomWidth: 0.6,
    borderBottomColor: "#E3D6F0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
    marginLeft: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 60, height: 60, borderRadius: 12 },
  thumbPlaceholder: { backgroundColor: "#D8CBEF" },

  destName: { fontSize: 14, fontWeight: "700", color: "#502F4C" },
  price: { fontSize: 12, color: "#70587C", marginTop: 2 },
  ticketCount: { fontSize: 11, color: "#A48FBF", marginTop: 2 },

  reorderBtn: {
    marginTop: 12,
    backgroundColor: "#5A3E6F",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  reorderText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});