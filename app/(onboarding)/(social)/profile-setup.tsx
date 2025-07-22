import React, {useState} from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useUser} from '@clerk/clerk-expo'
import {useRouter} from 'expo-router'

export default function ProfileSetupScreen() {
  const {user} = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (firstName.trim().length === 0 || lastName.trim().length === 0) {
      alert('Please enter your first and last name.')
      return
    }
    setIsLoading(true)
    try {
      await user?.update({firstName, lastName})
      router.push('/initial-photo')
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to save your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center p-5">
      <Text className="text-center text-2xl font-bold mb-5">
        Tell us about yourself
      </Text>
      <TextInput
        className="border border-gray-300 p-2.5 rounded-md mb-4 text-base"
        placeholder="First Name (required)"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        className="border border-gray-300 p-2.5 rounded-md mb-4 text-base"
        placeholder="Last Name (required)"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <View className="mt-5">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            onPress={handleContinue}
            disabled={isLoading}
            className="items-center rounded-md bg-blue-500 py-3 disabled:bg-blue-300">
            <Text className="text-lg font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}
