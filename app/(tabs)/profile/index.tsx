import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.pravatar.cc/200" }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Ika Cantik</Text>
      <Text style={styles.email}>ika@example.com</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Edit Profile</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Settings</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Logout</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700" },
  email: { color: "gray", marginBottom: 20 },
  card: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardText: { fontSize: 16 },
});