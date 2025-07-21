import {useSignIn} from '@clerk/clerk-expo'
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

      const firstFactor: any = supportedFirstFactors?.find(f => {
        return signInMethod === 'email'
          ? f.strategy === 'email_code'
          : f.strategy === 'phone_code'
      })

      if (firstFactor) {
        if (signInMethod === 'email') {
          const {emailAddressId} = firstFactor
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId,
          })
        } else {
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
    } catch (err: any) {
      console.error('Error signing in:', JSON.stringify(err, null, 2))
      const defaultMessage = 'An error occurred during sign in.'
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError(
          `We couldn't find an account with that ${signInMethod}. Please sign up.`,
        )
      } else {
        setError(err.errors?.[0]?.longMessage || defaultMessage)
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

  const renderSignInForm = () => (
    <>
      <TabSelector
        tabs={['Phone', 'Email']}
        activeTab={signInMethod}
        onTabChange={tab =>
          setSignInMethod(tab.toLowerCase() as 'email' | 'phone')
        }
      />

      {signInMethod === 'phone' ? (
        <AuthInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1..."
          keyboardType="phone-pad"
          autoComplete="tel"
          error={error ?? undefined}
        />
      ) : (
        <AuthInput
          label="Email Address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoComplete="email"
          error={error ?? undefined}
        />
      )}

      <AuthButton
        title="Sign In"
        onPress={onSignInPress}
        isLoading={loading}
        disabled={signInMethod === 'email' ? !emailAddress : !phoneNumber}
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
            Welcome Back
          </Text>
          <Text className="font-['Inter'] text-[#F8F6F1] text-center mt-2 opacity-80">
            Continue your journey with Momento
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
          {pendingVerification ? renderVerificationForm() : renderSignInForm()}
        </View>

        <View className="mt-8 items-center">
          <Text className="text-[#F8F6F1] font-['Inter'] text-center">
            Don't have an account?{' '}
            <Link href="/sign-up" asChild>
              <Text className="text-[#D4AF37]">Sign Up</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
