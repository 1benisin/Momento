import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import { Stack } from "expo-router";

export default function HostDashboardScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Host Dashboard" }} />
      <Text style={styles.title}>Host Dashboard</Text>
      <Text style={styles.subtitle}>
        Welcome to your host dashboard. This is a placeholder screen.
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
});
