## 3. Host Onboarding (for Venues & Organizations)

This flow describes the journey for a business or organization to create a `Community Host` account, which is focused exclusively on creating and managing events.

- **Role:** `Community Host`
- **Goal:** To create a host-only account, set up a public business profile, and be ready to create a first event.

**Actors:**

- **Host User:** The person representing the business/organization.
- **Momento App (Client):** The React Native/Expo application.
- **Momento Backend (Convex):** The Convex server handling logic.
- **Stripe:** Used for identity verification of the business's primary contact.
- **Postmark:** Used for sending any email-based verifications or communications.

---

### Flow Steps

#### 1. Entry Point & Role Selection

- **User Action:** Opens the app for the first time and is presented with the main `AuthScreen`. Instead of the standard "Sign Up," they select a smaller, distinct call-to-action like "For Businesses" or "Become a Host."
- **User Experience (UI/UX):**
  - This choice immediately funnels the user into a dedicated onboarding track, making it clear this is a different path from the participant sign-up.
  - The subsequent screens will have a more professional, business-oriented tone.

#### 2. Account Creation (Community Host)

- **User Action:** Enters a business phone number and a primary contact email address.
- **User Experience (UI/UX):**
  - The screen explains that the phone number will be used for account authentication (via OTP) and the email will be used for important communications and account recovery.
- **Backend & Services:**
  - **Client -> Backend:** The client calls `auth.sendHostOtp({ phoneNumber, email })`.
  - **Backend (Convex):**
    1.  The backend verifies that neither the phone number nor the email is associated with an existing account.
    2.  It proceeds with the standard OTP flow via Twilio to the provided phone number.
  - **User Action:** User enters the OTP to verify their phone number.
  - **Backend (Convex):** Upon successful OTP verification, a new `users` document is created.
    - The `phone_number` and `email` fields are populated.
    - An empty `hostProfile` object is created `{ host_type: 'community' }`.
    - Crucially, **no `socialProfile` object is created**. This is the key differentiator that defines this user as a Host-Only User.
    - The user `status` is set to `'verification_pending'`.

#### 3. Identity Verification

- **User Action:** The user is prompted to verify their identity.
- **User Experience (UI/UX):**
  - The app clearly explains that for the safety of the community, the primary contact for any business host must be verified.
  - The UI initiates the Stripe Identity native SDK flow, which handles the document capture and verification process seamlessly within the app.
- **Backend & Services:**
  - **Client -> Backend:** The client requests a `VerificationSession` client secret from the backend.
  - **Backend (Convex):** The backend uses the Stripe Node.js SDK to create a `VerificationSession` and returns the secret to the client.
  - **Client -> Stripe:** The client uses the secret to initialize the Stripe Identity flow.
  - **Stripe -> Backend:** Stripe sends webhook events to a registered Convex `httpAction` to update the backend on the status of the verification (`verification_session.processing`, `verification_session.verified`, etc.).
  - **Backend (Convex):** Upon receiving a `verified` webhook, the backend updates the user's `is_verified` flag to `true`.

#### 4. Host Profile Setup

- **User Action:** After successful verification, the user sets up their public host profile.
- **User Experience (UI/UX):**
  - A clean, form-based screen (`HostProfileSetupScreen`) prompts for:
    - `host_name` (Business Name)
    - `host_bio` (Business Description)
    - Primary business location (using a map interface to pin a location or search Google Places, which populates the `locations` collection and links the ID here).
    - Public-facing website or social media links.
  - The user is also prompted to upload brand photos (logo, venue pictures) which are stored in Convex File Storage.
- **Backend & Services:**
  - **Client -> Backend:** The client calls `users.updateHostProfile({ ... })` with all the collected data.
  * **Backend (Convex):** The mutation finds the user and populates their embedded `hostProfile` object with the provided details.

#### 5. Landing in Host Mode

- **User Action:** The user completes the profile setup.
- **User Experience (UI/UX):**
  - The user is transitioned to the main app interface, which is rendered exclusively in "Host Mode."
  - The UI is a streamlined professional dashboard (`HostDashboardScreen`). Tabs and features for participants (`MemoryBookTab`, `DiscoveryFeedScreen`, etc.) are completely absent, preventing any confusion.
  - A welcome message or a wizard might appear, guiding the user to create their first event.
- **Backend & Services:**
  - **Client:** When the client fetches the user object after login, it detects the presence of `hostProfile` and the absence of `socialProfile`. This client-side logic is responsible for mounting the "Host Mode" navigator and UI.
  - **Backend (Convex):** The `users.completeOnboarding()` mutation is called, switching the user's `status` from `'verification_pending'` to `'active'`.
