/**
 * Configuration management for environment variables
 * Provides centralized access to all environment variables with validation
 */

export const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    issuerUrl: process.env.CLERK_ISSUER_URL!,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET!,
  },
  convex: {
    deployment: process.env.CONVEX_DEPLOYMENT!,
    url: process.env.EXPO_PUBLIC_CONVEX_URL!,
  },
  google: {
    mapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
  },
  app: {
    debugLogs: process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true',
    environment: process.env.NODE_ENV || 'development',
  },
}

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = [
    {key: 'stripe.secretKey', value: config.stripe.secretKey},
    {key: 'stripe.webhookSecret', value: config.stripe.webhookSecret},
    {key: 'stripe.publishableKey', value: config.stripe.publishableKey},
    {key: 'clerk.secretKey', value: config.clerk.secretKey},
    {key: 'clerk.publishableKey', value: config.clerk.publishableKey},
    {key: 'clerk.issuerUrl', value: config.clerk.issuerUrl},
    {key: 'clerk.webhookSecret', value: config.clerk.webhookSecret},
    {key: 'convex.deployment', value: config.convex.deployment},
    {key: 'convex.url', value: config.convex.url},
    {key: 'google.mapsApiKey', value: config.google.mapsApiKey},
  ]

  const missing = requiredVars.filter(({value}) => !value)

  if (missing.length > 0) {
    const missingKeys = missing.map(({key}) => key).join(', ')
    throw new Error(`Missing required environment variables: ${missingKeys}`)
  }
}

// Validate configuration on module load
validateConfig()

export default config
