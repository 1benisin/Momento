import React, {useMemo} from 'react'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {FontAwesome} from '@expo/vector-icons'
import {useQuery} from 'convex/react'
import {useRouter} from 'expo-router'
import {api} from '@/convex/_generated/api'
import {Doc} from '@/convex/_generated/dataModel'

const HostEventsScreen = () => {
  const router = useRouter()
  const eventsQuery = useQuery(api.events.getMyEvents)

  const events = useMemo(() => eventsQuery || [], [eventsQuery])

  const {drafts, published} = useMemo(() => {
    return {
      drafts: events.filter(e => e.status === 'draft'),
      published: events.filter(e => e.status === 'published'),
    }
  }, [events])

  const renderEventItem = ({item}: {item: Doc<'events'>}) => (
    <TouchableOpacity
      className="my-2 mx-4 rounded-lg bg-gray-50 p-5"
      onPress={() =>
        router.push({
          pathname: '/(tabs)/(host)/CreateEvent',
          params: {eventId: item._id},
        })
      }>
      <Text className="text-lg">{item.title}</Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 p-2.5">
      <FlatList
        data={drafts}
        renderItem={renderEventItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <Text className="mt-5 mb-2.5 px-2.5 text-2xl font-bold">Drafts</Text>
        }
        ListEmptyComponent={
          <Text className="mt-5 text-center text-gray-500">
            No drafts found.
          </Text>
        }
      />
      <FlatList
        data={published}
        renderItem={renderEventItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <Text className="mt-5 mb-2.5 px-2.5 text-2xl font-bold">
            Published
          </Text>
        }
        ListEmptyComponent={
          <Text className="mt-5 text-center text-gray-500">
            No published events found.
          </Text>
        }
      />
      <TouchableOpacity
        className="absolute bottom-5 right-5 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        onPress={() => router.push({pathname: '/(tabs)/(host)/CreateEvent'})}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default HostEventsScreen
