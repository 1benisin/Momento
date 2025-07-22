import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

export default function CompletionScreen() {
  const router = useRouter()

  const handleGetStarted = () => {
    devLog('Participant onboarding completed, navigating to main app')
    router.replace('/(tabs)/(social)/discover')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to safety guidelines">
          <Text style={{color: '#6B7280', fontSize: 20, marginRight: 4}}>
            ←
          </Text>
          <Text style={{marginLeft: 4, color: '#6B7280', fontWeight: '500'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        {/* Success Animation */}
        <View style={{alignItems: 'center', marginBottom: 32}}>
          <View
            style={{
              width: 96,
              height: 96,
              backgroundColor: '#DCFCE7',
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
            <Text style={{fontSize: 36}}>🎉</Text>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontWeight: 'bold',
              marginBottom: 16,
            }}>
            Welcome to Momento!
          </Text>
          <Text style={{textAlign: 'center', fontSize: 18, color: '#6B7280'}}>
            Your profile is all set up and ready to go
          </Text>
        </View>

        {/* What's Next */}
        <View style={{width: '100%', marginBottom: 32, gap: 16}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            What you can do now:
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              padding: 16,
              backgroundColor: '#EFF6FF',
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 24}}>🔍</Text>
            <View style={{flex: 1}}>
              <Text
                style={{fontWeight: '600', color: '#1F2937', marginBottom: 4}}>
                Discover Events
              </Text>
              <Text style={{fontSize: 14, color: '#6B7280'}}>
                Browse events in your area and interests
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
            <Text style={{fontSize: 24}}>✅</Text>
            <View style={{flex: 1}}>
              <Text
                style={{fontWeight: '600', color: '#1F2937', marginBottom: 4}}>
                RSVP to Events
              </Text>
              <Text style={{fontSize: 14, color: '#6B7280'}}>
                Join events that catch your interest
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
            <Text style={{fontSize: 24}}>🤝</Text>
            <View style={{flex: 1}}>
              <Text
                style={{fontWeight: '600', color: '#1F2937', marginBottom: 4}}>
                Connect with People
              </Text>
              <Text style={{fontSize: 14, color: '#6B7280'}}>
                Build connections with fellow attendees
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
            <Text style={{fontSize: 24}}>📖</Text>
            <View style={{flex: 1}}>
              <Text
                style={{fontWeight: '600', color: '#1F2937', marginBottom: 4}}>
                Memory Book
              </Text>
              <Text style={{fontSize: 14, color: '#6B7280'}}>
                Keep track of your experiences and connections
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#3B82F6',
            padding: 16,
          }}
          onPress={handleGetStarted}>
          <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            Start Discovering Events
          </Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>
            💡 You can always update your profile, interests, and preferences in
            your settings.
          </Text>
        </View>
      </View>
    </View>
  )
}
