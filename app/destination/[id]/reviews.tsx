// app/destination/[id]/reviews.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image, // ⬅️ pastikan ini ada
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getDestinationDetail, Review } from "../../../constants/api";

const AllReviewsScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getDestinationDetail(Number(id));
      if (res.status === "success") {
        setReviews(res.reviews);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Semua Ulasan</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#502F4C" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada ulasan untuk destinasi ini.
            </Text>
          ) : (
            reviews.map((rev) => (
              <View key={rev.review_id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  {rev.profil_pic ? (
                    <Image
                      source={{ uri: rev.profil_pic }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatar} />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                      {rev.user_name || "Pengguna BukiTrip"}
                    </Text>
                    <Text style={styles.rating}>{rev.rating} / 5</Text>
                  </View>
                </View>

                <Text style={styles.comment}>{rev.comment}</Text>

                <View style={styles.imagesRow}>
                  <View style={styles.imgPlaceholder} />
                  <View style={styles.imgPlaceholder} />
                  <View style={styles.imgPlaceholder} />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AllReviewsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F9F4F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E3D6F0",
  },
  headerIconBtn: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#70587C",
    textAlign: "center",
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: "#F3F3F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D8CBEF",
    marginRight: 10,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#D8CBEF",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
  },
  rating: {
    fontSize: 12,
    color: "#70587C",
  },
  comment: {
    fontSize: 12,
    color: "#70587C",
    lineHeight: 18,
    marginBottom: 10,
  },
  imagesRow: {
    flexDirection: "row",
    gap: 8,
  },
  imgPlaceholder: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E0D6EE",
  },
});
