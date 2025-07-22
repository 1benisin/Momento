# Implementation Plan: Story 05 - Build Host Onboarding Flow

### 1. High-Level Summary

This plan outlines the implementation of the host onboarding flow. After a new user authenticates and selects the "Host Events" role on the `RoleSelectionScreen`, they will be guided through creating a basic host profile. This involves a new screen to collect host details, which are then saved to the backend. The flow concludes with a screen that prompts the user to begin identity verification (though the verification itself is part of a future story), before redirecting them to the main application in "Host Mode." The technical approach is to create new frontend screens within the existing `(onboarding)` route group and add a new mutation to Convex to update the user's record with their `hostProfile`.

### 2. Current Relevant Directory Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (onboarding)/
│   ├── _layout.tsx
│   ├── initial-photo.tsx
│   ├── profile-setup.tsx
│   └── role-selection.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── account.tsx
│   ├── events.tsx
│   ├── index.tsx
│   ├── memory-book.tsx
│   ├── settings.tsx
│   └── social-profile.tsx
└── ...

components/
├── ContactMethodManager.tsx
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
└── UserInfo.tsx

convex/
├── auth.config.ts
├── files.ts
├── http.ts
├── schema.ts
├── user.ts
└── ...
```

### 3. Data Model Changes (`convex/schema.ts`)

No changes are required for the data model. The `users` table already contains an optional `hostProfile: v.optional(v.object({ ... }))` field, which this story will populate.

### 4. Backend Implementation (`convex/`)

- **Files to Create**: None.
- **Files to Modify**: `convex/user.ts`
  - **New Mutation**: Add a new public (client-callable) `mutation` named `createHostProfile`.
    - **`createHostProfile({ host_name: string, host_bio: string })`**: This mutation will update the `users` document for the currently authenticated user. It will find the user by their `clerkId`, set the `hostProfile` object with the provided data (hardcoding `host_type: 'user'`), and set their `active_role` to `'host'`.

### 5. Frontend Implementation (`app/`, `components/`)

- **Directory/File Structure Changes**:

- Create a new directory: `app/(onboarding)/host/`. This will house the screens for the host onboarding flow, separating them from the participant onboarding flow.
- _(Recommended)_: To align with the PRD's proposed structure, create `app/(onboarding)/participant/` and move `initial-photo.tsx` and `profile-setup.tsx` into it. This would require updating the navigation logic in `role-selection.tsx` for the participant path.

- **Files to Create**:

- **Screens**:
  - `app/(onboarding)/host/host-profile-setup.tsx`: A new screen containing a form for users to create their host profile. It will capture the host's name and bio.
  - `app/(onboarding)/host/verification-prompt.tsx`: A screen that appears after profile setup. It will explain that identity verification is mandatory for publishing events and will provide two options: "Verify Now" and "Do This Later."
- **Components**:
  - `components/VerificationPromptBanner.tsx`: A reusable banner component that can be displayed on host-related screens (like the dashboard) for users who have not yet completed identity verification.

- **Files to Modify**:
  - `app/(onboarding)/role-selection.tsx`: Update the navigation logic so that selecting the "Host Events" option redirects the user to the new host onboarding flow, starting at `app/(onboarding)/host/host-profile-setup.tsx`.

### 6. Step-by-Step Task Breakdown

1.  **Backend**: Implement the `createHostProfile` mutation in `convex/user.ts`.
2.  **Project Structure**: Create the `app/(onboarding)/host/` directory.
3.  **Frontend Screen (Profile Setup)**: Build the `app/(onboarding)/host/host-profile-setup.tsx` screen. This includes creating the UI form fields for `host_name` and `host_bio`.
4.  **Connect Frontend to Backend**: Wire the form on the `host-profile-setup` screen to call the `createHostProfile` Convex mutation upon submission.
5.  **Frontend Screen (Verification Prompt)**: Build the `app/(onboarding)/host/verification-prompt.tsx` screen.
6.  **Navigation**:
    - Update `app/(onboarding)/role-selection.tsx` to navigate to `/host/host-profile-setup` when the host role is chosen.
    - Implement navigation from `host-profile-setup` to `verification-prompt` on successful profile creation.
    - Implement navigation from `verification-prompt` to the main application's host dashboard (e.g., `/dashboard`).
    - **Note**: Ensure that the client-side user state (from `useUser` or a Convex query) is refreshed _before_ the final navigation to the main app layout. This will guarantee the user lands in the correct "Host Mode" UI.
7.  **Component**: Create the `components/VerificationPromptBanner.tsx` component as described in the docs, to be used in a later story.

### 7. Open Questions & Assumptions

- **Assumption**: The plan focuses on creating a `User Host` profile (`host_type: 'user'`). The more complex `Community Host` profile is out of scope. A `// TODO` comment will be added to the backend code to note this simplification.
- **Assumption**: The `role-selection.tsx` screen is the correct and existing entry point for this flow, immediately following user sign-up.
- **Assumption**: For the purpose of this story, both "Verify Now" and "Do This Later" buttons on the `verification-prompt` screen will simply navigate to the main app. The actual integration of the Stripe Identity SDK will be handled in Story 06.
- **Question**: Should there be a `HostTypeSelectionScreen` before the `HostProfileSetupScreen` as suggested in `SCREENS_AND_COMPONENTS.md`, or a simple picker on the setup screen itself?
  - **Decision for this plan**: To simplify, we will default to creating a `'user'` host type and will not build a UI for selection in this story.
