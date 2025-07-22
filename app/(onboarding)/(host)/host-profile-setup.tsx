import {useRouter, Stack} from 'expo-router'
import React, {useState} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native'
import {useMutation} from 'convex/react'
import {api} from '../../../convex/_generated/api'

export default function HostProfileSetupScreen() {
  const router = useRouter()
  const [hostName, setHostName] = useState('')
  const [hostBio, setHostBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const createHostProfile = useMutation(api.user.createHostProfile)

  const handleContinue = async () => {
    if (isLoading || !hostName || !hostBio) return

    setIsLoading(true)
    try {
      await createHostProfile({
        hostProfile: {
          host_name: hostName,
          host_bio: hostBio,
        },
      })
      router.push('./verification-prompt')
    } catch (error) {
      console.error('Failed to create host profile:', error)
      Alert.alert('Error', 'Could not create host profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center bg-white p-5">
      <Stack.Screen options={{title: 'Host Profile'}} />
      <Text className="text-center text-[26px] font-bold mb-5">
        Create Your Host Profile
      </Text>

      <TextInput
        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 text-base"
        placeholder="Host Name"
        value={hostName}
        onChangeText={setHostName}
        placeholderTextColor="#999"
      />

      <TextInput
        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 text-base h-32"
        placeholder="Host Bio"
        value={hostBio}
        onChangeText={setHostBio}
        multiline
        placeholderTextColor="#999"
        style={{textAlignVertical: 'top'}}
      />

      <TouchableOpacity
        className="w-full items-center rounded-xl bg-blue-500 p-4 disabled:bg-blue-300"
        onPress={handleContinue}
        disabled={isLoading || !hostName || !hostBio}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-bold text-white text-base">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
