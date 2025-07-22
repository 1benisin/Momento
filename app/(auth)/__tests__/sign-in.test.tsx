import {fireEvent, render, waitFor} from '@testing-library/react-native'
import React from 'react'
import {useSignIn} from '@clerk/clerk-expo'
import SignInScreen from '../sign-in'

// Mock the dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: jest.fn(),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  Link: ({children}: {children: React.ReactNode}) => children,
}))

describe('SignInScreen', () => {
  const mockSignIn = {
    isLoaded: true,
    signIn: {
      create: jest.fn(),
      prepareFirstFactor: jest.fn(),
      attemptFirstFactor: jest.fn(),
    },
    setActive: jest.fn(),
  }

  beforeEach(() => {
    ;(useSignIn as jest.Mock).mockReturnValue(mockSignIn)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders email form when email tab is pressed', () => {
    const {getByText, getByPlaceholderText} = render(<SignInScreen />)
    fireEvent.press(getByText('Email'))
    expect(getByPlaceholderText('email@example.com')).toBeTruthy()
  })

  it('calls sign in with email on valid submission', async () => {
    const {getByText, getByPlaceholderText} = render(<SignInScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )

    mockSignIn.signIn.create.mockResolvedValueOnce({
      supportedFirstFactors: [
        {strategy: 'email_code', emailAddressId: 'some_id'},
      ],
    })
    mockSignIn.signIn.prepareFirstFactor.mockResolvedValueOnce({})

    fireEvent.press(getByText('Sign In'))

    await waitFor(() => {
      expect(mockSignIn.signIn.create).toHaveBeenCalledWith({
        identifier: 'test@user.com',
      })
      expect(mockSignIn.signIn.prepareFirstFactor).toHaveBeenCalled()
    })
  })

  it('navigates to verification on successful sign in', async () => {
    const {getByText, getByPlaceholderText} = render(<SignInScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )

    mockSignIn.signIn.create.mockResolvedValueOnce({
      supportedFirstFactors: [
        {strategy: 'email_code', emailAddressId: 'some_id'},
      ],
    })

    fireEvent.press(getByText('Sign In'))

    await waitFor(() => {
      expect(getByText('Verification Code')).toBeTruthy()
    })
  })

  it('calls verification and sets active session', async () => {
    const {getByText, getByPlaceholderText} = render(<SignInScreen />)
    fireEvent.press(getByText('Email'))
    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'test@user.com',
    )

    mockSignIn.signIn.create.mockResolvedValueOnce({
      supportedFirstFactors: [
        {strategy: 'email_code', emailAddressId: 'some_id'},
      ],
    })

    fireEvent.press(getByText('Sign In'))

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Code...'), '123456')
    })

    mockSignIn.signIn.attemptFirstFactor.mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_12345',
    })

    fireEvent.press(getByText('Verify'))

    await waitFor(() => {
      expect(mockSignIn.signIn.attemptFirstFactor).toHaveBeenCalledWith({
        strategy: 'email_code',
        code: '123456',
      })
      expect(mockSignIn.setActive).toHaveBeenCalledWith({session: 'sess_12345'})
    })
  })
})
