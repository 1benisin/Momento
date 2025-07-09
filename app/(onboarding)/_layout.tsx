import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="initial-photo" options={{ headerShown: false }} />
    </Stack>
  );
}
