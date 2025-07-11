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
        <ClerkLoading>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        </ClerkLoading>
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </MenuProvider>
    </ThemeProvider>
  );
}

/**
 * InitialLayout is the core component that handles the routing logic based on authentication state.
 * - It uses Clerk's `useAuth` to check if the user is signed in.
 * - It uses Convex's `useQuery` to fetch the user's data, including their onboarding status.
 * - Based on these states, it imperatively navigates the user to the correct screen:
 *   - `(auth)` flow if signed out.
 *   - `(onboarding)` flow if signed in but onboarding is not complete.
 *   - `(tabs)` flow if signed in and onboarded.
 */
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const userData = useQuery(api.user.me);
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";
  const inOnboardingGroup = segments[0] === "(onboarding)";
  const inTabsGroup = segments[0] === "(tabs)";

  const isLoading = !isLoaded || (isSignedIn && userData === undefined);

  useEffect(() => {
    if (isLoading) return;

    if (isSignedIn) {
      if (userData) {
        if (userData.status === UserStatuses.PENDING_ONBOARDING) {
          if (!inOnboardingGroup) {
            router.replace("/(onboarding)/role-selection");
          }
        } else if (userData.status === UserStatuses.ACTIVE) {
          if (!inTabsGroup) {
            router.replace("/(tabs)");
          }
        }
      }
    } else {
      if (!inAuthGroup) {
        router.replace("/sign-in");
      }
    }
  }, [
    isLoading,
    isSignedIn,
    userData,
    inAuthGroup,
    inOnboardingGroup,
    inTabsGroup,
  ]);

  const loadingView = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (isLoading) {
    return loadingView;
  }

  // If we are not in the correct route group, the useEffect above is triggering a
  // redirect. We return the loading view to prevent a flash of the wrong screen.
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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
    </Stack>
  );
}
