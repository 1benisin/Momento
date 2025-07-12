import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleAttend = () => {
    router.push("/(onboarding)/(social)/profile-setup");
  };

  const handleHost = () => {
    router.push("./(host)/host-profile-setup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How would you like to start?</Text>
      <Text style={styles.subtitle}>
        Choose your primary reason for joining Momento. You can always add the
        other role later.
      </Text>

      <TouchableOpacity style={styles.card} onPress={handleAttend}>
        <Text style={styles.cardTitle}>Attend Events</Text>
        <Text style={styles.cardDescription}>
          Join unique experiences and connect with new people.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleHost}>
        <Text style={styles.cardTitle}>Host Events</Text>
        <Text style={styles.cardDescription}>
          Create your own events and build a community.
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  comingSoonBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffc107",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 10,
  },
});
