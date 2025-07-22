import {Stack} from 'expo-router'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {ActivityIndicator, View, Text} from 'react-native'

/**
 * This component contains the core routing logic for the onboarding flow.
 * It acts as a state machine, redirecting the user to the correct screen
 * based on their `onboardingState` from the database.
 */
function OnboardingFlow() {
  const userData = useQuery(api.user.me)
  // Only show loading spinner while user data is loading
  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-500">
          onboarding loadingView (waiting for userData)
        </Text>
      </View>
    )
  }

  // Once data is loaded, allow navigation between onboarding screens freely
  return <Stack screenOptions={{headerShown: false}} />
}

/**
 * The main layout for the (onboarding) flow.
 * It wraps the core logic in a component that can use hooks.
 */
export default function OnboardingLayout() {
  return <OnboardingFlow />
}
