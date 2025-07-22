- **Story 05: Build Host Onboarding Flow**
  - **Goal**: Build the sequence of screens for the new host track, including host profile creation (`HostProfileSetupScreen`) and a prompt to begin identity verification.

### From `_docs/FEATURES.md`

#### The Intent-Driven Onboarding Flow

Momento's onboarding is designed to be **intent-driven**. Immediately after creating a core account, a new user is asked to choose their primary goal, which directs them to a tailored onboarding path. This ensures every user, whether a participant or a host, has a logical and streamlined first experience.

- **The Entry Point:** The journey begins at a single `SignUpScreen` where a user can create an account with either a phone number or an email/password.
- **The Fork in the Road:** Upon successful account creation, the user is navigated to a `RoleSelectionScreen` where they choose their initial path: "I want to attend events" or "I want to host events."
- **Participant Onboarding:** If the user selects "attend," they are guided through the standard participant flow: creating their `socialProfile`, taking an `AuthenticPhoto`, and completing the "Discovering Your Interests" experience.
- **Host Onboarding:** If the user selects "host," they are guided through the host setup flow, which includes creating a `hostProfile` and being prompted to start the identity verification process. This path is designed for both `User Hosts` (individuals) and `Community Hosts` (businesses).

#### Adding a Role Later (The Hybrid User)

The system is designed for flexibility, allowing single-role users to add a second role later.

- **Participant Becomes Host:** A user with only a `socialProfile` will see a "Become a Host" CTA on their `ProfileTab`. Tapping this initiates the `UserHostOnboardingFlow`, guiding them to create their `hostProfile`.
- **Host Becomes Participant:** A user with only a `hostProfile` will see a "Join Events Socially" CTA on their `ProfileTab`. Tapping this initiates the `ParticipantOnboardingFlow`.

Upon completing the second onboarding flow, the user becomes a `Hybrid User`, and the `ModeSwitcher` component appears on their `ProfileTab`, granting them access to both UI contexts.

#### Publishing Events: The Verification Gate

To ensure the safety and trust of the community, all hosts must be verified before they can make an event public.

- **The Rule:** A host cannot change an event's status from `'draft'` to `'published'` unless their `users.is_verified` status is `true`.
- **The Process:** The verification is handled via **Stripe Identity**. Both `User Hosts` and `Community Hosts` will be prompted by a persistent `VerificationPromptBanner` in their hosting dashboard to complete this step.
- **The Implementation:** This rule is enforced on the backend through a validation check in the "publish event" mutation. The UI will also reflect this by disabling the "Publish" button on the `ManageEventScreen` for unverified hosts, with a tooltip explaining the requirement.

#### Host Tools & Controls

- **Host Profile:** All hosts have a dedicated public profile with their name, bio, and average rating from past events.

### From `_docs/DATA_MODELS.md`

#### Embedded `hostProfile` Object

| Field Name                 | Type                                                                                                                           | Description                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `host_type`                | `v.string()`                                                                                                                   | 'user' or 'community'.                                                                                   |
| `host_name`                | `v.string()`                                                                                                                   | Public name of the host.                                                                                 |
| `host_bio`                 | `v.string()`                                                                                                                   | Biography specific to hosting activities.                                                                |
| `location_id`              | `v.optional(v.id("locations"))`                                                                                                | The primary, physical location of a `community` host.                                                    |
| `address`                  | `v.optional(v.string())`                                                                                                       | The physical street address for a `community` host. Required for verification.                           |
| `website_url`              | `v.optional(v.string())`                                                                                                       | The official website for a `community` host, used for verification.                                      |
| `average_rating`           | `v.optional(v.number())`                                                                                                       | Calculated average from all event/host ratings.                                                          |
| `photos`                   | `v.optional(v.array(v.object({ ... })))`                                                                                       | An embedded array of host brand/venue photos.                                                            |
| `reliabilityLog`           | `v.optional(v.array(v.object({ eventId: v.id("events"), actionType: v.string(), timestamp: v.number(), metadata: v.any() })))` | An array of log entries that tracks host reliability signals for internal review and automated flagging. |
| `push_account_and_safety`  | `v.boolean()`                                                                                                                  | Push notifications for payments, reports, etc.                                                           |
| `email_account_and_safety` | `v.boolean()`                                                                                                                  | For critical account alerts (e.g., phone number changes).                                                |

### From `_docs/USER_FLOWS/01_new_user_onboarding.md`

#### Phase 3B: Host Onboarding Branch

This flow is for users who want to create and manage events.

4.  **`HostProfileSetupScreen`**: The user is prompted to create their public-facing `hostProfile`.
    - **UI**: The form may differ slightly based on an initial question (e.g., "Are you hosting for a business?").
    - **Inputs**: `host_name`, `host_bio`, and potentially `website_url` for businesses.
    - `->` User completes the form and proceeds.

5.  **`VerificationPromptScreen`**: The user is informed about the mandatory identity verification step.
    - **UI**: Explains that verification via Stripe Identity is required to publish an event.
    - **Actions**:
      - **"Verify Now"**: Launches the verification flow immediately.
      - **"Do this Later"**: Allows the user to skip for now and enter the app. A persistent banner will remind them to get verified.
    - `->` User makes a selection.

6.  **Onboarding Complete**: The user is navigated to the main app, landing on the **`DashboardTab`** in **Host Mode**.

### From `_docs/USER_FLOWS/15_host_onboarding.md`

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

### From `_docs/SCREENS_AND_COMPONENTS.md`

#### 2. Host Onboarding Flow

This section describes the various paths for a user to create a `hostProfile`.

- **Primary Host Onboarding Flow**: This is the path for a new user who selects "I want to host events" on the `RoleSelectionScreen`.
  - **`HostTypeSelectionScreen`**: (Optional but recommended) A screen that asks if they are hosting as an "Individual" or for a "Business/Organization". This helps tailor the next step.
  - **`HostProfileSetupScreen`**: A form for entering host details. For `Community Hosts`, this will include fields like business address and website. For `User Hosts`, it's simpler, focusing on their host name and bio.
  - **`HostOnboardingCompleteScreen`**: A final screen congratulating the user, directing them to Host Mode, and providing a strong CTA to begin identity verification.

- **Secondary "Add-a-Role" Flow (Participant to Host)**:
  - **`UserHostOnboardingFlow`**: This is the original flow, now used for an existing participant who decides to become a host. It is launched from a CTA on their `ProfileTab`.
  1.  **`HostBenefitsScreen`**: Showcases the value proposition of hosting.
  2.  **`HostProfileCreationScreen`**: A simple form to confirm their `host_name` (pre-populated) and add a `host_bio`. Sets `host_type` to `'user'`.
  3.  **`HostOnboardingCompleteScreen`**: A final screen congratulating the user, directing them to the new `ModeSwitcher`, and providing a strong CTA to begin identity verification.

#### 11. Indicators & Badges

- **`VerificationPromptBanner`**: A persistent banner displayed at the top of the `HostDashboardScreen` and `ManageEventScreen` for unverified hosts. It contains a message like "Verify your identity to publish your first event" and a "Get Verified" button that launches the Stripe Identity verification flow.
