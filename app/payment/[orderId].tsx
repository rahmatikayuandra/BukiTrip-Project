// app/payment/[orderId].tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type PaymentMethod = "QRIS" | "e-wallet" | "Bank Transfer" | "COD";

const PaymentScreen: React.FC = () => {
  const router = useRouter();
  const { orderId, method, total } = useLocalSearchParams<{
    orderId: string;
    method: PaymentMethod;
    total: string;
  }>();

  const formattedTotal = useMemo(() => {
    const num = Number(total || 0);
    return (
      "Rp " +
      num.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })
    );
  }, [total]);

  const renderContent = () => {
    switch (method) {
      case "QRIS":
        return (
          <>
            <Text style={styles.label}>Scan QRIS berikut:</Text>
            <View style={styles.qrBox}>
              {/* dummy QR - nanti bisa diganti gambar QR asli */}
              <Text style={styles.qrText}>[ QRIS DUMMY ]</Text>
              <Text style={styles.qrCodeText}>BTQR123456</Text>
            </View>
          </>
        );
      case "Bank Transfer":
        return (
          <>
            <Text style={styles.label}>Transfer ke rekening berikut:</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLine}>Bank BukiTrip</Text>
              <Text style={styles.infoLine}>No. Rek: 1234 5678 90</Text>
              <Text style={styles.infoLine}>a.n. BukiTrip Travel</Text>
            </View>
          </>
        );
      case "e-wallet":
        return (
          <>
            <Text style={styles.label}>
              Scan QR e-wallet atau gunakan nomor:
            </Text>
            <View style={styles.qrBox}>
              <Text style={styles.qrText}>[ QR E-WALLET DUMMY ]</Text>
              <Text style={styles.qrCodeText}>EWAL123456</Text>
            </View>

            <View style={[styles.infoBox, { marginTop: 10 }]}>
              <Text style={styles.infoLine}>
                Nomor e-wallet: 0812 0000 1234
              </Text>
              <Text style={styles.infoLine}>a.n. BukiTrip</Text>
            </View>
          </>
        );
      case "COD":
        return (
          <>
            <Text style={styles.label}>Cash on Delivery (COD)</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLine}>
                Silakan bayar langsung pada petugas saat kunjungan.
              </Text>
            </View>
          </>
        );
      default:
        return (
          <Text style={styles.infoLine}>Metode pembayaran tidak dikenali.</Text>
        );
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.orderLabel}>ID Pesanan</Text>
          <Text style={styles.orderId}>#{orderId || "-"}</Text>

          <Text style={[styles.orderLabel, { marginTop: 8 }]}>
            Total Pembayaran
          </Text>
          <Text style={styles.orderTotal}>{formattedTotal}</Text>

          <View style={styles.divider} />

          <Text style={styles.methodLabel}>Metode Pembayaran</Text>
          <Text style={styles.methodValue}>{method || "-"}</Text>

          <View style={{ marginTop: 16 }}>{renderContent()}</View>
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            Alert.alert("Terima kasih!", "Pesananmu sedang diproses 😊", [
              {
                text: "OK",
                onPress: () => router.replace("/(tabs)/home"), // nanti bisa diganti ke tab Order
              },
            ]);
          }}
        >
          <Text style={styles.doneButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 10,
    backgroundColor: "#F9F4F5",
  },
  headerIconBtn: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#502F4C",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  orderLabel: {
    fontSize: 12,
    color: "#70587C",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#502F4C",
  },
  divider: {
    height: 1,
    backgroundColor: "#E3D6F0",
    marginVertical: 12,
  },
  methodLabel: {
    fontSize: 13,
    color: "#70587C",
  },
  methodValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 6,
  },
  infoBox: {
    backgroundColor: "#F3F3F5",
    borderRadius: 12,
    padding: 10,
  },
  infoLine: {
    fontSize: 12,
    color: "#502F4C",
    marginBottom: 2,
  },
  qrBox: {
    backgroundColor: "#F3F3F5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  qrText: {
    fontSize: 12,
    color: "#70587C",
    marginBottom: 6,
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#502F4C",
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
