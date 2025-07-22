import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

const benefits = [
  {
    icon: '🎯',
    title: 'Discover Amazing Events',
    description: 'Find unique experiences tailored to your interests',
  },
  {
    icon: '🤝',
    title: 'Connect with Like-minded People',
    description: 'Meet new friends who share your passions',
  },
  {
    icon: '📱',
    title: 'Easy RSVP & Communication',
    description: 'Join events with one tap and stay connected',
  },
  {
    icon: '📖',
    title: 'Memory Book',
    description: 'Keep track of connections and experiences',
  },
]

export default function WelcomeScreen() {
  const router = useRouter()

  const handleGetStarted = () => {
    devLog('Participant onboarding started')
    router.push('/(onboarding)/(social)/profile-setup')
  }

  const handleBack = () => {
    devLog('Navigating back to role selection')
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
          accessibilityLabel="Go back to role selection">
          <Text style={{color: '#6B7280', fontSize: 20, marginRight: 4}}>
            ←
          </Text>
          <Text style={{color: '#6B7280', fontWeight: '500'}}>Back</Text>
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
            <Text style={{fontSize: 36, marginBottom: 16}}>👋</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                marginBottom: 16,
              }}>
              {`Welcome to Momento!`}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: '#6B7280',
                marginBottom: 8,
              }}>
              {`You're about to join a community of people who love`}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 18, color: '#6B7280'}}>
              {`discovering amazing experiences together.`}
            </Text>
          </View>

          {/* Benefits */}
          <View style={{width: '100%', marginBottom: 32}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 16,
                textAlign: 'center',
              }}>
              What you can do as a participant:
            </Text>
            <View style={{gap: 16}}>
              {benefits.map((benefit, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                  }}>
                  <Text style={{fontSize: 24}}>{benefit.icon}</Text>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: '#1F2937',
                        marginBottom: 4,
                      }}>
                      {benefit.title}
                    </Text>
                    <Text style={{fontSize: 14, color: '#6B7280'}}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Onboarding Preview */}
          <View
            style={{
              width: '100%',
              marginBottom: 32,
              padding: 16,
              backgroundColor: '#EFF6FF',
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 12,
                textAlign: 'center',
                color: '#1E40AF',
              }}>
              Quick Setup Process
            </Text>
            <View style={{gap: 8}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#3B82F6',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
                    1
                  </Text>
                </View>
                <Text style={{color: '#374151'}}>Tell us about yourself</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#3B82F6',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
                    2
                  </Text>
                </View>
                <Text style={{color: '#374151'}}>Add your interests</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#3B82F6',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
                    3
                  </Text>
                </View>
                <Text style={{color: '#374151'}}>Upload a profile photo</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#3B82F6',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
                    4
                  </Text>
                </View>
                <Text style={{color: '#374151'}}>
                  Set up location & notifications
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
              Get Started
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
              💡 This setup takes about 2-3 minutes. You can always update your
              preferences later.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
