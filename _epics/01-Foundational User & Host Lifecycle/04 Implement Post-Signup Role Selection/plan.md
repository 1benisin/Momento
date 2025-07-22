### 1. High-Level Summary

This plan outlines the implementation of the `RoleSelectionScreen`, a new, mandatory step in the user onboarding flow. Immediately after a user signs up, they will be directed to this screen to choose their initial path: "attending events" or "hosting events." This story focuses on creating the screen, updating the application's navigation logic to enforce this step, and linking the "attend" path to the existing social profile creation flow. The "host" path will be a placeholder, to be implemented in a future story.

### 2. Current Relevant Directory Structure

```
app/
├── _layout.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (onboarding)/
│   ├── _layout.tsx
│   ├── initial-photo.tsx
│   └── profile-setup.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── account.tsx
│   ├── events.tsx
│   ├── index.tsx
│   ├── memory-book.tsx
│   ├── settings.tsx
│   └── social-profile.tsx
├── +html.tsx
├── +not-found.tsx
└── modal.tsx

components/
├── __tests__/
│   └── StyledText-test.js
├── ContactMethodManager.tsx
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
└── UserInfo.tsx

convex/
├── _generated/
├── tests/
├── auth.config.ts
├── files.ts
├── http.ts
├── schema.ts
├── tsconfig.json
└── user.ts
```

### 3. Data Model Changes (`convex/schema.ts`)

There are **no changes** to the Convex data model for this story.

### 4. Backend Implementation (`convex/`)

There are **no changes** to the Convex backend implementation for this story. All work is on the client-side.

### 5. Frontend Implementation (`app/`, `components/`)

- **Files to Create**:
  - `app/(onboarding)/role-selection.tsx`: This new screen will present the two role choices to the user. It will be a simple component with two buttons or tappable cards.

- **Files to Modify**:
  - `app/_layout.tsx`: The core navigation logic in the `InitialLayout` component will be updated. The `useEffect` hook that handles routing for newly signed-in users will be changed to redirect users with a `PENDING_ONBOARDING` status to the new `role-selection.tsx` screen instead of the `profile-setup.tsx` screen.
  - `app/(onboarding)/_layout.tsx`: This layout file will be updated to include the new `role-selection` screen in its navigation stack, ensuring it's a valid route within the onboarding group.

### 6. Step-by-Step Task Breakdown

1.  **Create `role-selection.tsx` Screen**:
    - Create the file `app/(onboarding)/role-selection.tsx`.
    - Build the UI with two distinct, tappable options: "Attend Events" and "Host Events".
    - Implement the `onPress` handler for the "Attend Events" option to navigate the user to `/(onboarding)/profile-setup`.
    - The "Host Events" option can be a placeholder for now (e.g., disabled or shows an alert).

2.  **Update Onboarding Navigator**:
    - In `app/(onboarding)/_layout.tsx`, add `<Stack.Screen name="role-selection" />` to register the new route within the onboarding `Stack`.

3.  **Update Root Navigation Logic**:
    - In `app/_layout.tsx`, locate the `InitialLayout` component's `useEffect` hook.
    - Modify the conditional logic: if `userData.status === UserStatuses.PENDING_ONBOARDING`, the router should replace the current route with `/(onboarding)/role-selection`.
    - Ensure this logic correctly executes for all new users, overriding the previous direct navigation to `profile-setup` or `initial-photo`.

4.  **Test the End-to-End Flow**:
    - Delete any existing test user from your Clerk development instance to simulate a fresh sign-up.
    - Sign up with a new email or phone number.
    - **Verify**: After successful sign-up, you are automatically redirected to the `RoleSelectionScreen`.
    - **Verify**: Tapping "Attend Events" navigates you to the `ProfileSetupScreen`.
    - **Verify**: The back button is not present or does not allow you to return to the auth flow.

### 7. Open Questions & Assumptions

- **Assumption**: A simple UI for the `RoleSelectionScreen` (e.g., two styled buttons) is sufficient for this story. No complex design is required at this stage.
- **Assumption**: The "Host Events" path is entirely out of scope for this story and its button can be a non-functional placeholder.
