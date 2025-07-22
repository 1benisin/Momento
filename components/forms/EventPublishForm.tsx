import React from 'react'
import {Alert, Pressable, Text, View} from 'react-native'
import {useMutation} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {useRouter} from 'expo-router'
import {FrontendEvent} from './EventItineraryForm'

interface EventPublishFormProps {
  event: FrontendEvent
}

const EventPublishForm: React.FC<EventPublishFormProps> = ({event}) => {
  const router = useRouter()
  const createOrUpdateDraft = useMutation(api.events.createOrUpdateDraft)
  const publishEvent = useMutation(api.events.publishEvent)

  const handleSaveDraft = async () => {
    try {
      await createOrUpdateDraft({
        ...event,
        title: event.title ?? '',
        description: event.description ?? '',
        min_attendees: event.min_attendees ?? 4,
        max_attendees: event.max_attendees ?? 4,
        estimated_event_cost: event.estimated_event_cost ?? [],
        itinerary: event.itinerary ?? [],
      })
      Alert.alert('Success', 'Draft saved successfully!')
      router.back()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Could not save draft.')
    }
  }

  const handlePublish = async () => {
    if (!event._id) {
      Alert.alert('Error', 'You must save a draft before publishing.')
      return
    }
    try {
      await publishEvent({id: event._id})
      Alert.alert('Success', 'Event published successfully!')
      router.back()
    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', error.message || 'Could not publish event.')
      // TODO: Display VerificationPromptBanner if error is due to verification
    }
  }

  return (
    <View className="p-5">
      <Text className="text-lg text-center mb-5">
        Review your event details below.
      </Text>
      {/* Add a summary of the event details here */}
      <View className="flex-row justify-around mt-8">
        <Pressable
          onPress={handleSaveDraft}
          className="bg-gray-500 py-3 px-6 rounded-lg">
          <Text className="text-white font-bold">Save Draft</Text>
        </Pressable>
        <Pressable
          onPress={handlePublish}
          className="bg-purple-700 py-3 px-6 rounded-lg">
          <Text className="text-white font-bold">Publish</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default EventPublishForm
