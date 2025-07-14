- **Story 04: Implement Post-Signup Role Selection**
  - **Goal**: Create the `RoleSelectionScreen` to be shown after sign-up. Reroute the completed social profile flow to become one of the branches selectable from this screen.

### 1. User Story

As a new user who has just created an account, I want to be presented with a clear choice between "attending events" and "hosting events" so that I can be directed into the onboarding flow that matches my primary goal for using the app.

### 2. Acceptance Criteria

- **AC1:** After a new user successfully completes the sign-up flow (via phone or email), they MUST be redirected to the new `RoleSelectionScreen`.
- **AC2:** The `RoleSelectionScreen` MUST display two clear, distinct, and tappable options:
  - An option for "attending events" (the Participant flow).
  - An option for "hosting events" (the Host flow).
- **AC3:** Tapping the "attend events" option MUST navigate the user to the existing `profile-setup` screen (`/(onboarding)/profile-setup`).
- **AC4:** The "host events" option should be present but can be a placeholder for now. Its full implementation is part of Story 05.
- **AC5:** The routing logic in the root `_layout.tsx` must be updated to handle this new step in the onboarding flow for users with the `status` of `PENDING_ONBOARDING`.
- **AC6:** A new user cannot bypass this selection screen.

### 3. Technical Context & Implementation Plan

This story introduces a new route and updates the primary navigation logic.

- **File to Create:**

  - `app/(onboarding)/role-selection.tsx`: This will be the new screen component. It should be a simple presentational component with two buttons or cards that navigate to the respective onboarding flows.

- **Files to Modify:**

  - `app/_layout.tsx`: The `InitialLayout` component's `useEffect` hook needs to be modified.
    - **Current Logic:** If a user is `isSignedIn` and their `userData.status` is `PENDING_ONBOARDING`, they are immediately routed to `/(onboarding)/profile-setup` or `/(onboarding)/initial-photo`.
    - **New Logic:** If a user is `isSignedIn` and `userData.status` is `PENDING_ONBOARDING`, they must _always_ be routed to `/(onboarding)/role-selection` first. The concept of "completing" onboarding will now be handled within the respective onboarding flows (Participant or Host).
  - `app/(onboarding)/_layout.tsx`: The new `role-selection` screen must be added to the `Stack` navigator.
  - `app/(onboarding)/profile-setup.tsx`: No code changes are required for this file in this story, but its role has changed. It is no longer the first onboarding screen, but the first screen of the _Participant_ onboarding track.

- **Data Model:**
  - No changes are required to the `users` schema in `convex/schema.ts` for this story. The `active_role` and profile data will be set in subsequent stories.

### 4. Dependencies

- This story is dependent on the completion of:
  - **Story 01 (Phone Auth)**, **Story 02 (Social Profile)**, and **Story 03 (Email Auth)**, which provide the unified authentication flow that precedes this screen.

### 5. Out of Scope

- **Implementing the Host Onboarding Flow:** Creating the screens for host profile setup is not part of this story. That is covered in **Story 05**.
- **Mode Switching:** The UI for a "hybrid" user to switch between roles is a separate feature and is not included.
- **"Add a Role" Flow:** The flow for an existing participant to later become a host (or vice-versa) is also out of scope.
