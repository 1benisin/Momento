import React, {useState} from 'react'
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

interface Guideline {
  id: string
  title: string
  description: string
  icon: string
}

const guidelines: Guideline[] = [
  {
    id: 'respect',
    title: 'Be Respectful',
    description:
      'Treat everyone with kindness and respect. Harassment, discrimination, or inappropriate behavior is not tolerated.',
    icon: '🤝',
  },
  {
    id: 'safety',
    title: 'Prioritize Safety',
    description:
      'Meet in public places for first-time encounters. Trust your instincts and report any concerning behavior.',
    icon: '🛡️',
  },
  {
    id: 'authenticity',
    title: 'Be Authentic',
    description:
      'Use real photos and accurate information. Authentic connections start with honest representation.',
    icon: '✨',
  },
  {
    id: 'communication',
    title: 'Communicate Clearly',
    description:
      'Be clear about your expectations and boundaries. Open communication helps everyone have a great experience.',
    icon: '💬',
  },
  {
    id: 'reporting',
    title: 'Report Issues',
    description:
      'If you experience or witness inappropriate behavior, report it immediately. We take all reports seriously.',
    icon: '🚨',
  },
]

export default function SafetyGuidelinesScreen() {
  const router = useRouter()
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!hasReadGuidelines) {
      Alert.alert(
        'Please Read Guidelines',
        'Please read through the community guidelines before continuing.',
        [{text: 'OK'}],
      )
      return
    }

    setIsLoading(true)
    try {
      devLog('Safety guidelines acknowledged')
      // TODO: Save acknowledgment to user profile
      router.push('/(onboarding)/(social)/completion')
    } catch (error) {
      devLog('Failed to save guidelines acknowledgment', error)
      Alert.alert(
        'Error',
        'Failed to save your acknowledgment. Please try again.',
        [{text: 'OK'}],
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    devLog('Safety guidelines skipped')
    router.push('/(onboarding)/(social)/completion')
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
          accessibilityLabel="Go back to notification setup">
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
            <Text style={{fontSize: 36, marginBottom: 16}}>🛡️</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
              }}>
              Community Guidelines
            </Text>
            <Text style={{textAlign: 'center', color: '#6B7280'}}>
              Help us create a safe and welcoming community for everyone
            </Text>
          </View>

          {/* Guidelines */}
          <View style={{width: '100%', marginBottom: 32, gap: 16}}>
            {guidelines.map(guideline => (
              <View
                key={guideline.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 16,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                }}>
                <Text style={{fontSize: 24}}>{guideline.icon}</Text>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: 4,
                    }}>
                    {guideline.title}
                  </Text>
                  <Text style={{fontSize: 14, color: '#6B7280'}}>
                    {guideline.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Safety Tips */}
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
                color: '#1E40AF',
              }}>
              {`Safety Tips for Events`}
            </Text>
            <View style={{gap: 8}}>
              <Text style={{fontSize: 14, color: '#1E40AF'}}>
                {`• Meet in public, well-lit locations`}
              </Text>
              <Text style={{fontSize: 14, color: '#1E40AF'}}>
                {`• Tell a friend or family member where you're going`}
              </Text>
              <Text style={{fontSize: 14, color: '#1E40AF'}}>
                {`• Trust your instincts - if something feels off, leave`}
              </Text>
              <Text style={{fontSize: 14, color: '#1E40AF'}}>
                {`• Keep your personal information private until you're
                comfortable`}
              </Text>
              <Text style={{fontSize: 14, color: '#1E40AF'}}>
                {`• Report any suspicious or inappropriate behavior`}
              </Text>
            </View>
          </View>

          {/* Acknowledgment */}
          <View style={{width: '100%', marginBottom: 32}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
              }}
              onPress={() => setHasReadGuidelines(!hasReadGuidelines)}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: hasReadGuidelines ? '#3B82F6' : '#9CA3AF',
                  backgroundColor: hasReadGuidelines
                    ? '#3B82F6'
                    : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {hasReadGuidelines && (
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={{flex: 1, color: '#374151'}}>
                I have read and agree to follow the community guidelines
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{width: '100%', gap: 12}}>
            <TouchableOpacity
              style={{
                width: '100%',
                alignItems: 'center',
                borderRadius: 8,
                padding: 16,
                backgroundColor: hasReadGuidelines ? '#3B82F6' : '#D1D5DB',
                opacity: !hasReadGuidelines || isLoading ? 0.6 : 1,
              }}
              onPress={handleContinue}
              disabled={!hasReadGuidelines || isLoading}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: hasReadGuidelines ? 'white' : '#6B7280',
                }}>
                {isLoading ? 'Saving...' : 'Continue'}
              </Text>
            </TouchableOpacity>

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
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>

          {/* Support Information */}
          <View
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 8,
              }}>
              Need help or have concerns?
            </Text>
            <Text style={{fontSize: 14, color: '#2563EB', textAlign: 'center'}}>
              Contact our support team at support@momento.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
