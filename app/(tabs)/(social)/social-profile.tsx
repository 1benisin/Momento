import { StyleSheet, Button, ActivityIndicator } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import { Text, View } from "@/components/Themed";

export default function SocialProfileScreen() {
  const user = useQuery(api.user.me);
  const router = useRouter();

  const handleBecomeHost = () => {
    router.push("/(onboarding)/(host)/host-profile-setup");
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
      <Text style={styles.title}>Social Profile</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>This is where the user's social profile will be displayed.</Text>

      {!user?.hostProfile && (
        <View style={styles.ctaContainer}>
          <Button title="Become a Host" onPress={handleBecomeHost} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  ctaContainer: {
    position: "absolute",
    bottom: 50,
  },
});
