import React, {useMemo} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native'
import {useRouter} from 'expo-router'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {FontAwesome} from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import {Doc} from '@/convex/_generated/dataModel'

const HostEventsScreen = () => {
  const router = useRouter()
  const events = useQuery(api.events.getMyEvents) || []

  const {drafts, published} = useMemo(() => {
    if (!events) return {drafts: [], published: []}
    return {
      drafts: events.filter(e => e.status === 'draft'),
      published: events.filter(e => e.status === 'published'),
    }
  }, [events])

  const renderEventItem = ({item}: {item: Doc<'events'>}) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/(host)/CreateEvent',
          params: {eventId: item._id},
        })
      }>
      <Text style={styles.eventTitle}>{item.title}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={drafts}
        renderItem={renderEventItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={<Text style={styles.listHeader}>Drafts</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drafts found.</Text>
        }
      />
      <FlatList
        data={published}
        renderItem={renderEventItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={<Text style={styles.listHeader}>Published</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No published events found.</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({pathname: '/(tabs)/(host)/CreateEvent'})}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  eventItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.light.tint,
    borderRadius: 28,
    elevation: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
})

export default HostEventsScreen
