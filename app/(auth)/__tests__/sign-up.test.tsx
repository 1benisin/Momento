import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react-native'
import SignUpScreen from '../sign-up'
import {useSignUp} from '@clerk/clerk-expo'

// Mock the dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useSignUp: jest.fn(),
}))

jest.mock('react-native-phone-number-input', () => {
  const React = require('react')
  const {View, TextInput} = require('react-native')
  const PhoneInput = React.forwardRef((props: any, ref: any) => {
    const {onChangeText, onChangeFormattedText, defaultValue} = props
    if (ref) {
      ref.current = {
        isValidNumber: (value: string) => {
          // simple validation for testing
          return value && value.length > 5
        },
      }
    }
    return (
      <View>
        <TextInput
          testID="phone-input"
          defaultValue={defaultValue}
          onChangeText={(text: string) => {
            if (onChangeText) onChangeText(text)
            if (onChangeFormattedText) onChangeFormattedText(`+1${text}`)
          }}
        />
      </View>
    )
  })
  return {
    __esModule: true,
    default: PhoneInput,
  }
})

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  Link: ({children}: {children: React.ReactNode}) => children,
}))

describe('SignUpScreen', () => {
  const mockSignUp = {
    isLoaded: true,
    signUp: {
      create: jest.fn(),
      prepareEmailAddressVerification: jest.fn(),
      attemptEmailAddressVerification: jest.fn(),
      preparePhoneNumberVerification: jest.fn(),
      attemptPhoneNumberVerification: jest.fn(),
    },
    setActive: jest.fn(),
  }

  beforeEach(() => {
    ;(useSignUp as jest.Mock).mockReturnValue(mockSignUp)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders email form when email tab is pressed', () => {
    const {getByText, getByPlaceholderText} = render(<SignUpScreen />)
    fireEvent.press(getByText('Email'))
    expect(getByPlaceholderText('email@example.com')).toBeTruthy()
  })

  it('calls sign up with phone on valid submission', async () => {
    const {getByText, getByTestId} = render(<SignUpScreen />)
    fireEvent.changeText(getByTestId('phone-input'), '1234567890')
    fireEvent.press(getByText('Sign Up'))

    await waitFor(() => {
      expect(mockSignUp.signUp.create).toHaveBeenCalledWith({
        phoneNumber: '+11234567890',
      })
      expect(
        mockSignUp.signUp.preparePhoneNumberVerification,
      ).toHaveBeenCalled()
    })
  })

  it('shows an error message if sign up fails', async () => {
    const {getByText, getByTestId, findByText} = render(<SignUpScreen />)
    const errorMessage = 'This phone number is already in use.'
    mockSignUp.signUp.create.mockRejectedValueOnce({
      errors: [{longMessage: errorMessage}],
    })

    fireEvent.changeText(getByTestId('phone-input'), '1234567890')
    fireEvent.press(getByText('Sign Up'))

    const error = await findByText(errorMessage)
    expect(error).toBeTruthy()
  })

  it('calls phone verification and sets active session', async () => {
    const {getByText, getByTestId, getByPlaceholderText} = render(
      <SignUpScreen />,
    )
    fireEvent.changeText(getByTestId('phone-input'), '1234567890')
    fireEvent.press(getByText('Sign Up'))

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Code...'), '123456')
    })

    mockSignUp.signUp.attemptPhoneNumberVerification.mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_67890',
    })

    fireEvent.press(getByText('Verify'))

    await waitFor(() => {
      expect(
        mockSignUp.signUp.attemptPhoneNumberVerification,
      ).toHaveBeenCalledWith({
        code: '123456',
      })
      expect(mockSignUp.setActive).toHaveBeenCalledWith({
        session: 'sess_67890',
      })
    })
  })

  it('calls sign up with email on valid submission', async () => {
    const {getByText, getByPlaceholderText} = render(<SignUpScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )

    mockSignUp.signUp.create.mockResolvedValueOnce({})
    mockSignUp.signUp.prepareEmailAddressVerification.mockResolvedValueOnce({})

    fireEvent.press(getByText('Sign Up'))

    await waitFor(() => {
      expect(mockSignUp.signUp.create).toHaveBeenCalledWith({
        emailAddress: 'test@user.com',
      })
      expect(
        mockSignUp.signUp.prepareEmailAddressVerification,
      ).toHaveBeenCalledWith({strategy: 'email_code'})
    })
  })

  it('navigates to verification on successful sign up', async () => {
    const {getByText, getByPlaceholderText} = render(<SignUpScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )
    fireEvent.press(getByText('Sign Up'))

    await waitFor(() => {
      expect(getByText('Verification Code')).toBeTruthy()
    })
  })

  it('calls verification and sets active session', async () => {
    const {getByText, getByPlaceholderText} = render(<SignUpScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )
    fireEvent.press(getByText('Sign Up'))

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Code...'), '123456')
    })

    mockSignUp.signUp.attemptEmailAddressVerification.mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_12345',
    })

    fireEvent.press(getByText('Verify'))

    await waitFor(() => {
      expect(
        mockSignUp.signUp.attemptEmailAddressVerification,
      ).toHaveBeenCalledWith({
        code: '123456',
      })
      expect(mockSignUp.setActive).toHaveBeenCalledWith({session: 'sess_12345'})
    })
  })
})
