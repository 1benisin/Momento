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
import {useSignUp} from '@clerk/clerk-expo'
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

export default function SignUpScreen() {
  const {isLoaded, signUp, setActive} = useSignUp()

  const [signUpMethod, setSignUpMethod] = useState<'email' | 'phone'>('phone')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- Handlers ---

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return
    setLoading(true)
    setError(null)

    try {
      if (signUpMethod === 'email') {
        await signUp.create({emailAddress})
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        })
      } else {
        await signUp.create({phoneNumber})
        await signUp.preparePhoneNumberVerification()
      }
      setPendingVerification(true)
    } catch (err: unknown) {
      devLog('Error signing up:', JSON.stringify(err, null, 2))
      if (isClerkError(err)) {
        setError(
          err.errors?.[0]?.longMessage || 'An error occurred during sign up.',
        )
      } else {
        setError('An error occurred during sign up.')
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
      const verificationFunction =
        signUpMethod === 'email'
          ? signUp.attemptEmailAddressVerification
          : signUp.attemptPhoneNumberVerification

      const result = await verificationFunction({code})

      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId})
      } else {
        setError(
          'Could not complete sign up. Please check the code and try again.',
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

  const renderSignUpForm = () => (
    <>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: signUpMethod === 'phone' ? '#007AFF' : '#E5E5EA',
            marginRight: 5,
            borderRadius: 5,
          }}
          onPress={() => setSignUpMethod('phone')}>
          <Text
            style={{
              textAlign: 'center',
              color: signUpMethod === 'phone' ? 'white' : 'black',
            }}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: signUpMethod === 'email' ? '#007AFF' : '#E5E5EA',
            marginLeft: 5,
            borderRadius: 5,
          }}
          onPress={() => setSignUpMethod('email')}>
          <Text
            style={{
              textAlign: 'center',
              color: signUpMethod === 'email' ? 'white' : 'black',
            }}>
            Email
          </Text>
        </TouchableOpacity>
      </View>
      {signUpMethod === 'email' ? (
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
      ) : (
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
          <Text
            style={{
              marginTop: 5,
              fontSize: 12,
              opacity: 0.6,
              textAlign: 'center',
            }}>
            Currently, we only support SMS authentication for US numbers.
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={onSignUpPress}
        disabled={
          loading || (signUpMethod === 'email' ? !emailAddress : !phoneNumber)
        }
        style={{
          backgroundColor:
            loading || (signUpMethod === 'email' ? !emailAddress : !phoneNumber)
              ? '#E5E5EA'
              : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {loading ? 'Loading...' : 'Sign Up'}
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
            Create Your Account
          </Text>
          <Text style={{textAlign: 'center', marginTop: 10, opacity: 0.8}}>
            Begin your mystical journey with Momento
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
          {pendingVerification ? renderVerificationForm() : renderSignUpForm()}
        </View>

        <View style={{marginTop: 40, alignItems: 'center'}}>
          <Text style={{textAlign: 'center'}}>
            Already have an account?{' '}
            <Link href="/sign-in" asChild>
              <Text style={{color: '#007AFF'}}>Sign In</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
