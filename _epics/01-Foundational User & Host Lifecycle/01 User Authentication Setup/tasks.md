# Tasks for User Authentication Setup (with Clerk)

## Relevant Files

- `app/_layout.tsx` - The root layout, responsible for wrapping the app in Clerk and Convex providers.
- `app/(auth)/_layout.tsx` - Handles navigation and layout for the authentication flow, redirecting signed-in users.
- `app/(auth)/sign-up.tsx` - The screen where new users sign up with their phone number using Clerk's `useSignUp` hook.
- `app/(auth)/sign-in.tsx` - The screen where existing users sign in with their phone number using Clerk's `useSignIn` hook.
- `components/SignOutButton.tsx` - A component to handle the sign-out process.
- `convex/auth.config.ts` - **NEW**: Configures Convex to trust JWTs issued by Clerk.
- `convex/schema.ts` - Defines the database schema; will be simplified to link to Clerk users.
- `convex/user.ts` - **NEW**: Contains logic to sync user data from Clerk to the Convex database.
- `lib/tokenCache.ts` - **NEW**: Implements the secure token cache for Clerk on Expo.

### Deprecated / To Be Deleted

- `app/(auth)/index.tsx`, `app/(auth)/otp.tsx`, `app/(auth)/waitlist.tsx`
- `app/(auth)/recycle-account.tsx`, `app/(auth)/security-hold.tsx`, `app/(auth)/check-email.tsx`
- `convex/auth.ts`, `convex/account.ts`, `convex/waitlist.ts`
- `convex/tests/auth.test.ts`, `convex/tests/account.test.ts`, `convex/tests/waitlist.test.ts`

---

## Tasks

- [x] 1.0 **Environment & Backend Configuration**
  - [x] 1.1 In the Clerk Dashboard, create a new application.
  - [x] 1.2 Enable "Phone number" as a sign-in method.
  - [x] 1.3 Create a new JWT Template, select the "Convex" preset, and copy the **Issuer URL**.
  - [x] 1.4 In the Convex Dashboard, add an environment variable for the Clerk Issuer URL (e.g., `CLERK_ISSUER_URL`).
  - [x] 1.5 In your local project, create `convex/auth.config.ts` to configure the Convex backend with the Clerk provider, referencing the new environment variable.
  - [x] 1.6 Add your `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to a local `.env` file.
  - [x] 1.7 Run `npx convex dev` to push the new backend configuration.

- [x] 2.0 **Update Database Schema and Sync Logic**
  - [x] 2.1 In `convex/schema.ts`, modify the `users` table:
    - [x] Remove `email`, `otp_hash`, `otp_expires_at`, `otp_attempts`, `otp_last_attempt_at`, and `deviceHistory`.
    - [x] Add a new field: `clerkId: v.string()`.
    - [x] Add `.index("by_clerk_id", ["clerkId"])` to the table definition.
  - [x] 2.2 Delete the `waitlist_users` table from the schema.
  - [x] 2.3 Create a new file, `convex/user.ts`.
  - [x] 2.4 In `convex/user.ts`, implement an internal mutation `store` that:
    - [x] Gets the user identity from `ctx.auth.getUserIdentity()`.
    - [x] Checks if a user with that `clerkId` (`identity.subject`) already exists.
    - [x] If not, it creates a new user record, storing the `clerkId` and `phone_number` (`identity.phoneNumber`).
  - [x] 2.5 Create a new file `convex/http.ts` and add an HTTP Action that calls the `store` internal mutation. Configure this HTTP Action as a webhook in Clerk's dashboard to run after a user is created.

- [x] 3.0 **Frontend Provider Setup**
  - [x] 3.1 Install the required packages: `npm install @clerk/clerk-expo expo-secure-store`.
  - [ ] 3.2 Create a new file `lib/tokenCache.ts` and add the code for the encrypted token cache from the Clerk Expo documentation.
  - [x] 3.3 In `app/_layout.tsx`, wrap the root `<Slot />` component with `<ClerkProvider>` and then `<ConvexProviderWithClerk>`.
  - [x] 3.4 Pass the `publishableKey` and `tokenCache` props to the `<ClerkProvider>`.
  - [x] 3.5 Pass the `useAuth` hook from `@clerk/clerk-expo` to the `<ConvexProviderWithClerk>` `useAuth` prop.

- [x] 4.0 **Implement Frontend Authentication UI**
  - [x] 4.1 Create the `(auth)` directory with a `_layout.tsx` file inside.
  - [x] 4.2 In `app/(auth)/_layout.tsx`, use the `useAuth` hook to check `isSignedIn` and redirect to the main app if true.
  - [x] 4.3 Create `app/(auth)/sign-up.tsx`. Implement the UI for a user to enter their phone number and the OTP code they receive, using the `useSignUp` hook to manage the flow.
  - [x] 4.4 Create `app/(auth)/sign-in.tsx`. Implement a similar UI using the `useSignIn` hook.
  - [x] 4.5 Add navigation links between the sign-in and sign-up pages.
  - [x] 4.6 Create a `SignOutButton.tsx` component that calls `signOut()` from the `useClerk()` hook.

- [x] 5.0 **Cleanup and Final Integration**
  - [x] 5.1 Delete all deprecated files and tests listed at the top of this document.
  - [x] 5.2 Go through the app and replace any UI that relied on the old auth system with Convex's `<Authenticated>` and `<Unauthenticated>` components to conditionally render content.
  - [x] 5.3 Ensure the `SignOutButton` is accessible to authenticated users.
  - [x] 5.4 Manually test the full sign-up, sign-out, and sign-in flow.

- [x] 6.0 **Finalize UI and Routing**
  - [x] 6.1 In `app/_layout.tsx`, implement a component that checks the authentication state using `useConvexAuth`.
    - [x] This component should show a loading indicator while the auth state is being determined.
    - [x] It should use `expo-router`'s `useRouter` and `useEffect` to navigate the user.
    - [x] If the user is authenticated, it should navigate them to the `(tabs)` group.
    - [x] If the user is not authenticated, it should navigate them to the `(auth)` group (i.e., `/sign-in`).
  - [x] 6.2 In `app/(auth)/_layout.tsx`, confirm that an already authenticated user is redirected to `/(tabs)` if they land on an auth screen.
  - [x] 6.3 Add the `<SignOutButton />` to one of the screens inside the `(tabs)` group, like `app/(tabs)/index.tsx`, to allow for testing the complete authentication lifecycle.
  - [x] 6.4 Manually re-test the entire authentication flow to confirm that the routing now works as expected.
