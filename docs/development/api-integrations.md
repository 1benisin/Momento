# API Integration Guide

This document provides comprehensive guidance for integrating and working with all third-party APIs and services used in the Momento platform.

## Table of Contents

- [Integration Overview](#integration-overview)
- [Stripe Integration](#stripe-integration)
- [Clerk Authentication](#clerk-authentication)
- [Convex Backend](#convex-backend)
- [Postmark Email](#postmark-email)
- [Error Handling](#error-handling)
- [Webhook Management](#webhook-management)
- [Testing Integrations](#testing-integrations)
- [Security Best Practices](#security-best-practices)

---

## Integration Overview

Momento integrates with several third-party services to provide a complete user experience. Each integration follows consistent patterns for error handling, security, and testing.

### Integration Principles

- **Fail Gracefully**: Handle service outages without breaking user experience
- **Security First**: Never expose sensitive credentials in client-side code
- **Consistent Error Handling**: Standardized error responses across all integrations
- **Comprehensive Logging**: Log all integration interactions for debugging
- **Rate Limiting**: Respect API rate limits and implement backoff strategies

### Service Dependencies

| Service  | Purpose                          | Environment | Status |
| -------- | -------------------------------- | ----------- | ------ |
| Stripe   | Payments & Identity Verification | Production  | Active |
| Clerk    | Authentication & User Management | Production  | Active |
| Convex   | Backend Database & Functions     | Production  | Active |
| Postmark | Transactional Email              | Production  | Active |
| Expo     | Mobile App Platform              | Production  | Active |

---

## Stripe Integration

### Payment Processing

#### Setup and Configuration

```typescript
// convex/lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export {stripe}
```

#### Payment Intent Creation

```typescript
// convex/payments.ts
import {mutation} from './_generated/server'
import {stripe} from './lib/stripe'

export const createPaymentIntent = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: args.amount,
        currency: args.currency,
        customer: args.customerId,
        metadata: {
          userId: ctx.auth.userId,
        },
      })

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`)
    }
  },
})
```

#### Client-Side Payment Processing

```typescript
// components/PaymentElement.tsx
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export const PaymentForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay $5.00
      </button>
    </form>
  );
};
```

### Identity Verification

#### Verification Session Creation

```typescript
// convex/verification.ts
import {mutation} from './_generated/server'
import {stripe} from './lib/stripe'

export const createVerificationSession = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    try {
      const verificationSession =
        await stripe.identity.verificationSessions.create({
          type: 'document',
          return_url: `${process.env.FRONTEND_URL}/verification-complete`,
          metadata: {
            userId: args.userId,
          },
        })

      // Update user with verification session ID
      await ctx.db.patch(args.userId, {
        verificationSessionId: verificationSession.id,
        verificationStatus: 'pending',
      })

      return {
        clientSecret: verificationSession.client_secret,
        verificationSessionId: verificationSession.id,
      }
    } catch (error) {
      throw new Error(`Verification session creation failed: ${error.message}`)
    }
  },
})
```

#### Verification Status Check

```typescript
// convex/verification.ts
export const checkVerificationStatus = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user?.verificationSessionId) {
      return {status: 'not_started'}
    }

    try {
      const session = await stripe.identity.verificationSessions.retrieve(
        user.verificationSessionId,
      )

      if (session.status === 'verified') {
        // Update user verification status
        await ctx.db.patch(args.userId, {
          isVerified: true,
          verificationStatus: 'verified',
        })
      }

      return {
        status: session.status,
        verifiedAt: session.verified_at,
      }
    } catch (error) {
      console.error('Verification status check failed:', error)
      return {status: 'error'}
    }
  },
})
```

### Webhook Handling

#### Payment Webhooks

```typescript
// convex/http.ts
import {internal} from './_generated/api'
import {httpAction} from './_generated/server'
import {stripe} from './lib/stripe'

export const stripeWebhook = httpAction(async (ctx, request) => {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', {status: 400})
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        await ctx.runMutation(internal.payments.handlePaymentSuccess, {
          paymentIntentId: event.data.object.id,
        })
        break

      case 'payment_intent.payment_failed':
        await ctx.runMutation(internal.payments.handlePaymentFailure, {
          paymentIntentId: event.data.object.id,
        })
        break

      case 'identity.verification_session.verified':
        await ctx.runMutation(internal.verification.handleVerificationSuccess, {
          sessionId: event.data.object.id,
        })
        break
    }

    return new Response('Webhook processed', {status: 200})
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', {status: 400})
  }
})
```

---

## Clerk Authentication

### User Management

#### User Creation and Profile Setup

```typescript
// convex/auth.ts
import {ConvexError} from 'convex/values'
import {mutation} from './_generated/server'

export const createUserProfile = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_user_id', q => q.eq('clerkUserId', args.clerkUserId))
      .first()

    if (existingUser) {
      throw new ConvexError('User already exists')
    }

    // Create user profile
    const userId = await ctx.db.insert('users', {
      clerkUserId: args.clerkUserId,
      email: args.email,
      phoneNumber: args.phoneNumber,
      firstName: args.firstName,
      lastName: args.lastName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      isVerified: false,
      activeRole: 'social',
    })

    return userId
  },
})
```

#### User Authentication State

```typescript
// convex/auth.ts
export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return null
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_user_id', q => q.eq('clerkUserId', identity.subject))
      .first()

    return user
  },
})
```

### Client-Side Authentication

#### React Native Integration

```typescript
// hooks/useAuth.ts
import {useAuth as useClerkAuth} from '@clerk/clerk-expo'
import {useQuery} from 'convex/react'
import {api} from '../convex/_generated/api'

export const useAuth = () => {
  const {isSignedIn, userId, signOut} = useClerkAuth()

  const user = useQuery(api.auth.getCurrentUser)

  return {
    isSignedIn,
    userId,
    user,
    signOut,
    isLoading: user === undefined,
  }
}
```

#### Protected Routes

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <>{children}</>;
};
```

---

## Convex Backend

### Database Schema

#### User Schema

```typescript
// convex/schema.ts
import {defineSchema, defineTable} from 'convex/server'
import {v} from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    interests: v.array(v.string()),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
        city: v.string(),
        state: v.string(),
      }),
    ),
    isVerified: v.boolean(),
    verificationSessionId: v.optional(v.string()),
    verificationStatus: v.union(
      v.literal('not_started'),
      v.literal('pending'),
      v.literal('verified'),
      v.literal('failed'),
    ),
    activeRole: v.union(v.literal('social'), v.literal('host')),
    status: v.union(
      v.literal('active'),
      v.literal('paused'),
      v.literal('deleted'),
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_clerk_user_id', ['clerkUserId'])
    .index('by_email', ['email'])
    .index('by_phone', ['phoneNumber']),
})
```

#### Event Schema

```typescript
// convex/schema.ts
export default defineSchema({
  // ... existing schema
  events: defineTable({
    hostId: v.id('users'),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.object({
      name: v.string(),
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    maxAttendees: v.number(),
    minAttendees: v.number(),
    price: v.optional(v.number()),
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('cancelled'),
      v.literal('completed'),
    ),
    publishedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_host', ['hostId'])
    .index('by_status', ['status'])
    .index('by_date', ['date'])
    .index('by_location', ['location.latitude', 'location.longitude']),
})
```

### Query Functions

#### Event Discovery

```typescript
// convex/events.ts
import {v} from 'convex/values'
import {query} from './_generated/server'

export const getEventsForUser = query({
  args: {
    userId: v.id('users'),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
        radius: v.number(), // in miles
      }),
    ),
    categories: v.optional(v.array(v.string())),
    dateRange: v.optional(
      v.object({
        start: v.string(),
        end: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User not found')
    }

    let eventsQuery = ctx.db
      .query('events')
      .withIndex('by_status', q => q.eq('status', 'published'))

    // Apply location filter
    if (args.location) {
      // Note: This is a simplified location filter
      // In production, use a proper geospatial index
      eventsQuery = eventsQuery.filter(q =>
        q.and(
          q.gte(q.field('location.latitude'), args.location!.latitude - 0.1),
          q.lte(q.field('location.latitude'), args.location!.latitude + 0.1),
          q.gte(q.field('location.longitude'), args.location!.longitude - 0.1),
          q.lte(q.field('location.longitude'), args.location!.longitude + 0.1),
        ),
      )
    }

    // Apply category filter
    if (args.categories && args.categories.length > 0) {
      eventsQuery = eventsQuery.filter(q =>
        q.or(
          ...args.categories!.map(category =>
            q.eq(q.field('category'), category),
          ),
        ),
      )
    }

    // Apply date range filter
    if (args.dateRange) {
      eventsQuery = eventsQuery.filter(q =>
        q.and(
          q.gte(q.field('date'), args.dateRange!.start),
          q.lte(q.field('date'), args.dateRange!.end),
        ),
      )
    }

    return await eventsQuery.collect()
  },
})
```

### Mutation Functions

#### Event Creation

```typescript
// convex/events.ts
import {v} from 'convex/values'
import {mutation} from './_generated/server'

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.object({
      name: v.string(),
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    maxAttendees: v.number(),
    minAttendees: v.number(),
    price: v.optional(v.number()),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_user_id', q => q.eq('clerkUserId', identity.subject))
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.isVerified) {
      throw new Error('User must be verified to create events')
    }

    const eventId = await ctx.db.insert('events', {
      hostId: user._id,
      ...args,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return eventId
  },
})
```

---

## Postmark Email

### Email Service Setup

```typescript
// convex/lib/postmark.ts
import {ServerClient} from 'postmark'

const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY!)

export {postmarkClient}
```

### Transactional Emails

#### Event Invitation Email

```typescript
// convex/emails.ts
import {mutation} from './_generated/server'
import {postmarkClient} from './lib/postmark'

export const sendEventInvitation = mutation({
  args: {
    userId: v.id('users'),
    eventId: v.id('events'),
    invitationId: v.id('invitations'),
  },
  handler: async (ctx, args) => {
    const [user, event, invitation] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.eventId),
      ctx.db.get(args.invitationId),
    ])

    if (!user || !event || !invitation) {
      throw new Error('Required data not found')
    }

    try {
      await postmarkClient.sendEmail({
        From: 'noreply@momento.com',
        To: user.email!,
        Subject: `You're invited to ${event.title}!`,
        HtmlBody: `
          <h1>You're invited to ${event.title}!</h1>
          <p>Hi ${user.firstName},</p>
          <p>You've been invited to attend ${event.title} on ${event.date} at ${event.time}.</p>
          <p><strong>Location:</strong> ${event.location.name}</p>
          <p><strong>Description:</strong> ${event.description}</p>
          <p>Click the link below to accept your invitation:</p>
          <a href="${process.env.FRONTEND_URL}/invitation/${invitation._id}">Accept Invitation</a>
        `,
        TextBody: `
          You're invited to ${event.title}!
          
          Hi ${user.firstName},
          
          You've been invited to attend ${event.title} on ${event.date} at ${event.time}.
          
          Location: ${event.location.name}
          Description: ${event.description}
          
          Accept your invitation: ${process.env.FRONTEND_URL}/invitation/${invitation._id}
        `,
        MessageStream: 'outbound',
      })

      // Update invitation status
      await ctx.db.patch(args.invitationId, {
        emailSent: true,
        emailSentAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Email sending failed:', error)
      throw new Error('Failed to send invitation email')
    }
  },
})
```

#### Payment Confirmation Email

```typescript
// convex/emails.ts
export const sendPaymentConfirmation = mutation({
  args: {
    userId: v.id('users'),
    eventId: v.id('events'),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const [user, event] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.eventId),
    ])

    if (!user || !event) {
      throw new Error('Required data not found')
    }

    try {
      await postmarkClient.sendEmail({
        From: 'payments@momento.com',
        To: user.email!,
        Subject: `Payment Confirmed - ${event.title}`,
        HtmlBody: `
          <h1>Payment Confirmed!</h1>
          <p>Hi ${user.firstName},</p>
          <p>Your payment of $5.00 has been confirmed for ${event.title}.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: ${event.date}</li>
            <li>Time: ${event.time}</li>
            <li>Location: ${event.location.name}</li>
          </ul>
          <p>Transaction ID: ${args.paymentIntentId}</p>
          <p>We'll send you a reminder 24 hours before the event.</p>
        `,
        MessageStream: 'outbound',
      })
    } catch (error) {
      console.error('Payment confirmation email failed:', error)
      // Don't throw error for email failures
    }
  },
})
```

---

## Error Handling

### Standardized Error Responses

```typescript
// convex/lib/errors.ts
export class ConvexError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'ConvexError'
  }
}

export const createError = (
  code: string,
  message: string,
  statusCode?: number,
) => {
  return new ConvexError(message, code, statusCode)
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const
```

### Error Handling in Functions

```typescript
// convex/events.ts
import {ErrorCodes, createError} from './lib/errors'

export const createEvent = mutation({
  args: {
    // ... args
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (!identity) {
        throw createError(
          ErrorCodes.UNAUTHORIZED,
          'Authentication required',
          401,
        )
      }

      // ... function logic
    } catch (error) {
      if (error instanceof ConvexError) {
        throw error
      }

      // Log unexpected errors
      console.error('Unexpected error in createEvent:', error)
      throw createError(
        ErrorCodes.SERVICE_UNAVAILABLE,
        'An unexpected error occurred',
        500,
      )
    }
  },
})
```

### Client-Side Error Handling

```typescript
// hooks/useMutation.ts
import {useMutation} from 'convex/react'
import {api} from '../convex/_generated/api'

export const useCreateEvent = () => {
  const createEvent = useMutation(api.events.createEvent)

  const handleCreateEvent = async (eventData: EventData) => {
    try {
      const result = await createEvent(eventData)
      return {success: true, data: result}
    } catch (error: any) {
      console.error('Event creation failed:', error)

      // Handle specific error types
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          return {success: false, error: 'Please log in to create events'}
        case 'VALIDATION_ERROR':
          return {success: false, error: error.message}
        case 'PAYMENT_FAILED':
          return {success: false, error: 'Payment processing failed'}
        default:
          return {success: false, error: 'An unexpected error occurred'}
      }
    }
  }

  return {createEvent: handleCreateEvent}
}
```

---

## Webhook Management

### Webhook Security

```typescript
// convex/http.ts
import crypto from 'crypto'
import {httpAction} from './_generated/server'

const verifyWebhookSignature = (
  body: string,
  signature: string,
  secret: string,
): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  )
}
```

### Webhook Error Handling

```typescript
// convex/http.ts
export const stripeWebhook = httpAction(async (ctx, request) => {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', {status: 400})
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    // Process webhook
    await processWebhookEvent(ctx, event)

    return new Response('Webhook processed', {status: 200})
  } catch (error) {
    console.error('Webhook processing failed:', error)

    // Return 200 to prevent retries for permanent failures
    if (error.message.includes('No such event')) {
      return new Response('Event not found', {status: 200})
    }

    // Return 400 for signature verification failures
    if (error.message.includes('Invalid signature')) {
      return new Response('Invalid signature', {status: 400})
    }

    // Return 500 for processing errors (will be retried)
    return new Response('Processing error', {status: 500})
  }
})
```

---

## Testing Integrations

### Mocking External Services

```typescript
// convex/lib/test-utils.ts
export const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
  identity: {
    verificationSessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
}

export const mockPostmark = {
  sendEmail: jest.fn(),
}

export const setupTestMocks = () => {
  jest.mock('./stripe', () => ({
    stripe: mockStripe,
  }))

  jest.mock('./postmark', () => ({
    postmarkClient: mockPostmark,
  }))
}
```

### Integration Test Examples

```typescript
// convex/__tests__/payments.test.ts
import {runMutation} from 'convex-test'
import {api} from '../_generated/api'
import {mockStripe} from '../lib/test-utils'

describe('Payment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create payment intent successfully', async () => {
    const mockPaymentIntent = {
      id: 'pi_test123',
      client_secret: 'pi_test123_secret',
    }

    mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent)

    const result = await runMutation(api.payments.createPaymentIntent, {
      amount: 500,
      currency: 'usd',
    })

    expect(result.clientSecret).toBe('pi_test123_secret')
    expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 500,
      currency: 'usd',
      metadata: expect.any(Object),
    })
  })

  it('should handle payment creation failure', async () => {
    mockStripe.paymentIntents.create.mockRejectedValue(
      new Error('Payment failed'),
    )

    await expect(
      runMutation(api.payments.createPaymentIntent, {
        amount: 500,
        currency: 'usd',
      }),
    ).rejects.toThrow('Payment creation failed: Payment failed')
  })
})
```

---

## Security Best Practices

### Environment Variables

```typescript
// convex/lib/config.ts
export const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  },
  postmark: {
    apiKey: process.env.POSTMARK_API_KEY!,
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL!,
    environment: process.env.NODE_ENV!,
  },
}

// Validate required environment variables
Object.entries(config).forEach(([service, config]) => {
  Object.entries(config).forEach(([key, value]) => {
    if (!value) {
      throw new Error(
        `Missing required environment variable: ${service}.${key}`,
      )
    }
  })
})
```

### API Key Rotation

```typescript
// convex/lib/key-rotation.ts
export const rotateApiKeys = async () => {
  // Implement key rotation logic
  // This should be called periodically or when keys are compromised

  const newStripeKey = await stripe.accounts.createLoginLink({
    account: process.env.STRIPE_ACCOUNT_ID!,
  })

  // Update environment variables
  // Notify team of key changes
  // Update all services using the old key
}
```

### Rate Limiting

```typescript
// convex/lib/rate-limiting.ts
import {ConvexError} from 'convex/values'

const rateLimitStore = new Map<string, {count: number; resetTime: number}>()

export const checkRateLimit = (
  key: string,
  limit: number,
  windowMs: number,
): boolean => {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {count: 1, resetTime: now + windowMs})
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export const withRateLimit = (key: string, limit: number, windowMs: number) => {
  if (!checkRateLimit(key, limit, windowMs)) {
    throw new ConvexError('Rate limit exceeded', 'RATE_LIMITED', 429)
  }
}
```

---

**Last Updated:** 2024-12-19

This API integration guide is reviewed and updated regularly to ensure continued reliability and security of all third-party integrations.
