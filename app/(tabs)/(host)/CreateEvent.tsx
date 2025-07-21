import React, {useState, useEffect} from 'react'
import {StyleSheet, ActivityIndicator, Button, ScrollView} from 'react-native'
import {Text, View} from '@/components/Themed'
import {useLocalSearchParams} from 'expo-router'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {Id} from '@/convex/_generated/dataModel'
import EventDetailsForm from '@/components/forms/EventDetailsForm'
import EventItineraryForm, {
  FrontendEvent,
} from '@/components/forms/EventItineraryForm'
import EventPublishForm from '@/components/forms/EventPublishForm'

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
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 32}}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {eventId ? 'Edit Event' : 'Create Event'} - Step {step} of 3
        </Text>

        {step === 1 && <EventDetailsForm event={event} setEvent={setEvent} />}
        {step === 2 && <EventItineraryForm event={event} setEvent={setEvent} />}
        {step === 3 && <EventPublishForm event={event} />}
      </ScrollView>
      <View style={styles.navigation}>
        {step > 1 && (
          <Button title="Previous" onPress={() => setStep(step - 1)} />
        )}
        {step < 3 && <Button title="Next" onPress={() => setStep(step + 1)} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
})

export default CreateEventScreen
