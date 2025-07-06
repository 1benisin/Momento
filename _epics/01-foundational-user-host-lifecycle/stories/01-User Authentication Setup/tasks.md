# Tasks for User Authentication Setup

## Relevant Files

- `app/(auth)/_layout.tsx` - Handles navigation and layout for the authentication flow.
- `app/(auth)/index.tsx` - The main "Sign Up" / "Log In" screen where users enter their phone number.
- `app/(auth)/otp.tsx` - The screen for entering the one-time password (OTP).
- `app/(auth)/waitlist.tsx` - The screen shown to non-US users to join a waitlist.
- `app/_layout.tsx` - The root layout, responsible for handling authenticated vs. unauthenticated routing.
- `convex/auth.ts` - Contains all backend mutations and actions for authentication logic.
- `convex/schema.ts` - Defines the database schema for `users` and `waitlist_users` collections.
- `convex/tests/auth.test.ts` - Unit and integration tests for the authentication backend logic.
- `lib/utils.ts` - Utility functions, potentially for phone number validation or normalization.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx convex run tests/auth.test.ts` to run backend tests.

## Tasks

- [ ] 1.0 **Setup Backend Schema and Testing Framework**

  - [ ] 1.1 Update `convex/schema.ts`: Add `phone_number`, `status`, `otp_attempts`, `otp_last_attempt_at`, `deviceHistory`, and `email` to the `users` collection.
  - [ ] 1.2 Update `convex/schema.ts`: Create the `waitlist_users` collection with `phone_number` and `region_code` fields.
  - [ ] 1.3 Create `convex/tests/auth.test.ts` with test skeletons for all test cases defined in `story-plan.md`.

- [ ] 2.0 **Implement Core Authentication Logic (Backend)**

  - [ ] 2.1 Implement `auth.sendOtp` mutation in `convex/auth.ts` to handle the golden path for new US-based users.
  - [ ] 2.2 Inside `auth.sendOtp`, validate that the phone number is a valid US number.
  - [ ] 2.3 Inside `auth.sendOtp`, integrate with Twilio via an `httpAction` to send the OTP SMS.
  - [ ] 2.4 Implement `auth.verifyOtp` mutation to validate the submitted OTP, create a new user, and return a session token.
  - [ ] 2.5 Implement `waitlist.join` mutation to add non-US users to the `waitlist_users` collection.

- [ ] 3.0 **Implement Advanced Authentication Flows (Backend)**

  - [ ] 3.1 In `auth.sendOtp`, add logic to detect if a phone number is already registered (recycled number scenario) and return `{ accountExists: true }`.
  - [ ] 3.2 Implement `auth.initiateAccountRecycling` mutation to start the 24-hour security hold.
  - [ ] 3.3 Inside `auth.initiateAccountRecycling`, send a warning email to the original owner using Postmark.
  - [ ] 3.4 Create a scheduled function that runs after 24 hours to archive the old account and free up the phone number.
  - [ ] 3.5 Implement the account recovery flow (`auth.requestVerification` and `auth.verifyDeviceToken`) for existing users on new devices.

- [ ] 4.0 **Create Authentication UI Screens (Frontend)**

  - [ ] 4.1 Create `app/(auth)/index.tsx` to serve as the initial phone number entry screen.
  - [ ] 4.2 Create `app/(auth)/otp.tsx` for users to enter the code they receive.
  - [ ] 4.3 Create `app/(auth)/waitlist.tsx` to inform non-US users about the app's availability.
  - [ ] 4.4 Create a new screen for the recycled phone number flow to ask the user if the account is theirs.
  - [ ] 4.5 Create a new screen to inform the user about the 24-hour security hold.
  - [ ] 4.6 Create the necessary UI screens for the account recovery flow (e.g., a "Check your email" prompt).

- [ ] 5.0 **Integrate Frontend with Backend and Manage State**

  - [ ] 5.1 Create `app/(auth)/_layout.tsx` to structure the navigation flow between auth screens.
  - [ ] 5.2 Connect the frontend screens to the Convex backend mutations (`sendOtp`, `verifyOtp`, etc.).
  - [ ] 5.3 Implement client-side logic to handle different backend responses, such as navigating to the OTP screen or the recycled number screen.
  - [ ] 5.4 Manage loading, success, and error states for all user interactions.

- [ ] 6.0 **Implement Global Route Protection**
  - [ ] 6.1 Modify the root `app/_layout.tsx` to manage session state.
  - [ ] 6.2 Add logic to check for a valid session token on app load.
  - [ ] 6.3 Automatically redirect authenticated users to the main app experience and unauthenticated users to the login screen.
