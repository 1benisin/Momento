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
import '../global.css'
import 'expo-dev-client'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native'
import {useFonts} from 'expo-font'
import {Stack, useRouter, useSegments} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import 'react-native-reanimated'
import 'react-native-get-random-values'
import {
  ClerkProvider,
  useAuth,
  ClerkLoading,
  ClerkLoaded,
} from '@clerk/clerk-expo'
import {tokenCache} from '@clerk/clerk-expo/token-cache'
import {ConvexProviderWithClerk} from 'convex/react-clerk'
import {ConvexReactClient, useQuery, useMutation} from 'convex/react'
import {ActivityIndicator, View, Text} from 'react-native'
import {api} from '@/convex/_generated/api'
import {useColorScheme} from '@/hooks/useColorScheme'
import {MenuProvider} from 'react-native-popup-menu'
import {devLog} from '@/utils/devLog'
import {StripeProvider} from '@/components/StripeProvider'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  // Your Convex client options go here
})

/**
 * RootLayout is the main layout for the entire app. It sets up all the necessary providers.
 * - ClerkProvider: Manages user authentication state.
 * - ConvexProviderWithClerk: Connects the Convex backend with Clerk for authenticated data access.
 * It also handles font loading and splash screen management.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <StripeProvider>
          <RootLayoutNav />
        </StripeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

/**
 * RootLayoutNav is responsible for setting up the navigation theme (dark/light mode)
 * and rendering the core routing logic using Clerk's loading and authentication state components.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MenuProvider>
        {/* The ClerkLoading component will be rendered while Clerk is checking the user's authentication state. */}
        <ClerkLoading>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        </ClerkLoading>
        {/* Once Clerk has loaded, the ClerkLoaded component will render its children. */}
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </MenuProvider>
    </ThemeProvider>
  )
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
  const {isLoaded, isSignedIn} = useAuth()
  const userData = useQuery(api.user.me)
  const getOrCreateUser = useMutation(api.user.getOrCreateUser)
  const segments = useSegments()
  const router = useRouter()

  const inAuthGroup = segments[0] === '(auth)'
  const inOnboardingGroup = segments[0] === '(onboarding)'
  const inTabsGroup = segments[0] === '(tabs)'

  // `isLoading` is true until Clerk has loaded and we have the initial user data.
  const isLoading = !isLoaded || (isSignedIn && userData === undefined)

  useEffect(() => {
    devLog('[InitialLayout] Segments:', segments.join('/'))
    devLog('[InitialLayout] Group states:', {
      inAuthGroup,
      inOnboardingGroup,
      inTabsGroup,
    })
    // Store the user in the database as soon as they are signed in.
    // This is idempotent and will only create a new user if one doesn't
    // already exist.
    if (isSignedIn) {
      devLog('[InitialLayout] Signed in, calling getOrCreateUser')
      getOrCreateUser({})
    }
  }, [isSignedIn, getOrCreateUser])

  useEffect(() => {
    if (isLoading) {
      devLog('[InitialLayout] isLoading is true, waiting for data...')
      return
    }

    // The user is not signed in and not in the auth group, press them into the auth flow.
    if (!isSignedIn) {
      if (!inAuthGroup) {
        devLog('[InitialLayout] Not signed in, redirecting to /auth/sign-in')
        router.replace('/(auth)/sign-in')
      } else {
        devLog('[InitialLayout] Not signed in, already in auth group')
      }
      return
    }

    // If the user IS signed in, they should NOT be in the auth flow.
    if (inAuthGroup) {
      devLog(
        '[InitialLayout] Signed in, but in auth group. Redirecting to /tabs/(social)/discover',
      )
      router.replace('/(tabs)/(social)/discover') // Default route for signed-in users
      return
    }

    // Main logic for authenticated users based on onboarding state
    if (userData) {
      const {socialProfile, hostProfile} = userData

      // Only force onboarding if both profiles are missing
      if (!socialProfile && !hostProfile) {
        if (!inOnboardingGroup) {
          devLog(
            '[InitialLayout] Signed in, missing both socialProfile and hostProfile, redirecting to onboarding',
          )
          router.replace('/(onboarding)/role-selection')
        } else {
          devLog(
            '[InitialLayout] Signed in, missing both socialProfile and hostProfile, already in onboarding group',
          )
        }
        // Key Fix: Once we're in the onboarding flow, stop all routing logic
        // in this root layout to prevent conflicts.
        return
      } else {
        // User has at least one profile.
        // If they are not in tabs and not in onboarding, then direct them to tabs.
        // This allows them to enter the onboarding flow to create a second profile.
        if (!inTabsGroup && !inOnboardingGroup) {
          const dashboard = hostProfile
            ? '/(tabs)/(host)/dashboard'
            : '/(tabs)/(social)/discover'
          devLog(
            '[InitialLayout] Signed in, has profile, not in tabs/onboarding, redirecting to',
            dashboard,
          )
          router.replace(dashboard)
        } else {
          devLog(
            '[InitialLayout] Signed in, has profile, in tabs or onboarding. No redirect.',
          )
        }
      }
    } else {
      devLog('[InitialLayout] Signed in, but userData is null')
    }
  }, [isLoading, isSignedIn, userData, segments, router])

  const loadingView = (msg: string) => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
      <Text style={{marginTop: 16, color: 'gray'}}>{msg}</Text>
    </View>
  )

  // While the useEffect is determining the correct route, we show a loading indicator
  // to prevent a "flash" of the wrong screen.
  if (isLoading) {
    devLog('[InitialLayout] Rendering loadingView (isLoading)')
    return loadingView('loadingView (isLoading)')
  }

  // If the user is signed in but their record hasn't been created yet
  // (e.g., the `store` mutation is in flight), show a loading screen.
  if (isSignedIn && userData === null) {
    devLog(
      '[InitialLayout] Rendering loadingView (signed in, userData is null)',
    )
    return loadingView('loadingView (signed in, userData is null)')
  }

  // This logic prevents rendering a screen that is about to be redirected.
  if (isSignedIn && userData) {
    const {socialProfile, hostProfile} = userData
    // Only show loading if both are missing and we are not in the onboarding flow yet.
    if (!socialProfile && !hostProfile && !inOnboardingGroup) {
      devLog(
        '[InitialLayout] Rendering loadingView (signed in, missing both profile fields, not yet in onboarding group)',
      )
      return loadingView('Redirecting to onboarding...')
    }
  }
  if (!isSignedIn && !inAuthGroup) {
    devLog(
      '[InitialLayout] Rendering loadingView (not signed in, not in auth group)',
    )
    return loadingView('loadingView (not signed in, not in auth group)')
  }

  devLog('[InitialLayout] Rendering Stack (main navigation)')
  return (
    <Stack>
      {/* These are the three main navigators of the app. The `InitialLayout`
          component ensures that only the correct one is active at any time. */}
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen name="modal" options={{presentation: 'modal'}} />
      <Stack.Screen name="(auth)" options={{headerShown: false}} />
      <Stack.Screen name="(onboarding)" options={{headerShown: false}} />
    </Stack>
  )
}
