/**
 * Webhook handler for Clerk
 *
 * This file contains the HTTP action that handles incoming webhooks from Clerk.
 * It's responsible for validating the webhook request and then creating,
 * updating, or deleting users in the Convex database based on the Clerk event type.
 *
 * @see https://docs.convex.dev/functions/http-actions
 * @see https://clerk.com/docs/users/sync-data
 */
import {httpAction} from '../_generated/server'
import {internal} from '../_generated/api'
import type {WebhookEvent} from '@clerk/backend'
import {Webhook} from 'svix'
import {config} from '../lib/config'

async function validateRequest(
  req: Request,
): Promise<WebhookEvent | undefined> {
  const webhookSecret = config.clerk.webhookSecret
  if (!webhookSecret) {
    // This should not happen if config validation is working
    console.error('CLERK_WEBHOOK_SECRET is not set in config')
    return
  }
  const payloadString = await req.text()
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  }
  const wh = new Webhook(webhookSecret)
  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent
  } catch (error) {
    console.error('Error verifying webhook:', error)
    return
  }
}

/**
 * Handles the logic for creating or updating a user based on a Clerk webhook event.
 * This function is called from the main webhook handler when a `user.created` or
 * `user.updated` event is received.
 */
async function handleUserCreatedOrUpdated(ctx: any, event: WebhookEvent) {
  if (event.type !== 'user.created' && event.type !== 'user.updated') {
    return
  }

  const {id: clerkId, ...attributes} = event.data
  const primaryEmailAddress =
    attributes.email_addresses.find(
      email => email.id === attributes.primary_email_address_id,
    )?.email_address ?? null
  const primaryPhoneNumber =
    attributes.phone_numbers.find(
      phone => phone.id === attributes.primary_phone_number_id,
    )?.phone_number ?? null

  // Construct tokenIdentifier from issuer URL and clerkId
  const clerkIssuerUrl = config.clerk.issuerUrl
  if (!clerkIssuerUrl) {
    // This should not happen if config validation is working
    throw new Error('CLERK_ISSUER_URL environment variable not set!')
  }
  const tokenIdentifier = `${clerkIssuerUrl}|${clerkId}`

  const existingUser = await ctx.runQuery(internal.user.getUser, {
    clerkId: clerkId,
  })

  if (existingUser) {
    console.log(`Updating user: ${clerkId}`)
    await ctx.runMutation(internal.user.updateUser, {
      clerkId,
      email: primaryEmailAddress ?? undefined,
      phone_number: primaryPhoneNumber ?? undefined,
      firstName: attributes.first_name ?? undefined,
      lastName: attributes.last_name ?? undefined,
    })
  } else {
    console.log(`Creating new user: ${clerkId}`)
    await ctx.runMutation(internal.user.createUser, {
      clerkId,
      email: primaryEmailAddress ?? undefined,
      phone_number: primaryPhoneNumber ?? undefined,
      firstName: attributes.first_name ?? undefined,
      lastName: attributes.last_name ?? undefined,
      tokenIdentifier,
    })
  }
}

/**
 * Handles the logic for deleting a user based on a Clerk webhook event.
 * This function is called from the main webhook handler when a `user.deleted`
 * event is received.
 */
async function handleUserDeleted(ctx: any, event: WebhookEvent) {
  if (event.type !== 'user.deleted') {
    return
  }
  const {id: clerkId, deleted} = event.data
  if (deleted) {
    console.log(`Deleting user: ${clerkId}`)
    await ctx.runMutation(internal.user.deleteUser, {clerkId: clerkId!})
  }
}

/**
 * The main webhook handler for Clerk.
 * It validates the request and then routes the event to the appropriate handler.
 */
export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request)
  if (!event) {
    return new Response('Invalid request', {status: 400})
  }

  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      await handleUserCreatedOrUpdated(ctx, event)
      break
    case 'user.deleted':
      await handleUserDeleted(ctx, event)
      break
    default: {
      console.log('Ignored Clerk webhook event:', event.type)
    }
  }

  return new Response(null, {status: 200})
})
