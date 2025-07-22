import React, {useState} from 'react'
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'

interface Interest {
  id: string
  name: string
  icon: string
  category: string
}

const interests: Interest[] = [
  // Food & Dining
  {id: 'cooking', name: 'Cooking', icon: '👨‍🍳', category: 'Food & Dining'},
  {
    id: 'wine-tasting',
    name: 'Wine Tasting',
    icon: '🍷',
    category: 'Food & Dining',
  },
  {id: 'coffee', name: 'Coffee', icon: '☕', category: 'Food & Dining'},
  {id: 'craft-beer', name: 'Craft Beer', icon: '🍺', category: 'Food & Dining'},

  // Outdoor & Adventure
  {id: 'hiking', name: 'Hiking', icon: '🏔️', category: 'Outdoor & Adventure'},
  {
    id: 'rock-climbing',
    name: 'Rock Climbing',
    icon: '🧗',
    category: 'Outdoor & Adventure',
  },
  {id: 'cycling', name: 'Cycling', icon: '🚴', category: 'Outdoor & Adventure'},
  {id: 'yoga', name: 'Yoga', icon: '🧘', category: 'Outdoor & Adventure'},

  // Arts & Culture
  {id: 'art', name: 'Art', icon: '🎨', category: 'Arts & Culture'},
  {id: 'music', name: 'Music', icon: '🎵', category: 'Arts & Culture'},
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    category: 'Arts & Culture',
  },
  {id: 'theater', name: 'Theater', icon: '🎭', category: 'Arts & Culture'},

  // Technology
  {id: 'programming', name: 'Programming', icon: '💻', category: 'Technology'},
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    category: 'Technology',
  },
  {id: 'gaming', name: 'Gaming', icon: '🎮', category: 'Technology'},
  {id: 'startups', name: 'Startups', icon: '🚀', category: 'Technology'},

  // Social & Networking
  {
    id: 'networking',
    name: 'Networking',
    icon: '🤝',
    category: 'Social & Networking',
  },
  {
    id: 'language-exchange',
    name: 'Language Exchange',
    icon: '🗣️',
    category: 'Social & Networking',
  },
  {
    id: 'book-club',
    name: 'Book Club',
    icon: '📚',
    category: 'Social & Networking',
  },
  {
    id: 'board-games',
    name: 'Board Games',
    icon: '🎲',
    category: 'Social & Networking',
  },

  // Wellness & Health
  {
    id: 'meditation',
    name: 'Meditation',
    icon: '🧘‍♀️',
    category: 'Wellness & Health',
  },
  {id: 'fitness', name: 'Fitness', icon: '💪', category: 'Wellness & Health'},
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: '🥗',
    category: 'Wellness & Health',
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: '🧠',
    category: 'Wellness & Health',
  },
]

const categories = Array.from(
  new Set(interests.map(interest => interest.category)),
)

export default function InterestSelectionScreen() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId],
    )
  }

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert(
        'Select Interests',
        'Please select at least one interest to help us find events for you.',
        [{text: 'OK'}],
      )
      return
    }

    if (selectedInterests.length > 8) {
      Alert.alert(
        'Too Many Interests',
        'Please select 8 or fewer interests for the best experience.',
        [{text: 'OK'}],
      )
      return
    }

    setIsLoading(true)
    try {
      devLog('Interest selection completed', {selectedInterests})
      // TODO: Save interests to user profile
      router.push('/(onboarding)/(social)/initial-photo')
    } catch (error) {
      devLog('Failed to save interests', error)
      Alert.alert('Error', 'Failed to save your interests. Please try again.', [
        {text: 'OK'},
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    devLog('Interest selection skipped')
    router.push('/(onboarding)/(social)/initial-photo')
  }

  const handleBack = () => {
    router.back()
  }

  const getInterestsByCategory = (category: string) => {
    return interests.filter(interest => interest.category === category)
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Back Button */}
      <View style={{padding: 20, paddingTop: 60}}>
        <TouchableOpacity
          onPress={handleBack}
          style={{flexDirection: 'row', alignItems: 'center'}}
          accessibilityRole="button"
          accessibilityLabel="Go back to profile setup">
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
        {/* Header */}
        <View style={{marginBottom: 24}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 8,
            }}>
            What interests you?
          </Text>
          <Text
            style={{textAlign: 'center', color: '#6B7280', marginBottom: 16}}>
            {`Select your interests to help us find events you'll love`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text style={{fontSize: 14, color: '#6B7280'}}>
              {selectedInterests.length} selected
            </Text>
            {selectedInterests.length > 0 && (
              <TouchableOpacity
                onPress={() => setSelectedInterests([])}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: '#E5E7EB',
                  borderRadius: 4,
                }}>
                <Text style={{fontSize: 12, color: '#6B7280'}}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Interest Categories */}
        <View style={{gap: 24}}>
          {categories.map(category => (
            <View key={category}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 12,
                  color: '#1F2937',
                }}>
                {category}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                {getInterestsByCategory(category).map(interest => (
                  <TouchableOpacity
                    key={interest.id}
                    onPress={() => handleInterestToggle(interest.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: selectedInterests.includes(interest.id)
                        ? '#3B82F6'
                        : '#D1D5DB',
                      backgroundColor: selectedInterests.includes(interest.id)
                        ? '#EFF6FF'
                        : 'white',
                    }}>
                    <Text style={{fontSize: 18}}>{interest.icon}</Text>
                    <Text
                      style={{
                        fontWeight: '500',
                        color: selectedInterests.includes(interest.id)
                          ? '#1E40AF'
                          : '#374151',
                      }}>
                      {interest.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={{marginTop: 32, gap: 12}}>
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              borderRadius: 8,
              padding: 16,
              backgroundColor:
                selectedInterests.length === 0 || isLoading
                  ? '#D1D5DB'
                  : '#3B82F6',
            }}
            onPress={handleContinue}
            disabled={selectedInterests.length === 0 || isLoading}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color:
                  selectedInterests.length === 0 || isLoading
                    ? '#6B7280'
                    : 'white',
              }}>
              {isLoading
                ? 'Saving...'
                : `Continue (${selectedInterests.length} selected)`}
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
            backgroundColor: '#EFF6FF',
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 14, color: '#1E40AF', textAlign: 'center'}}>
            💡 You can always update your interests later in your profile
            settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
