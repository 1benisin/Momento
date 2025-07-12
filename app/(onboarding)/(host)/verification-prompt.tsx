import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/Themed";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function VerificationPromptScreen() {
  const router = useRouter();
  const completeOnboarding = useMutation(api.user.completeOnboarding);

  const handleVerifyNow = async () => {
    // For now, just complete onboarding and let the root layout redirect.
    await handleCompleteOnboarding();
  };

  const handleDoThisLater = async () => {
    await handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
      // The root layout will handle navigation once the user status is updated.
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      Alert.alert("Error", "Could not complete onboarding. Please try again.");
    }
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
