import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../src/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>Layman</Text>
        <Text style={styles.slogan}>
          Business, tech & startups{" "}
          <Text style={styles.accent}>made simple</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth")}
      >
        <Text style={styles.buttonText}>Swipe to get started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { fontSize: 48, fontWeight: "bold", color: "white", marginBottom: 10 },
  slogan: { fontSize: 18, color: "white" },
  accent: { color: colors.accent, fontWeight: "bold" },
  button: {
    marginBottom: 50,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
