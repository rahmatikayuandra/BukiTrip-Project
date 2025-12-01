// app/review/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrderDetail, OrderDetail, submitReview } from "../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
};

const ReviewScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!user || !order) {
      Alert.alert("Oops", "Data tidak lengkap.");
      return;
    }
    if (!rating) {
      Alert.alert("Oops", "Pilih rating dulu ya.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitReview({
        user_id: user.user_id,
        order_id: order.order_id,
        rating,
        comment,
      });

      if (res.status === "success") {
        Alert.alert("Terima kasih! 💜", "Review kamu berhasil dikirim.", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/order"),
          },
        ]);
      } else {
        Alert.alert("Gagal", res.message);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Memuat data review...
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
        <Text style={styles.headerTitle}>Ulasan</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dest info */}
        <View style={styles.destCard}>
          <Text style={styles.destName}>{order.destination_name}</Text>
          <Text style={styles.destPrice}>
            {Number(order.total_amount || 0).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </Text>
          <Text style={styles.destTicket}>
            {order.adult_quantity + order.child_quantity} Tiket
          </Text>
        </View>

        {/* Rating stars */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity key={val} onPress={() => setRating(val)}>
                <Ionicons
                  name={val <= rating ? "star" : "star-outline"}
                  size={28}
                  color="#F5C045"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comment */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Tulis Ulasan</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ceritakan pengalamanmu di destinasi ini..."
            placeholderTextColor="#B09BCB"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* (Optional) foto/video placeholder */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Foto atau Video (opsional)</Text>
          <View style={styles.imagePlaceholderRow}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.imagePlaceholder} />
          </View>
          <Text style={styles.hint}>
            Untuk sekarang masih placeholder ya, upload nanti bisa ditambah.
          </Text>
        </View>
      </ScrollView>

      {/* bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? "Mengirim..." : "KIRIM"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewScreen;

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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  destName: { fontSize: 15, fontWeight: "700", color: "#502F4C" },
  destPrice: { fontSize: 13, color: "#70587C", marginTop: 4 },
  destTicket: { fontSize: 12, color: "#A48FBF", marginTop: 2 },
  label: { fontSize: 13, color: "#502F4C", marginBottom: 6 },
  starsRow: { flexDirection: "row" },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C8B8DC",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13,
    color: "#502F4C",
    minHeight: 100,
  },
  imagePlaceholderRow: {
    flexDirection: "row",
    marginTop: 6,
    gap: 8,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#E3D6F0",
  },
  hint: { fontSize: 11, color: "#A48FBF", marginTop: 4 },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(249,244,245,0.96)",
    borderTopWidth: 1,
    borderTopColor: "#E3D6F0",
  },
  submitButton: {
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});