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
import { ConvexReactClient, useConvexAuth, useQuery } from "convex/react";
import { ActivityIndicator, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { UserStatuses } from "@/convex/schema";

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
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();
  const userData = useQuery(api.user.me);
  const segments = useSegments();
  const router = useRouter();

  const inTabsGroup = segments[0] === "(tabs)";
  const inOnboardingGroup = segments[0] === "(onboarding)";

  // Wait until both auth and user data fetching are complete.
  // userData === undefined means the query is still loading for the first time.
  const isLoading = isConvexAuthLoading || userData === undefined;

  useEffect(() => {
    if (isLoading) return;

    // If the user is authenticated
    if (isAuthenticated) {
      // and we have their data
      if (userData) {
        if (userData.status === UserStatuses.PENDING_ONBOARDING) {
          // If they are not already in the onboarding flow, redirect them.
          if (!inOnboardingGroup) {
            // Check if they've set their name yet
            if (!userData.socialProfile?.first_name) {
              router.replace("/(onboarding)/profile-setup");
            } else {
              router.replace("/(onboarding)/initial-photo");
            }
          }
        } else if (userData.status === UserStatuses.ACTIVE) {
          // If they are active and not in the main app, send them there.
          if (!inTabsGroup) {
            router.replace("/(tabs)");
          }
        }
      } else {
        // This case handles the race condition: user is auth'd but the Convex user
        // record hasn't been created yet. We do nothing and let the loading
        // indicator continue until `userData` is populated.
        // If userData remains null, something is wrong with the webhook setup.
      }
    } else if (!isAuthenticated) {
      // If they are not authenticated, send them to the sign-in page.
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated, userData, inTabsGroup, inOnboardingGroup]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
    </Stack>
  );
}
