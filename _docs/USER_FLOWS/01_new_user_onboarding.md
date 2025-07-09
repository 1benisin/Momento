# User Flow: New User Onboarding

This document outlines the step-by-step journey for a brand new user, from initial sign-up to landing in the core application. This flow is designed to be **intent-driven**, allowing the user to choose their primary goal upfront, which then directs them to a tailored onboarding experience.

- **[Phase 1: Universal Account Creation](#phase-1-universal-account-creation)**: The initial sign-up process, which is flexible and provider-agnostic.
- **[Phase 2: Intent-Driven Role Selection](#phase-2-intent-driven-role-selection)**: The critical fork in the road where the user defines their primary goal.
- **[Phase 3A: Participant Onboarding](#phase-3a-participant-onboarding-branch)**: The flow for users who want to attend events.
- **[Phase 3B: Host Onboarding](#phase-3b-host-onboarding-branch)**: The flow for users who want to create events.

---

## Phase 1: Universal Account Creation

The goal of this phase is to create a core Momento account with minimal friction, leveraging our authentication provider, Clerk.

1.  **`AuthScreen`**: The user is presented with options to "Sign Up" or "Log In."

    - `->` User taps **`Sign Up`**.

2.  **`SignUpScreen`**: The user can choose their preferred method for creating an account.
    - **Option A (Phone)**: User enters their phone number, receives an OTP via SMS, and enters it to verify.
    - **Option B (Email)**: User enters an email and creates a password.
    - `->` Upon successful verification, Clerk creates a new user record, and the user is now considered **authenticated**.

## Phase 2: Intent-Driven Role Selection

This is the most critical step in the new onboarding process. It ensures the user's first experience is tailored to their primary motivation for joining Momento.

3.  **`RoleSelectionScreen`**: Immediately after their first successful sign-up, the user is presented with a clear, simple choice.
    - **UI**: The screen presents two large, tappable cards:
      - **"I want to attend events"**: Describes the participant experience.
      - **"I want to host events"**: Describes the host experience.
    - `->` The user's selection determines which onboarding branch they will enter.

## Phase 3A: Participant Onboarding Branch

This flow is for users who want to find and attend events.

4.  **`ProfileSetupScreen`**: The user is prompted to create their public-facing `socialProfile`.

    - **Inputs**: `first_name`, `preferred_name` (optional), `bio` (optional).
    - `->` User completes the form and proceeds.

5.  **`InitialPhotoScreen`**: The user is prompted to add their first profile photo.

    - **UI**: The screen strongly encourages the user to take a new, in-app photo to receive the "Authentic" badge, but also allows them to upload from their library.
    - `->` User takes or uploads a photo.

6.  **`InterestDiscoveryScreen`**: The user is introduced to the "Discover Your Interests" feature.

    - **UI**: They are presented with the swipeable deck of "Possibility Cards" to build their initial `positive_interest_vector`.
    - `->` After a set number of swipes, the user can proceed.

7.  **Onboarding Complete**: The user is navigated to the main app, landing on the **`HomeTab`** in **Social Mode**.

## Phase 3B: Host Onboarding Branch

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
