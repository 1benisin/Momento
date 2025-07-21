import {useSignUp} from '@clerk/clerk-expo'
import {Link} from 'expo-router'
import React, {useState} from 'react'
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import {AuthButton} from '@/components/auth/AuthButton'
import {AuthInput} from '@/components/auth/AuthInput'
import {TabSelector} from '@/components/auth/TabSelector'

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
    } catch (err: any) {
      console.error('Error signing up:', JSON.stringify(err, null, 2))
      setError(
        err.errors?.[0]?.longMessage || 'An error occurred during sign up.',
      )
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
    } catch (err: any) {
      console.error('Error verifying code:', JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.longMessage || 'Invalid verification code.')
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
      <TabSelector
        tabs={['Phone', 'Email']}
        activeTab={signUpMethod}
        onTabChange={tab =>
          setSignUpMethod(tab.toLowerCase() as 'email' | 'phone')
        }
      />
      {signUpMethod === 'email' ? (
        <AuthInput
          label="Email Address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoComplete="email"
          error={error ?? undefined}
        />
      ) : (
        <AuthInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1..."
          keyboardType="phone-pad"
          autoComplete="tel"
          error={error ?? undefined}
        />
      )}
      <AuthButton
        title="Sign Up"
        onPress={onSignUpPress}
        isLoading={loading}
        disabled={signUpMethod === 'email' ? !emailAddress : !phoneNumber}
      />
    </>
  )

  const renderVerificationForm = () => (
    <>
      <AuthInput
        label="Verification Code"
        value={code}
        onChangeText={setCode}
        placeholder="Code..."
        keyboardType="numeric"
        error={error ?? undefined}
      />
      <AuthButton title="Verify" onPress={onVerifyPress} isLoading={loading} />
      <View className="mt-4">
        <AuthButton title="Back" onPress={onBackPress} variant="secondary" />
      </View>
    </>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="font-['Playfair_Display'] text-3xl text-[#F8F6F1] text-center">
            Create Your Account
          </Text>
          <Text className="font-['Inter'] text-[#F8F6F1] text-center mt-2 opacity-80">
            Begin your mystical journey with Momento
          </Text>
        </View>

        {error && (
          <View className="mb-4 p-3 bg-[#8B2635]/20 rounded-md">
            <Text className="text-[#8B2635] font-['Inter'] text-center">
              {error}
            </Text>
          </View>
        )}

        <View className="w-full">
          {pendingVerification ? renderVerificationForm() : renderSignUpForm()}
        </View>

        <View className="mt-8 items-center">
          <Text className="text-[#F8F6F1] font-['Inter'] text-center">
            Already have an account?{' '}
            <Link href="/sign-in" asChild>
              <Text className="text-[#D4AF37]">Sign In</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
