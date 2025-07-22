import React, {useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native'
import {useMutation} from 'convex/react'
import * as ImagePicker from 'expo-image-picker'
import {api} from '../convex/_generated/api'

interface ImageUploaderProps {
  onUploadSuccess: (storageId: string, isAuthentic: boolean) => void
}

export default function ImageUploader({onUploadSuccess}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const handleImageUpload = async (uri: string, isAuthentic: boolean) => {
    setIsUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const response = await fetch(uri)
      const blob = await response.blob()
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {'Content-Type': blob.type},
        body: blob,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const {storageId} = await uploadResponse.json()
      onUploadSuccess(storageId, isAuthentic)
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Upload Failed',
        "Sorry, we couldn't upload your image. Please try again.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant camera roll permissions to select an image.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ],
      )
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImage(uri)
      await handleImageUpload(uri, false)
    }
  }

  const takePhoto = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant camera permissions to take a photo.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ],
      )
      return
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImage(uri)
      await handleImageUpload(uri, true)
    }
  }

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-lg font-bold mb-5">Add a Profile Photo</Text>
      <View className="w-full mb-5">
        <Pressable
          className="bg-blue-500 py-3 rounded-md items-center mb-2.5"
          onPress={pickImage}
          disabled={isUploading}>
          <Text className="text-white font-bold">
            Pick an image from camera roll
          </Text>
        </Pressable>
        <Pressable
          className="bg-blue-500 py-3 rounded-md items-center"
          onPress={takePhoto}
          disabled={isUploading}>
          <Text className="text-white font-bold">Take a photo</Text>
        </Pressable>
      </View>

      {isUploading && (
        <View className="absolute inset-0 bg-white/70 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      )}

      {image && !isUploading && (
        <Image
          source={{uri: image}}
          className="w-52 h-52 rounded-full border-2 border-gray-300"
        />
      )}
    </View>
  )
}
