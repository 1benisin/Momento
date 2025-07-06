# Story: User Authentication Setup - Implementation Details

This document synthesizes all relevant information from the `_docs` directory to guide the implementation of US-only, phone-based OTP authentication.

## 1. Overview & Goal

- **Story**: 001-01: User Authentication Setup
- **Goal**: Implement US-only, phone-based authentication using One-Time Passwords (OTP) sent via SMS.

## 2. Technology Stack

- **Backend**: Convex
- **SMS Provider**: Twilio
- **Transactional Email**: Postmark (for recovery/notifications)
- **Frontend**: React Native / Expo

## 3. Core Data Models

The following collections in `convex/schema.ts` are central to this story.

### `users` Collection

This is the main user record. Key fields for authentication:

| Field Name            | Type                       | Description                                                                        |
| --------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `phone_number`        | `v.optional(v.string())`   | User's US-based phone number. Indexed. `null` for archived accounts.               |
| `status`              | `v.string()`               | Tracks user state, e.g., 'pending_onboarding', 'active', 'archived_for_recycling'. |
| `otp_attempts`        | `v.optional(v.number())`   | Tracks failed OTP attempts to prevent abuse.                                       |
| `otp_last_attempt_at` | `v.optional(v.number())`   | Timestamp of the last failed OTP attempt.                                          |
| `deviceHistory`       | `v.optional(v.array(...))` | Stores fingerprints of trusted devices to detect new logins.                       |
| `email`               | `v.optional(v.string())`   | Optional private email used for account recovery.                                  |

### `waitlist_users` Collection

Stores contact info for users from unsupported regions.

| Field Name     | Type         | Description                           |
| -------------- | ------------ | ------------------------------------- |
| `phone_number` | `v.string()` | The user's full international number. |
| `region_code`  | `v.string()` | The country code prefix, e.g., "+44". |

## 4. Authentication Flows

The implementation must handle several distinct user journeys.

### Flow 1: New US-Based User (Golden Path)

1.  **`PhoneInputScreen`**: User enters a valid US phone number (`+1` country code).
2.  **Backend (`auth.sendOtp`)**:
    - Validates the number is from the US.
    - Generates a 6-digit OTP.
    - Calls Twilio via an `httpAction` to send the SMS.
    - **SMS Content**: "Your new Momento verification code is [Code]. This code will expire in 10 minutes."
3.  **`OTPScreen`**: User enters the received OTP.
4.  **Backend (`auth.verifyOtp`)**:
    - Verifies the code.
    - On success, creates a new user record with `status: 'pending_onboarding'`.
    - Returns a session token to the client.
5.  **Client**: Navigates to the `ProfileSetupScreen`.

### Flow 2: Non-US User

1.  **`PhoneInputScreen`**: User enters a non-US phone number.
2.  **Client**: Detects the country code is not `+1`.
3.  **Navigation**: Redirects to the `InternationalWaitlistScreen`.
4.  **`InternationalWaitlistScreen`**:
    - Displays a message that the app is not yet available.
    - Provides a "Notify Me" button.
5.  **Backend (`waitlist.join`)**: On button press, saves the phone number to the `waitlist_users` collection.

### Flow 3: Recycled Phone Number

This is triggered when a user enters a phone number that already exists in the `users` collection.

1.  **Backend (`auth.sendOtp`)**: Finds an existing user with the phone number.
2.  **Backend Response**: Returns `{ accountExists: true }` to the client.
3.  **Client**: Navigates to a disambiguation screen: "Is this your account?" with two options:
    - "Yes, that's my account" -> Go to **Flow 4: Account Recovery**.
    - "No, I'm a new user" -> Continue below.
4.  **Security Hold**:
    - **Client**: Calls `auth.initiateAccountRecycling`.
    - **Backend**:
      - Initiates a 24-hour security hold.
      - Sends an email (via Postmark) to the original owner's email (if available) warning them of the change.
      - **Email Content**: "A sign-in attempt was made on your Momento account... your account's phone number will be unlinked in 24 hours..."
      - Creates a scheduled function to run in 24 hours.
    - **Client**: Shows a screen explaining the 24-hour wait.
5.  **Account Archival (After 24 hours)**:
    - The scheduled function runs.
    - It archives the original user account (`status: 'archived_for_recycling'`) and sets `phone_number` to `null`.
    - It sends an SMS (via Twilio) to the phone number.
    - **SMS Content**: "Welcome to Momento! You can now complete your sign-up."
6.  **New User Onboarding**: The new user can now sign up normally following **Flow 1**.

### Flow 4: Account Recovery (Existing User, New Device)

This flow begins when an existing user tries to log in from an unrecognized device or confirms ownership during the recycled number flow.

1.  **Backend (`auth.requestVerification`)**:
    - Checks for a verified `email` on the user's record.
    - **If email exists**:
      - Generates a time-limited verification token.
      - Sends an email (via Postmark) with a deep link: `momento://verify-device?token=...`
    - **If no email exists**: Fallback to Stripe Identity verification.
2.  **User Action**: Clicks the deep link in the email.
3.  **Client**:
    - The app opens from the deep link.
    - It extracts the token and calls `auth.verifyDeviceToken`.
4.  **Backend (`auth.verifyDeviceToken`)**:
    - Validates the token.
    - On success, adds the new device fingerprint to the user's `deviceHistory`.
    - Returns a new session token to the client, granting access.

## 5. UI Components / Screens

The primary screens for this story will live in the `app/(auth)/` directory.

- `index.tsx`: The main "Sign Up" / "Log In" screen.
- `otp.tsx`: The screen for entering the one-time password.
- `waitlist.tsx`: The screen shown to non-US users.
- **New Screens Needed**:
  - A screen to handle the recycled number disambiguation.
  - A screen to inform the user about the 24-hour security hold.
  - Screens for the account recovery flow (e.g., "Check your email").

This consolidated guide should provide a clear path for implementation.
