import React, {useState} from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native'
import {useUser} from '@clerk/clerk-expo'
import type {EmailAddressResource, PhoneNumberResource} from '@clerk/types'

type ContactMethodManagerProps = {
  methodType: 'email' | 'phone'
}

type Flow = 'idle' | 'adding' | 'verifying'

const ContactMethodManager = ({methodType}: ContactMethodManagerProps) => {
  const {user, isLoaded} = useUser()
  const [flow, setFlow] = useState<Flow>('idle')
  const [newItem, setNewItem] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // A reference to the email/phone resource that is being verified
  const [verifyingResource, setVerifyingResource] = useState<
    EmailAddressResource | PhoneNumberResource | null
  >(null)

  const isEmail = methodType === 'email'

  if (!isLoaded) {
    return <ActivityIndicator />
  }

  const handleAdd = async () => {
    if (!user) return
    setIsProcessing(true)
    try {
      let resource
      if (isEmail) {
        resource = await user.createEmailAddress({email: newItem})
        await resource.prepareVerification({strategy: 'email_code'})
      } else {
        resource = await user.createPhoneNumber({phoneNumber: newItem})
        await resource.prepareVerification()
      }
      setVerifyingResource(resource)
      setFlow('verifying')
    } catch (err: any) {
      console.error(
        'Error adding contact method:',
        JSON.stringify(err, null, 2),
      )
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'An unknown error occurred.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyingResource) return
    setIsProcessing(true)
    try {
      const result = await verifyingResource.attemptVerification({
        code: verificationCode,
      })

      if (result.verification.status === 'verified') {
        if (isEmail) {
          const oldPrimary = user?.primaryEmailAddress
          if (oldPrimary && oldPrimary.id !== verifyingResource.id) {
            await oldPrimary.destroy()
          }
        } else {
          const oldPrimary = user?.primaryPhoneNumber
          if (oldPrimary && oldPrimary.id !== verifyingResource.id) {
            await oldPrimary.destroy()
          }
        }

        Alert.alert(
          'Success',
          `${isEmail ? 'Email' : 'Phone'} updated successfully.`,
        )
        setFlow('idle')
        setNewItem('')
        setVerificationCode('')
        setVerifyingResource(null)
      } else {
        console.log(
          'Verification status is not complete:',
          result.verification.status,
        )
      }
    } catch (err: any) {
      console.error(
        'Error verifying contact method:',
        JSON.stringify(err, null, 2),
      )
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'An unknown error occurred.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const getIdentifier = (
    method: EmailAddressResource | PhoneNumberResource,
  ) => {
    return isEmail
      ? (method as EmailAddressResource).emailAddress
      : (method as PhoneNumberResource).phoneNumber
  }

  const renderIdleState = () => {
    const primaryMethod = isEmail
      ? user?.primaryEmailAddress
      : user?.primaryPhoneNumber
    const identifier = primaryMethod ? getIdentifier(primaryMethod) : null

    return (
      <>
        {identifier ? (
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-base">{identifier}</Text>
            <Text className="text-sm text-gray-500 capitalize">Verified</Text>
          </View>
        ) : (
          <Text className="mb-2.5 text-gray-700 text-center">
            No {isEmail ? 'email' : 'phone'} added.
          </Text>
        )}
        <Pressable
          className="bg-blue-500 py-3 rounded-md items-center mb-2.5"
          onPress={() => setFlow('adding')}>
          <Text className="text-white font-bold text-base">
            {identifier ? 'Change' : 'Add'} {isEmail ? 'Email' : 'Phone'}
          </Text>
        </Pressable>
      </>
    )
  }

  const renderAddingState = () => (
    <View>
      <TextInput
        placeholder={isEmail ? 'Enter email address' : 'Enter phone number'}
        value={newItem}
        onChangeText={setNewItem}
        className="border border-gray-300 rounded-md p-2.5 mb-2.5 text-base"
        autoCapitalize="none"
      />
      <Pressable
        className="bg-blue-500 py-3 rounded-md items-center mb-2.5"
        onPress={handleAdd}
        disabled={isProcessing}>
        <Text className="text-white font-bold text-base">
          {isProcessing ? 'Adding...' : 'Add'}
        </Text>
      </Pressable>
      <Pressable
        className="bg-white border border-blue-500 py-3 rounded-md items-center"
        onPress={() => setFlow('idle')}
        disabled={isProcessing}>
        <Text className="text-blue-500 font-bold text-base">Cancel</Text>
      </Pressable>
    </View>
  )

  const renderVerifyingState = () => (
    <View>
      <Text className="mb-2.5 text-gray-700 text-center">
        A verification code has been sent to {newItem}. Please enter it below.
      </Text>
      <TextInput
        placeholder="Verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        className="border border-gray-300 rounded-md p-2.5 mb-2.5 text-base"
      />
      <Pressable
        className="bg-blue-500 py-3 rounded-md items-center mb-2.5"
        onPress={handleVerify}
        disabled={isProcessing}>
        <Text className="text-white font-bold text-base">
          {isProcessing ? 'Verifying...' : 'Verify'}
        </Text>
      </Pressable>
      <Pressable
        className="bg-white border border-blue-500 py-3 rounded-md items-center"
        onPress={() => setFlow('adding')}
        disabled={isProcessing}>
        <Text className="text-blue-500 font-bold text-base">Back</Text>
      </Pressable>
    </View>
  )

  return (
    <View className="w-full mb-5 border border-gray-200 rounded-lg p-4">
      <Text className="text-lg font-bold mb-4 text-center">
        {isEmail ? 'Email Address' : 'Phone Number'}
      </Text>
      {flow === 'idle' && renderIdleState()}
      {flow === 'adding' && renderAddingState()}
      {flow === 'verifying' && renderVerifyingState()}
    </View>
  )
}

export default ContactMethodManager
