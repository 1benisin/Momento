import React, {useState} from 'react'
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {useFocusEffect, useRouter} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {SafeAreaView} from 'react-native-safe-area-context'
import {devLog} from '../../utils/devLog'

export default function RoleSelectionScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'social' | 'host' | null>(
    null,
  )

  // Reset loading state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false)
      setSelectedRole(null)
      devLog('Role selection screen focused - resetting state')
    }, []),
  )

  const handleSelection = async (role: 'social' | 'host') => {
    if (isLoading) return

    setSelectedRole(role)
    devLog('Role selection initiated', {role})
    setIsLoading(true)

    try {
      // Add accessibility announcement
      AccessibilityInfo.announceForAccessibility(
        `Selected ${role === 'social' ? 'participant' : 'host'} role`,
      )

      if (role === 'social') {
        router.push('/(onboarding)/(social)/welcome')
      } else {
        router.push('/(onboarding)/(host)/host-profile-setup')
      }
    } catch (error) {
      devLog('Failed to update onboarding state', error)
      Alert.alert('Error', 'Something went wrong. Please try again.', [
        {text: 'OK'},
      ])
      // Reset loading state on error
      setIsLoading(false)
      setSelectedRole(null)
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar style="dark" />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 24}}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{alignItems: 'center', marginBottom: 40}}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#000000',
            }}
            accessibilityRole="header">
            Choose Your Path
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: '#666666',
              marginTop: 12,
              maxWidth: 280,
              lineHeight: 24,
            }}>
            How would you like to experience Momento? Select the role that
            resonates with your journey.
          </Text>
        </View>

        {/* Participant Role Card */}
        <TouchableOpacity
          style={{
            width: '100%',
            marginBottom: 20,
            padding: 20,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            borderWidth: selectedRole === 'social' ? 2 : 1,
            borderColor: selectedRole === 'social' ? '#007AFF' : '#e1e5e9',
          }}
          onPress={() => handleSelection('social')}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Select participant role"
          accessibilityState={{selected: selectedRole === 'social'}}
          accessibilityHint="Double tap to choose participant role and start onboarding">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#007AFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
              <Text style={{fontSize: 24}}>👥</Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#000000',
                  textTransform: 'uppercase',
                }}>
                Participant
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666666',
                  marginTop: 4,
                }}>
                Discover and connect
              </Text>
            </View>
            {selectedRole === 'social' && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#007AFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16, color: '#ffffff'}}>✓</Text>
              </View>
            )}
          </View>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 12,
                alignItems: 'flex-start',
              }}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>🎯</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  DISCOVER
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Explore curated experiences and connect with like-minded
                  individuals
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 12,
                alignItems: 'flex-start',
              }}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>🤝</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  CONNECT
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Build meaningful relationships through shared moments
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>💬</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  ENGAGE
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Participate in discussions and share your perspective
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Host Role Card */}
        <TouchableOpacity
          style={{
            width: '100%',
            marginBottom: 20,
            padding: 20,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            borderWidth: selectedRole === 'host' ? 2 : 1,
            borderColor: selectedRole === 'host' ? '#007AFF' : '#e1e5e9',
          }}
          onPress={() => handleSelection('host')}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Select host role"
          accessibilityState={{selected: selectedRole === 'host'}}
          accessibilityHint="Double tap to choose host role and start onboarding">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#007AFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
              <Text style={{fontSize: 24}}>👑</Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#000000',
                  textTransform: 'uppercase',
                }}>
                Host
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666666',
                  marginTop: 4,
                }}>
                Create and earn
              </Text>
            </View>
            {selectedRole === 'host' && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#007AFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16, color: '#ffffff'}}>✓</Text>
              </View>
            )}
          </View>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 12,
                alignItems: 'flex-start',
              }}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>✨</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  CREATE
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Design and lead your own unique experiences
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 12,
                alignItems: 'flex-start',
              }}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>💰</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  EARN
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Generate income through your expertise and creativity
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <View style={{marginRight: 12, marginTop: 2}}>
                <Text style={{fontSize: 16}}>📈</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                  GROW
                </Text>
                <Text style={{fontSize: 12, color: '#666666', marginTop: 2}}>
                  Build a following and expand your influence
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={{alignItems: 'center', marginTop: 32}}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text
              style={{
                marginTop: 16,
                fontSize: 14,
                color: '#666666',
              }}>
              Setting up your experience...
            </Text>
          </View>
        )}

        {/* Additional Info */}
        <View
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e1e5e9',
          }}>
          <Text
            style={{
              fontSize: 12,
              color: '#666666',
              textAlign: 'center',
            }}>
            💫 You can switch between roles anytime in your settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
