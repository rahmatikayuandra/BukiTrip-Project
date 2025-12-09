// app/(tabs)/profile/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getProfile, UserProfile } from "../../../constants/api";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
  username: string;
};

const ProfileTabScreen: React.FC = () => {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("bukitrip_user");
      if (raw) {
        const u = JSON.parse(raw) as StoredUser;
        setStoredUser(u);

        const res = await getProfile(u.user_id);
        console.log("PROFILE RES:", res);
        if (res.status === "success" && res.user) {
          setProfile(res.user);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSwitchAccount = async () => {
    Alert.alert(
      "Ganti Akun",
      "Apakah Anda yakin ingin mengganti akun? Anda akan diarahkan ke halaman login.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: async () => {
            await AsyncStorage.removeItem("bukitrip_user");
            router.replace("/login");
          },
        },
      ]
    );
  }
  const handleLogout = async () => {
    await AsyncStorage.removeItem("bukitrip_user");
    router.replace("/login");
  };

  if (loading || !storedUser || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* HEADER PROFILE */}
        <View style={styles.headerBox}>
          <View style={styles.headerLeft}>
            {profile.profil_pic ? (
              <Image
                source={{ uri: profile.profil_pic }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color="#B7A3D4" />
              </View>
            )}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.email}>{profile.email}</Text>
              {profile.phone_number && (
                <Text style={styles.phone}>{profile.phone_number}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={() => router.push("/profile/edit")}
          >
            <Ionicons name="create-outline" size={18} color="#502F4C" />
          </TouchableOpacity>
        </View>

        {/* SECTION: PROFIL */}
        <Text style={styles.sectionTitle}>Profil</Text>
        <View style={styles.card}>
          <MenuItem
            label="Akun"
            onPress={() => router.push("/profile/account")}
          />
          <MenuItem
            label="Metode Pembayaran"
            onPress={() => router.push("/profile/payment")}
          />
          <MenuItem
            label="Favorit"
            onPress={() => router.push("/profile/favorites")}
          />
          <MenuItem
            label="Riwayat Pemesanan"
            onPress={() => router.push("/profile/history")}
            isLast
          />
        </View>

        {/* SECTION: PENGATURAN */}
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <View style={styles.card}>
          <MenuItem
            label="Notifikasi"
            onPress={() => router.push("/profile/notifications")}
          />
          <MenuItem
            label="Bahasa"
            onPress={() => router.push("/profile/language")}
          />
          <MenuItem
            label="Aksesibilitas"
            onPress={() => router.push("/profile/accessibility")}
            isLast
          />
        </View>

        {/* HELP */}
        <View style={styles.card}>
          <MenuItem
            label="Help Center"
            onPress={() => router.push("/profile/help")}
          />
          <MenuItem
            label="FAQ"
            onPress={() => router.push("/profile/faq")}
            isLast
          />
        </View>

        {/* BUTTONS */}
        <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSwitchAccount}
          >
            <Text style={styles.secondaryButtonText}>Ganti Akun</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


const MenuItem: React.FC<{
  label: string;
  onPress: () => void;
  isLast?: boolean;
}> = ({ label, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.menuRow, isLast && { borderBottomWidth: 0 }]}
    onPress={onPress}
  >
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#C0B1D9" />
  </TouchableOpacity>
);


export default ProfileTabScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F4F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E5DAF2",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3D6F0",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "700", color: "#502F4C" },
  email: { fontSize: 12, color: "#70587C", marginTop: 2 },
  phone: { fontSize: 12, color: "#70587C", marginTop: 2 },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0E6F7",
  },
  menuLabel: {
    fontSize: 13,
    color: "#502F4C",
  },
  secondaryButton: {
    borderRadius: 22,
    backgroundColor: "#502F4C",
    paddingVertical: 11,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#502F4C",
    paddingVertical: 11,
    alignItems: "center",
  },
  logoutText: {
    color: "#502F4C",
    fontSize: 14,
    fontWeight: "600",
  },
});
