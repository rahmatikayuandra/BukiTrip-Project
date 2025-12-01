// app/order/[id].tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Destination,
  Voucher,
  getDestinationDetail,
  getVouchers,
  createOrder,
  PaymentMethod,
} from "../../constants/api";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type StoredUser = {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string | null;
};

const OrderScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const destinationId = Number(id);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [visitDate, setVisitDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper rupiah
  const formatRupiah = (val: number) =>
    "Rp " + val.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        if (!destinationId) {
          throw new Error("ID destinasi tidak valid");
        }

        // 1. detail destinasi
        const detailRes = await getDestinationDetail(destinationId);
        if (detailRes.status === "success") {
          setDestination(detailRes.destination);
        } else {
          throw new Error(detailRes.message);
        }

        // 2. vouchers
        const vRes = await getVouchers(destinationId);
        if (vRes.status === "success") {
          setVouchers(vRes.data);
        }

        // 3. user dari AsyncStorage (disimpan waktu login/register)
        const rawUser = await AsyncStorage.getItem("bukitrip_user");
        if (rawUser) {
          setUser(JSON.parse(rawUser));
        }
      } catch (e: any) {
        console.error(e);
        Alert.alert("Error", e.message || "Gagal memuat data pesanan");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [destinationId]);

  const subtotalAdult = useMemo(() => {
    const price = destination ? parseFloat(destination.price_adult || "0") : 0;
    return adultQty * (price || 0);
  }, [adultQty, destination]);

  const subtotalChild = useMemo(() => {
    const price = destination ? parseFloat(destination.price_child || "0") : 0;
    return childQty * (price || 0);
  }, [childQty, destination]);

  const subtotal = subtotalAdult + subtotalChild;

  const discountAmount = useMemo(() => {
    if (!selectedVoucherId || subtotal <= 0) return 0;
    const v = vouchers.find((x) => x.voucher_id === selectedVoucherId);
    if (!v) return 0;
    const discPercent = parseFloat(v.discount || "0"); // 25.00
    return subtotal * (discPercent / 100);
  }, [selectedVoucherId, vouchers, subtotal]);

  const total = subtotal - discountAmount;

  const handleChangeQty = (type: "adult" | "child", delta: 1 | -1) => {
    if (type === "adult") {
      setAdultQty((prev) => Math.max(0, prev + delta));
    } else {
      setChildQty((prev) => Math.max(0, prev + delta));
    }
  };

  const visitDateLabel = useMemo(
    () =>
      visitDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [visitDate]
  );

  const handleChangeDate = () => {
    setShowDatePicker(true);
  };
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // kalau user tekan "cancel" di Android, jangan ubah apa-apa
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setVisitDate(selectedDate);
    }

    // setelah pilih tanggal, sembunyiin picker lagi
    setShowDatePicker(false);
  };
  const handleConfirm = () => {
    if (!destination || !user) {
      Alert.alert("Oops", "Data belum lengkap.");
      return;
    }
    if (adultQty === 0 && childQty === 0) {
      Alert.alert("Oops", "Minimal 1 tiket harus dipilih.");
      return;
    }

    Alert.alert(
      "Konfirmasi Pesanan",
      `Pesan tiket ke ${destination.destination_name}?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, pesan", onPress: submitOrder },
      ]
    );
  };

  const submitOrder = async () => {
    if (!destination || !user) return;

    setSubmitting(true);
    try {
      const payload = {
        user_id: user.user_id,
        destination_id: destination.destination_id,
        visit_date: visitDate.toISOString().slice(0, 10), // YYYY-MM-DD
        adult_quantity: adultQty,
        child_quantity: childQty,
        payment_method: paymentMethod,
        voucher_id: selectedVoucherId,
      };

      const res = await createOrder(payload);

      console.log("CREATE_ORDER JSON:", res);

      if (res.status === "success") {
        Alert.alert("Selamat! 🎉", "Pesananmu berhasil dibuat.", [
          {
            text: "Lihat pesanan",
            onPress: () => router.replace("/(tabs)/order"),
          },
        ]);
      } else {
        Alert.alert(
          "Gagal",
          res.message + (res.error ? `\n\nDetail: ${res.error}` : "")
        );
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Terjadi kesalahan saat membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !destination) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#502F4C" />
        <Text style={{ marginTop: 8, color: "#70587C" }}>
          Memuat data pesanan...
        </Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Pesan Tiket</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* DESTINATION CARD */}
        <View style={styles.destCard}>
          <View style={styles.destRow}>
            {destination.image_url ? (
              <Image
                source={{ uri: destination.image_url }}
                style={styles.destImage}
              />
            ) : (
              <View style={[styles.destImage, styles.destImagePlaceholder]} />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.destName} numberOfLines={2}>
                {destination.destination_name}
              </Text>
              <View style={styles.destLocationRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color="#70587C"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.destAddress} numberOfLines={2}>
                  {destination.address}
                </Text>
              </View>
            </View>
          </View>

          {/* price badges */}
          <View style={styles.priceBadgesRow}>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeLabel}>Dewasa</Text>
              <Text style={styles.priceBadgeValue}>
                {formatRupiah(parseFloat(destination.price_adult || "0"))}
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeLabel}>Anak-anak</Text>
              <Text style={styles.priceBadgeValue}>
                {formatRupiah(parseFloat(destination.price_child || "0"))}
              </Text>
            </View>
          </View>
        </View>

        {/* Tanggal kunjungan */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Tanggal Kunjungan</Text>

          <TouchableOpacity
            style={styles.datePicker}
            onPress={handleChangeDate}
          >
            <Text style={styles.dateText}>{visitDateLabel}</Text>
            <Ionicons name="chevron-down" size={16} color="#70587C" />
          </TouchableOpacity>

          {/* hint kecil di bawah */}
          <Text style={styles.dateHint}>Pilih tanggal kunjunganmu.</Text>

          {showDatePicker && (
            <DateTimePicker
              value={visitDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()} // supaya ga bisa pilih tanggal yang sudah lewat
              onChange={onChangeDate}
            />
          )}
        </View>

        {/* Jumlah tiket */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Jumlah Tiket</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Dewasa</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleChangeQty("adult", -1)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{adultQty}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleChangeQty("adult", 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Anak-anak</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleChangeQty("child", -1)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{childQty}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleChangeQty("child", 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Data pemesan */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Data Pemesan</Text>
          <View style={styles.bookingCard}>
            <Text style={styles.bookingName}>
              {user?.name?.toUpperCase() || "Nama pemesan"}
            </Text>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.bookingLabel}>e-mail</Text>
              <Text style={styles.bookingValue}>{user?.email || "-"}</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.bookingLabel}>HP</Text>
              <Text style={styles.bookingValue}>
                {user?.phone_number || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Metode pembayaran */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Metode Pembayaran</Text>

          {(
            ["QRIS", "e-wallet", "Bank Transfer", "COD"] as PaymentMethod[]
          ).map((m) => (
            <TouchableOpacity
              key={m}
              style={styles.paymentRow}
              onPress={() => setPaymentMethod(m)}
            >
              <Text style={styles.paymentText}>{m}</Text>
              <Ionicons
                name={
                  paymentMethod === m ? "radio-button-on" : "radio-button-off"
                }
                size={18}
                color="#502F4C"
              />
            </TouchableOpacity>
          ))}

          {/* info dummy */}
          {paymentMethod === "QRIS" && (
            <Text style={styles.paymentHint}>
              Kode QR dummy:{" "}
              <Text style={{ fontWeight: "600" }}>BTQR123456</Text>
            </Text>
          )}
          {paymentMethod === "Bank Transfer" && (
            <Text style={styles.paymentHint}>
              Rekening dummy:{" "}
              <Text style={{ fontWeight: "600" }}>
                1234 5678 90 a.n. BukiTrip
              </Text>
            </Text>
          )}
          {paymentMethod === "e-wallet" && (
            <Text style={styles.paymentHint}>
              Nomor e-wallet dummy:{" "}
              <Text style={{ fontWeight: "600" }}>0812 0000 1234</Text>
            </Text>
          )}
          {paymentMethod === "COD" && (
            <Text style={styles.paymentHint}>
              Bayar di tempat pada saat kunjungan.
            </Text>
          )}
        </View>

        {/* Voucher */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Voucher</Text>
          {vouchers.length === 0 ? (
            <Text style={styles.noVoucher}>
              Belum ada voucher aktif untuk destinasi ini.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {vouchers.map((v) => {
                const selected = v.voucher_id === selectedVoucherId;
                return (
                  <TouchableOpacity
                    key={v.voucher_id}
                    style={[
                      styles.voucherCard,
                      selected && styles.voucherCardSelected,
                    ]}
                    onPress={() =>
                      setSelectedVoucherId(selected ? null : v.voucher_id)
                    }
                  >
                    <Text style={styles.voucherTitle}>{v.voucher_name}</Text>
                    <Text style={styles.voucherDesc} numberOfLines={2}>
                      {v.description}
                    </Text>
                    <Text style={styles.voucherDiscount}>
                      Diskon {parseFloat(v.discount || "0").toFixed(0)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Ringkasan harga */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Ringkasan Harga</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dewasa ({adultQty}x)</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(subtotalAdult)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Anak-anak ({childQty}x)</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(subtotalChild)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Voucher</Text>
              <Text style={styles.summaryValue}>
                {discountAmount > 0 ? "- " + formatRupiah(discountAmount) : "-"}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                {formatRupiah(Math.max(total, 0))}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmButton, submitting && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={submitting}
        >
          <Text style={styles.confirmButtonText}>
            {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 16,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F4F5",
  },
  destCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  destImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  destImagePlaceholder: {
    backgroundColor: "#E3D6F0",
  },
  destName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#502F4C",
  },
  destLocationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  destAddress: {
    flex: 1,
    fontSize: 11,
    color: "#70587C",
  },
  priceBadgesRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  priceBadge: {
    flex: 1,
    backgroundColor: "#E9DEF6",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  priceBadgeLabel: {
    fontSize: 11,
    color: "#70587C",
  },
  priceBadgeValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
  },
  block: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 8,
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C8B8DC",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 13,
    color: "#502F4C",
  },
  dateHint: {
    marginTop: 4,
    fontSize: 11,
    color: "#A48FBF",
  },
  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  qtyLabel: {
    fontSize: 13,
    color: "#502F4C",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E3D6F0",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 16,
    color: "#502F4C",
    fontWeight: "600",
  },
  qtyValue: {
    width: 32,
    textAlign: "center",
    fontSize: 14,
    color: "#502F4C",
  },
  bookingCard: {
    backgroundColor: "#FBEFF7",
    borderRadius: 16,
    padding: 12,
  },
  bookingName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
  bookingChange: {
    fontSize: 12,
    color: "#70587C",
  },
  bookingLabel: {
    fontSize: 11,
    color: "#A48FBF",
  },
  bookingValue: {
    fontSize: 12,
    color: "#502F4C",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 13,
    color: "#502F4C",
  },
  paymentHint: {
    fontSize: 11,
    color: "#70587C",
    marginTop: 4,
  },
  noVoucher: {
    fontSize: 12,
    color: "#70587C",
  },
  voucherCard: {
    width: 180,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E3D6F0",
  },
  voucherCardSelected: {
    borderColor: "#502F4C",
    backgroundColor: "#F3E7FF",
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#502F4C",
    marginBottom: 4,
  },
  voucherDesc: {
    fontSize: 11,
    color: "#70587C",
    marginBottom: 4,
  },
  voucherDiscount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#502F4C",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#70587C",
  },
  summaryValue: {
    fontSize: 12,
    color: "#502F4C",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E3D6F0",
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
  summaryTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#502F4C",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(249,244,245,0.96)",
    borderTopWidth: 1,
    borderTopColor: "#E3D6F0",
  },
  confirmButton: {
    backgroundColor: "#502F4C",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
