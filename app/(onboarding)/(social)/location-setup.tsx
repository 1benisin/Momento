import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Location from 'expo-location'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

export default function LocationSetupScreen() {
  const router = useRouter()
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    try {
      const {status} = await Location.getForegroundPermissionsAsync()
      setLocationPermission(status)
      devLog('Location permission status', {status})
    } catch (error) {
      devLog('Failed to check location permission', error)
    }
  }

  const requestLocationPermission = async () => {
    setIsLoading(true)
    try {
      const {status} = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(status)
      devLog('Location permission requested', {status})

      if (status === 'granted') {
        await getCurrentLocation()
      } else {
        Alert.alert(
          'Location Permission Required',
          'To find events near you, we need access to your location. You can enable this in your device settings.',
          [
            {text: 'Continue without location', onPress: handleSkip},
            {text: 'Open Settings', onPress: openSettings},
          ],
        )
      }
    } catch (error) {
      devLog('Failed to request location permission', error)
      Alert.alert(
        'Error',
        'Failed to request location permission. Please try again.',
        [{text: 'OK'}],
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setCurrentLocation(location)
      devLog('Current location obtained', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    } catch (error) {
      devLog('Failed to get current location', error)
      Alert.alert(
        'Location Error',
        'Could not get your current location. You can still continue without location.',
        [{text: 'Continue'}],
      )
    }
  }

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      // For iOS, we can't directly open settings, but we can guide the user
      Alert.alert(
        'Open Settings',
        'Please go to Settings > Privacy & Security > Location Services > Momento and enable location access.',
        [{text: 'OK'}],
      )
    } else {
      // For Android, we can try to open settings
      // This would require additional setup in a real app
      Alert.alert(
        'Open Settings',
        'Please go to Settings > Apps > Momento > Permissions and enable location access.',
        [{text: 'OK'}],
      )
    }
  }

  const handleContinue = () => {
    devLog('Location setup completed', {
      permission: locationPermission,
      hasLocation: !!currentLocation,
    })
    router.push('/(onboarding)/(social)/notification-setup')
  }

  const handleSkip = () => {
    devLog('Location setup skipped')
    router.push('/(onboarding)/(social)/notification-setup')
  }

  const handleBack = () => {
    router.back()
  }

  const getPermissionStatusText = () => {
    switch (locationPermission) {
      case 'granted':
        return 'Location access granted'
      case 'denied':
        return 'Location access denied'
      case 'undetermined':
        return 'Location permission not determined'
      default:
        return 'Location permission not determined'
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to photo upload">
          <Text style={{color: '#6B7280', fontSize: 20, marginRight: 4}}>
            ←
          </Text>
          <Text style={{marginLeft: 4, color: '#6B7280', fontWeight: '500'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 600,
          }}>
          {/* Header */}
          <View style={{alignItems: 'center', marginBottom: 32}}>
            <Text style={{fontSize: 36, marginBottom: 16}}>📍</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
              }}>
              Find Events Near You
            </Text>
            <Text style={{textAlign: 'center', color: '#6B7280'}}>
              Enable location access to discover events in your area
            </Text>
          </View>

          {/* Location Benefits */}
          <View style={{width: '100%', marginBottom: 32, gap: 16}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                backgroundColor: '#EFF6FF',
                borderRadius: 8,
              }}>
              <Text style={{fontSize: 24}}>🎯</Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}>
                  Discover Local Events
                </Text>
                <Text style={{fontSize: 14, color: '#6B7280'}}>
                  Find events happening near you
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                backgroundColor: '#EFF6FF',
                borderRadius: 8,
              }}>
              <Text style={{fontSize: 24}}>🚶</Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}>
                  Easy Travel Planning
                </Text>
                <Text style={{fontSize: 14, color: '#6B7280'}}>
                  See travel time and directions to events
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                backgroundColor: '#EFF6FF',
                borderRadius: 8,
              }}>
              <Text style={{fontSize: 24}}>🌍</Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}>
                  Community Connection
                </Text>
                <Text style={{fontSize: 14, color: '#6B7280'}}>
                  Connect with people in your area
                </Text>
              </View>
            </View>
          </View>

          {/* Permission Status */}
          {locationPermission && (
            <View
              style={{
                width: '100%',
                marginBottom: 24,
                padding: 16,
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: 8,
                }}>
                Current Status:
              </Text>
              <Text
                style={{textAlign: 'center', fontSize: 14, color: '#6B7280'}}>
                {getPermissionStatusText()}
              </Text>
              {currentLocation && (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#9CA3AF',
                    marginTop: 8,
                  }}>
                  Location: {currentLocation.coords.latitude.toFixed(4)},{' '}
                  {currentLocation.coords.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={{width: '100%', gap: 12}}>
            {locationPermission !== 'granted' ? (
              <TouchableOpacity
                style={{
                  width: '100%',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: '#3B82F6',
                  padding: 16,
                }}
                onPress={requestLocationPermission}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
                    Enable Location Access
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  width: '100%',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: '#10B981',
                  padding: 16,
                }}
                onPress={handleContinue}>
                <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
                  Continue with Location
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                width: '100%',
                alignItems: 'center',
                borderRadius: 8,
                padding: 12,
              }}
              onPress={handleSkip}
              disabled={isLoading}>
              <Text style={{fontSize: 18, fontWeight: '600', color: '#6B7280'}}>
                Continue without location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Notice */}
          <View
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>
              🔒 Your location is only used to find nearby events and is never
              shared with other users without your permission.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
