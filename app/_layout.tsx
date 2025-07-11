/**
 * @file This is the root layout file for the entire application.
 *
 * @see https://docs.expo.dev/router/layouts/
 *
 * This file is responsible for three main things:
 * 1.  Setting up global providers that wrap the entire app, such as `ClerkProvider` for authentication,
 *     `ConvexProviderWithClerk` for the database, and `ThemeProvider` for light/dark mode.
 * 2.  Loading essential assets like fonts and managing the splash screen.
 * 3.  Defining the core navigation logic in the `InitialLayout` component, which acts as the
 *     central "router" based on the user's authentication and onboarding state.
 */

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
import {
  ClerkProvider,
  useAuth,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useQuery } from "convex/react";
import { ActivityIndicator, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { UserStatuses } from "@/convex/schema";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MenuProvider } from "react-native-popup-menu";

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
 * and rendering the core routing logic using Clerk's loading and authentication state components.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MenuProvider>
        {/* The ClerkLoading component will be rendered while Clerk is checking the user's authentication state. */}
        <ClerkLoading>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        </ClerkLoading>
        {/* Once Clerk has loaded, the ClerkLoaded component will render its children. */}
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </MenuProvider>
    </ThemeProvider>
  );
}

/**
 * InitialLayout is the core of the navigation logic. It functions as a state machine
 * that determines which main section of the app to display based on the user's context.
 * This component is the "single source of truth" for top-level navigation.
 *
 * The logic is as follows:
 * - If the user is not signed in, they are directed to the `(auth)` flow.
 * - If the user is signed in but has not completed onboarding, they are sent to the `(onboarding)` flow.
 * - If the user is signed in and fully onboarded, they are shown the main `(tabs)` interface.
 *
 * This centralized approach prevents navigation conflicts and makes the routing behavior predictable and easy to debug.
 */
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const userData = useQuery(api.user.me);
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";
  const inOnboardingGroup = segments[0] === "(onboarding)";
  const inTabsGroup = segments[0] === "(tabs)";

  // `isLoading` is true until Clerk has loaded and we have the initial user data.
  const isLoading = !isLoaded || (isSignedIn && userData === undefined);

  useEffect(() => {
    // Wait until all authentication and user data is loaded before making routing decisions.
    if (isLoading) return;

    // If the user is not signed in, ensure they are in the auth flow.
    // Otherwise, redirect them to the sign-in page.
    if (!isSignedIn) {
      if (!inAuthGroup) {
        router.replace("/(auth)/sign-in");
      }
      return;
    }

    // If the user IS signed in, they should NOT be in the auth flow.
    // This handles the edge case where the user presses the back button from the main app
    // or if they are somehow navigated to a sign-in screen while already authenticated.
    if (inAuthGroup) {
      router.replace("/(tabs)/(social)/discover");
      return;
    }

    // Main logic for authenticated users
    if (userData) {
      // If onboarding is not complete, ensure they are in the onboarding flow.
      if (userData.status === UserStatuses.PENDING_ONBOARDING) {
        if (!inOnboardingGroup) {
          router.replace("/(onboarding)/role-selection");
        }
        // If the user is fully onboarded and active, ensure they are in the main tabs flow.
      } else if (userData.status === UserStatuses.ACTIVE) {
        if (!inTabsGroup) {
          // Direct the user to the correct dashboard based on their active role.
          if ((userData as any).active_role === "host") {
            // @ts-ignore - Host dashboard route exists but may not be in the generated type
            router.replace("/(tabs)/(host)/dashboard");
          } else {
            router.replace("/(tabs)/(social)/discover");
          }
        }
      }
    }
  }, [
    isLoading,
    isSignedIn,
    userData,
    inAuthGroup,
    inOnboardingGroup,
    inTabsGroup,
    router,
  ]);

  const loadingView = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );

  // While the useEffect is determining the correct route, we show a loading indicator.
  // This prevents a "flash" of the wrong screen while the redirect is happening.
  if (isLoading) {
    return loadingView;
  }

  // This logic ensures that we don't render a screen that is about to be redirected from.
  // For example, if a signed-in user lands on an auth screen, we show the loading view
  // while the `useEffect` navigates them away.
  if (isSignedIn) {
    if (
      (userData?.status === UserStatuses.PENDING_ONBOARDING &&
        !inOnboardingGroup) ||
      (userData?.status === UserStatuses.ACTIVE && !inTabsGroup)
    ) {
      return loadingView;
    }
  } else {
    if (!inAuthGroup) {
      return loadingView;
    }
  }

  return (
    <Stack>
      {/* These are the three main navigators of the app. The `InitialLayout`
          component ensures that only the correct one is active at any time. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
    </Stack>
  );
}
