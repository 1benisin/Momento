/**
 * HTTP Router for Convex
 *
 * This file defines the HTTP routes for the application, mapping incoming requests
 * to the appropriate webhook handlers. It acts as the main entry point for all
 * HTTP-based interactions from external services like Clerk and Stripe.
 *
 * @see https://docs.convex.dev/functions/http-actions
 */
import {httpRouter} from 'convex/server'
// Import webhook handlers from their respective files.
import {handleClerkWebhook} from './webhooks/clerk'
import {stripeWebhook} from './webhooks/stripe'

const http = httpRouter()

// Define the route for Clerk webhooks.
// All logic for handling Clerk events is in `clerk-webhook.ts`.
http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleClerkWebhook,
})

// Define the route for Stripe webhooks.
// All logic for handling Stripe events is in `webhooks/stripe.ts`.
http.route({
  path: '/stripe',
  method: 'POST',
  handler: stripeWebhook,
})

// The `http` router is exported and used by Convex to route incoming requests.
export default http
