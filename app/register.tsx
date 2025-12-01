// app/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { registerUser } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !username || !password || !confirm) {
      Alert.alert("Oops", "Semua field harus diisi");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Oops", "Password dan konfirmasi tidak sama");
      return;
    }

    if (!acceptTerms) {
      Alert.alert(
        "Oops",
        "Kamu harus menyetujui Terms of Use & Privacy Policy"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name, email, username, password });

      if (res.status === "success") {
        try {
          await AsyncStorage.setItem("bukitrip_user", JSON.stringify(res.user));
        } catch (e) {
          console.warn("Gagal menyimpan user ke storage", e);
        }

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Gagal", res.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Tidak bisa terhubung ke server. Cek koneksi & URL API."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>BukiTrip</Text>
          <Text style={styles.subtitle}>Bergabung & jelajahi Bukittinggi</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="person-outline"
                size={18}
                color="#70587C"
                style={styles.icon}
              />
              <TextInput
                placeholder="Nama lengkap"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#70587C"
                style={styles.icon}
              />
              <TextInput
                placeholder="contoh@email.com"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="at-outline"
                size={18}
                color="#70587C"
                style={styles.icon}
              />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#70587C"
                style={styles.icon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#70587C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#70587C"
                style={styles.icon}
              />
              <TextInput
                placeholder="Konfirmasi password"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                value={confirm}
                onChangeText={setConfirm}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#70587C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View
              style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
            >
              {acceptTerms && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I accept the{" "}
              <Text
                style={styles.termsLink}
                onPress={() => router.push("/terms")}
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                style={styles.termsLink}
                onPress={() => router.push("/privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.8 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* --- SOCIAL LOGIN SECTION --- */}
          <View style={styles.socialSeparator}>
            <View style={styles.socialLine} />
            <Text style={styles.socialText}>Or sign up with</Text>
            <View style={styles.socialLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Sign up dengan Google belum tersedia ya 😊"
                )
              }
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Sign up dengan Apple belum tersedia ya 😊"
                )
              }
            >
              <Ionicons name="logo-apple" size={20} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Sign up dengan Facebook belum tersedia ya 😊"
                )
              }
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.bottomTextContainer}>
            <Text style={styles.smallText}>
              Already have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => router.replace("/login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F4F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    color: "#502F4C",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#70587C",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 26,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#502F4C",
    textAlign: "center",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#70587C",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8B8DC",
    backgroundColor: "#F9F4F5",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    color: "#000000",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#70587C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#70587C",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 12,
  },
  termsText: {
    fontSize: 12,
    color: "#70587C",
    flexShrink: 1,
  },
  termsLink: {
    color: "#502F4C",
    fontWeight: "600",
  },
  button: {
    marginTop: 6,
    backgroundColor: "#502F4C",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* SOCIAL STYLES */
  socialSeparator: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  socialLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E1D6F0",
  },
  socialText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#70587C",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  bottomTextContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  smallText: {
    fontSize: 12,
    color: "#70587C",
  },
  linkText: {
    fontSize: 12,
    color: "#502F4C",
    fontWeight: "600",
  },
});
