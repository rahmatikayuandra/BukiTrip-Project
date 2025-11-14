import { View, Text, StyleSheet } from "react-native";

export default function OrderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders 🧾</Text>
      <Text style={styles.subtitle}>Track your bookings and payments.</Text>

      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>Bali Getaway</Text>
        <Text style={styles.orderStatus}>Status: Confirmed</Text>
      </View>

      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>City Tour</Text>
        <Text style={styles.orderStatus}>Status: Pending Payment</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 15, color: "gray", marginTop: 4, marginBottom: 20 },
  orderCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  orderTitle: { fontSize: 18, fontWeight: "600" },
  orderStatus: { marginTop: 4, color: "gray" },
});