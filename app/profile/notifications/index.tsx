import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "bukitrip_notifications";

type NotificationSettings = {
  allow: boolean;
  order: boolean;
  promo: boolean;
  reminder: boolean;
  system: boolean;
};

const defaultValues: NotificationSettings = {
  allow: true,
  order: true,
  promo: true,
  reminder: true,
  system: true,
};

const NotificationScreen: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>(defaultValues);

  useEffect(() => {
    const loadSettings = async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings(JSON.parse(raw));
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async (field: keyof NotificationSettings, value: boolean) => {
    const updated = { ...settings, [field]: value };

    // kalau master switch mati, semua ikut mati
    if (field === "allow" && value === false) {
      updated.order = false;
      updated.promo = false;
      updated.reminder = false;
      updated.system = false;
    }

    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
      </View>

      {/* Body */}
      <View style={styles.container}>
        {/* Master Switch */}
        <View style={styles.row}>
          <Text style={styles.label}>Izinkan Notifikasi</Text>
          <Switch
            value={settings.allow}
            onValueChange={(v) => updateSetting("allow", v)}
            thumbColor="#fff"
            trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
          />
        </View>

        {/* Individual switches */}
        <View style={styles.row}>
          <Text style={styles.label}>Pesanan</Text>
          <Switch
            value={settings.order && settings.allow}
            disabled={!settings.allow}
            onValueChange={(v) => updateSetting("order", v)}
            thumbColor="#fff"
            trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Event & Promo</Text>
          <Switch
            value={settings.promo && settings.allow}
            disabled={!settings.allow}
            onValueChange={(v) => updateSetting("promo", v)}
            thumbColor="#fff"
            trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pengingat kunjungan</Text>
          <Switch
            value={settings.reminder && settings.allow}
            disabled={!settings.allow}
            onValueChange={(v) => updateSetting("reminder", v)}
            thumbColor="#fff"
            trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Update sistem</Text>
          <Switch
            value={settings.system && settings.allow}
            disabled={!settings.allow}
            onValueChange={(v) => updateSetting("system", v)}
            thumbColor="#fff"
            trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 14,
    paddingHorizontal: 16,
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
  container: {
    padding: 16,
  },
  row: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: "#502F4C",
  },
});