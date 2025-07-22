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
      router.push('/(onboarding)/(social)/interest-selection')
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to save your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to welcome screen">
          <Text style={{color: '#6B7280', fontSize: 20, marginRight: 4}}>
            ←
          </Text>
          <Text style={{color: '#6B7280', fontWeight: '500'}}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Tell us about yourself
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#D1D5DB',
            padding: 10,
            borderRadius: 5,
            marginBottom: 16,
            fontSize: 16,
            backgroundColor: 'white',
          }}
          placeholder="First Name (required)"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#D1D5DB',
            padding: 10,
            borderRadius: 5,
            marginBottom: 16,
            fontSize: 16,
            backgroundColor: 'white',
          }}
          placeholder="Last Name (required)"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        <View style={{marginTop: 20}}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <TouchableOpacity
              onPress={handleContinue}
              disabled={isLoading}
              style={{
                alignItems: 'center',
                borderRadius: 5,
                backgroundColor: '#007AFF',
                padding: 15,
                opacity: isLoading ? 0.6 : 1,
              }}>
              <Text style={{fontSize: 18, fontWeight: '600', color: 'white'}}>
                Continue
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
