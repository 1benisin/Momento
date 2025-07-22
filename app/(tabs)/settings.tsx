import React from 'react'
import {ActivityIndicator, TouchableOpacity, Text, View} from 'react-native'
import {useQuery, useMutation} from 'convex/react'
import {useRouter} from 'expo-router'

import {api} from '@/convex/_generated/api'
import ModeSwitcher from '@/components/ModeSwitcher'
import {UserRole} from '@/convex/schema'
import {SignOutButton} from '@/components/SignOutButton'

const SettingsScreen = () => {
  const user = useQuery(api.user.me)
  const setActiveRole = useMutation(api.user.setActiveRole)
  const router = useRouter()

  const handleRoleChange = async (role: UserRole) => {
    try {
      await setActiveRole({role})
    } catch (error) {
      console.error('Failed to switch role:', error)
      // Optionally: show an error message to the user
    }
  }

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  // A user is a "hybrid" user if they have both a social and a host profile.
  const isHybridUser = !!(user?.socialProfile && user?.hostProfile)
  const hasSocial = !!user?.socialProfile
  const hasHost = !!user?.hostProfile

  const handleBecomeHost = () => {
    router.push('/(onboarding)/(host)/host-profile-setup')
  }
  const handleCreateSocial = () => {
    router.push('/(onboarding)/(social)/profile-setup')
  }

  return (
    <View className="flex-1 items-center pt-5">
      <Text className="mb-5 text-2xl font-bold">Settings</Text>

      {isHybridUser && user?.active_role && (
        <View className="w-full mb-5">
          <Text className="self-start px-5 mb-2.5 text-lg font-semibold">
            Mode
          </Text>
          <ModeSwitcher
            currentRole={user.active_role}
            onRoleChange={handleRoleChange}
          />
        </View>
      )}

      {/* Entry point for creating the other profile type */}
      {!isHybridUser && (
        <View className="w-full mb-5">
          {!hasHost && (
            <>
              <Text className="mb-2.5 text-center">Want to host events?</Text>
              <TouchableOpacity
                className="items-center rounded-md bg-blue-500 px-4 py-2"
                onPress={handleBecomeHost}>
                <Text className="text-white">Become a Host</Text>
              </TouchableOpacity>
            </>
          )}
          {!hasSocial && (
            <>
              <Text className="mb-2.5 text-center">Want to attend events?</Text>
              <TouchableOpacity
                className="items-center rounded-md bg-blue-500 px-4 py-2"
                onPress={handleCreateSocial}>
                <Text className="text-white">Create Social Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Placeholder for future settings */}
      <View className="w-full mb-5">
        <Text className="text-center">App settings will go here.</Text>
      </View>

      <View className="my-7 h-px w-4/5 bg-gray-200" />

      <SignOutButton />
    </View>
  )
}

export default SettingsScreen
