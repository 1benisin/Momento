import {Text, View} from 'react-native'
import {Stack} from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{title: 'Oops!'}} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-2xl font-bold">
          {"This screen doesn't exist."}
        </Text>
      </View>
    </>
  )
}
