import React from "react";
import { View, StyleSheet, Button, ActivityIndicator } from "react-native";
import { Text } from "@/components/Themed";
import { Stack, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HostDashboardScreen() {
  const user = useQuery(api.user.me);
  const router = useRouter();

  const handleJoinSocially = () => {
    router.push("/(onboarding)/(social)/profile-setup");
  };

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Host Dashboard" }} />
      <Text style={styles.title}>Host Dashboard</Text>
      <Text style={styles.subtitle}>
        Welcome to your host dashboard. This is a placeholder screen.
      </Text>
      {!user?.socialProfile && (
        <View style={styles.ctaContainer}>
          <Button title="Join Events Socially" onPress={handleJoinSocially} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  ctaContainer: {
    position: "absolute",
    bottom: 50,
  },
});
