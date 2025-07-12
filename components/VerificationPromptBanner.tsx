import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Themed";
import { FontAwesome } from "@expo/vector-icons";

type VerificationPromptBannerProps = {
  onPress?: () => void;
};

export default function VerificationPromptBanner({
  onPress,
}: VerificationPromptBannerProps) {
  return (
    <View style={styles.container}>
      <FontAwesome name="exclamation-triangle" size={20} color="#856404" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Verification Required</Text>
        <Text style={styles.subtitle}>
          You must verify your identity to publish events.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffeeba",
    margin: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontWeight: "bold",
    color: "#856404",
  },
  subtitle: {
    color: "#856404",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#856404",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
