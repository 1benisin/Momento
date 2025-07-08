import { Redirect, Stack } from "expo-router";
import { useConvexAuth } from "convex/react";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return null; // or a loading indicator
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
