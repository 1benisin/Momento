import React, {useState} from 'react'
import {Text, View} from 'react-native'
import LocationSearchInput from './LocationSearchInput'
import MapViewModal from './MapViewModal'

export interface LocationData {
  address?: string
  name: string
  latitude: number
  longitude: number
  googlePlaceId?: string
}

interface LocationPickerProps {
  onLocationChange: (location: LocationData) => void
  initialLocation?: LocationData
  renderKey: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationChange,
  initialLocation,
  renderKey,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null,
  )
  const [isMapVisible, setMapVisible] = useState(false)

  // Use the same PlaceDetail type as in LocationSearchInput
  const handleLocationSelect = (
    details: {
      formatted_address: string
      name?: string
      geometry: {location: {lat: number; lng: number}}
      place_id: string
    } | null,
  ) => {
    if (!details) return

    const location: LocationData = {
      address: details.formatted_address,
      name: details.name || details.formatted_address || 'Pinned Location',
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      googlePlaceId: details.place_id,
    }
    setSelectedLocation(location)
    onLocationChange(location)
  }

  const handlePinConfirm = (coords: {latitude: number; longitude: number}) => {
    const location: LocationData = {
      ...coords,
      name: `Pinned Location`,
      address: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
    }
    setSelectedLocation(location)
    onLocationChange(location)
    setMapVisible(false)
  }

  return (
    <View className="my-2.5 relative min-h-[300px] w-full overflow-visible">
      <Text className="text-base font-bold mb-1">Location</Text>
      <LocationSearchInput
        renderKey={renderKey}
        onLocationSelect={handleLocationSelect}
        onPressPin={() => setMapVisible(true)}
      />
      {selectedLocation && (
        <View className="mt-2.5 p-2.5 bg-gray-100 rounded-md">
          <Text className="font-bold">{selectedLocation.name}</Text>
          <Text className="mt-1 text-gray-600">{selectedLocation.address}</Text>
        </View>
      )}
      <MapViewModal
        visible={isMapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={handlePinConfirm}
        initialLocation={
          selectedLocation
            ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }
            : undefined
        }
      />
    </View>
  )
}

export default LocationPicker
