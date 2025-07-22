import {ActivityIndicator, Image, Text, View} from 'react-native'
import {useUser} from '@clerk/clerk-expo'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'

export default function UserInfo() {
  const {user, isLoaded} = useUser()
  const convexUser = useQuery(api.user.me)

  const isLoading = !isLoaded || convexUser === undefined

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!user || convexUser === null) {
    return <Text>User not found</Text>
  }

  return (
    <View className="items-center mb-5">
      {user.imageUrl && (
        <Image
          source={{uri: user.imageUrl}}
          className="w-24 h-24 rounded-full mb-2.5"
        />
      )}
      <Text className="text-lg font-bold">
        Hi, {user.firstName || user.primaryEmailAddress?.emailAddress}!
      </Text>
      <Text>Your status is: {convexUser.accountStatus}</Text>
    </View>
  )
}
