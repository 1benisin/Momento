# Story: User Authentication Setup - Implementation Details

This document synthesizes all relevant information from the `_docs` directory to guide the implementation of US-only, phone-based OTP authentication.

## 1. Overview & Goal

- **Story**: 001-01: User Authentication Setup
- **Goal**: Implement US-only, phone-based authentication using Clerk for user management and Convex for the backend.

## 2. Technology Stack

- **Backend**: Convex
- **Authentication**: Clerk (handles SMS, session management, user identity)
- **Frontend**: React Native / Expo

## 3. Core Data Models

With Clerk handling all authentication logic, our Convex data models become much simpler.

### `users` Collection

This is the main application-specific user record. It links to the authoritative user object in Clerk.

| Field Name     | Type         | Description                                                              |
| :------------- | :----------- | :----------------------------------------------------------------------- |
| `clerkId`      | `v.string()` | The user's unique ID from Clerk (`identity.subject`). Indexed.           |
| `phone_number` | `v.string()` | User's US-based phone number (E.164 format). Stored for application use. |
| `status`       | `v.string()` | Tracks user state within our app, e.g., 'pending_onboarding', 'active'.  |

**Removed Fields:** All `otp_*`, `email`, and `deviceHistory` fields are no longer needed. Clerk manages all of this.

### `waitlist_users` Collection

- This collection is **DEPRECATED** and will be removed. We are launching US-only, and Clerk will be configured to enforce this.

## 4. Authentication Flow with Clerk

The previous custom authentication flows are replaced by a single, streamlined process managed by Clerk's Expo SDK. We will build custom UI that uses Clerk's underlying hooks.

### The Unified Clerk Flow

1.  **App Start**:
    - The root layout (`app/_layout.tsx`) is wrapped with `<ClerkProvider>` and `<ConvexProviderWithClerk>`.
    - Clerk attempts to load a session token from its secure cache (`tokenCache.ts`).
    - The `useConvexAuth()` hook determines the user's authentication state.

2.  **Unauthenticated User Journey**:
    - The user is shown the `app/(auth)/sign-in.tsx` or `app/(auth)/sign-up.tsx` screen.
    - **Sign-Up (`sign-up.tsx`)**:
      - The UI uses Clerk's `useSignUp()` hook.
      - The user enters their phone number.
      - `signUp.create()` is called.
      - `signUp.preparePhoneNumberVerification()` sends the OTP via SMS (handled by Clerk).
      - A second UI step appears for OTP entry.
      - `signUp.attemptPhoneNumberVerification()` is called with the code.
      - On success, `setActive({ session: signUp.createdSessionId })` completes the flow.
    - **Sign-In (`sign-in.tsx`)**:
      - The UI uses Clerk's `useSignIn()` hook.
      - The flow is nearly identical to sign-up, using `signIn.create()`, `signIn.prepareFirstFactor()`, and `signIn.attemptFirstFactor()` to handle the OTP process.

3.  **Authenticated State & Data Sync**:
    - Once `setActive()` is called, the `<ConvexProviderWithClerk>` automatically fetches the JWT from Clerk and authenticates with the Convex backend.
    - Convex validates the token using the configuration in `convex/auth.config.ts`.
    - Components wrapped in `<Authenticated>` are now rendered.
    - The first time an authenticated query or mutation runs, we will trigger an internal mutation (`user.store`) that syncs the Clerk user to our `users` collection. It uses `ctx.auth.getUserIdentity()` to get the `clerkId` and `phone_number` from the token and creates a new record if one doesn't already exist for that `clerkId`.

4.  **Account Recovery & Recycled Numbers**:
    - These complex flows are now managed entirely by Clerk's settings and security features. We do not need to build any custom logic, UI, or backend functions for these scenarios. Clerk handles phone number ownership verification and provides users with recovery options if configured in the Clerk dashboard.

## 5. UI Components / Screens

The primary screens for this story will live in the `app/(auth)/` directory.

- `_layout.tsx`: The layout for the auth group. It will use the `useAuth()` hook from Clerk to redirect already-signed-in users to the main app.
- `sign-up.tsx`: A custom screen built with React Native components that uses the `useSignUp()` hook to manage the sign-up state machine.
- `sign-in.tsx`: A custom screen that uses the `useSignIn()` hook.
- `SignOutButton.tsx`: A component that calls `signOut()` from Clerk's `useClerk()` hook.

**Removed Screens**:

- `index.tsx` (in `(auth)`)
- `otp.tsx`
- `waitlist.tsx`
- `recycle-account.tsx`
- `security-hold.tsx`
- `check-email.tsx`

This consolidated guide provides a clear path for implementation using Clerk.
