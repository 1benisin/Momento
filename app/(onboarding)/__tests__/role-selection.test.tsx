import {fireEvent, render} from '@testing-library/react-native'
import React from 'react'
import {AccessibilityInfo, Alert, View} from 'react-native'
import {useRouter} from 'expo-router'
import {devLog} from '../../../utils/devLog'
import RoleSelectionScreen from '../role-selection'

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useFocusEffect: jest.fn(),
}))

// Mock devLog
jest.mock('../../../utils/devLog', () => ({
  devLog: jest.fn(),
}))

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const React = jest.requireActual('react')
  const {View} = jest.requireActual('react-native')
  return {
    LinearGradient: (props: React.ComponentProps<typeof View>) => (
      <View {...props} />
    ),
  }
})

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock')
  Reanimated.default.call = () => {}
  return {
    ...Reanimated,
    useSharedValue: () => ({value: 1}),
    useAnimatedStyle: () => ({}),
    withSpring: () => 1,
    FadeIn: {
      delay: () => ({
        springify: () => ({}),
      }),
    },
    FadeInDown: {
      delay: () => ({
        springify: () => ({}),
      }),
    },
  }
})

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const {View} = jest.requireActual('react-native')
  return {
    SafeAreaView: View,
  }
})

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}))

// Mock AccessibilityInfo and Alert
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(() => {})
jest.spyOn(Alert, 'alert').mockImplementation(() => {})

describe('RoleSelectionScreen', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders role selection options', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    expect(getByText('Choose Your Path')).toBeTruthy()
    expect(
      getByText(
        'How would you like to experience Momento? Select the role that resonates with your journey.',
      ),
    ).toBeTruthy()
    expect(getByText('Participant')).toBeTruthy()
    expect(getByText('Host')).toBeTruthy()
  })

  it('displays all participant features', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    expect(getByText('DISCOVER')).toBeTruthy()
    expect(
      getByText(
        'Explore curated experiences and connect with like-minded individuals',
      ),
    ).toBeTruthy()
    expect(getByText('CONNECT')).toBeTruthy()
    expect(
      getByText('Build meaningful relationships through shared moments'),
    ).toBeTruthy()
    expect(getByText('ENGAGE')).toBeTruthy()
    expect(
      getByText('Participate in discussions and share your perspective'),
    ).toBeTruthy()
  })

  it('displays all host features', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    expect(getByText('CREATE')).toBeTruthy()
    expect(
      getByText('Design and lead your own unique experiences'),
    ).toBeTruthy()
    expect(getByText('EARN')).toBeTruthy()
    expect(
      getByText('Generate income through your expertise and creativity'),
    ).toBeTruthy()
    expect(getByText('GROW')).toBeTruthy()
    expect(
      getByText('Build a following and expand your influence'),
    ).toBeTruthy()
  })

  it('navigates to social onboarding when participant role is selected', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/(onboarding)/(social)/welcome',
    )
  })

  it('navigates to host onboarding when host role is selected', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const hostButton = getByText('Host')
    fireEvent.press(hostButton)

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/(onboarding)/(host)/host-profile-setup',
    )
  })

  it('announces accessibility when role is selected', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Selected participant role',
    )
  })

  it('announces accessibility for host role selection', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const hostButton = getByText('Host')
    fireEvent.press(hostButton)

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Selected host role',
    )
  })

  it('prevents multiple selections when loading', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const participantButton = getByText('Participant')
    const hostButton = getByText('Host')

    // Press participant button
    fireEvent.press(participantButton)

    // Immediately try to press host button - should not work
    fireEvent.press(hostButton)

    // Should only have been called once
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/(onboarding)/(social)/welcome',
    )
  })

  it('has proper accessibility labels', () => {
    const {getByLabelText} = render(<RoleSelectionScreen />)

    expect(getByLabelText('Select participant role')).toBeTruthy()
    expect(getByLabelText('Select host role')).toBeTruthy()
  })

  it('shows role switching information', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    expect(
      getByText('💫 You can switch between roles anytime in your settings'),
    ).toBeTruthy()
  })

  it('shows loading indicator during navigation', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    expect(getByText('Setting up your experience...')).toBeTruthy()
  })

  it('logs role selection with devLog', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    expect(devLog).toHaveBeenCalledWith('Role selection initiated', {
      role: 'social',
    })
  })

  it('handles navigation errors gracefully', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    // Mock router.push to throw an error
    mockRouter.push.mockImplementationOnce(() => {
      throw new Error('Navigation failed')
    })

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    // Should show error alert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Something went wrong. Please try again.',
      [{text: 'OK'}],
    )
  })

  it('logs error when navigation fails', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    // Mock router.push to throw an error
    mockRouter.push.mockImplementationOnce(() => {
      throw new Error('Navigation failed')
    })

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    expect(devLog).toHaveBeenCalledWith(
      'Failed to update onboarding state',
      expect.any(Error),
    )
  })

  it('resets loading state on error', () => {
    const {getByText, queryByText} = render(<RoleSelectionScreen />)

    // Mock router.push to throw an error
    mockRouter.push.mockImplementationOnce(() => {
      throw new Error('Navigation failed')
    })

    const participantButton = getByText('Participant')
    fireEvent.press(participantButton)

    // Should show error alert
    expect(Alert.alert).toHaveBeenCalled()

    // Loading indicator should disappear after error
    expect(queryByText('Setting up your experience...')).toBeFalsy()
  })

  it('displays correct subtitles for each role', () => {
    const {getByText} = render(<RoleSelectionScreen />)

    expect(getByText('Discover and connect')).toBeTruthy()
    expect(getByText('Create and earn')).toBeTruthy()
  })
})
