import "expo-dev-client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { ActivityIndicator, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  // Your Convex client options go here
});

/**
 * RootLayout is the main layout for the entire app. It sets up all the necessary providers.
 * - ClerkProvider: Manages user authentication state.
 * - ConvexProviderWithClerk: Connects the Convex backend with Clerk for authenticated data access.
 * It also handles font loading and splash screen management.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RootLayoutNav />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

/**
 * RootLayoutNav is responsible for setting up the navigation theme (dark/light mode)
 * and rendering the core routing logic.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <InitialLayout />
    </ThemeProvider>
  );
}

/**
 * InitialLayout is the core component that handles the routing logic based on authentication state.
 * - It uses `useConvexAuth` to check if the user is authenticated.
 * - While checking (`isLoading`), it can show a loading indicator.
 * - Based on the `isAuthenticated` status, it uses `useRouter` to navigate the user to either:
 *   - The main app content `(tabs)` if they are signed in.
 *   - The sign-in screen `(auth)` if they are not.
 * It ensures that users cannot access protected routes without being authenticated.
 */
function InitialLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && !inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }
  return (
    <View style={{ flex: 1 }} testID="app-ready">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
