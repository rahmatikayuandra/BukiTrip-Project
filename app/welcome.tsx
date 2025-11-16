import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the logo
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Auto-navigate to home after a longer delay (3s)
    const t = setTimeout(() => {
      // replace so user can't go back to splash
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(t);
  }, [opacity, router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.splash, { opacity }]}>
        <Image
          source={require("../assets/whitelogo.png")}
          style={styles.logo}
          accessibilityLabel="BukiTrip logo"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    backgroundColor: "#07393c",
  },
  splash: {
    alignItems: "center",
  },
  logo: {
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
  // intentionally minimal styles for splash
});