import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Destination, Review, getDestinationDetail } from "../../constants/api";
import { Platform } from "react-native";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 220;

type DetailState = {
  destination: Destination | null;
  reviews: Review[];
  related: Destination[];
};

const DestinationDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<DetailState>({
    destination: null,
    reviews: [],
    related: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  const destinationId = Number(id);

  useEffect(() => {
    const loadDetail = async () => {
      if (!destinationId) {
        setError("ID destinasi tidak valid");
        setLoading(false);
        return;
      }

      try {
        const res = await getDestinationDetail(destinationId);
        if (res.status === "success") {
          setData({
            destination: res.destination,
            reviews: res.reviews,
            related: res.related,
          });
        } else {
          setError(res.message);
        }
      } catch (e) {
        console.error(e);
        setError("Gagal mengambil data detail destinasi");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [destinationId]);

  const destination = data.destination;

  const images = useMemo(() => {
    // sementara: pakai satu image dari DB, diulang biar bisa di-swipe
    if (destination?.image_url) {
      return [
        destination.image_url,
        destination.image_url,
        destination.image_url,
      ];
    }
    return [];
  }, [destination]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Memuat detail destinasi...
        </Text>
      </View>
    );
  }

  if (error || !destination) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Data tidak tersedia"}</Text>
        <TouchableOpacity
          style={styles.backButtonOutline}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonOutlineText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayRating = destination.rating
    ? parseFloat(destination.rating).toFixed(1)
    : "-";

  const openingTime = destination.opening_time || "08:00";
  const closingTime = destination.closing_time || "18:00";

  // ambil maks 2 ulasan teratas
  const reviewsToShow = data.reviews.slice(0, 2);
  const totalReviews = data.reviews.length;

  // card destinasi kecil untuk "Mungkin anda tertarik"
  const renderRelatedCard = (item: Destination) => (
    <TouchableOpacity
      style={styles.relatedCard}
      onPress={() =>
        router.push({
          pathname: "/destination/[id]",
          params: { id: item.destination_id },
        })
      }
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.relatedImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.relatedImage, styles.relatedPlaceholder]} />
      )}
      <View style={styles.relatedInfo}>
        <Text style={styles.relatedName} numberOfLines={1}>
          {item.destination_name}
        </Text>
        <Text style={styles.relatedPrice}>Rp {item.price_adult}</Text>
        {item.rating && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#F5C045" />
            <Text style={styles.relatedRating}>
              {parseFloat(item.rating).toFixed(1)} / 5
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" backgroundColor="#F9F4F5" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Destinasi</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE SLIDER */}
        <View style={styles.heroWrapper}>
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {images.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]} />
          )}

          {/* Like */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => setLiked((p) => !p)}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#E63946" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        {/* CONTENT CARD */}
        <View style={styles.content}>
          {/* Title & price badges */}
          <Text style={styles.destTitle}>{destination.destination_name}</Text>

          <View style={styles.priceBadgesRow}>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeLabel}>Dewasa</Text>
              <Text style={styles.priceBadgeValue}>
                Rp {destination.price_adult}
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeLabel}>Anak-anak</Text>
              <Text style={styles.priceBadgeValue}>
                Rp {destination.price_child}
              </Text>
            </View>
          </View>

          {/* Rating & status */}
          <View style={styles.sectionRow}>
            <View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F5C045" />
                <Text style={styles.ratingText}>
                  {displayRating} / 5{" "}
                  <Text style={styles.ratingSubText}>• beberapa ulasan</Text>
                </Text>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Buka</Text>
              </View>
            </View>
            <Text style={styles.timeRange}>
              {openingTime.slice(0, 5)} - {closingTime.slice(0, 5)}
            </Text>
          </View>

          {/* Deskripsi */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.sectionBody}>{destination.description}</Text>
          </View>

          {/* Lokasi */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Lokasi</Text>
            <Text style={styles.sectionBody}>{destination.address}</Text>

            <View style={styles.mapPlaceholder}>
              {/* nanti bisa diganti MapView / open Google Maps */}
            </View>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Integrasi ke Google Maps akan ditambahkan nanti 😊"
                )
              }
            >
              <Text style={styles.mapButtonText}>Tampilkan di Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Ulasan */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ulasan</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F5C045" />
                <Text style={styles.ratingText}>
                  {displayRating} / 5{" "}
                  {totalReviews > 0 && (
                    <Text style={styles.ratingSubText}>
                      ({totalReviews} ulasan)
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            {totalReviews === 0 ? (
              <Text style={styles.sectionBody}>
                Belum ada ulasan. Jadilah yang pertama memberikan review!
              </Text>
            ) : (
              <>
                {reviewsToShow.map((rev) => (
                  <View key={rev.review_id} style={styles.reviewCard}>
                    {/* header: avatar + nama + rating */}
                    <View style={styles.reviewHeader}>
  {rev.profil_pic ? (
    <Image
      source={{ uri: rev.profil_pic }}
      style={styles.reviewAvatarImage}
    />
  ) : (
    <View style={styles.reviewAvatar} />
  )}
  <View style={{ flex: 1 }}>
    <Text style={styles.reviewName}>
      {rev.user_name || "Pengguna BukiTrip"}
    </Text>
    <View style={styles.reviewRatingRow}>
      <Ionicons name="star" size={12} color="#F5C045" />
      <Text style={styles.reviewRatingText}>{rev.rating} / 5</Text>
    </View>
  </View>
</View>

                    {/* komentar */}
                    <Text style={styles.reviewComment}>
                      {rev.comment || "-"}
                    </Text>

                    {/* placeholder foto */}
                    <View style={styles.reviewImagesRow}>
                      <View style={styles.reviewImagePlaceholder} />
                      <View style={styles.reviewImagePlaceholder} />
                      <View style={styles.reviewImagePlaceholder} />
                    </View>
                  </View>
                ))}

                {/* tombol lihat semua ulasan */}
                {totalReviews > 2 && (
                  <TouchableOpacity
                    style={styles.moreReviewsButton}
                    onPress={() =>
                      router.push(`/destination/${destinationId}/reviews`)
                    }
                  >
                    <Text style={styles.moreReviewsText}>
                      Lihat Ulasan Lainnya
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#502F4C" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Related destinations */}
          {data.related.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Mungkin Anda tertarik</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data.related}
                keyExtractor={(item) =>
                  String(item.destination_id) + "_related"
                }
                renderItem={({ item }) => renderRelatedCard(item)}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* PESAN SEKARANG */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() =>
            Alert.alert(
              "Pesan Sekarang",
              "Halaman pemesanan akan kita buat di step berikutnya 😉"
            )
          }
        >
          <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 28 : 16,
    paddingHorizontal: 16,
    paddingBottom: 6,
    backgroundColor: "#F9F4F5",
    borderBottomWidth: 0.5,
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
  heroWrapper: {
    backgroundColor: "#E5DAF2",
  },
  heroImage: {
    width,
    height: HERO_HEIGHT,
  },
  heroPlaceholder: {
    backgroundColor: "#D8CBEF",
  },
  likeButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  destTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#502F4C",
    marginBottom: 10,
  },
  priceBadgesRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  priceBadge: {
    flex: 1,
    backgroundColor: "#E9DEF6",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  priceBadgeLabel: {
    fontSize: 11,
    color: "#70587C",
  },
  priceBadgeValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: "#502F4C",
    marginLeft: 4,
  },
  ratingSubText: {
    fontSize: 12,
    color: "#70587C",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
  },
  timeRange: {
    fontSize: 13,
    color: "#70587C",
  },
  sectionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: "#70587C",
    lineHeight: 20,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 14,
    backgroundColor: "#E3D6F0",
    marginTop: 8,
  },
  mapButton: {
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#502F4C",
  },
  mapButtonText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sectionHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
},
reviewCard: {
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  backgroundColor: "#F3F3F5",
},
reviewHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},
reviewAvatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#D0C4E5",
  marginRight: 10,
},
reviewAvatarImage: {
  width: 32,
  height: 32,
  borderRadius: 16,
  marginRight: 10,
  backgroundColor: "#D0C4E5", // kalau gambar belum ke-load
},
// reviewAvatar lama (lingkaran ungu) boleh tetap dipakai untuk placeholder
reviewName: {
  fontSize: 13,
  fontWeight: "600",
  color: "#502F4C",
},
reviewRatingRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 2,
},
reviewRatingText: {
  fontSize: 12,
  color: "#70587C",
  marginLeft: 4,
},
reviewComment: {
  fontSize: 12,
  color: "#70587C",
  lineHeight: 18,
  marginBottom: 8,
},
reviewImagesRow: {
  flexDirection: "row",
  gap: 8,
  marginTop: 4,
},
reviewImagePlaceholder: {
  flex: 1,
  height: 50,
  borderRadius: 6,
  backgroundColor: "#E0D6EE",
},
moreReviewsButton: {
  marginTop: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  backgroundColor: "#F3F3F5",
},
moreReviewsText: {
  fontSize: 13,
  color: "#502F4C",
  fontWeight: "500",
},
  relatedCard: {
    width: 140,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  relatedImage: {
    width: "100%",
    height: 80,
  },
  relatedPlaceholder: {
    backgroundColor: "#E3D6F0",
  },
  relatedInfo: {
    padding: 8,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 2,
  },
  relatedPrice: {
    fontSize: 11,
    color: "#70587C",
    marginBottom: 2,
  },
  relatedRating: {
    fontSize: 10,
    color: "#70587C",
    marginLeft: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(249,244,245,0.96)",
    borderTopWidth: 1,
    borderTopColor: "#E3D6F0",
  },
  orderButton: {
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F4F5",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
  backButtonOutline: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#502F4C",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonOutlineText: {
    color: "#502F4C",
    fontSize: 13,
    fontWeight: "500",
  },
});
