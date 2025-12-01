// app/payment/[method].tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PaymentMethodScreen: React.FC = () => {
  const router = useRouter();
  const { method, amount } = useLocalSearchParams<{ method: string; amount?: string }>();

  const niceLabel =
    method === "QRIS"
      ? "QRIS"
      : method === "e-wallet"
      ? "E-Wallet"
      : method === "Bank Transfer"
      ? "Transfer Bank"
      : "Bayar di Tempat";

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#502F4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{niceLabel}</Text>
      </View>

      <View style={styles.content}>
        {method === "QRIS" && (
          <>
            <Text style={styles.title}>Scan QRIS untuk pembayaran</Text>
            {/* QR dummy aja */}
            <View style={styles.qrBox}>
              <Text style={styles.qrDummy}>QR DUMMY</Text>
            </View>
          </>
        )}

        {method === "Bank Transfer" && (
          <>
            <Text style={styles.title}>Transfer ke rekening berikut:</Text>
            <Text style={styles.info}>Bank Dummy BukiTrip</Text>
            <Text style={styles.infoBold}>1234 5678 90</Text>
            <Text style={styles.info}>a.n. PT BukiTrip Indonesia</Text>
          </>
        )}

        {method === "e-wallet" && (
          <>
            <Text style={styles.title}>Bayar via e-wallet:</Text>
            <Text style={styles.info}>Nomor tujuan:</Text>
            <Text style={styles.infoBold}>0812 0000 1234</Text>
            <Text style={styles.info}>Nama: BukiTrip Official</Text>
          </>
        )}

        {method === "COD" && (
          <>
            <Text style={styles.title}>Bayar di tempat</Text>
            <Text style={styles.info}>
              Silakan lakukan pembayaran langsung saat tiba di destinasi.
            </Text>
          </>
        )}

        {amount && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.info}>Total yang harus dibayar:</Text>
            <Text style={styles.amount}>Rp {Number(amount).toLocaleString("id-ID")}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentMethodScreen;

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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 8,
  },
  info: {
    fontSize: 13,
    color: "#70587C",
  },
  infoBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#502F4C",
  },
  qrBox: {
    marginTop: 12,
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#E3D6F0",
    justifyContent: "center",
    alignItems: "center",
  },
  qrDummy: {
    fontSize: 16,
    fontWeight: "700",
    color: "#502F4C",
  },
});