# Story 01-03 Plan: Add Email Authentication & Overhaul User Management

## 1. High-Level Summary

This plan outlines two major initiatives:

1.  **Email Authentication**: Implementing email/password sign-up and sign-in, augmenting the existing phone-based system. This includes custom UI using Clerk's headless hooks, a one-time code verification flow, and a password reset mechanism.
2.  **User Management Overhaul**: Replacing the previous plan of using pre-built components with a fully custom, native strategy. We will build a dedicated account management screen using Clerk's hooks (`useUser`, etc.) for core functionality and a separate, custom screen for Momento-specific app preferences.

This plan ensures a seamless, secure authentication experience and a scalable, maintainable, and fully native architecture for user settings.

## 2. Current Relevant Directory Structure

```
app/
├── _layout.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── forgot-password.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (onboarding)/
│   ├── _layout.tsx
│   ├── initial-photo.tsx
│   └── profile-setup.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── account.tsx
│   ├── index.tsx
│   └── two.tsx
├── +html.tsx
├── +not-found.tsx
└── modal.tsx

components/
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
├── useClientOnlyValue.ts
├── useClientOnlyValue.web.ts
├── useColorScheme.ts
├── useColorScheme.web.ts
└── UserInfo.tsx

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

The `users` table requires a new optional `email` field, and the `phone_number` field must be made optional to support email-only sign-ups.

```typescript
// convex/schema.ts
// ...
export default defineSchema({
  users: defineTable({
    // ...
    phone_number: v.optional(v.string()), // <-- MAKE OPTIONAL
    email: v.optional(v.string()), // <-- ADD THIS LINE
    // ...
  }),
  // ...
});
```

## 4. Backend Implementation (`convex/`)

- **Files to Modify**:
  - **`convex/user.ts`**:
    - Modify the `createUser` internal mutation to accept an optional `email` and handle cases where `phone_number` is not provided.
  - **`convex/http.ts`**:
    - The Clerk webhook handler (`http.route`) must be enhanced to be fully idempotent for both `user.created` and `user.updated` events. It must correctly sync the primary email address from the Clerk payload (`email_addresses[0].email_address`) to our `users` table using a "get-or-create" pattern.

## 5. Frontend Implementation (`app/`, `components/`)

- **Files to Create**:

  - `app/(tabs)/account.tsx`: A new, custom screen for all user account management, built with Clerk hooks.
  - `app/(tabs)/settings.tsx`: A new, fully custom screen for all Momento-specific preferences, linked from the account screen. For this story, a placeholder screen is sufficient.
  - `app/(auth)/forgot-password.tsx`: A new screen to manage the two-step password reset flow (request code, submit new password).

- **Files to Modify**:

  - **`app/_layout.tsx`**: Wrap the root layout with Clerk's control components (`<ClerkLoading>`, `<ClerkLoaded>`, `<SignedIn>`, `<SignedOut>`) to manage loading and authentication states.
  - **`app/(auth)/sign-up.tsx` & `sign-in.tsx`**: Refactor to include a tabbed or segmented control UI, allowing users to switch between "Email" and "Phone" methods. Implement forms and state management for the email/password and verification code flows using Clerk's headless hooks.
  - **`app/(tabs)/_layout.tsx`**: Implement a custom user icon in the header that navigates to the `/account` screen.

- **Files to Keep & Integrate**:
  - `components/UserInfo.tsx`: Will be used to display user data on the new `account.tsx` screen.
  - `components/SignOutButton.tsx`: Will be used to provide sign-out functionality on the new `account.tsx` screen.

## 6. Step-by-Step Task Breakdown

1.  **Backend Setup**:

    1.  Modify `convex/schema.ts`: Make `phone_number` optional and add the optional `email` field to the `users` table.
    2.  Update `convex/user.ts`: Adjust the `createUser` internal mutation to handle the new schema.
    3.  Enhance `convex/http.ts`: Make the Clerk webhook handler idempotent for `user.created` and `user.updated` events.

2.  **Frontend Foundational Changes**:

    1.  Update `app/_layout.tsx`: Wrap the root layout with the necessary Clerk provider and control components (`<ClerkLoading>`, `<SignedIn>`, etc.).
    2.  Update `app/(tabs)/_layout.tsx`: Add a custom user icon to the header that navigates to `/account`.

3.  **Implement Authentication Flow**:

    1.  Refactor `app/(auth)/sign-in.tsx`: Implement the new tabbed UI for Email/Phone login.
    2.  Refactor `app/(auth)/sign-up.tsx`: Implement the new tabbed UI and the multi-step email verification flow.
    3.  Create `app/(auth)/forgot-password.tsx` to handle the password reset user flow.

4.  **Implement User Management Screens**:

    1.  Create `app/(tabs)/account.tsx` and build a custom UI integrating the `UserInfo` and `SignOutButton` components.
    2.  Create a placeholder `app/(tabs)/settings.tsx` and add a navigation link to it from the `account.tsx` screen.

5.  **Final Integration & Testing**:
    1.  Thoroughly test the sign-up, sign-in, and password reset flows for both email and phone.
    2.  Verify that the custom account screen displays user data and that the sign-out button works correctly.
    3.  Verify that navigation to the settings screen works.

## 7. Open Questions & Assumptions

- **Assumption**: We will use Clerk's headless hooks (`useSignIn`, `useSignUp`, `useUser`) for all authentication and account management logic to maintain full control over the native UI.
- **Assumption**: The custom user icon in the header will be the single entry point for all profile, security, and app settings, streamlining navigation.
- **Consideration**: The Clerk webhook handler in `convex/http.ts` **must** be idempotent to prevent data inconsistencies. This will be achieved using a "get-or-create" logic.
- **Consideration**: It is critical to verify the signature of every incoming webhook to prevent forged requests. This should be implemented from day one.
