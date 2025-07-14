import { Stack, useRouter, useSegments } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * This component contains the core routing logic for the onboarding flow.
 * It acts as a state machine, redirecting the user to the correct screen
 * based on their `onboardingState` from the database.
 */
function OnboardingFlow() {
  const userData = useQuery(api.user.me);
  const segments = useSegments();
  const router = useRouter();

  // Only show loading spinner while user data is loading
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once data is loaded, allow navigation between onboarding screens freely
  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * The main layout for the (onboarding) flow.
 * It wraps the core logic in a component that can use hooks.
 */
export default function OnboardingLayout() {
  return <OnboardingFlow />;
}
