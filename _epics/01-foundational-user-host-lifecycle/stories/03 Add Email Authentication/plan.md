# Story 01-03 Plan: Add Email Authentication

## 1. High-Level Summary

This plan outlines the implementation of email and password authentication, augmenting the existing phone-based system. We will build custom UI components within the existing `(auth)` screens that use Clerk's `useSignUp` and `useSignIn` hooks. The backend will be updated to handle user creation from email sign-ups via a Clerk webhook, storing the user's email in the Convex `users` table. This involves creating new UI for email/password forms, a verification flow via email deep linking, a password reset mechanism, and a new screen for existing users to add an email to their account.

## 2. Current Relevant Directory Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (onboarding)/
│   ├── ...
└── (tabs)/
    ├── ...

components/
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
├── ...

convex/
├── _generated/
├── tests/
├── auth.config.ts
├── clerk.ts
├── files.ts
├── http.ts
├── schema.ts
├── tsconfig.json
└── user.ts
```

## 3. Data Model Changes (`convex/schema.ts`)

The `users` table in `convex/schema.ts` is missing the `email` field. It needs to be added to store the user's email address.

```typescript
// convex/schema.ts

// ...
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    phone_number: v.optional(v.string()), // Make phone optional
    email: v.optional(v.string()), // <-- ADD THIS LINE
    status: userStatusValidator,

    socialProfile: v.optional(
// ...
```

## 4. Backend Implementation (`convex/`)

### Files to Create

- None.

### Files to Modify

- **`convex/user.ts`**:

  - Modify the `createUser` mutation to accept an optional `email` and handle cases where `phone_number` is not provided.
  - Add a new `updateUserEmail` mutation to allow existing users to add an email address to their profile.

- **`convex/http.ts`**:
  - Update the Clerk webhook handler to process `user.created` events for email-based sign-ups. It must extract `email_addresses[0].email_address` from the webhook payload.
  - Add logic to handle the `user.updated` event to sync changes when a user adds an email to their existing account. The logic should call the new `updateUserEmail` mutation.

## 5. Frontend Implementation (`app/`, `components/`)

### Files to Create

- **`app/(auth)/verify-email.tsx`**: A new screen to handle the verification deep link. This screen will extract the verification token, call `signUp.attemptEmailAddressVerification()`, and navigate the user to the main app upon success.
- **`app/(auth)/forgot-password.tsx`**: A new screen that allows users to enter their email to receive a password reset link. This will use Clerk's `signIn.create({ strategy: 'reset_password_email_code' })`.
- **`app/(tabs)/account.tsx`**: A new screen in the main app where logged-in users can view account details and add/verify an email address if they originally signed up with a phone number.

### Files to Modify

- **`app/(auth)/sign-up.tsx`**:

  - Add a UI switcher (e.g., tabs) to allow users to select between "Phone" and "Email" sign-up.
  - Create new input fields for `emailAddress` and `password`.
  - Update the `onSignUpPress` handler to call `signUp.create({ emailAddress, password })` and `signUp.prepareEmailAddressVerification()` for the email flow.
  - Add a new view state to inform the user to check their email for the verification link.

- **`app/(auth)/sign-in.tsx`**:

  - Add a UI switcher for "Phone" and "Email" sign-in.
  - Add input fields for `emailAddress` and `password`.
  - Update the `onSignInPress` handler to use `signIn.create({ identifier: emailAddress, password })` for email-based login.
  - Add a "Forgot Password?" link that navigates to `app/(auth)/forgot-password.tsx`.

- **Expo Router / Deep Linking**:
  - Configuration will be required to handle deep links for email verification and password resets, likely in `app.config.ts` and the root layout (`app/_layout.tsx`).

## 6. Step-by-Step Task Breakdown

1.  **Backend Schema**: Modify `convex/schema.ts` to add the optional `email` field to the `users` table and make `phone_number` optional.
2.  **Backend Logic**: Update the `createUser` mutation in `convex/user.ts` to support email.
3.  **Backend Webhook**: Enhance the webhook in `convex/http.ts` to handle `user.created` events with email and `user.updated` events.
4.  **Sign-Up UI**: Implement the email/password form in `app/(auth)/sign-up.tsx` and the corresponding `useSignUp` logic.
5.  **Sign-In UI**: Implement the email/password form in `app/(auth)/sign-in.tsx` and the corresponding `useSignIn` logic.
6.  **Email Verification Screen**: Build the `app/(auth)/verify-email.tsx` screen and configure deep linking to handle the verification flow.
7.  **Forgot Password Flow**: Build the `app/(auth)/forgot-password.tsx` screen and link it from the sign-in page.
8.  **Account Management**: Create the `app/(tabs)/account.tsx` screen for existing users to add an email.
9.  **Backend Linking**: Implement the `updateUserEmail` mutation in `convex/user.ts` and connect it to the account management screen and the `user.updated` webhook.
10. **Testing**: Thoroughly test all authentication paths: phone sign-up/sign-in, email sign-up/verification/sign-in, password reset, and adding an email to an existing account.

## 7. Key Considerations & Edge Cases

### User Experience (UX)

- **Duplicate Account Prevention**: The sign-up flow must detect if an email is already associated with an account and prompt the user to sign in instead.
- **Verification Email Resend**: The UI must include a "Resend Email" button with a cooldown period to handle cases where the initial email is missed or delayed.
- **Expired/Invalid Link Handling**: The `verify-email` screen must gracefully handle expired or invalid tokens and guide the user on what to do next.
- **Real-time Password Validation**: The password input field should provide immediate feedback on whether the password meets the security requirements.

### Architecture & Security

- **Idempotent Webhooks**: The Clerk webhook handler in `convex/http.ts` must be idempotent. It should use a "get-or-create" logic (`query` for `clerkId` first, then `create` if not found, or `update` if found) to prevent data inconsistencies if webhooks are missed or retried.
- **Webhook Security**: It's critical to verify the signature of every incoming webhook request using Clerk's `WebhookHandler` to prevent forged requests.
- **Deep Link Navigation**: The root navigator must be configured to allow unauthenticated access to the `verify-email` and `forgot-password` routes to prevent race conditions during redirection.
- **Robust State Management**: All authentication forms must handle `isLoading` states (e.g., disabling buttons) and display clear error messages returned from the Clerk hooks.

## 8. Open Questions & Assumptions

- **Question**: What is the desired location and navigation path for the "Account Settings" screen? (Assuming `app/(tabs)/account.tsx` for now).
- **Assumption**: Clerk's email templates are sufficient for the initial implementation, and custom branding is out of scope for this story.
- **Assumption**: The project is already configured to handle deep linking with Expo. If not, that will be an additional prerequisite task.
