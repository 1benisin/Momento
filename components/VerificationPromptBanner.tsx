import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from 'react-native'
import {FontAwesome} from '@expo/vector-icons'

type VerificationPromptBannerProps = {
  onPress?: () => void
}

export default function VerificationPromptBanner({
  onPress,
}: VerificationPromptBannerProps) {
  return (
    <View className="flex-row items-center bg-yellow-100 p-4 rounded-lg border border-yellow-200 m-2.5">
      <FontAwesome name="exclamation-triangle" size={20} color="#856404" />
      <View className="flex-1 ml-4">
        <Text className="font-bold text-yellow-800">Verification Required</Text>
        <Text className="text-yellow-800 text-xs">
          You must verify your identity to publish events.
        </Text>
      </View>
      <TouchableOpacity
        className="bg-yellow-800 py-2 px-4 rounded-md"
        onPress={onPress}>
        <Text className="text-white font-bold text-xs">Verify</Text>
      </TouchableOpacity>
    </View>
  )
}
