// app/(tabs)/home/index.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Destination, getDestinations } from "../../../constants/api";
import { useRouter } from "expo-router";

const heroImage = require("../../../assets/images/jamgadangmain.jpg");

const CATEGORY_OPTIONS = [
  { id: "ALL", label: "Semua" },
  { id: "Alam", label: "Alam" },
  { id: "Sejarah", label: "Sejarah" },
  { id: "Museum", label: "Museum" },
  { id: "Keluarga", label: "Keluarga" },
];

const HomeScreen: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const router = useRouter();

  const loadDestinations = async () => {
    try {
      setError(null);
      const res = await getDestinations();
      if (res.status === "success") {
        setDestinations(res.data);
      } else {
        setError(res.message);
      }
    } catch (e) {
      console.error(e);
      setError("Gagal mengambil data destinasi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDestinations();
  };

  const filteredDestinations = useMemo(() => {
    let list = destinations;

    // filter by category dulu
    if (selectedCategory !== "ALL") {
      list = list.filter((d) => d.category && d.category === selectedCategory);
    }

    // lalu filter by search text
    if (search.trim()) {
      const lower = search.toLowerCase();
      list = list.filter((d) =>
        d.destination_name.toLowerCase().includes(lower)
      );
    }

    return list;
  }, [search, destinations, selectedCategory]);

  const mostSearched = filteredDestinations.slice(0, 3);
  const specialForYou = filteredDestinations.slice().reverse().slice(0, 3);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Loading destinasi...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderDestinationCard = (item: Destination) => (
  <TouchableOpacity
    style={styles.destCard}
    onPress={() =>
      router.push({
        pathname: "/destination/[id]",
        params: { id: item.destination_id },
      })
    }
  >
    {item.image_url ? (
      <Image source={{ uri: item.image_url }} style={styles.destImage} />
    ) : (
      <View style={[styles.destImage, styles.destImagePlaceholder]} />
    )}
    <View style={styles.destInfo}>
      <Text style={styles.destName} numberOfLines={1}>
        {item.destination_name}
      </Text>
      <Text style={styles.destPrice}>Rp {item.price_adult}</Text>
      {item.rating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F5C045" />
          <Text style={styles.destRating}>
            {parseFloat(item.rating).toFixed(1)} / 5
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.root}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero image full bleed */}
        <ImageBackground
          source={heroImage}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Bukittinggi</Text>
            <Text style={styles.heroSubtitle}>
              Temukan destinasi terbaik untuk liburanmu.
            </Text>
          </View>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          {/* Search bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#70587C"
                style={{ marginRight: 6 }}
              />
              <TextInput
                placeholder="Cari destinasi pilihanmu"
                placeholderTextColor="#A48FBF"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Filter kategori */}
          <View style={styles.categoryRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 6 }}
            >
              {CATEGORY_OPTIONS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryChip,
                      active && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {filteredDestinations.length === 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 14, color: "#70587C" }}>
                Tidak ada destinasi yang cocok dengan pencarian.
              </Text>
            </View>
          )}

          {filteredDestinations.length > 0 && (
            <>
              {/* Paling banyak dicari */}
              <Text style={styles.sectionTitle}>Paling banyak dicari</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={mostSearched}
                keyExtractor={(item) =>
                  String(item.destination_id) + "_popular"
                }
                renderItem={({ item }) => renderDestinationCard(item)}
                contentContainerStyle={{ paddingVertical: 4 }}
              />

              {/* Promo 1 */}
              <View style={styles.promoCardLarge}>
                <View style={styles.promoBoxLeft} />
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>
                    Museum Kelahiran Bung Hatta
                  </Text>
                  <Text style={styles.promoSubtitle}>
                    Gratis tiket masuk di hari kerja!
                  </Text>
                </View>
              </View>

              {/* Promo 2 */}
              <View style={styles.promoCardRow}>
                <View style={styles.promoCardLeft}>
                  <Text style={styles.promoSmallTitle}>Kinantan Zoo</Text>
                  <Text style={styles.promoSmallText}>
                    Diskon khusus hari ini
                  </Text>
                  <Text style={styles.promoPercent}>25%</Text>
                </View>
                <View style={styles.promoCardRight} />
              </View>

              {/* Spesial Untukmu */}
              <Text style={styles.sectionTitle}>Spesial Untukmu</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={specialForYou}
                keyExtractor={(item) =>
                  String(item.destination_id) + "_special"
                }
                renderItem={({ item }) => renderDestinationCard(item)}
                contentContainerStyle={{ paddingVertical: 4 }}
              />

              {/* Quotes */}
              <View style={styles.quoteCard}>
                <Text style={styles.quoteText}>
                  Mari, nikmati keindahan alam dan sejarah di Kota Bukittinggi!
                </Text>
                <Text style={[styles.quoteText, { marginTop: 8 }]}>
                  Pesan tiket wisata sekarang dan rasakan liburan yang nyaman
                  tanpa antre panjang.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const HERO_HEIGHT = 220;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  container: {
    flex: 1,
  },
  hero: {
    width: "100%",
    height: HERO_HEIGHT,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(80,47,76,0.35)", // ungu transparan
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#F9F4F5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

    categoryRow: {
    marginTop: 10,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8B8DC",
    backgroundColor: "#F9F4F5",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#502F4C",
    borderColor: "#502F4C",
  },
  categoryChipText: {
    fontSize: 12,
    color: "#70587C",
  },
  categoryChipTextActive: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F4F5",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#C8B8DC",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  micButton: {
    marginLeft: 8,
    backgroundColor: "#502F4C",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },
  destCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  destImage: {
    width: "100%",
    height: 90,
  },
  destImagePlaceholder: {
    backgroundColor: "#E3D6F0",
  },
  destInfo: {
    padding: 8,
  },
  destName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
    color: "#502F4C",
  },
  destPrice: {
    fontSize: 12,
    color: "#70587C",
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  destRating: {
    fontSize: 11,
    marginLeft: 4,
    color: "#555",
  },
  promoCardLarge: {
    marginTop: 16,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  promoBoxLeft: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#C8B8DC",
    marginRight: 12,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 13,
    color: "#70587C",
  },
  promoCardRow: {
    marginTop: 12,
    flexDirection: "row",
  },
  promoCardLeft: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  promoCardRight: {
    flex: 1,
    backgroundColor: "#F1E5F7",
    borderRadius: 20,
  },
  promoSmallTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
    marginBottom: 4,
  },
  promoSmallText: {
    fontSize: 12,
    color: "#70587C",
    marginBottom: 6,
  },
  promoPercent: {
    fontSize: 22,
    fontWeight: "700",
    color: "#502F4C",
  },
  quoteCard: {
    marginTop: 20,
    backgroundColor: "#F8F0F8",
    borderRadius: 20,
    padding: 16,
  },
  quoteText: {
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
    color: "#4E274E",
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
  },
});
