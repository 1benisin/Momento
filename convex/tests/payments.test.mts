import {convexTest} from 'convex-test'
import {vi} from 'vitest'
import * as stripe from '../lib/stripe'
import {api} from '../_generated/api'
import {Id} from '../_generated/dataModel'
import schema from '../schema'

vi.mock('../lib/stripe', async () => {
  return {
    createPaymentIntent: vi.fn(),
    createCustomer: vi.fn(),
    getPaymentIntent: vi.fn(),
  }
})

describe('Payments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createEventConfirmationPayment', () => {
    test('should create a payment intent for a new customer', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_1',
          clerkId: 'clerk_123',
          email: 'test@example.com',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
          },
        })
      })

      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })
      const hostId = await t.run(async ctx => {
        return await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_2',
          clerkId: 'clerk_456',
          email: 'host@example.com',
          accountStatus: 'active',
        })
      })
      const eventId = await t.run(async ctx => {
        return await ctx.db.insert('events', {
          hostId,
          title: 'Test Event',
          description: 'Test Event Description',
          status: 'published',
          min_attendees: 1,
          max_attendees: 10,
          itinerary: [],
          estimated_event_cost: [],
        })
      })

      const customer = {
        id: 'cus_123',
      }
      ;(stripe.createCustomer as any).mockResolvedValue(customer)

      const paymentIntent = {
        id: 'pi_123',
        clientSecret: 'secret',
      }
      ;(stripe.createPaymentIntent as any).mockResolvedValue(paymentIntent)

      const result = await asUser.mutation(
        api.payments.createEventConfirmationPayment,
        {
          eventId,
          amount: 500,
          currency: 'usd',
        },
      )
      expect(stripe.createCustomer).toHaveBeenCalled()
      expect(stripe.createPaymentIntent).toHaveBeenCalled()
      expect(result.clientSecret).toBe(paymentIntent.clientSecret)
      expect(result.paymentIntentId).toBe(paymentIntent.id)
    })

    test('should create a payment intent for an existing customer', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_1',
          clerkId: 'clerk_123',
          email: 'test@example.com',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
            stripe_customer_id: 'cus_123',
          },
        })
      })
      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })
      const hostId = await t.run(async ctx => {
        return await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_2',
          clerkId: 'clerk_456',
          email: 'host@example.com',
          accountStatus: 'active',
        })
      })
      const eventId = await t.run(async ctx => {
        return await ctx.db.insert('events', {
          hostId,
          title: 'Test Event',
          description: 'Test Event Description',
          status: 'published',
          min_attendees: 1,
          max_attendees: 10,
          itinerary: [],
          estimated_event_cost: [],
        })
      })

      const paymentIntent = {
        id: 'pi_123',
        clientSecret: 'secret',
      }
      ;(stripe.createPaymentIntent as any).mockResolvedValue(paymentIntent)

      const result = await asUser.mutation(
        api.payments.createEventConfirmationPayment,
        {
          eventId,
          amount: 500,
          currency: 'usd',
        },
      )
      expect(stripe.createCustomer).not.toHaveBeenCalled()
      expect(stripe.createPaymentIntent).toHaveBeenCalled()
      expect(result.clientSecret).toBe(paymentIntent.clientSecret)
      expect(result.paymentIntentId).toBe(paymentIntent.id)
    })
  })

  describe('getPaymentIntentDetails', () => {
    test('should return payment intent details', async () => {
      const t = convexTest(schema as any)
      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })
      const paymentIntent = {
        id: 'pi_123',
        clientSecret: 'secret',
        status: 'requires_payment_method',
        amount: 500,
      }
      ;(stripe.getPaymentIntent as any).mockResolvedValue(paymentIntent)
      const result = await asUser.query(api.payments.getPaymentIntentDetails, {
        paymentIntentId: 'pi_123',
      })
      expect(stripe.getPaymentIntent).toHaveBeenCalledWith('pi_123')
      expect(result.status).toBe(paymentIntent.status)
      expect(result.amount).toBe(paymentIntent.amount)
    })
  })

  describe('createStripeCustomer', () => {
    test('should create a new stripe customer', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_1',
          clerkId: 'clerk_123',
          email: 'test@example.com',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
          },
        })
      })

      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })
      const customer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'Test User',
      }
      ;(stripe.createCustomer as any).mockResolvedValue(customer)
      const result = await asUser.mutation(api.payments.createStripeCustomer, {
        email: 'test@example.com',
      })
      expect(result.customerId).toBe(customer.id)
      expect(result.email).toBe(customer.email)
      expect(result.name).toBe(customer.name)
    })
  })
})
