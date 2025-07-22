import React, {useEffect, useState} from 'react'
import {ActivityIndicator, Alert, Pressable, Text, View} from 'react-native'
import {usePaymentSheet} from '@stripe/stripe-react-native'
import {useMutation} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {Id} from '@/convex/_generated/dataModel'
import {devLog} from '@/utils/devLog'
import {StripeProvider} from './StripeProvider'

interface PaymentSheetProps {
  eventId: string
  amount: number // Amount in cents
  currency: string
  onSuccess: () => void
  onCancel: () => void
  onError: (error: string) => void
}

export const PaymentSheetComponent: React.FC<PaymentSheetProps> = ({
  eventId,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false)
  const [isSheetInitialized, setIsSheetInitialized] = useState(false)

  const createPayment = useMutation(api.payments.createEventConfirmationPayment)

  const {
    initPaymentSheet,
    presentPaymentSheet,
    loading: paymentSheetLoading,
  } = usePaymentSheet()

  useEffect(() => {
    initializePaymentSheet()
  }, [])

  const initializePaymentSheet = async () => {
    try {
      setLoading(true)
      devLog('[PaymentSheet] Initializing payment', {
        eventId,
        amount,
        currency,
      })

      const {clientSecret} = await createPayment({
        eventId: eventId as Id<'events'>,
        amount,
        currency,
      })

      if (!clientSecret) {
        throw new Error('Failed to create payment intent.')
      }

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Momento',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: 'Momento Event Confirmation',
        },
      })

      if (error) {
        devLog('[PaymentSheet] Payment sheet initialization error', error)
        onError(`Payment initialization failed: ${error.message}`)
        setIsSheetInitialized(false)
        return
      }

      devLog('[PaymentSheet] Payment sheet initialized successfully')
      setIsSheetInitialized(true)
    } catch (error: unknown) {
      let message = 'Payment initialization failed.'
      if (error instanceof Error) {
        message = `Payment initialization failed: ${error.message}`
      }
      devLog('[PaymentSheet] Error initializing payment', error)
      onError(message)
    } finally {
      setLoading(false)
    }
  }

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet()

    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message)
      onError(error.message)
    } else {
      Alert.alert('Success', 'Your payment was successful!')
      onSuccess()
    }
  }

  if (loading || paymentSheetLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-500">Setting up payment...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-4">Event Confirmation Fee</Text>
      <Text className="mb-4">
        Amount: ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
      </Text>
      <Text className="mb-6 text-gray-500">
        This non-refundable fee confirms your event and helps cover platform
        costs.
      </Text>
      <Pressable
        disabled={!isSheetInitialized}
        onPress={openPaymentSheet}
        className="bg-blue-500 py-3 rounded-md items-center disabled:opacity-50">
        <Text className="text-white font-bold">Pay Now</Text>
      </Pressable>
    </View>
  )
}

/**
 * Wrapper component that provides Stripe context
 */
export const PaymentSheetWrapper: React.FC<PaymentSheetProps> = props => {
  return (
    <StripeProvider>
      <PaymentSheetComponent {...props} />
    </StripeProvider>
  )
}
