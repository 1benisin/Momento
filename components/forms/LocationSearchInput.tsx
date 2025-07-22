import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import Colors from '@/constants/Colors'
import {devLog} from '@/utils/devLog'

// Minimal type for Google Places details used in this app
interface PlaceDetail {
  formatted_address: string
  name?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  place_id: string
}

// This will come from your environment variables
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

devLog('[LocationSearchInput] GOOGLE_MAPS_API_KEY', GOOGLE_MAPS_API_KEY)

if (!GOOGLE_MAPS_API_KEY) {
  console.error(
    'Google Maps API key is not provided. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.',
  )
}

interface LocationSearchInputProps {
  onLocationSelect: (details: PlaceDetail | null) => void
  onPressPin: () => void
  renderKey: string
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  onPressPin,
  renderKey,
}) => {
  devLog('[LocationSearchInput] Render', {renderKey, GOOGLE_MAPS_API_KEY})
  if (!GOOGLE_MAPS_API_KEY) {
    devLog('[LocationSearchInput] No API key, not rendering')
    return null
  }

  devLog('[LocationSearchInput] Rendering GooglePlacesAutocomplete', {
    query: {
      key: GOOGLE_MAPS_API_KEY,
      language: 'en',
    },
    renderKey,
  })

  return (
    <View className="relative min-h-[300px] w-full overflow-visible">
      <View className="relative w-full">
        <GooglePlacesAutocomplete
          key={renderKey}
          placeholder="Search for an address or business"
          onPress={(data, details = null) => {
            devLog('[LocationSearchInput] onPress', {data, details})
            onLocationSelect(details)
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
          }}
          fetchDetails={true}
          predefinedPlaces={[]}
          textInputProps={{}}
          styles={{
            textInput: {
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              fontSize: 16,
              height: 44,
              width: '100%',
              backgroundColor: '#fff',
            },
            container: {
              width: '100%',
            },
            listView: {
              position: 'absolute',
              top: 44,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#007AFF',
              zIndex: 1000,
              maxHeight: 200,
              overflow: 'visible',
            },
          }}
        />
        <TouchableOpacity
          onPress={onPressPin}
          className="absolute right-2.5 top-2.5 z-[1100] bg-transparent">
          <Ionicons name="map-outline" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LocationSearchInput
