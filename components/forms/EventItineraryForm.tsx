import React, {useState, useMemo} from 'react'
import {Text, View, TextInput, TouchableOpacity} from 'react-native'
import {Doc, Id} from '@/convex/_generated/dataModel'
import CustomTimePicker from './CustomTimePicker'
import LocationPicker, {LocationData} from './LocationPicker'

export type ItineraryItem = Omit<
  Doc<'events'>['itinerary'][number],
  'location_id'
> & {
  location_id?: Id<'locations'>
  location: LocationData
  // Add missing properties to satisfy form usage
  title: string
  order: number
}

export type FrontendEvent = Omit<Partial<Doc<'events'>>, 'itinerary'> & {
  itinerary?: ItineraryItem[]
}
interface EventItineraryFormProps {
  event: FrontendEvent
  setEvent: (event: FrontendEvent) => void
}

const EventItineraryForm: React.FC<EventItineraryFormProps> = ({
  event,
  setEvent,
}) => {
  const [showTimePickerIdx, setShowTimePickerIdx] = useState<number | null>(
    null,
  )

  const pickerDate = useMemo(() => {
    if (showTimePickerIdx === null) {
      return new Date() // Default value, not used when picker is hidden
    }
    const item = (event.itinerary ?? [])[showTimePickerIdx]
    return new Date(item?.start_time || Date.now())
  }, [showTimePickerIdx, event.itinerary])

  const handleAddItem = () => {
    const newItem: ItineraryItem = {
      order: (event.itinerary?.length || 0) + 1,
      start_time: Date.now(),
      location: {
        name: '',
        address: '',
        latitude: 37.78825,
        longitude: -122.4324,
      },
      title: '',
      description: '',
    }
    setEvent({...event, itinerary: [...(event.itinerary ?? []), newItem]})
  }

  const handleRemoveItem = (idx: number) => {
    const updated = (event.itinerary ?? []).filter((_, i) => i !== idx)
    setEvent({...event, itinerary: updated})
  }

  const handleUpdateItem = (
    idx: number,
    updatedFields: Partial<ItineraryItem>,
  ) => {
    const updated = [...(event.itinerary ?? [])]
    updated[idx] = {...updated[idx], ...updatedFields}
    setEvent({...event, itinerary: updated})
  }

  return (
    <View>
      <Text className="text-base font-bold mt-4 mb-1">Itinerary</Text>
      {(event.itinerary ?? []).map((item, idx) => (
        <View
          key={idx}
          style={{zIndex: (event.itinerary?.length || 0) - idx}}
          className="p-4 mt-2.5 border border-gray-200 rounded-lg bg-gray-50">
          <Text className="text-lg font-bold mb-2.5">Stop {idx + 1}</Text>
          <Text className="text-sm font-semibold text-gray-800 mt-1">
            Title
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2.5 mt-1 text-base mb-2.5"
            value={item.title}
            onChangeText={text => handleUpdateItem(idx, {title: text})}
            placeholder="e.g., Coffee & Pastries"
          />

          <Text className="text-sm font-semibold text-gray-800 mt-1">
            Start Time:
          </Text>
          <TouchableOpacity onPress={() => setShowTimePickerIdx(idx)}>
            <Text className="text-blue-500 my-2 font-bold text-base p-2.5 border border-gray-300 rounded-md text-center">
              {new Date(item.start_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>

          <LocationPicker
            renderKey={`${idx}-${item.start_time}`}
            initialLocation={item.location}
            onLocationChange={location => {
              handleUpdateItem(idx, {location})
            }}
          />

          <Text className="text-sm font-semibold text-gray-800 mt-1">
            Description:
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2.5 mt-1 text-base h-20"
            value={item.description}
            onChangeText={text => handleUpdateItem(idx, {description: text})}
            placeholder="What happens at this stop?"
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            className="mt-2.5 border-t border-gray-200 pt-2.5 items-center"
            onPress={() => handleRemoveItem(idx)}>
            <Text className="text-red-500 font-bold text-sm">Remove Stop</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 items-center mt-4"
        onPress={handleAddItem}>
        <Text className="text-white font-bold text-base">
          + Add Itinerary Stop
        </Text>
      </TouchableOpacity>

      {showTimePickerIdx !== null && (
        <CustomTimePicker
          isVisible={showTimePickerIdx !== null}
          onClose={() => setShowTimePickerIdx(null)}
          value={
            new Date(
              (event.itinerary ?? [])[showTimePickerIdx]?.start_time ||
                Date.now(),
            )
          }
          onChange={newDate => {
            const itineraryItem = (event.itinerary ?? [])[showTimePickerIdx]
            if (itineraryItem) {
              handleUpdateItem(showTimePickerIdx, {
                start_time: newDate.getTime(),
              })
            }
          }}
        />
      )}
    </View>
  )
}

export default EventItineraryForm
