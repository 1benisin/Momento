/**
 * Payment processing functions using Stripe
 * Handles payment intents, customer creation, and payment verification
 */
import {v} from 'convex/values'
import {devLog} from '../utils/devLog'
import {mutation, query} from './_generated/server'
import {
  createCustomer,
  createPaymentIntent,
  getPaymentIntent,
} from './lib/stripe'

/**
 * Create a payment intent for event confirmation fee
 */
export const createEventConfirmationPayment = mutation({
  args: {
    eventId: v.id('events'),
    amount: v.number(), // Amount in cents
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    devLog('[createEventConfirmationPayment] Creating payment intent', {
      eventId: args.eventId,
      amount: args.amount,
      userId: user._id,
    })

    try {
      // Create or get Stripe customer
      let customerId = user.hostProfile?.stripe_customer_id

      if (!customerId) {
        if (!user.hostProfile) {
          throw new Error('User does not have a host profile.')
        }
        const customer = await createCustomer({
          email: user.email || '',
          name: `${user.first_name} ${user.last_name}`.trim(),
          metadata: {
            userId: user._id,
            clerkId: user.clerkId,
          },
        })

        customerId = customer.id

        // Update user with Stripe customer ID
        const hostProfile = {...user.hostProfile}
        await ctx.db.patch(user._id, {
          hostProfile: {
            ...hostProfile,
            stripe_customer_id: customerId,
          },
        })
      }

      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        amount: args.amount,
        currency: args.currency,
        customerId,
        metadata: {
          eventId: args.eventId,
          userId: user._id,
          type: 'event_confirmation_fee',
        },
      })

      devLog('[createEventConfirmationPayment] Payment intent created', {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.clientSecret,
      })

      return {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
      }
    } catch (error) {
      devLog('[createEventConfirmationPayment] Error', error)
      throw new Error(`Payment creation failed: ${error}`)
    }
  },
})

/**
 * Get payment intent details
 */
export const getPaymentIntentDetails = query({
  args: {
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    try {
      const paymentIntent = await getPaymentIntent(args.paymentIntentId)

      // Verify the payment belongs to the current user
      if (paymentIntent.metadata?.userId) {
        const user = await ctx.db
          .query('users')
          .withIndex('by_token', q =>
            q.eq('tokenIdentifier', identity.tokenIdentifier),
          )
          .unique()

        if (!user || user._id !== paymentIntent.metadata.userId) {
          throw new Error('Payment intent does not belong to current user')
        }
      }

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        customer: paymentIntent.customer,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      devLog('[getPaymentIntentDetails] Error', error)
      throw new Error(`Payment intent retrieval failed: ${error}`)
    }
  },
})

/**
 * Create a Stripe customer for a user
 */
export const createStripeCustomer = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    if (user.hostProfile?.stripe_customer_id) {
      throw new Error('User already has a Stripe customer')
    }

    if (!user.hostProfile) {
      throw new Error('User does not have a host profile.')
    }

    try {
      const customer = await createCustomer({
        email: args.email,
        name: args.name,
        metadata: {
          userId: user._id,
          clerkId: user.clerkId,
        },
      })

      // Update user with Stripe customer ID
      const hostProfile = {...user.hostProfile}
      await ctx.db.patch(user._id, {
        hostProfile: {
          ...hostProfile,
          stripe_customer_id: customer.id,
        },
      })

      devLog('[createStripeCustomer] Customer created', {
        customerId: customer.id,
        userId: user._id,
      })

      return {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
      }
    } catch (error) {
      devLog('[createStripeCustomer] Error', error)
      throw new Error(`Customer creation failed: ${error}`)
    }
  },
})
