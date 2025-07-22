import React, {useState} from 'react'
import {Alert, Text, TouchableOpacity, View} from 'react-native'
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
    devLog('[InitialPhotoScreen] Navigating to location setup')
    router.push('/(onboarding)/(social)/location-setup')
  }

  const handleBack = () => {
    router.back()
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to interest selection">
          <Text style={{color: '#6B7280', fontSize: 20, marginRight: 4}}>
            ←
          </Text>
          <Text style={{marginLeft: 4, color: '#6B7280', fontWeight: '500'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <Text
          style={{
            marginBottom: 10,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
          }}>
          Add your first photo
        </Text>
        <Text
          style={{
            marginBottom: 32,
            textAlign: 'center',
            fontSize: 16,
            color: '#6B7280',
          }}>
          This helps people recognize you. You can change it later.
        </Text>

        <ImageUploader onUploadSuccess={handleUploadSuccess} />

        <View style={{marginTop: 20, width: '100%'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: '#3B82F6',
              padding: 12,
              opacity: !storageId || isSubmitting ? 0.5 : 1,
            }}
            onPress={onSave}
            disabled={!storageId || isSubmitting}>
            <Text style={{fontSize: 18, fontWeight: '600', color: 'white'}}>
              {isSubmitting ? 'Saving...' : 'Save and Finish'}
            </Text>
          </TouchableOpacity>
          <View style={{marginVertical: 8}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                borderRadius: 5,
                padding: 12,
                opacity: isSubmitting ? 0.5 : 1,
              }}
              onPress={onSkip}
              disabled={isSubmitting}>
              <Text style={{fontSize: 18, fontWeight: '600', color: '#6B7280'}}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
