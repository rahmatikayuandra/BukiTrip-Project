import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "bukitrip_language";

const LanguageScreen: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<"id" | "en">("id");

  useEffect(() => {
    const loadLang = async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved === "id" || saved === "en") {
        setLang(saved);
      }
    };
    loadLang();
  }, []);

  const updateLang = async (newLang: "id" | "en") => {
    setLang(newLang);
    await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
  };

  const renderItem = (label: string, code: "id" | "en") => (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => updateLang(code)}
    >
      <Text style={styles.itemText}>{label}</Text>

      {lang === code && (
        <Ionicons name="checkmark" size={20} color="#502F4C" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bahasa</Text>
      </View>

      {/* Content */}
      <View style={styles.container}>
        {renderItem("Indonesia", "id")}
        {renderItem("Inggris", "en")}
      </View>
    </View>
  );
};

export default LanguageScreen;

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
    marginTop: 10,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemText: {
    fontSize: 14,
    color: "#502F4C",
  },
});