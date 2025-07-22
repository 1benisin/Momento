import React, {useState, useEffect, useRef} from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from 'react-native'
import {useUser} from '@clerk/clerk-expo'
import {useRouter} from 'expo-router'
import {useMutation, useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {SignOutButton} from '@/components/SignOutButton'
import {AccountStatuses} from '@/convex/schema'
import ContactMethodManager from '@/components/ContactMethodManager'

const AccountScreen = () => {
  const {user, isLoaded} = useUser()
  const router = useRouter()
  const convexUser = useQuery(api.user.me)
  const pauseAccount = useMutation(api.user.pauseAccount)
  const unpauseAccount = useMutation(api.user.unpauseAccount)
  const scrollViewRef = useRef<ScrollView>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
    }
  }, [user])

  const onSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await user.update({
        firstName: firstName,
        lastName: lastName,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user:', error)
      Alert.alert('Error', 'Could not save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const onEdit = () => {
    setIsEditing(true)
  }

  const onCancel = () => {
    setIsEditing(false)
    // Reset fields to original values
    if (user) {
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
    }
  }

  const onPauseAccount = async () => {
    Alert.alert(
      'Pause Account',
      'Pausing your account will hide your profile from others and stop all non-critical notifications. You can reactivate it at any time. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Pause',
          style: 'destructive',
          onPress: async () => {
            try {
              await pauseAccount()
              // The root layout will handle showing the paused banner.
            } catch (error) {
              console.error('Error pausing account:', error)
              Alert.alert('Error', 'Could not pause your account.')
            }
          },
        },
      ],
    )
  }

  const onUnpauseAccount = async () => {
    try {
      await unpauseAccount()
    } catch (error) {
      console.error('Error unpausing account:', error)
      Alert.alert('Error', 'Could not unpause your account.')
    }
  }

  const onDeleteAccount = async () => {
    if (!user) return

    Alert.alert(
      'Are you sure?',
      'Pausing your account hides your profile and stops notifications. Deleting is permanent and cannot be undone. We recommend pausing if you just need a break.',
      [
        {
          text: 'Pause Account',
          onPress: onPauseAccount,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await user.delete()
            } catch (error) {
              console.error('Error deleting account:', error)
              Alert.alert('Error', 'Could not delete your account.')
            }
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    )
  }

  const isLoading = !isLoaded || convexUser === undefined
  const isPaused = convexUser?.accountStatus === AccountStatuses.PAUSED

  if (isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
      }}>
      {isPaused && (
        <Pressable onPress={() => scrollViewRef.current?.scrollToEnd()}>
          <View className="w-full items-center bg-orange-400 p-2.5 mb-5">
            <Text className="font-bold text-white">
              Your account is currently paused. Tap to manage.
            </Text>
          </View>
        </Pressable>
      )}
      <View className="items-center mb-5">
        <Image
          source={{uri: user.imageUrl}}
          className="mb-2.5 h-24 w-24 rounded-full"
        />
        {isEditing ? (
          <View className="flex-row items-center gap-2.5">
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              className="flex-1 border-b border-gray-300 p-2 text-center text-2xl font-bold"
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              className="flex-1 border-b border-gray-300 p-2 text-center text-2xl font-bold"
            />
          </View>
        ) : (
          <Text className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </Text>
        )}
        <Text className="mt-1 text-base text-gray-500">
          {user.primaryEmailAddress?.emailAddress}
        </Text>
        <Text className="mt-1 text-base text-gray-500">
          {user.primaryPhoneNumber?.phoneNumber}
        </Text>
        {convexUser?.accountStatus && (
          <Text className="mt-2 text-base italic text-gray-800">
            Status:{' '}
            {convexUser.accountStatus.charAt(0).toUpperCase() +
              convexUser.accountStatus.slice(1)}
          </Text>
        )}
      </View>

      <View className="mt-5 w-4/5 gap-5">
        <ContactMethodManager methodType="email" />
        <ContactMethodManager methodType="phone" />
      </View>

      <View className="w-4/5">
        {isEditing ? (
          <>
            <Pressable
              onPress={onSave}
              className="mb-2.5 items-center rounded-xl bg-blue-500 p-4"
              disabled={isSaving}>
              <Text className="text-base font-bold text-white">
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              className="mb-2.5 items-center rounded-xl border border-blue-500 bg-white p-4"
              disabled={isSaving}>
              <Text className="text-base font-bold text-blue-500">Cancel</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={onEdit}
            className="mb-2.5 items-center rounded-xl bg-blue-500 p-4">
            <Text className="text-base font-bold text-white">Edit Profile</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.push('/settings')}
          className="mb-2.5 items-center rounded-xl border border-blue-500 bg-white p-4">
          <Text className="text-base font-bold text-blue-500">
            App Settings
          </Text>
        </Pressable>
        <SignOutButton />
      </View>

      <View className="mt-7 w-4/5 items-center border-t border-gray-200 pt-5">
        <Text className="mb-2.5 text-lg font-bold text-red-600">
          Danger Zone
        </Text>
        <Pressable
          onPress={isPaused ? onUnpauseAccount : onPauseAccount}
          className="mb-2.5 items-center rounded-xl border-yellow-500 bg-yellow-500 p-4">
          <Text className="text-base font-bold text-white">
            {isPaused ? 'Unpause Account' : 'Pause Account'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onDeleteAccount}
          className="items-center rounded-xl border-red-600 bg-red-600 p-4">
          <Text className="text-base font-bold text-white">Delete Account</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default AccountScreen
