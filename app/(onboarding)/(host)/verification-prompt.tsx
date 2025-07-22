import {useRouter} from 'expo-router'
import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'

export default function VerificationPromptScreen() {
  const router = useRouter()

  const handleVerifyNow = () => {
    // For now, just complete onboarding and let the root layout redirect.
    handleCompleteOnboarding()
  }

  const handleDoThisLater = () => {
    handleCompleteOnboarding()
  }

  const handleCompleteOnboarding = () => {
    // The user has a host profile now, so we can send them to the host-side
    // of the app. We use `replace` to prevent them from navigating back
    // to the onboarding flow.
    router.replace('/(tabs)/(host)/dashboard')
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="mb-4 text-center text-[26px] font-bold">
        Verification Required
      </Text>
      <Text className="mb-10 px-2.5 text-center text-base text-gray-500">
        {
          "To ensure the safety of our community, you'll need to verify your identity before you can publish an event."
        }
      </Text>

      <TouchableOpacity
        className="mb-4 w-full items-center rounded-xl bg-blue-500 p-4"
        onPress={handleVerifyNow}>
        <Text className="font-bold text-white text-base">Verify Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full items-center rounded-xl bg-gray-100 p-4"
        onPress={handleDoThisLater}>
        <Text className="font-bold text-blue-500 text-base">Do This Later</Text>
      </TouchableOpacity>
    </View>
  )
}
