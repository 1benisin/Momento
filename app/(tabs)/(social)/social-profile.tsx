import {ActivityIndicator, TouchableOpacity, Text, View} from 'react-native'
import React from 'react'
import {useQuery} from 'convex/react'
import {useRouter} from 'expo-router'
import {api} from '@/convex/_generated/api'

export default function SocialProfileScreen() {
  const user = useQuery(api.user.me)
  const router = useRouter()

  const handleBecomeHost = () => {
    router.push('/(onboarding)/(host)/host-profile-setup')
  }

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Social Profile</Text>
      <View className="my-7 h-px w-4/5 bg-gray-200" />
      <Text>
        {"This is where the user's social profile will be displayed."}
      </Text>

      {!user?.hostProfile && (
        <View className="absolute bottom-12">
          <TouchableOpacity
            className="rounded-md bg-blue-500 px-4 py-2"
            onPress={handleBecomeHost}>
            <Text className="text-white">Become a Host</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
