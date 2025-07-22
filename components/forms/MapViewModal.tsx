import React, {useEffect, useState} from 'react'
import {Button, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import * as Location from 'expo-location'
import MapView, {Region} from 'react-native-maps'

interface MapViewModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (location: {latitude: number; longitude: number}) => void
  initialLocation?: {latitude: number; longitude: number}
}

const MapViewModal: React.FC<MapViewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialLocation,
}) => {
  const [region, setRegion] = useState<Region | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      if (initialLocation) {
        setRegion({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      } else {
        let {status} = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.error('Permission to access location was denied')
          setRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
          return
        }

        let location = await Location.getCurrentPositionAsync({})
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      }
    })()
  }, [visible, initialLocation])

  const handleConfirm = () => {
    if (region) {
      onConfirm({
        latitude: region.latitude,
        longitude: region.longitude,
      })
    }
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1">
        <View className="p-4 items-center border-b border-gray-200">
          <Text className="text-lg font-bold">Drag Map to Set Location</Text>
        </View>
        <View className="flex-1">
          <MapView
            style={StyleSheet.absoluteFill}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
          />
          <View className="left-1/2 top-1/2 absolute -ml-5 -mt-10">
            <Ionicons name="location" size={40} color="#FF3B30" />
          </View>
        </View>
        <View className="p-4 flex-row justify-around border-t border-gray-200">
          <Button title="Cancel" onPress={onClose} color="#FF3B30" />
          <Button title="Confirm Location" onPress={handleConfirm} />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default MapViewModal
