import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AccessibilityScreen = () => {
  const router = useRouter();

  // Dummy states (bisa kamu sambungkan ke AsyncStorage nanti)
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [biggerText, setBiggerText] = useState(false);

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aksesibilitas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* SECTION 1 */}
        <Text style={styles.sectionLabel}>Preferensi Tampilan</Text>

        <View style={styles.card}>
          {/* Reduce Motion */}
          <View style={styles.row}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Kurangi Animasi</Text>
              <Text style={styles.subtitle}>
                Mengurangi animasi untuk pengalaman yang lebih stabil.
              </Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
              thumbColor="#fff"
            />
          </View>

          {/* Bigger Text */}
          <View style={styles.row}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Teks Lebih Besar</Text>
              <Text style={styles.subtitle}>
                Perbesar ukuran teks di dalam aplikasi.
              </Text>
            </View>
            <Switch
              value={biggerText}
              onValueChange={setBiggerText}
              trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
              thumbColor="#fff"
            />
          </View>

          {/* High Contrast */}
          <View style={styles.rowLast}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Mode Kontras Tinggi</Text>
              <Text style={styles.subtitle}>
                Tingkatkan keterbacaan dengan warna berkontras tinggi.
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: "#D8CBEF", true: "#502F4C" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.hint}>
          Pengaturan aksesibilitas hanya berlaku di aplikasi dan tidak memengaruhi
          preferensi sistem perangkat.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AccessibilityScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 10,
    backgroundColor: "#F9F4F5",
  },
  headerIconBtn: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },

  container: {
    padding: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#70587C",
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textGroup: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 2,
    color: "#70587C",
  },

  hint: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    color: "#A48FBF",
  },
});