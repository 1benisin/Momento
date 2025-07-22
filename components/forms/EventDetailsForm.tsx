import React from 'react'
import {TextInput, TouchableOpacity} from 'react-native'
import {Text, View} from 'react-native'
import {FrontendEvent} from './EventItineraryForm'

interface EventDetailsFormProps {
  event: FrontendEvent
  setEvent: (event: FrontendEvent) => void
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  event,
  setEvent,
}) => {
  return (
    <View>
      <Text className="text-base font-bold mt-4">Title</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2.5 mt-1 text-base"
        value={event.title}
        onChangeText={title => setEvent({...event, title})}
        placeholder="e.g., Sunset Hike and Picnic"
      />

      <Text className="text-base font-bold mt-4">Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2.5 mt-1 text-base h-24"
        value={event.description}
        onChangeText={description => setEvent({...event, description})}
        placeholder="Describe the event..."
        multiline
        textAlignVertical="top"
      />

      <Text className="text-base font-bold mt-4">Min. Attendees</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2.5 mt-1 text-base"
        value={
          event.min_attendees && event.min_attendees >= 4
            ? event.min_attendees.toString()
            : '4'
        }
        onChangeText={text => {
          const value = Math.max(4, parseInt(text) || 0)
          setEvent({...event, min_attendees: value})
        }}
        keyboardType="numeric"
      />

      <Text className="text-base font-bold mt-4">Max. Attendees</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2.5 mt-1 text-base"
        value={event.max_attendees?.toString()}
        onChangeText={text =>
          setEvent({...event, max_attendees: parseInt(text) || 0})
        }
        keyboardType="numeric"
      />

      <Text className="text-base font-bold mt-4">Estimated Event Costs</Text>
      {(event.estimated_event_cost ?? []).length > 0 ? (
        (event.estimated_event_cost ?? []).map((item, idx) => (
          <View key={idx} className="flex-row items-center mt-1">
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 text-base flex-1 mr-1"
              value={item.amount?.toString() || ''}
              onChangeText={text => {
                const updated = [...(event.estimated_event_cost ?? [])]
                updated[idx] = {
                  ...updated[idx],
                  amount: parseFloat(text) || 0,
                }
                setEvent({...event, estimated_event_cost: updated})
              }}
              keyboardType="numeric"
              placeholder="$ Amount"
            />
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 text-base flex-2 mr-1"
              value={item.description || ''}
              onChangeText={text => {
                const updated = [...(event.estimated_event_cost ?? [])]
                updated[idx] = {...updated[idx], description: text}
                setEvent({...event, estimated_event_cost: updated})
              }}
              placeholder="Description"
            />
            <TouchableOpacity
              onPress={() => {
                const updated = (event.estimated_event_cost ?? []).filter(
                  (_, i) => i !== idx,
                )
                setEvent({...event, estimated_event_cost: updated})
              }}>
              <Text className="text-red-500 font-bold text-sm ml-1">
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-gray-500 mb-1">No cost items added.</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          const updated = Array.isArray(event.estimated_event_cost)
            ? [...event.estimated_event_cost]
            : []
          updated.push({amount: 0, description: ''})
          setEvent({...event, estimated_event_cost: updated})
        }}>
        <Text className="text-blue-500 mt-2.5 font-bold text-base">
          + Add Cost Item
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default EventDetailsForm
