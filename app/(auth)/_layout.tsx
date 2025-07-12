import { Stack } from "expo-router";

/**
 * This layout is for the authentication flow. It's a "dumb" layout that
 * simply provides a Stack navigator for the sign-in and sign-up screens.
 * It does not contain any redirection logic, as that is handled by the
 * root `_layout.tsx` file.
 */
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
