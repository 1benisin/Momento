import React, {useState} from 'react'
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native'
import {useRouter} from 'expo-router'

export default function RoleSelectionScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSelection = async (role: 'social' | 'host') => {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (role === 'social') {
        router.push('/(onboarding)/(social)/profile-setup')
      } else {
        router.push('/(onboarding)/(host)/host-profile-setup')
      }
    } catch (error) {
      console.error('Failed to update onboarding state:', error)
      // Optionally, show an alert to the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-center text-[26px] font-bold mb-2.5">
        How would you like to start?
      </Text>
      <Text className="mb-10 text-center text-base text-gray-600">
        Choose your primary reason for joining Momento. You can always add the
        other role later.
      </Text>

      <TouchableOpacity
        className="mb-5 w-full items-center rounded-2xl border border-gray-200 bg-gray-50 p-6"
        onPress={() => handleSelection('social')}
        disabled={isLoading}>
        <Text className="mb-2 text-xl font-bold">Attend Events</Text>
        <Text className="text-center text-sm text-gray-800">
          Join unique experiences and connect with new people.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full items-center rounded-2xl border border-gray-200 bg-gray-50 p-6"
        onPress={() => handleSelection('host')}
        disabled={isLoading}>
        <Text className="mb-2 text-xl font-bold">Host Events</Text>
        <Text className="text-center text-sm text-gray-800">
          Create your own events and build a community.
        </Text>
        {isLoading && <ActivityIndicator className="mt-2.5" />}
      </TouchableOpacity>
    </View>
  )
}
