import {Text, View} from 'react-native'
import React from 'react'

export default function MemoryBookScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Memory Book</Text>
      <View className="my-7 h-px w-4/5 bg-gray-200" />
      <Text>{"This is where the user's memory book will be displayed."}</Text>
    </View>
  )
}
