# Story Plan: 001-01 - User Authentication Setup

## 1. Goal

Implement a secure, US-only, phone-based authentication system using One-Time Passwords (OTP) sent via SMS. This includes the full loop: a user provides a phone number, receives an SMS, enters the code, and is granted a session.

## 2. Key Decisions & Recommendations

- **Phone Number Handling (Backend)**: All phone numbers must be parsed and normalized to **E.164 format** (e.g., `+15551234567`) using a library like `libphonenumber-js` before being stored or queried. This prevents duplicates and ensures consistency.
- **Phone Number Input (Frontend)**: To ensure a high-quality user experience and reduce invalid inputs, we will use a specialized component like `react-native-phone-number-input`. This provides a country code selector and input masking.
- **Security**: OTPs must be generated using a cryptographically secure random number generator. The OTP itself is never stored; only a **hash** of the OTP is stored in the database.

## 3. Test Plan

This plan is written from a test-first perspective. The implementation is complete when all of these test cases can be passed.

### Validation Loop Commands

- **Backend Validation**: `npx convex run tests/auth.test.ts`
- **Frontend Validation**: Run the Expo app and manually test the flows described below.

---

### Test Cases

#### Happy Paths

| Test Case ID | Description                                                                                      | Validation Steps                                                                                                                                                                                                                                                                                                                         |
| :----------- | :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TC-01`      | **New User Signup (Success)**: A new user with a valid US phone number can sign up successfully. | 1. Enter a valid, unregistered US phone number on `AuthScreen`. <br> 2. Verify an OTP is received via SMS. <br> 3. Enter the correct OTP on `OTPScreen`. <br> 4. **Expected**: User is authenticated and a new `users` document is created in the database with `status: 'pending_onboarding'`. Navigate to the profile creation screen. |
| `TC-02`      | **Returning User Login (Success)**: An existing user can log in successfully.                    | 1. Enter the phone number of a pre-existing user. <br> 2. Verify an OTP is received. <br> 3. Enter the correct OTP. <br> 4. **Expected**: User is authenticated and navigated into the core app experience. No new user document is created.                                                                                             |
| `TC-03`      | **Resend OTP**: A user can request a new OTP code.                                               | 1. On `OTPScreen`, wait for the cooldown to expire. <br> 2. Tap the "Resend Code" button. <br> 3. **Expected**: A new, different OTP is received via SMS. The old OTP is invalidated.                                                                                                                                                    |

#### Edge Cases & Sad Paths

| Test Case ID | Description                                                                                      | Validation Steps                                                                                                                                                                                                                                                                 |
| :----------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TC-04`      | **Non-US Phone Number**: User enters a phone number from outside the US.                         | 1. Enter a valid non-US phone number (e.g., `+44...`). <br> 2. **Expected**: The UI prevents proceeding to the OTP step and instead navigates to the `InternationalWaitlistScreen`. <br> 3. Join the waitlist and verify the number is added to the `waitlist_users` collection. |
| `TC-05`      | **Invalid Phone Number Format**: User enters a malformed phone number.                           | 1. Enter an invalid number (e.g., "123", "555-555-555"). <br> 2. **Expected**: A validation error message is displayed on the `AuthScreen`. The "Continue" button is disabled.                                                                                                   |
| `TC-06`      | **Incorrect OTP**: User enters an incorrect OTP.                                                 | 1. After receiving a valid OTP, enter an incorrect value on the `OTPScreen`. <br> 2. **Expected**: An error message "Invalid code, please try again" is displayed. The `users.otp_attempts` count is incremented. User remains on the `OTPScreen`.                               |
| `TC-07`      | **Expired OTP**: User enters an OTP after it has expired.                                        | 1. Request an OTP. <br> 2. Wait for the expiry period (e.g., 10 minutes). <br> 3. Enter the now-expired OTP. <br> 4. **Expected**: An error message is displayed indicating the code has expired.                                                                                |
| `TC-08`      | **OTP Resend Abuse**: User abuses the "Resend Code" button.                                      | 1. On `OTPScreen`, request to resend the code multiple times (e.g., 3+ times). <br> 2. **Expected**: The "Resend Code" button becomes disabled for a longer cooldown period to prevent SMS spam.                                                                                 |
| `TC-09`      | **Signup with Existing Number**: A user attempts to sign up with a number already in the system. | 1. Enter a phone number that already exists for a user. <br> 2. **Expected**: The flow should treat them as a **returning user** and proceed with the login flow (`TC-02`). The complex "recycled number" scenario is out of scope for this story.                               |
| `TC-10`      | **Rate Limiting on `requestOtp`**: A single phone number is used to request OTPs too frequently. | 1. In a test script, call the `requestOtp` mutation multiple times in rapid succession for the same phone number. <br> 2. **Expected**: After a certain threshold (e.g., 3 requests in 5 minutes), the mutation should throw a "Too many requests" error and not send an SMS.    |

---

## 4. Implementation Plan

### Task Breakdown

#### Backend (Convex)

1.  **Environment Setup**:
    - [ ] Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` as environment variables in the Convex dashboard.
2.  **Schema Definition** (`convex/schema.ts`):
    - [ ] In the `users` table definition, add:
      - `otp_hash: v.optional(v.string())`
      - `otp_expires_at: v.optional(v.number())`
      - `otp_attempts: v.optional(v.number())`
      - `otp_last_attempt_at: v.optional(v.number())`
    - [ ] Define the `waitlist_users` table for international numbers.
3.  **Authentication Logic** (`convex/auth.ts`):
    - [ ] Create a public `requestOtp` mutation.
      - It must normalize the phone number to E.164 format.
      - It must validate that the number is a US number. Non-US numbers should be rejected.
      - It must implement rate-limiting logic.
      - It must generate a secure OTP, hash it, and store the hash and an expiry timestamp on the user document.
      - It must call the private `_sendSms` action.
    - [ ] Create a private `_sendSms` action that uses the Twilio Node SDK to send the OTP message. This action should only be callable by other backend functions.
    - [ ] Create a public `verifyOtp` mutation that checks the submitted code against the stored hash, handles new vs. returning users, and returns a session token. It must also handle error cases like incorrect or expired codes.
    - [ ] Create a public `joinWaitlist` mutation to store non-US numbers.
4.  **Testing** (`convex/tests/auth.test.ts`):
    - [ ] Write backend tests covering the logic in `requestOtp` and `verifyOtp` using `convex/testing`. Mock the Twilio action. Test all happy paths and error conditions, including rate limiting.

#### Frontend (Expo)

5.  **Screen Creation**:
    - [ ] Build the `AuthScreen` using `react-native-phone-number-input` for the phone input field.
    - [ ] Build the `OTPScreen` with an input for the code and the "Resend Code" button.
    - [ ] Build the `InternationalWaitlistScreen` with a simple form to confirm joining the waitlist.
6.  **Component & State Logic**:
    - [ ] Implement client-side validation for the phone number input on `AuthScreen`.
    - [ ] Manage the auth flow state (`idle`, `requestingOtp`, `verifyingOtp`, `error`) on the `AuthScreen` and `OTPScreen`.
    - [ ] Use the `useMutation` hook from `convex/react` to call the `requestOtp`, `verifyOtp`, and `joinWaitlist` mutations.
    - [ ] Implement logic to securely store the session token upon successful login. Convex's auth helpers should be used to manage this automatically.
7.  **Navigation**:
    - [ ] Set up routing in Expo Router to handle the flow: `AuthScreen` -> `OTPScreen` or `InternationalWaitlistScreen`.
    - [ ] The root `_layout.tsx` should protect routes, redirecting unauthenticated users to the `AuthScreen`.
    - [ ] On successful authentication from `verifyOtp`, navigate the user to the next step in the onboarding flow (`ProfileSetupScreen`, to be built in the next story).

## 5. Future Considerations (Out of Scope for this Story)

- **Recycled Phone Number Flow**: The advanced logic for handling recycled phone numbers (notifying the original owner, a security waiting period, etc.) is complex. This will be handled in a separate story (`001-06_HandleRecycledPhoneNumbers`). For now, an existing phone number always logs in the existing user.
- **"Magic Link" Email Fallback**: An alternative auth method using email for users who lose access to their phone number can be added later.
