import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";

export default function VerificationPromptScreen() {
  const router = useRouter();

  const handleVerifyNow = () => {
    // For now, just complete onboarding and let the root layout redirect.
    handleCompleteOnboarding();
  };

  const handleDoThisLater = () => {
    handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = () => {
    // The user has a host profile now, so we can send them to the host-side
    // of the app. We use `replace` to prevent them from navigating back
    // to the onboarding flow.
    router.replace("/(tabs)/(host)/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Required</Text>
      <Text style={styles.subtitle}>
        To ensure the safety of our community, you'll need to verify your
        identity before you can publish an event.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleVerifyNow}>
        <Text style={styles.buttonText}>Verify Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleDoThisLater}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Do This Later
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#e9ecef",
  },
  secondaryButtonText: {
    color: "#007bff",
  },
});
