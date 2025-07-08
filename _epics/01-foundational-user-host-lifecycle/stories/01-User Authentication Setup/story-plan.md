# 001-01 - User Authentication Setup

**As a** new or returning user,
**I want** to securely sign in or sign up using my phone number,
**so that** I can access my Momento account without needing to remember a password.

- **Status**: Ready for Dev
- **Epic**: 001 - Foundational User & Host Lifecycle
- **Story Points**: 5

---

## 1. All Needed Context

### Tactical Documentation & References

_To implement this story correctly, you MUST reference the following specific sections of the project documentation and external resources._

```yaml
# Project-Specific Documentation
- file: /_docs/FEATURES.md
  section: "Phone-First Authentication & US-Only Launch"
  why: "Defines the US-only requirement, which will be configured within Clerk."
- file: /_docs/DATA_MODELS.md
  section: "users Collection"
  why: "The user record will be simplified, linking to the Clerk user via a clerkId."

# External Documentation
- url: https://clerk.com/docs/convex/get-started-with-convex
  why: "Primary guide for the Convex and Clerk integration."
- url: https://clerk.com/docs/references/expo/overview
  why: "API reference for the Clerk Expo SDK (@clerk/clerk-expo)."
- url: https://clerk.com/docs/custom-flows/overview
  why: "Since Clerk's pre-built UI components are not fully supported on native Expo yet, we must build our own UI using their hooks."
- url: https://docs.expo.dev/versions/latest/sdk/secure-store/
  why: "Used by the Clerk SDK to securely cache JWTs on the device."
- url: https://docs.convex.dev/auth/clerk
  why: "Convex documentation for the Clerk integration."
```

### Integration Points

- [ ] **Database (Convex)**:
  - The `users` collection will be simplified. The `phone_number` will be the primary identifier, and we'll add a `clerkId` field to link to the Clerk user record. All OTP and device history fields will be removed.
  - The `waitlist_users` collection is no longer needed.
- [ ] **Config / Environment**:
  - Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to the Expo environment variables.
  - Add the Clerk Issuer URL to the Convex environment variables (as detailed in the Clerk + Convex docs).
- [ ] **Authentication Service (Clerk)**:
  - Configure a new Clerk application.
  - Enable Phone Number authentication (SMS Passcodes).
  - Create a JWT Template for Convex integration.

### Known Gotchas & Library Quirks

- `CRITICAL`: Clerk's pre-built UI components (`<SignIn>`, `<SignUp>`) are **not** supported in native Expo builds (only on web). We must create our own UI using Clerk's hooks (`useSignUp`, `useSignIn`).
- `CRITICAL`: We must use `<ConvexProviderWithClerk>` and the `useConvexAuth()` hook to manage authentication state, _not_ Clerk's standard components like `<SignedIn>` or `<SignedOut>`. This ensures the Convex backend has validated the user's token.
- `GOTCHA`: The `@clerk/clerk-expo` package requires `expo-secure-store` for its token cache. This needs to be explicitly installed and configured.

### Anti-Patterns to Avoid

- ❌ Don't try to use Clerk's pre-built UI components in the native app. They will not work.
- ❌ Don't store any passwords, OTPs, or session tokens in the Convex database. This is now entirely managed by Clerk.
- ❌ Don't call Convex mutations/queries that require authentication from components that are not children of `<Authenticated>` from `convex/react`.

---

## 2. Test-First Blueprint

### A. Behavior & Test Cases

_The developer AI's primary goal is to enable these user flows._

| Test Case ID | Description                                                                                               |
| :----------- | :-------------------------------------------------------------------------------------------------------- |
| `TC-01`      | **New User Signup (Success)**: A new user can sign up with a valid US phone number and OTP.               |
| `TC-02`      | **Returning User Login (Success)**: An existing user can sign in with their phone number and OTP.         |
| `TC-03`      | **Sign Out (Success)**: A signed-in user can successfully sign out.                                       |
| `TC-04`      | **Incorrect OTP**: A user entering an incorrect OTP sees a clear error message.                           |
| `TC-05`      | **Session Persistence**: A user who closes and reopens the app remains signed in.                         |
| `TC-06`      | **Redirects**: An unauthenticated user trying to access a protected screen is sent to the sign-in screen. |
| `TC-07`      | **Redirects**: A signed-in user visiting the sign-in/sign-up screen is redirected to the main app.        |

### B. Data Models / Schema

```typescript
// From convex/schema.ts

// In users table definition
// ...
  // This will link our app's user record to the Clerk user record.
  clerkId: v.string(),
  phone_number: v.string(), // Kept for easier access and querying within our app
  status: v.string(), // e.g., 'pending_onboarding', 'active'
// ...
// All otp_*, deviceHistory, and email fields for auth are REMOVED.
// The `waitlist_users` table is REMOVED.
```

### C. Project Structure

```text
/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx                 <-- CREATE: Handles auth flow layout and redirects
│   │   ├── sign-in.tsx                 <-- CREATE: The sign-in screen using Clerk hooks
│   │   └── sign-up.tsx                 <-- CREATE: The sign-up screen using Clerk hooks
│   └── _layout.tsx                     <-- TOUCH: Wrap with ClerkProvider and ConvexProviderWithClerk
├── convex/
│   ├── auth.config.ts                  <-- CREATE: Configures Convex to trust Clerk's JWTs
│   ├── user.ts                         <-- CREATE: Mutation to create/update user record on first login
│   └── schema.ts                       <-- TOUCH: Simplify 'users' table as described in 2.B
├── components/
│   └── SignOutButton.tsx               <-- CREATE: A simple component to handle signing out.
└── lib/
    └── tokenCache.ts                   <-- CREATE: Secure token cache using expo-secure-store for Clerk
```

### D. Implementation Tasks

- [ ] **Task 1: Setup Clerk & Convex Backend**

  - [ ] 1.1 Create a new application in the Clerk Dashboard and enable Phone Number (SMS) sign-in.
  - [ ] 1.2 Create a Convex JWT template in Clerk and get the Issuer URL.
  - [ ] 1.3 Create `convex/auth.config.ts` and add the provider configuration using the Issuer URL from Clerk.
  - [ ] 1.4 Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and the Clerk Issuer URL to environment variables.
  - [ ] 1.5 Run `npx convex dev` to sync the auth configuration.

- [ ] **Task 2: Update Convex Schema & Create User Sync Function**

  - [ ] 2.1 Remove the old auth-related fields (`otp_hash`, `otp_expires_at`, etc.) from the `users` table in `convex/schema.ts`.
  - [ ] 2.2 Add `clerkId: v.string()` to the `users` table and index it.
  - [ ] 2.3 Create a new mutation, e.g., `user:store`, that runs on the first authenticated action. This function gets the user's identity from `ctx.auth.getUserIdentity()` and creates a corresponding document in the `users` table.

- [ ] **Task 3: Configure Frontend Providers**

  - [ ] 3.1 Install `@clerk/clerk-expo` and `expo-secure-store`.
  - [ ] 3.2 Create a `tokenCache.ts` file as recommended by Clerk Expo docs.
  - [ ] 3.3 In the root `app/_layout.tsx`, wrap the entire app with `<ClerkProvider>` and `<ConvexProviderWithClerk>`.
  - [ ] 3.4 Pass the `tokenCache` and your `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to the `<ClerkProvider>`.

- [ ] **Task 4: Build Authentication Screens**

  - [ ] 4.1 Create the `(auth)` route group with a `_layout.tsx` that redirects signed-in users away from the auth screens.
  - [ ] 4.2 Build `app/(auth)/sign-up.tsx` using the `useSignUp` hook to handle the phone number input and OTP verification steps.
  - [ ] 4.3 Build `app/(auth)/sign-in.tsx` using the `useSignIn` hook.
  - [ ] 4.4 Ensure clear error handling for cases like incorrect OTPs.

- [ ] **Task 5: Final Integration**
  - [ ] 5.1 Create a `SignOutButton` component that uses Clerk's `useClerk().signOut()` method.
  - [ ] 5.2 Use Convex's `<Authenticated>` and `<Unauthenticated>` components to control UI visibility based on login state.
  - [ ] 5.3 Ensure that any data fetches for a logged-in user are performed inside components wrapped with `<Authenticated>`.

### E. Pseudocode for Complex Logic

```typescript
// convex/user.ts -> store mutation
// This is an internal mutation to sync Clerk users to our DB.

export const store = internalMutation({
  handler: async (ctx) => {
    // 1. Get the Clerk user identity.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called store user without authentication present");
    }

    // 2. Check if we've already stored this user.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    // 3. If the user document already exists, we're done.
    if (user !== null) {
      return user._id;
    }

    // 4. If it's a new user, create a new document in our `users` table.
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject, // `subject` is the Clerk User ID
      phone_number: identity.phoneNumber, // get phone number from token
      status: "pending_onboarding",
    });

    return userId;
  },
});
```

---

## 3. Validation Loop

_The developer AI **MUST** run these commands after every meaningful change._

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npx eslint . --fix
npx prettier . --write

# Expected: No errors.
```

### Level 2: Local Development Server

```bash
# Run the app in the simulator
npm start

# In a separate terminal, run the convex dev server
npx convex dev

# If issues arise: Read logs, understand root cause, fix code, re-run.
```

---

## 4. Post-Implementation Review Checklist

- [ ] All tasks in section 2.D are marked `[x]`.
- [ ] All validation loop commands pass.
- [ ] New code is consistent with existing project patterns.
- [ ] The feature is correctly integrated with other parts of the application.
- [ ] Obsolete files (`convex/auth.ts`, `convex/account.ts`, etc.) have been deleted.

---

## 5. Developer Notes

_{This section is to be filled out by the developer AI during implementation.}_
