## 21. Handling a Recycled Phone Number (New User)

**Goal:** To securely handle a sign-up attempt with a phone number that is already associated with an existing Momento account, correctly identifying whether the user is the original owner or a new owner, and safely transitioning the number to the new user if appropriate.

**Actors:**

- **User:** The person trying to sign up.
- **Momento App (Client):** The React Native/Expo application.
- **Momento Backend (Convex):** The Convex server handling logic.
- **Postmark/Twilio:** Services for sending notification emails/SMS to the original account owner.

### High-Level Flow Diagram

```mermaid
graph TD
    A[User enters phone number] --> B{Account exists?};
    B -- No --> C[Proceed with Golden Path Onboarding];
    B -- Yes --> D{Check for dormancy/new device};
    D --> E[Ask user: "Is this your account?"];
    E -- No, I'm new --> F[Path A: New User (Recycled Number)];
    E -- Yes, this is me --> G[Path B: Original Owner (Re-authentication)];

    subgraph "Path A: New User"
        F --> F1[Initiate 24hr security hold];
        F1 --> F2[Notify original owner via email/SMS];
        F2 --> F3[Archive original account data];
        F3 --> F4[Notify new user after 24hrs];
        F4 --> F5[New user completes onboarding];
    end

    subgraph "Path B: Original Owner"
        G --> G1(Redirect to Account Recovery Flow);
    end
```

_Note: Path B redirects to the dedicated [Account Recovery](./22_account_recovery_new_device.md) flow._

---

### Flow Steps

The flow begins after the user enters their phone number on the initial OTP request screen.

#### 1. Account Existence Check

- **System Action:** This deviates from the "Golden Path" when the `auth.sendOtp` mutation in the backend discovers an existing `users` document with the provided `phone_number`.
- **Backend (Convex):**
  1.  Instead of immediately sending an OTP, the backend first checks the `last_active_at` timestamp and `deviceHistory` of the existing account.
  2.  If the account has been inactive for a long period (e.g., > 90 days) or the sign-in attempt comes from a device with an unrecognized fingerprint, the system flags it as a high probability for being a recycled number.
  3.  The backend returns a specific response to the client, e.g., `{ accountExists: true }`.

#### 2. User Intent Clarification

- **User Action:** The user is presented with a screen asking them to clarify their identity.
- **User Experience (UI/UX):**
  - The screen displays a message like: "This phone number is already linked to a Momento account. Are you trying to access your existing account or are you a new user?"
  - Two clear buttons are shown: **"Yes, that's my account"** and **"No, I'm a new user"**.

---

### Path A: New User (Recycled Number)

The user has selected **"No, I'm a new user"**.

#### A1. Security Hold & Notification

- **User Action:** Acknowledges the security hold information.
- **User Experience (UI/UX):**
  - The app explains that a 24-hour security waiting period is being initiated to protect the previous owner's privacy.
  - The message is reassuring: "To ensure a smooth transition, we'll notify you via SMS in 24 hours when your new account is ready to be created. Thank you for your patience."
- **Backend & Services:**
  - **Client -> Backend:** The client calls a mutation like `auth.initiateAccountRecycling({ phoneNumber })`.
  - **Backend (Convex):**
    1.  Logs the recycling request with a 24-hour expiry.
    2.  Triggers an `httpAction` to send a notification to the original account owner via their registered email (if available) using Postmark. The message is critical: "A sign-in attempt was made on your Momento account with a new device, and the user claims to be new. If this was not you, your account's phone number will be unlinked in 24 hours for security. Please contact support if you believe this is an error."
    3.  A scheduled function is created to run in 24 hours.

#### A2. Account Archival & New User Go-Ahead

- **System Action:** The 24-hour scheduled function executes.
- **Backend & Services:**
  1.  The function finds the original `users` document.
  2.  It archives the account by setting its `status` to `'archived_for_recycling'` and, most importantly, **sets the `phone_number` field to `null`**, effectively unlinking it.
  3.  It then calls Twilio to send an SMS to the phone number, notifying the new user that they can now proceed with onboarding. "Welcome to Momento! You can now complete your sign-up."
- **User Action:** The new user re-opens the app.
- **User Experience (UI/UX):** When the user enters their phone number again, the system no longer finds an associated account and they proceed with the standard "Golden Path" onboarding.

---

### Path B: Original Owner (Redirection)

The user has selected **"Yes, that's my account"**.

- **System Action:** The application redirects the user to the dedicated **Account Recovery** flow.
- **Rationale:** This keeps the concerns separate. This flow's primary job is to correctly identify the user's intent. The job of verifying an existing user on a new device belongs to the `Account Recovery` flow.
- **User Experience (UI/UX):** The user is seamlessly transitioned to the start of the account recovery process. See `_docs/USER_FLOWS/22_account_recovery_new_device.md` for the next steps.
