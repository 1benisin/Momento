- **Story 01-03: Add Email Authentication**
  - **Goal**: Enhance the existing authentication system to allow users to sign up and log in with an email and password, creating a unified auth experience.

### Epic

- **Epic**: [01: Foundational User & Host Lifecycle](/_epics/01-foundational-user-host-lifecycle/01-epic-prd.md)
- **Parent Story**: [01-01: User Authentication Setup](/_epics/01-foundational-user-host-lifecycle/stories/01%20User%20Authentication%20Setup/story-plan.md)

### User Personas

- **Primary**: `Alex (The Adventurous Newcomer)` - A new user who may prefer traditional email signup over using a phone number for privacy or convenience reasons.
- **Secondary**: `Returning User` - An existing user who signed up with a phone number and now wishes to link their email address to their account for recovery or notification purposes.

### Acceptance Criteria

- **Functional Requirements**:

  - [ ] A user can navigate to the "Sign Up" screen and choose an "Email" option.
  - [ ] A user can successfully create a new account by providing a valid email address and a secure password.
  - [ ] Upon signup, the user receives a verification email with a clickable link.
  - [ ] The user must click the verification link to activate their account before they can log in.
  - [ ] A user can log in using their registered email and password.
  - [ ] An existing user who signed up via phone can add an email and password to their account through a new "Account Settings" screen.
  - [ ] A user can initiate a "Forgot Password" flow from the "Log In" screen.
  - [ ] The password reset flow sends a secure link to the user's verified email address.
  - [ ] All authentication logic is handled through Clerk, and the new email/user data is correctly synced to the Convex `users` table.

- **Non-Functional Requirements**:
  - [ ] Passwords must be securely stored and managed by Clerk, not in our database.
  - [ ] The email verification and password reset tokens must be secure, single-use, and time-limited.
  - [ ] The implementation must follow Clerk's best practices for custom email/password flows with their React Native SDK.

### Out of Scope

- **Social Logins**: Integration with Google, Apple, or other social providers is not part of this story.
- **Two-Factor Authentication (2FA)**: Advanced security features like TOTP or SMS as a second factor are excluded.
- **Magic Links**: Passwordless login via "magic links" (other than for the initial verification and password reset) is not included.

### Dependencies

- The core Clerk and Convex provider setup from story `01-01` must be complete.
- The `users` data model in `convex/schema.ts` must be stable.

### Assumptions

- Clerk's infrastructure will handle the complexities of email sending, deliverability, and security for verification and password reset emails.
- We will build custom UI components for the sign-up and sign-in forms that interact with Clerk's `useSignUp` and `useSignIn` hooks, as pre-built components are not suitable for our React Native (Expo) setup.

### Risks

- **Email Deliverability**: Emails sent by Clerk could be marked as spam, preventing users from completing verification. Mitigation: Monitor email delivery stats in the Clerk dashboard and follow best practices for email content.
- **UI Complexity**: Building custom authentication screens that handle all edge cases (e.g., incorrect password, email already exists, loading states) is complex and requires thorough testing. Mitigation: Allocate sufficient time for UI development and testing across different devices.

### Relevant User Flows

- **Primary**: `01_new_user_onboarding.md` - This story directly adds a new path ("Option B: Email") to the "Universal Account Creation" phase.
- **Secondary**: `04_account_recovery.md` - This story provides the primary "Path A: Email Verification" for account recovery, which was previously a fallback.

### Key Technical Decisions & Implementation Strategy

- **Frontend**:
  - The UI will **not** use Clerk's pre-built components. Instead, we will build custom screens (`sign-in.tsx`, `sign-up.tsx`) that use Clerk's headless React hooks: `useSignUp()` and `useSignIn()`.
  - These hooks provide the state management (`isLoading`, `isLoaded`) and methods (`signUp.create()`, `signIn.attemptFirstFactor()`) needed to handle the entire email/password and verification flow, as outlined in `_docs/SCREENS_AND_COMPONENTS.md`.
- **Backend**:
  - The existing `user.store` internal mutation in `convex/user.ts` must be updated. After a user is created via Clerk (including with email), the webhook that syncs user data should now also pull `identity.email` from the Clerk token and store it in the `users.email` field in our Convex database.
  - The `users` table schema in `_docs/DATA_MODELS.md` and `convex/schema.ts` is already prepared for this with an `email: v.optional(v.string())` field.
- **Email Delivery**:
  - **Decision**: All authentication-related emails (account verification, password reset) will be sent by **Clerk**'s built-in services.
  - **Rationale**: This maintains the principle of using Clerk as the single source of truth for authentication, simplifying the implementation. While project documents like `_docs/ARCHITECTURE.md` mention a direct `Postmark` integration, that will be reserved for non-auth transactional emails (e.g., event notifications), as per the strategy in `_docs/NOTIFICATIONS_PLAN.md`.

### Developer & Testing Notes

- **Clerk Test Accounts**: To test the email/password flow without needing to use real, verifiable email addresses, developers should create test accounts in the Clerk Dashboard. These accounts allow setting a test email and password that can be used directly in the simulator or development builds. This process is documented in `_docs/DEVELOPMENT_PROCESS.md`.
