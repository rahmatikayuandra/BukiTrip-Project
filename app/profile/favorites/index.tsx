// app/profile/favorites/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Destination, getDestinations } from "../../../constants/api";

const FAV_KEY = "bukitrip_favorites";

const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(FAV_KEY);
        const favIds = raw ? JSON.parse(raw) : [];
        setFavorites(favIds);

        const res = await getDestinations();
        if (res.status === "success") {
          // filter hanya yang difavoritkan
          const filtered = res.data.filter((d) =>
            favIds.includes(d.destination_id)
          );
          setDestinations(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const removeFavorite = async (id: number) => {
    const newFav = favorites.filter((x) => x !== id);
    setFavorites(newFav);
    setDestinations(destinations.filter((d) => d.destination_id !== id));
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(newFav));
  };

  const renderItem = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/destination/[id]", params: { id: item.destination_id } })
      }
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.destination_name}
        </Text>
        <Text style={styles.price}>Rp {item.price_adult}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F5C045" />
          <Text style={styles.ratingText}>
            {parseFloat(item.rating || "0").toFixed(1)} / 5
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => removeFavorite(item.destination_id)}>
        <Ionicons name="heart" size={22} color="#E63946" />
      </TouchableOpacity>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorit</Text>
      </View>

      {destinations.length === 0 ? (
        <Text style={styles.empty}>Belum ada destinasi favorit.</Text>
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item) => String(item.destination_id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#502F4C",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#70587C",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumb: { width: 60, height: 60, borderRadius: 12 },
  thumbPlaceholder: { backgroundColor: "#E3D6F0" },
  name: { fontSize: 14, fontWeight: "600", color: "#502F4C" },
  price: { fontSize: 12, color: "#70587C", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 11, color: "#70587C" },
});