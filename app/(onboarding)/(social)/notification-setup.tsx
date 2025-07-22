import React, {useState} from 'react'
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

export default function NotificationSetupScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: 'event-invites',
      title: 'Event Invitations',
      description: 'Get notified when you receive event invitations',
      enabled: true,
    },
    {
      id: 'event-reminders',
      title: 'Event Reminders',
      description: "Receive reminders before events you've RSVP'd to",
      enabled: true,
    },
    {
      id: 'event-updates',
      title: 'Event Updates',
      description: "Get notified about changes to events you're attending",
      enabled: true,
    },
    {
      id: 'new-events',
      title: 'New Events',
      description: 'Discover new events in your area and interests',
      enabled: false,
    },
    {
      id: 'messages',
      title: 'Messages',
      description:
        'Receive notifications for new messages from hosts and attendees',
      enabled: true,
    },
    {
      id: 'connection-requests',
      title: 'Connection Requests',
      description: 'Get notified when someone wants to connect with you',
      enabled: true,
    },
  ])

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting,
      ),
    )
  }

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      const enabledSettings = notificationSettings.filter(
        setting => setting.enabled,
      )
      devLog('Notification preferences saved', {
        totalSettings: notificationSettings.length,
        enabledSettings: enabledSettings.length,
        settings: enabledSettings.map(s => s.id),
      })

      // TODO: Save notification preferences to user profile
      router.push('/(onboarding)/(social)/safety-guidelines')
    } catch (error) {
      devLog('Failed to save notification preferences', error)
      Alert.alert(
        'Error',
        'Failed to save your notification preferences. Please try again.',
        [{text: 'OK'}],
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    devLog('Notification setup skipped')
    router.push('/(onboarding)/(social)/safety-guidelines')
  }

  const handleBack = () => {
    router.back()
  }

  const enableAllNotifications = () => {
    setNotificationSettings(prev =>
      prev.map(setting => ({...setting, enabled: true})),
    )
  }

  const disableAllNotifications = () => {
    setNotificationSettings(prev =>
      prev.map(setting => ({...setting, enabled: false})),
    )
  }

  const enabledCount = notificationSettings.filter(
    setting => setting.enabled,
  ).length

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to location setup">
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
            <Text style={{fontSize: 36, marginBottom: 16}}>🔔</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
              }}>
              Stay Connected
            </Text>
            <Text style={{textAlign: 'center', color: '#6B7280'}}>
              Choose how you want to be notified about events and activities
            </Text>
          </View>

          {/* Quick Actions */}
          <View
            style={{
              width: '100%',
              marginBottom: 24,
              flexDirection: 'row',
              gap: 8,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: '#DBEAFE',
                borderRadius: 8,
              }}
              onPress={enableAllNotifications}>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#1E40AF'}}>
                Enable All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
              }}
              onPress={disableAllNotifications}>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#374151'}}>
                Disable All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notification Settings */}
          <View style={{width: '100%', marginBottom: 32, gap: 16}}>
            {notificationSettings.map(setting => (
              <View
                key={setting.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                }}>
                <View style={{flex: 1, marginRight: 16}}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: 4,
                    }}>
                    {setting.title}
                  </Text>
                  <Text style={{fontSize: 14, color: '#6B7280'}}>
                    {setting.description}
                  </Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleNotification(setting.id)}
                  trackColor={{false: '#767577', true: '#3B82F6'}}
                  thumbColor={setting.enabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>

          {/* Summary */}
          <View
            style={{
              width: '100%',
              marginBottom: 24,
              padding: 16,
              backgroundColor: '#EFF6FF',
              borderRadius: 8,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                color: '#1E40AF',
                marginBottom: 8,
              }}>
              Notification Summary
            </Text>
            <Text style={{textAlign: 'center', fontSize: 14, color: '#1E40AF'}}>
              {enabledCount} of {notificationSettings.length} notification types
              enabled
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{width: '100%', gap: 12}}>
            <TouchableOpacity
              style={{
                width: '100%',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: '#3B82F6',
                padding: 16,
              }}
              onPress={handleContinue}
              disabled={isLoading}>
              <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
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

          {/* Help Text */}
          <View
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#F9FAFB',
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>
              💡 You can always change these settings later in your profile
              preferences.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
