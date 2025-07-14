// utils/devLog.ts

// __DEV__ is a global variable in React Native/Expo that's true in development
// To enable debug logs, set EXPO_PUBLIC_DEBUG_LOGS=true in your environment.
export function devLog(...args: any[]) {
  if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG_LOGS === "true") {
    // You can add a prefix to make these logs easy to search for
    // Uncomment the next line to debug when devLog is called:
    // console.log("[DEVLOG CALLED]", ...args);
    console.log("[DEV]", ...args);
  }
}
