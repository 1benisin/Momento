import React from 'react'
import {View, ActivityIndicator, TouchableOpacity, Text} from 'react-native'
import {Stack, useRouter} from 'expo-router'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'

export default function HostDashboardScreen() {
  const user = useQuery(api.user.me)
  const router = useRouter()

  const handleJoinSocially = () => {
    router.push('/(onboarding)/(social)/profile-setup')
  }

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Stack.Screen options={{title: 'Host Dashboard'}} />
      <Text className="mb-4 text-2xl font-bold">Host Dashboard</Text>
      <Text className="text-base text-gray-500">
        Welcome to your host dashboard. This is a placeholder screen.
      </Text>
      {!user?.socialProfile && (
        <View className="absolute bottom-12">
          <TouchableOpacity
            className="rounded-md bg-blue-500 px-4 py-2"
            onPress={handleJoinSocially}>
            <Text className="text-white">Join Events Socially</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
