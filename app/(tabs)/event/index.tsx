// app/(tabs)/event/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { EventItem, getEvents } from "../../../constants/api";

const EventScreen: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await getEvents();
      if (res.status === "success") {
        setEvents(res.data);
      } else {
        setError(res.message);
        setEvents([]);
      }
    } catch (e) {
      console.error(e);
      setError("Gagal memuat event");
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const formatTanggal = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCountdown = (dateStr: string) => {
  const today = new Date();
  const event = new Date(dateStr);
  const diff = event.getTime() - today.getTime();

  if (diff <= 0) return "Hari ini!";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} hari lagi`;
};

const renderItem = ({ item }: { item: EventItem }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.9}
    onPress={() =>
      router.push({
        pathname: "/destination/[id]",
        params: { id: item.destination_id },
      })
    }
  >
    {/* Banner + overlay */}
    <View style={styles.bannerWrapper}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.bannerImage} />
      ) : (
        <View style={[styles.bannerImage, styles.eventBannerPlaceholder]} />
      )}

      {/* Overlay gradient */}
      <View style={styles.gradientOverlay} />

      {/* Countdown */}
      <View style={styles.countdownBadge}>
        <Ionicons name="time-outline" size={14} color="#FFF" />
        <Text style={styles.countdownText}>{getCountdown(item.start_date)}</Text>
      </View>

      {/* Event title on banner */}
      <View style={styles.bannerTextWrapper}>
        <Text style={styles.bannerTitle}>{item.event_name}</Text>
        <Text style={styles.bannerSubtitle}>{item.destination_name}</Text>
      </View>
    </View>

    {/* Bottom section */}
    <View style={{ padding: 14 }}>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={16} color="#70587C" />
        <Text style={styles.dateText}>{formatTanggal(item.start_date)}</Text>
      </View>

      <View style={styles.ctaRow}>
        <Text style={styles.ctaText}>Pesan tiketmu sekarang</Text>
        <Ionicons name="arrow-forward" size={18} color="#502F4C" />
      </View>
    </View>
  </TouchableOpacity>
);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>Memuat event...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load}>
          <Text style={styles.retryText}>Coba lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroSmall}>ADA BEBERAPA EVENT NIH</Text>
        <Text style={styles.heroBig}>LIAT YUK!!</Text>
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.event_id)}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada event aktif saat ini.</Text>
        }
      />
    </View>
  );
};

export default EventScreen;

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

  /* HERO */
  hero: {
    paddingTop: Platform.OS === "ios" ? 40 : 24,
    paddingBottom: 24,
    backgroundColor: "#E5DAF2",
    alignItems: "center",
  },
  heroSmall: {
    fontSize: 13,
    color: "#70587C",
    letterSpacing: 1,
  },
  heroBig: {
    fontSize: 20,
    marginTop: 4,
    fontWeight: "700",
    color: "#502F4C",
  },

  /* EVENT CARD */
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  eventBanner: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  eventBannerPlaceholder: {
    backgroundColor: "#E3D6F0",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#502F4C",
  },
  eventPlace: {
    fontSize: 13,
    color: "#70587C",
    marginTop: 2,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
  },

  ctaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
  },

  emptyText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#70587C",
  },

  retryButton: {
    borderWidth: 1,
    borderColor: "#502F4C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  retryText: {
    color: "#502F4C",
    fontSize: 13,
    fontWeight: "500",
  },
  bannerWrapper: {
  height: 170,
  borderRadius: 20,
  overflow: "hidden",
  marginBottom: 10,
  backgroundColor: "#DDD",
},

bannerImage: {
  width: "100%",
  height: "100%",
},

gradientOverlay: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "45%",
  backgroundColor: "rgba(0,0,0,0.45)",
},

bannerTextWrapper: {
  position: "absolute",
  bottom: 12,
  left: 14,
},

bannerTitle: {
  color: "#FFF",
  fontSize: 18,
  fontWeight: "700",
},

bannerSubtitle: {
  color: "#EADCF7",
  fontSize: 13,
  marginTop: 2,
},

countdownBadge: {
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "rgba(0,0,0,0.55)",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
},

countdownText: {
  color: "#FFF",
  fontSize: 12,
  fontWeight: "600",
},
});

