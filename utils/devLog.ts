/**
 * Custom development logger
 * Logs messages only in development mode and when debug logs are enabled
 */
export const devLog = (message: string, ...args: unknown[]) => {
  // process.env.NODE_ENV is 'development' in Expo and during `npx convex dev`.
  // This provides a reliable way to check for development mode in both environments.
  const isDev = process.env.NODE_ENV === 'development'

  const isDebugEnabled = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true'

  if (isDev && isDebugEnabled) {
    console.log(`[DEVLOG] ${message}`, ...args)
  }
}
