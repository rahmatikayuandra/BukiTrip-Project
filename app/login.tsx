import { StatusBar } from "expo-status-bar";
// app/login.tsx
import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../constants/api";

const STORAGE_REMEMBER = "bukitrip_remember_me";
const STORAGE_EMAIL = "bukitrip_saved_email";

const LoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Saat screen pertama kali dibuka, cek apakah sebelumnya user pilih "remember me"
  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const remembered = await AsyncStorage.getItem(STORAGE_REMEMBER);
        const savedEmail = await AsyncStorage.getItem(STORAGE_EMAIL);

        if (remembered === "true" && savedEmail) {
          setRememberMe(true);
          setEmail(savedEmail);
        }
      } catch (e) {
        console.warn("Gagal mengambil data remember me", e);
      }
    };

    loadRemembered();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Oops", "Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);

      if (res.status === "success") {
        // Simpan / hapus email sesuai status rememberMe
        try {
          if (rememberMe) {
            await AsyncStorage.setItem(STORAGE_REMEMBER, "true");
            await AsyncStorage.setItem(STORAGE_EMAIL, email);
          } else {
            await AsyncStorage.removeItem(STORAGE_REMEMBER);
            await AsyncStorage.removeItem(STORAGE_EMAIL);
          }
        } catch (e) {
          console.warn("Gagal menyimpan remember me", e);
        }

        try {
          await AsyncStorage.setItem("bukitrip_user", JSON.stringify(res.user));
        } catch (e) {
          console.warn("Gagal menyimpan user ke storage", e);
        }

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login gagal", res.message);
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
      <StatusBar style="dark" backgroundColor="#F9F4F5" />
      <View style={styles.container}>
        {/* Brand & tagline */}
        <View style={styles.header}>
          <Text style={styles.brand}>BukiTrip</Text>
          <Text style={styles.subtitle}>
            Jelajahi Bukittinggi dengan mudah & nyaman.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {/* Email */}
          <View className="field-email" style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#70587C"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Masukkan email"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Masukkan password"
                placeholderTextColor="#A48FBF"
                style={styles.input}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#70587C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember me */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe((prev) => !prev)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          {/* Tombol LOGIN */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.8 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* --- SOCIAL LOGIN SECTION --- */}
          <View style={styles.socialSeparator}>
            <View style={styles.socialLine} />
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.socialLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Login dengan Google belum tersedia ya 😊"
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
                  "Login dengan Apple belum tersedia ya 😊"
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
                  "Login dengan Facebook belum tersedia ya 😊"
                )
              }
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Text create account */}
          <View style={styles.bottomTextContainer}>
            <Text style={styles.smallText}>
              Don’t have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => router.push("/register")}
              >
                Create account
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    marginBottom: 24,
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
    marginBottom: 16,
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
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    color: "#000000",
  },
  eyeButton: {
    paddingLeft: 6,
    paddingVertical: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
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
    color: "#FFFFFF",
    fontSize: 11,
  },
  rememberText: {
    fontSize: 12,
    color: "#70587C",
  },
  button: {
    marginTop: 8,
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
    marginBottom: 8,
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
