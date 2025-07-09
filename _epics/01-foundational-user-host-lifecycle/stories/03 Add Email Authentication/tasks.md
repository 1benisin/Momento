# Tasks for Story 01-03: Add Email Authentication

## Relevant Files

### Files to Modify

- `convex/schema.ts` - To add the `email` field to the `users` table.
- `convex/user.ts` - To update backend logic for creating and updating users with an email.
- `convex/http.ts` - To enhance the Clerk webhook to sync email users.
- `app/(auth)/sign-up.tsx` - To add the email sign-up UI and logic.
- `app/(auth)/sign-in.tsx` - To add the email sign-in UI and logic.
- `app.config.ts` - To configure deep linking for email verification.
- `app/_layout.tsx` - To handle deep linking logic.

### Files to Create

- `app/(auth)/verify-email.tsx` - Screen to handle the email verification deep link.
- `app/(auth)/forgot-password.tsx` - Screen for the "forgot password" flow.
- `app/(tabs)/account.tsx` - Screen for logged-in users to manage their account (e.g., add an email).

### Notes

- The "Relevant Files" are based on the implementation `plan.md`. File paths may need to be adjusted during implementation.
- Remember to run `npx convex dev` after schema changes to push them to the backend.

## Tasks

- [ ] 1.0 Configure Clerk Dashboard

  - [ ] 1.1 Log in to the Clerk Dashboard for this project.
  - [ ] 1.2 Navigate to **User & Authentication** -> **Email, Phone, Username**.
  - [ ] 1.3 Ensure **Email address** is enabled as a sign-up and sign-in method.
  - [ ] 1.4 Navigate to **User & Authentication** -> **Verification**.
  - [ ] 1.5 Enable email verification and ensure it's required for sign-in.
  - [ ] 1.6 Navigate to **Paths** and configure the "Verify Email" redirect URL to point to your app's deep link (e.g., `momentoapp://auth/verify-email`).

- [ ] 2.0 Update Database Schema

  - [ ] 2.1 In `convex/schema.ts`, modify the `users` table definition.
  - [ ] 2.2 Make the `phone_number` field optional: `phone_number: v.optional(v.string())`.
  - [ ] 2.3 Add a new optional `email` field: `email: v.optional(v.string())`.
  - [ ] 2.4 Push the schema changes by running `npx convex dev` in the terminal.

- [ ] 3.0 Implement Backend Logic & Webhooks

  - [ ] 3.1 In `convex/user.ts`, update the `createUser` mutation to handle an optional `email` and a potentially missing `phone_number`.
  - [ ] 3.2 In `convex/user.ts`, create a new `updateUserEmail` mutation to allow adding/changing a user's email. This will be called by the webhook.
  - [ ] 3.3 In `convex/http.ts`, find the Clerk webhook handler and ensure it uses `WebhookHandler` to securely verify request signatures.
  - [ ] 3.4 Enhance the `user.created` and `user.updated` event cases to use idempotent "get-or-create" logic (query for user by `clerkId` first, then create or update).
  - [ ] 3.5 In the webhook, extract `email_addresses[0].email_address` from the payload and pass it to the appropriate mutation.

- [ ] 4.0 Implement Email Sign-Up Flow

  - [ ] 4.1 In `app/(auth)/sign-up.tsx`, add a UI switcher (e.g., tabs) to let users choose between "Phone" and "Email" sign-up.
  - [ ] 4.2 Add input fields for `emailAddress` and `password` to the email tab.
  - [ ] 4.3 Implement real-time, client-side password validation feedback (e.g., "✓ 8 characters").
  - [ ] 4.4 Use the `useSignUp` hook from `@clerk/clerk-expo` to manage state.
  - [ ] 4.5 Implement the `onSignUpPress` handler to call `signUp.create({ emailAddress, password })`.
  - [ ] 4.6 After creation, call `signUp.prepareEmailAddressVerification()` to send the verification email.
  - [ ] 4.7 Display a message instructing the user to check their email, and include a "Resend Email" button with a 60-second cooldown.
  - [ ] 4.8 Handle errors from `signUp.create`, specifically checking for "email already exists" and prompting the user to sign in instead.
  - [ ] 4.9 Ensure the "Sign Up" button is disabled when `isLoading` is true and that any errors from the hook are displayed.

- [ ] 5.0 Implement Email Sign-In Flow

  - [ ] 5.1 In `app/(auth)/sign-in.tsx`, add a UI switcher for "Phone" and "Email" sign-in.
  - [ ] 5.2 Add `emailAddress` and `password` input fields.
  - [ ] 5.3 Implement the `onSignInPress` handler to use `signIn.create({ identifier: emailAddress, password })` from the `useSignIn` hook.
  - [ ] 5.4 Add a "Forgot Password?" link that navigates to `/forgot-password`.
  - [ ] 5.5 Ensure the "Sign In" button is disabled when `isLoading` is true and that errors are displayed clearly to the user.

- [ ] 6.0 Build Email Verification Screen & Deep Linking

  - [ ] 6.1 Create the new file `app/(auth)/verify-email.tsx`.
  - [ ] 6.2 The screen should use the `useSignUp` hook to attempt verification.
  - [ ] 6.3 It will be activated via a deep link. Implement logic to parse the verification token from the link.
  - [ ] 6.4 On load, call `signUp.attemptEmailAddressVerification({ code })` with the token.
  - [ ] 6.5 On success, set the session with `setSession` and navigate the user into the main app (e.g., `/(tabs)`).
  - [ ] 6.6 Gracefully handle cases where the verification token is invalid or expired by showing a user-friendly error message.
  - [ ] 6.7 Configure deep linking in `app.config.ts` and ensure the root navigator allows unauthenticated access to this route.

- [ ] 7.0 Build Forgot Password Flow

  - [ ] 7.1 Create the new file `app/(auth)/forgot-password.tsx`.
  - [ ] 7.2 Add a form with an email input and a "Send Reset Link" button.
  - [ ] 7.3 Use the `useSignIn` hook. When the button is pressed, call `signIn.create({ strategy: 'reset_password_email_code', identifier: email })`.
  - [ ] 7.4 After the call succeeds, show a confirmation message to the user.
  - [ ] 7.5 Ensure the submit button is disabled when `isLoading` is true and that errors are handled gracefully.

- [ ] 8.0 Create Account Management Screen

  - [ ] 8.1 Create the new file `app/(tabs)/account.tsx`.
  - [ ] 8.2 The screen should allow a logged-in user to add an email address if one isn't already present.
  - [ ] 8.3 Use Clerk's `user.createEmailAddress()` method to add the new email. Clerk will handle the verification flow.
  - [ ] 8.4 The data will be synced back to Convex via the `user.updated` webhook configured in step 3.

- [ ] 9.0 End-to-End Testing
  - [ ] 9.1 Create test accounts in the Clerk Dashboard.
  - [ ] 9.2 Test the full email sign-up flow: account creation -> email receipt -> verification -> sign in.
  - [ ] 9.3 Test the email sign-in flow for a verified account.
  - [ ] 9.4 Test the "Forgot Password" flow.
  - [ ] 9.5 Test adding an email to an existing phone-based account via the Account screen.
  - [ ] 9.6 Use the Convex dashboard to verify that user records in the `users` table are correctly created and updated.
