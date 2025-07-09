# Tasks for Add Email Authentication & Overhaul User Management

## Relevant Files

- `convex/schema.ts`: For updating the `users` table schema.
- `convex/user.ts`: To update the `createUser` mutation.
- `convex/http.ts`: To enhance the Clerk webhook handler.
- `app/_layout.tsx`: For wrapping the app with Clerk providers and routing logic.
- `app/(tabs)/_layout.tsx`: To add a custom user icon to the header.
- `app/(auth)/sign-in.tsx`: For the new email/password sign-in UI and logic.
- `app/(auth)/sign-up.tsx`: For the new email/password sign-up UI and logic.
- `app/(auth)/forgot-password.tsx`: New screen for the password reset flow.
- `app/(tabs)/account.tsx`: New screen for the custom user management UI.
- `app/(tabs)/settings.tsx`: New screen for custom app settings.
- `components/SignOutButton.tsx`: To be integrated into the account screen.
- `components/UserInfo.tsx`: To be integrated into the account screen.

### Notes

- This task list is designed to be completed sequentially.
- Run `npx convex dev` after schema changes to push them to the backend.
- Ensure webhook security is handled correctly by verifying signatures.

## Tasks

- [ ] 1.0 Clerk Dashboard Configuration

  - [ ] 1.1 Log in to the Clerk Dashboard.
  - [ ] 1.2 Navigate to **User & Authentication** -> **Email, Phone, Username**.
  - [ ] 1.3 Confirm that **Email address** is enabled as a sign-up and sign-in method.
  - [ ] 1.4 Navigate to **User & Authentication** -> **Verification**.
  - [ ] 1.5 Ensure email verification is set to use a **one-time code**.

- [ ] 2.0 Backend Setup

  - [ ] 2.1 In `convex/schema.ts`, modify the `users` table: make `phone_number` optional and add `email: v.optional(v.string())`.
  - [ ] 2.2 Run `npx convex dev` to push the schema changes and generate new types.
  - [ ] 2.3 In `convex/user.ts`, update the `createUser` internal mutation to correctly handle payloads with `email` but without `phone_number`.
  - [ ] 2.4 In `convex/http.ts`, enhance the Clerk webhook handler to be idempotent for `user.created` and `user.updated`, ensuring it securely verifies signatures and syncs the primary email address.

- [ ] 3.0 Frontend Foundational Changes

  - [ ] 3.1 In `app/_layout.tsx`, wrap the root component with the `<ClerkProvider>` and add your `publishableKey`.
  - [ ] 3.2 Inside the provider, use `<ClerkLoading>` to show a global loading indicator to prevent UI flash.
  - [ ] 3.3 Wrap the main navigation inside `<ClerkLoaded>`. Use `<SignedIn>` to conditionally render the `(tabs)` stack and `<SignedOut>` to render the `(auth)` stack.
  - [ ] 3.4 In `app/(tabs)/_layout.tsx`, add a custom user icon to the header that navigates to the `/account` screen.

- [ ] 4.0 Implement Authentication Flow

  - [ ] 4.1 In `app/(auth)/sign-up.tsx`, implement a tabbed UI to switch between "Phone" and "Email" sign-up methods.
  - [ ] 4.2 Build the email sign-up form and connect it to the `useSignUp` hook. Implement the full multi-step flow: `signUp.create`, `signUp.prepareEmailAddressVerification`, and `signUp.attemptEmailAddressVerification`.
  - [ ] 4.3 In `app/(auth)/sign-in.tsx`, implement a similar tabbed UI for "Phone" and "Email" sign-in, connecting it to the `useSignIn` hook.
  - [ ] 4.4 Create the `app/(auth)/forgot-password.tsx` file. Implement the two-step password reset flow using `signIn.create` to request a code and `signIn.attemptFirstFactor` to reset the password.
  - [ ] 4.5 Ensure all auth forms handle `isLoading` states by disabling buttons and display clear, user-friendly errors from the Clerk hooks.

- [ ] 5.0 Implement User Management Screens

  - [ ] 5.1 Create the `app/(tabs)/account.tsx` file and build a custom user profile screen using Clerk's `useUser` hook. Integrate the existing `UserInfo` and `SignOutButton` components.
  - [ ] 5.2 Create the `app/(tabs)/settings.tsx` file. This can be a placeholder screen, but ensure there is a navigation link to it from the `account.tsx` screen.
  - [ ] 5.3 Remove any now-redundant props from the custom icon in `app/(tabs)/_layout.tsx`, as navigation is direct.

- [ ] 6.0 Final Integration & Testing
  - [ ] 6.1 Ensure `components/SignOutButton.tsx` and `components/UserInfo.tsx` are correctly integrated into the new `account.tsx` screen.
  - [ ] 6.2 Perform an end-to-end test of the full email sign-up and sign-in flows.
  - [ ] 6.3 Test the "Forgot Password" flow.
  - [ ] 6.4 Test that the custom user icon in the header navigates correctly to the `/account` screen.
  - [ ] 6.5 Test the custom `/account` screen. At a minimum, verify that user data is displayed correctly and that the sign-out button works.
