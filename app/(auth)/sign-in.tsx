import React, {useState} from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useSignIn} from '@clerk/clerk-expo'
import type {SignInFirstFactor} from '@clerk/types'
import {Link} from 'expo-router'
import {devLog} from '@/utils/devLog'

function isClerkError(
  err: unknown,
): err is {errors: {code?: string; longMessage?: string}[]} {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errors' in err &&
    Array.isArray((err as {errors?: unknown}).errors)
  )
}

export default function SignInScreen() {
  const {signIn, setActive, isLoaded} = useSignIn()

  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('phone')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- Handlers ---

  const onSignInPress = async () => {
    if (!isLoaded || loading) return
    setLoading(true)
    setError(null)

    try {
      const identifier = signInMethod === 'email' ? emailAddress : phoneNumber
      const {supportedFirstFactors} = await signIn.create({identifier})

      const firstFactor = supportedFirstFactors?.find(
        (f: SignInFirstFactor) => {
          return signInMethod === 'email'
            ? f.strategy === 'email_code'
            : f.strategy === 'phone_code'
        },
      )

      if (firstFactor) {
        if (signInMethod === 'email' && 'emailAddressId' in firstFactor) {
          const {emailAddressId} = firstFactor
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId,
          })
        } else if ('phoneNumberId' in firstFactor) {
          const {phoneNumberId} = firstFactor
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
          })
        }
        setPendingVerification(true)
      } else {
        setError(
          `This account does not have a verified ${signInMethod}. Please try another method.`,
        )
      }
    } catch (err: unknown) {
      devLog('Error signing in:', JSON.stringify(err, null, 2))
      const defaultMessage = 'An error occurred during sign in.'
      if (isClerkError(err)) {
        if (err.errors?.[0]?.code === 'form_identifier_not_found') {
          setError(
            `We couldn't find an account with that ${signInMethod}. Please sign up.`,
          )
        } else {
          setError(err.errors?.[0]?.longMessage || defaultMessage)
        }
      } else {
        setError(defaultMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return
    setLoading(true)
    setError(null)

    try {
      const strategy = signInMethod === 'email' ? 'email_code' : 'phone_code'
      const result = await signIn.attemptFirstFactor({strategy, code})

      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId})
      } else {
        setError(
          'Could not complete sign in. Please check the code and try again.',
        )
      }
    } catch (err: unknown) {
      devLog('Error verifying code:', JSON.stringify(err, null, 2))
      if (isClerkError(err)) {
        setError(err.errors?.[0]?.longMessage || 'Invalid verification code.')
      } else {
        setError('Invalid verification code.')
      }
    } finally {
      setLoading(false)
    }
  }

  const onBackPress = () => {
    setPendingVerification(false)
    setCode('')
    setError(null)
  }

  // --- Render ---

  const renderSignInForm = () => (
    <>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: signInMethod === 'phone' ? '#007AFF' : '#E5E5EA',
            marginRight: 5,
            borderRadius: 5,
          }}
          onPress={() => setSignInMethod('phone')}>
          <Text
            style={{
              textAlign: 'center',
              color: signInMethod === 'phone' ? 'white' : 'black',
            }}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: signInMethod === 'email' ? '#007AFF' : '#E5E5EA',
            marginLeft: 5,
            borderRadius: 5,
          }}
          onPress={() => setSignInMethod('email')}>
          <Text
            style={{
              textAlign: 'center',
              color: signInMethod === 'email' ? 'white' : 'black',
            }}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {signInMethod === 'phone' ? (
        <View style={{marginBottom: 20}}>
          <Text style={{marginBottom: 5}}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1..."
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: '#E5E5EA',
              borderRadius: 5,
              padding: 10,
              backgroundColor: 'white',
            }}
          />
        </View>
      ) : (
        <View style={{marginBottom: 20}}>
          <Text style={{marginBottom: 5}}>Email Address</Text>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="email@example.com"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: '#E5E5EA',
              borderRadius: 5,
              padding: 10,
              backgroundColor: 'white',
            }}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={onSignInPress}
        disabled={
          loading || (signInMethod === 'email' ? !emailAddress : !phoneNumber)
        }
        style={{
          backgroundColor:
            loading || (signInMethod === 'email' ? !emailAddress : !phoneNumber)
              ? '#E5E5EA'
              : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {loading ? 'Loading...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </>
  )

  const renderVerificationForm = () => (
    <>
      <View style={{marginBottom: 20}}>
        <Text style={{marginBottom: 5}}>Verification Code</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Code..."
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#E5E5EA',
            borderRadius: 5,
            padding: 10,
            backgroundColor: 'white',
          }}
        />
      </View>
      <TouchableOpacity
        onPress={onVerifyPress}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#E5E5EA' : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {loading ? 'Loading...' : 'Verify'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onBackPress}
        style={{
          backgroundColor: '#E5E5EA',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'black'}}>Back</Text>
      </TouchableOpacity>
    </>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{alignItems: 'center', marginBottom: 40}}>
          <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
            Welcome Back
          </Text>
          <Text style={{textAlign: 'center', marginTop: 10, opacity: 0.8}}>
            Continue your journey with Momento
          </Text>
        </View>

        {error && (
          <View
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: '#FFE5E5',
              borderRadius: 5,
            }}>
            <Text style={{color: '#D70015', textAlign: 'center'}}>{error}</Text>
          </View>
        )}

        <View style={{width: '100%'}}>
          {pendingVerification ? renderVerificationForm() : renderSignInForm()}
        </View>

        <View style={{marginTop: 40, alignItems: 'center'}}>
          <Text style={{textAlign: 'center'}}>
            {"Don't have an account?"}
            <Link href="/sign-up" asChild>
              <Text style={{color: '#007AFF'}}>Sign Up</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
