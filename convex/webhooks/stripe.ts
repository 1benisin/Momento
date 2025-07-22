/**
 * Webhook handler for Stripe
 *
 * This file contains the HTTP action that handles incoming webhooks from Stripe.
 * It's responsible for validating the webhook request and then triggering
 * different handlers based on the Stripe event type.
 *
 * @see https://docs.convex.dev/functions/http-actions
 * @see https://stripe.com/docs/webhooks
 */
import {httpAction} from '../_generated/server'
import {internal} from '../_generated/api'
import {verifyWebhookSignature} from '../lib/stripe'
import {devLog} from '../../utils/devLog'
import type {ActionCtx} from '../_generated/server'
import type {Stripe} from 'stripe'
import type {Id} from '../_generated/dataModel'

/**
 * Stripe webhook handler
 * Processes payment and identity verification events.
 * This function validates the incoming request to ensure it's from Stripe,
 * then routes the event to the appropriate handler.
 */
export const stripeWebhook = httpAction(async (ctx, request) => {
  const method = request.method

  if (method !== 'POST') {
    return new Response('Method not allowed', {status: 405})
  }

  try {
    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing Stripe signature')
    }

    const body = await request.text()
    const event = verifyWebhookSignature(body, signature)

    devLog('[Stripe Webhook] Processing event', {
      type: event.type,
      id: event.id,
    })

    // Route event to the appropriate handler
    switch (event.type) {
      // Payment Intent Events
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(ctx, event.data.object)
        break
      case 'payment_intent.processing':
        await handlePaymentIntentProcessing(ctx, event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(ctx, event.data.object)
        break

      // Identity Verification Events
      case 'identity.verification_session.verified':
        await handleVerificationSessionVerified(ctx, event.data.object)
        break
      case 'identity.verification_session.processing':
        await handleVerificationSessionProcessing(ctx, event.data.object)
        break
      case 'identity.verification_session.requires_input':
        await handleVerificationSessionRequiresInput(ctx, event.data.object)
        break
      case 'identity.verification_session.canceled':
        await handleVerificationSessionCanceled(ctx, event.data.object)
        break

      default:
        devLog('[Stripe Webhook] Unhandled event type', {type: event.type})
    }

    return new Response('Webhook processed successfully', {status: 200})
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    devLog('[Stripe Webhook] Error processing webhook', {
      message: errorMessage,
      stack: errorStack,
    })
    if (errorMessage.includes('Invalid signature')) {
      return new Response('Invalid signature', {status: 400})
    }
    return new Response('Internal server error', {status: 500})
  }
})

// --- Payment Intent Handlers ---

async function handlePaymentIntentSucceeded(
  ctx: ActionCtx,
  paymentIntent: Stripe.PaymentIntent,
) {
  devLog('[Stripe] Payment Succeeded', {id: paymentIntent.id})
  // TODO: Fulfill the order, send confirmation email, etc.
}

async function handlePaymentIntentProcessing(
  ctx: ActionCtx,
  paymentIntent: Stripe.PaymentIntent,
) {
  devLog('[Stripe] Payment Processing', {id: paymentIntent.id})
  // TODO: Update UI to show "Processing" state.
}

async function handlePaymentIntentFailed(
  ctx: ActionCtx,
  paymentIntent: Stripe.PaymentIntent,
) {
  devLog('[Stripe] Payment Failed', {
    id: paymentIntent.id,
    error: paymentIntent.last_payment_error?.message,
  })
  // TODO: Notify user of payment failure.
}

// --- Identity Verification Handlers ---

async function handleVerificationSessionVerified(
  ctx: ActionCtx,
  session: Stripe.Identity.VerificationSession,
) {
  devLog('[Stripe] Identity Verified', {
    id: session.id,
    userId: session.metadata?.userId,
  })
  if (session.metadata?.userId) {
    await ctx.runMutation(internal.user.updateVerificationStatus, {
      userId: session.metadata.userId as Id<'users'>, // TODO: Convert string to proper Convex ID
      isVerified: true,
      sessionId: session.id,
      verificationData: session.verified_outputs,
    })
  }
}

async function handleVerificationSessionProcessing(
  ctx: ActionCtx,
  session: Stripe.Identity.VerificationSession,
) {
  devLog('[Stripe] Identity Processing', {
    id: session.id,
    userId: session.metadata?.userId,
  })
  // TODO: Update UI to show "Verification in progress".
  if (session.metadata?.userId) {
    await ctx.runMutation(internal.user.updateVerificationStatus, {
      userId: session.metadata.userId as Id<'users'>, // TODO: Convert string to proper Convex ID
      isVerified: false,
      sessionId: session.id,
      verificationStatus: 'processing',
    })
  }
}

async function handleVerificationSessionRequiresInput(
  ctx: ActionCtx,
  session: Stripe.Identity.VerificationSession,
) {
  devLog('[Stripe] Identity Requires Input', {
    id: session.id,
    userId: session.metadata?.userId,
  })
  // TODO: Notify user to complete verification steps.
  if (session.metadata?.userId) {
    await ctx.runMutation(internal.user.updateVerificationStatus, {
      userId: session.metadata.userId as Id<'users'>, // TODO: Convert string to proper Convex ID
      isVerified: false,
      sessionId: session.id,
      verificationStatus: 'requires_input',
    })
  }
}

async function handleVerificationSessionCanceled(
  ctx: ActionCtx,
  session: Stripe.Identity.VerificationSession,
) {
  devLog('[Stripe] Identity Canceled', {
    id: session.id,
    userId: session.metadata?.userId,
  })
  // TODO: Update UI to reflect canceled verification.
  if (session.metadata?.userId) {
    await ctx.runMutation(internal.user.updateVerificationStatus, {
      userId: session.metadata.userId as Id<'users'>, // TODO: Convert string to proper Convex ID
      isVerified: false,
      sessionId: session.id,
      verificationStatus: 'canceled',
    })
  }
}
