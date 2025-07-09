# Story 01-03 Context: Add Email Authentication & Overhaul User Management

## 1. High-Level Goal & User Personas

- **Goal**: To enhance the existing authentication system to allow users to sign up and log in with an email and password, and to refactor the entire user settings and account management architecture to be more robust, scalable, and professional by leveraging pre-built Clerk components alongside our own custom UI.
- **Primary Persona**: `Alex (The Adventurous Newcomer)` - A new user who may prefer traditional email signup over using a phone number for privacy or convenience reasons.
- **Secondary Persona**: `Returning User` - An existing user who wants to manage their account settings, security, and app preferences in a clear and intuitive way.

---

## 2. Key Product & Feature Decisions

This section captures the high-level "what and why" from our main planning documents.

### From `PROJECT_OVERVIEW.md`: Technology Stack

Our strategy for authentication is a hybrid approach, which is a key decision:

- **Authentication:** Clerk (using `@clerk/clerk-expo` and `convex/react-clerk`, with a hybrid approach leveraging custom UI for onboarding and pre-built components like `<UserProfile />` for account management).

### From `FEATURES.md`: User Account Management & Settings

This defines our "Two Destinations" architecture for all settings:

To provide a clear and robust user experience, we divide settings into two distinct areas, accessed via a menu from the main `<UserButton>` in the app header:

1.  **Profile & Security (Managed by Clerk)**: This destination is a dedicated screen that renders Clerk's pre-built `<UserProfile />` component. It serves as the single source of truth for core account and security management, including:

    - Updating profile information (name, etc.).
    - Managing and verifying email addresses and phone numbers.
    - Changing passwords and managing multi-factor authentication (MFA).
    - Viewing active sessions and signing out of other devices.

2.  **App Preferences (Managed by Momento)**: This is a fully custom-built settings screen where we house all of Momento's unique application-level preferences. This screen contextually displays settings based on the user's active mode.

This hybrid approach allows us to leverage Clerk's powerful, secure, and pre-built components for the complex parts of account management, while giving us full control to build a tailored experience for our app-specific settings.

---

## 3. Screen & Component Architecture

This section, from `SCREENS_AND_COMPONENTS.md`, details the specific screens and components involved in this new architecture.

### Root Layout (`app/_layout.tsx`)

To manage the initial authentication state gracefully, the root layout will be wrapped with Clerk's control components:

- `<ClerkLoading>` will show a loading indicator to prevent screen flash.
- `<ClerkLoaded>` will contain the main app content.
- `<SignedIn>` will wrap the `(tabs)` stack, automatically showing it to authenticated users.
- `<SignedOut>` will wrap the `(auth)` stack, automatically directing unauthenticated users there.

### Auth Flow Screens (`app/(auth)/`)

- **`sign-in.tsx` & `sign-up.tsx`**:
  - These screens will be refactored to include a tabbed UI, allowing users to switch between "Phone" (OTP) and "Email" (password) methods.
  - The email sign-up flow will use Clerk's headless hooks to manage the multi-step process of verifying a user's email with a one-time code.
- **`forgot-password.tsx` (New Screen)**:
  - A new screen to handle the two-step password reset flow (requesting a code, then submitting a new password with the code).

### User Management: Profile, Settings & Preferences

To provide a clear and organized experience, all user management functions are accessed from a menu presented by the `<UserButton>` component in the main app header. This leads to two distinct destinations: one for core account and security settings (managed by Clerk), and another for app-specific preferences (managed by us).

- **`<UserButton>` Component**:

  - **Location**: Placed in the header of the main `(tabs)` layout.
  - **Functionality**: On press, it opens a menu with two primary navigation options:
    1.  **"Profile & Security"** -> Navigates to the `UserProfileScreen`.
    2.  **"App Preferences"** -> Navigates to the `SettingsScreen`.
    3.  It also includes a "Sign Out" option.

- **`UserProfileScreen` (`/account`)**:

  - **Purpose**: This screen is dedicated _exclusively_ to rendering Clerk's pre-built `<UserProfile />` component. It acts as the secure, centralized hub for all core identity and security management (name, email, phone, password, MFA).
  - **File Path**: `app/(tabs)/account/[[...userProfile]].tsx`.
  - **Note on Routing**: The `[[...userProfile]]` catch-all route structure is a **requirement** from Expo Router. It allows the Clerk component to manage its own internal URL state and navigation, and removing it will break the component.

- **`SettingsScreen` (`/settings`)**:
  - **Purpose**: This is our fully custom, native screen for all Momento-specific settings and preferences. Its content is context-aware and changes based on the user's `active_role`.
  - **File Path**: `app/(tabs)/settings.tsx`.
  - **Core Layout & Universal Sections (Always Visible)**:
    - **`ModeSwitcher`**: For `Hybrid Users`, this is the primary control at the top of the screen to switch between 'Social' and 'Host' contexts.
    - **`NotificationSettingsScreen`**: For managing all push and SMS preferences.
    - **`PaymentAndHistoryScreen`**: For managing payment methods and viewing past transactions.
    - **`SecurityAndPrivacyScreen`**: Hub for Momento-specific safety features, including the `BlockedUsersScreen`.
    - **`HelpCenterScreen`**: The entry point for contacting support.
    - **`LegalScreen`**: Contains links to the `PrivacyPolicyScreen` and `TermsOfServiceScreen`.
  - **Contextual Sections (Mode-Dependent)**:
    - **If in 'Social' Mode (Participant Settings)**: Includes `EditProfileScreen`, `EventPreferencesScreen`, and `MySocialLinksScreen`.
    - **If in 'Host' Mode (Host Settings)**: Includes `EditHostProfileScreen` and `ManagePublicSocialsScreen`.

---

## 4. Data Model Context

This note from `DATA_MODELS.md` clarifies the relationship between Clerk and our Convex database.

### Schema Change (`convex/schema.ts`)

To support email-only signup, the `users` table needs to be updated. The `phone_number` will become optional, and a new optional `email` field will be added.

```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    // ...
    phone_number: v.optional(v.string()), // <-- Now optional
    email: v.optional(v.string()), // <-- New field
    // ...
  }),
  //...
});
```

### Note on Data Synchronization

While the `users` table stores a comprehensive view of the user, the "source of truth" for user-editable account information (like name, email, phone numbers) and security settings (password, MFA) is **Clerk**. Users modify this data through Clerk's `<UserProfile />` component. Changes are then synchronized to this `users` collection via webhooks to power Momento's internal application logic. This architecture allows us to leverage Clerk's robust, pre-built UI for account management, saving significant development effort and ensuring a high standard of security.

---

## 5. Relevant User Flow Impacts

### `01_new_user_onboarding.md`

- The initial sign-up flow now explicitly supports both Phone (OTP) and Email (password + verification code) methods.
- The rest of the intent-driven flow remains the same.

### `19_participant_becomes_host.md` & `20_mode_switching.md`

- The `ModeSwitcher` component is no longer located on a generic "Profile" tab.
- The canonical flow for a user to switch modes is now:
  1.  Tap the `<UserButton>` in the app header.
  2.  Select "App Preferences" from the menu.
  3.  Navigate to the custom `SettingsScreen`.
  4.  Use the `ModeSwitcher` control at the top of that screen.

### `02_non_us_user_onboarding.md`

- This flow remains a valid edge case, but we have noted that it could be replaced in the future by leveraging Clerk's pre-built `<Waitlist />` component.

---

## 6. Key Technical & UX Considerations

This section captures critical implementation details and user experience requirements to ensure a robust and polished feature.

### Backend & Security

- **Idempotent Webhooks**: The Clerk webhook handler in `convex/http.ts` **must** be idempotent. It should use a "get-or-create" logic (query for `clerkId` first, then create if not found, otherwise update) to prevent data inconsistencies if webhooks are retried or arrive out of order.
- **Webhook Signature Verification**: It is critical to verify the cryptographic signature of every incoming webhook request using Clerk's provided utilities to prevent forged requests from a malicious third party.

### User Experience (UX)

- **Robust State Management**: All authentication forms must handle `isLoading` states (e.g., disabling buttons during submission) and display clear, user-friendly error messages returned from the Clerk hooks.
- **Duplicate Account Prevention**: The sign-up flow must gracefully handle the case where an email is already in use and prompt the user to sign in instead of showing a generic error.
- **Verification Code Resend**: The UI for email verification must include a "Resend Code" button, ideally with a cooldown period, to handle cases where the initial email is missed by the user or delayed.
- **Clear Settings Navigation**: The menu presented by the `<UserButton>` must use clear, distinct language for "Profile & Security" vs. "App Preferences" to guide the user to the correct destination and avoid confusion.
