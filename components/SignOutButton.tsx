import {useAuth} from '@clerk/clerk-expo'
import React from 'react'
import {Pressable, Text} from 'react-native'
import {useMutation} from 'convex/react'
import {api} from '../convex/_generated/api'
import {devLog} from '../utils/devLog'

export const SignOutButton = () => {
  const {signOut} = useAuth()
  const logSignOutMutation = useMutation(api.user.logSignOut)

  const handleSignOut = async () => {
    try {
      await logSignOutMutation()
      devLog('Sign-out logged to backend.')
    } catch (error) {
      console.error('Failed to log sign-out to backend:', error)
    } finally {
      signOut()
    }
  }

  return (
    <Pressable
      onPress={handleSignOut}
      className="bg-red-500 py-3 px-6 rounded-lg items-center">
      <Text className="text-white font-bold">Sign Out</Text>
    </Pressable>
  )
}
