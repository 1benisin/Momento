import React, {useState} from 'react'
import {Alert, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {useMutation} from 'convex/react'
import {useRouter} from 'expo-router'
import {Id} from '@/convex/_generated/dataModel'
import {devLog} from '@/utils/devLog'
import ImageUploader from '../../../components/ImageUploader'
import {api} from '../../../convex/_generated/api'

export default function InitialPhotoScreen() {
  const router = useRouter()
  const createSocialProfile = useMutation(api.user.createSocialProfile)
  const [storageId, setStorageId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUploadSuccess = (newStorageId: string) => {
    setStorageId(newStorageId)
  }

  const handleContinue = () => {
    devLog('[InitialPhotoScreen] Navigating to social discover')
    router.replace('/(tabs)/(social)/discover')
  }

  const onSave = async () => {
    if (!storageId) {
      Alert.alert(
        'Please upload a photo',
        'You must upload a photo to continue.',
      )
      return
    }
    setIsSubmitting(true)
    try {
      devLog('[InitialPhotoScreen] Calling createSocialProfile with photo')
      await createSocialProfile({
        initialPhoto: {
          storageId: storageId as Id<'_storage'>,
          isAuthentic: false,
        },
      })
      handleContinue()
    } catch (error) {
      console.error('Failed to create social profile:', error)
      Alert.alert(
        'Save Failed',
        'Could not save your profile. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSkip = async () => {
    setIsSubmitting(true)
    try {
      devLog('[InitialPhotoScreen] Calling createSocialProfile without photo')
      await createSocialProfile({}) // Call with empty object
      handleContinue()
    } catch (error) {
      console.error('Failed to create social profile on skip:', error)
      Alert.alert('Skip Failed', 'Could not skip this step. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white p-5">
      <Text className="mb-2.5 text-center text-2xl font-bold">
        Add your first photo
      </Text>
      <Text className="mb-8 text-center text-base text-gray-500">
        This helps people recognize you. You can change it later.
      </Text>

      <ImageUploader onUploadSuccess={handleUploadSuccess} />

      <View className="mt-5 w-full">
        <TouchableOpacity
          className="items-center rounded-md bg-blue-500 py-3 disabled:opacity-50"
          onPress={onSave}
          disabled={!storageId || isSubmitting}>
          <Text className="text-lg font-semibold text-white">
            {isSubmitting ? 'Saving...' : 'Save and Finish'}
          </Text>
        </TouchableOpacity>
        <View className="my-2">
          <TouchableOpacity
            className="items-center rounded-md py-3 disabled:opacity-50"
            onPress={onSkip}
            disabled={isSubmitting}>
            <Text className="text-lg font-semibold text-gray-500">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
