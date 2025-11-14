import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to BukiTrip 👋</Text>
      <Text style={styles.subtitle}>
        Discover your next adventure with ease!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Featured Trips</Text>
        <Text style={styles.cardText}>
          Browse our top destinations and book your trip today.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Promo</Text>
        <Text style={styles.cardText}>
          Enjoy exclusive discounts on selected travel packages.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "gray",
  },
});