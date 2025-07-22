/**
 * Stripe Provider component for payment processing
 * Wraps the app with Stripe configuration and provides payment functionality
 */

import React, {createContext, useContext, useEffect, useState} from 'react'
import {StripeProvider as StripeProviderBase} from '@stripe/stripe-react-native'
import {devLog} from '@/utils/devLog'

interface StripeContextType {
  isStripeReady: boolean
  publishableKey: string | null
}

const StripeContext = createContext<StripeContextType>({
  isStripeReady: false,
  publishableKey: null,
})

export const useStripe = () => useContext(StripeContext)

interface StripeProviderProps {
  children: React.ReactNode
}

export const StripeProvider: React.FC<StripeProviderProps> = ({children}) => {
  const [isStripeReady, setIsStripeReady] = useState(false)
  const [publishableKey, setPublishableKey] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get the publishable key from environment variables
        const key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY

        if (!key) {
          devLog('[StripeProvider] Missing Stripe publishable key')
          return
        }

        setPublishableKey(key)
        setIsStripeReady(true)

        devLog('[StripeProvider] Stripe initialized successfully', {
          hasKey: !!key,
        })
      } catch (error) {
        devLog('[StripeProvider] Error initializing Stripe', error)
        setIsStripeReady(false)
      }
    }

    initializeStripe()
  }, [])

  if (!isStripeReady || !publishableKey) {
    devLog('[StripeProvider] Stripe not ready, showing loading state')
    return (
      <StripeContext.Provider
        value={{isStripeReady: false, publishableKey: null}}>
        {children}
      </StripeContext.Provider>
    )
  }

  return (
    <StripeProviderBase
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.momento.app" // For Apple Pay
    >
      <StripeContext.Provider value={{isStripeReady, publishableKey}}>
        {children}
      </StripeContext.Provider>
    </StripeProviderBase>
  )
}
