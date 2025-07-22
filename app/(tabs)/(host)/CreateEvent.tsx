import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {useQuery} from 'convex/react'
import {useLocalSearchParams} from 'expo-router'
import EventDetailsForm from '@/components/forms/EventDetailsForm'
import EventItineraryForm, {
  FrontendEvent,
} from '@/components/forms/EventItineraryForm'
import EventPublishForm from '@/components/forms/EventPublishForm'
import {api} from '@/convex/_generated/api'
import {Id} from '@/convex/_generated/dataModel'

const CreateEventScreen = () => {
  const {eventId} = useLocalSearchParams()
  const eventToEdit = useQuery(
    api.events.getEvent,
    eventId ? {id: eventId as Id<'events'>} : 'skip',
  )

  const [step, setStep] = useState(1)
  const [event, setEvent] = useState<FrontendEvent>({
    title: '',
    description: '',
    min_attendees: 4,
    max_attendees: 10,
    estimated_event_cost: [],
    itinerary: [],
  })

  useEffect(() => {
    if (eventToEdit) {
      setEvent(eventToEdit as FrontendEvent)
    }
  }, [eventToEdit])

  if (eventId && eventToEdit === undefined) {
    return <ActivityIndicator style={styles.centered} />
  }

  return (
    <View className="flex-1 p-5">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{paddingBottom: 32}}
        keyboardShouldPersistTaps="handled">
        <Text className="mb-5 text-2xl font-bold">
          {eventId ? 'Edit Event' : 'Create Event'} - Step {step} of 3
        </Text>

        {step === 1 && <EventDetailsForm event={event} setEvent={setEvent} />}
        {step === 2 && <EventItineraryForm event={event} setEvent={setEvent} />}
        {step === 3 && <EventPublishForm event={event} />}
      </ScrollView>
      <View className="mt-5 flex-row justify-around">
        {step > 1 && (
          <TouchableOpacity
            className="rounded-md bg-gray-200 px-4 py-2"
            onPress={() => setStep(step - 1)}>
            <Text>Previous</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity
            className="rounded-md bg-blue-500 px-4 py-2"
            onPress={() => setStep(step + 1)}>
            <Text className="text-white">Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

export default CreateEventScreen
