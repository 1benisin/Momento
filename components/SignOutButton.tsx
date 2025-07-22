import {useAuth} from '@clerk/clerk-expo'
import React from 'react'
import {Pressable, Text} from 'react-native'

export const SignOutButton = () => {
  const {signOut} = useAuth()
  return (
    <Pressable
      onPress={() => signOut()}
      className="bg-red-500 py-3 px-6 rounded-lg items-center">
      <Text className="text-white font-bold">Sign Out</Text>
    </Pressable>
  )
}
