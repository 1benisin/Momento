import React from "react";
import { StyleSheet, ActivityIndicator, Button } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";

import { api } from "@/convex/_generated/api";
import ModeSwitcher from "@/components/ModeSwitcher";
import { UserRole } from "@/convex/schema";
import { SignOutButton } from "@/components/SignOutButton";
import { Text, View } from "@/components/Themed";

const SettingsScreen = () => {
  const user = useQuery(api.user.me);
  const setActiveRole = useMutation(api.user.setActiveRole);
  const router = useRouter();

  const handleRoleChange = async (role: UserRole) => {
    try {
      await setActiveRole({ role });
    } catch (error) {
      console.error("Failed to switch role:", error);
      // Optionally: show an error message to the user
    }
  };

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  // A user is a "hybrid" user if they have both a social and a host profile.
  const isHybridUser = !!(user?.socialProfile && user?.hostProfile);
  const hasSocial = !!user?.socialProfile;
  const hasHost = !!user?.hostProfile;

  const handleBecomeHost = () => {
    router.push("/(onboarding)/(host)/host-profile-setup");
  };
  const handleCreateSocial = () => {
    router.push("/(onboarding)/(social)/profile-setup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {isHybridUser && user?.active_role && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Mode</Text>
          <ModeSwitcher
            currentRole={user.active_role}
            onRoleChange={handleRoleChange}
          />
        </View>
      )}

      {/* Entry point for creating the other profile type */}
      {!isHybridUser && (
        <View style={styles.section}>
          {!hasHost && (
            <>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                Want to host events?
              </Text>
              <Button title="Become a Host" onPress={handleBecomeHost} />
            </>
          )}
          {!hasSocial && (
            <>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                Want to attend events?
              </Text>
              <Button
                title="Create Social Profile"
                onPress={handleCreateSocial}
              />
            </>
          )}
        </View>
      )}

      {/* Placeholder for future settings */}
      <View style={styles.section}>
        <Text style={{ textAlign: "center" }}>App settings will go here.</Text>
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <SignOutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default SettingsScreen;
