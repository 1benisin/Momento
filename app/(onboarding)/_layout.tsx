import { Stack } from "expo-router";
import React from "react";

/**
 * This layout sets up the stack navigator for the multi-step onboarding flow.
 * Each screen in the onboarding process is defined here.
 */
export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="role-selection" options={{ headerShown: false }} />
      <Stack.Screen
        name="(social)/profile-setup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(social)/initial-photo"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
