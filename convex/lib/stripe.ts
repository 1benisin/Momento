/**
 * Stripe integration for payment processing and identity verification
 * Provides server-side Stripe functionality for the Momento platform
 */

import Stripe from 'stripe'
import {config} from './config'

// Initialize Stripe with secret key
export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

/**
 * Create a payment intent for event confirmation fees
 */
export const createPaymentIntent = async (params: {
  amount: number // Amount in cents
  currency: string
  customerId?: string
  metadata?: Record<string, string>
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      customer: params.customerId,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    }
  } catch (error) {
    throw new Error(`Payment intent creation failed: ${error}`)
  }
}

/**
 * Create a Stripe customer for a user
 */
export const createCustomer = async (params: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) => {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    })

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    }
  } catch (error) {
    throw new Error(`Customer creation failed: ${error}`)
  }
}

/**
 * Create a verification session for Stripe Identity
 */
export const createVerificationSession = async (params: {
  returnUrl: string
  type: 'document' | 'id_number'
  metadata?: Record<string, string>
}) => {
  try {
    const session = await stripe.identity.verificationSessions.create({
      return_url: params.returnUrl,
      type: params.type,
      metadata: params.metadata,
    })

    return {
      id: session.id,
      clientSecret: session.client_secret,
      status: session.status,
      url: session.url,
    }
  } catch (error) {
    throw new Error(`Verification session creation failed: ${error}`)
  }
}

/**
 * Retrieve a verification session
 */
export const getVerificationSession = async (sessionId: string) => {
  try {
    const session =
      await stripe.identity.verificationSessions.retrieve(sessionId)

    return {
      id: session.id,
      status: session.status,
      verifiedOutputs: session.verified_outputs,
      lastError: session.last_error,
    }
  } catch (error) {
    throw new Error(`Verification session retrieval failed: ${error}`)
  }
}

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret,
    )
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`)
  }
}

/**
 * Process refund for a payment intent
 */
export const processRefund = async (params: {
  paymentIntentId: string
  amount?: number
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
}) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amount,
      reason: params.reason,
    })

    return {
      id: refund.id,
      amount: refund.amount,
      status: refund.status,
      reason: refund.reason,
    }
  } catch (error) {
    throw new Error(`Refund processing failed: ${error}`)
  }
}

/**
 * Get payment intent details
 */
export const getPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      customer: paymentIntent.customer,
      metadata: paymentIntent.metadata,
    }
  } catch (error) {
    throw new Error(`Payment intent retrieval failed: ${error}`)
  }
}
