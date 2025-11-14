import { View, Text, StyleSheet } from "react-native";

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events 🎉</Text>
      <Text style={styles.subtitle}>
        Stay updated with the latest events and activities.
      </Text>

      <View style={styles.eventCard}>
        <Text style={styles.eventName}>Mountain Hiking</Text>
        <Text style={styles.eventDate}>12 Nov 2025</Text>
      </View>

      <View style={styles.eventCard}>
        <Text style={styles.eventName}>Beach Festival</Text>
        <Text style={styles.eventDate}>20 Dec 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { marginTop: 4, fontSize: 15, color: "gray", marginBottom: 20 },
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  eventName: { fontSize: 18, fontWeight: "600" },
  eventDate: { color: "gray", marginTop: 4 },
});