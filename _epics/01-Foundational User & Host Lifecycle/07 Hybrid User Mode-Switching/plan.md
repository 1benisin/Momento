### 1. High-Level Summary

This plan outlines the implementation of the **Hybrid User Mode-Switching** feature. The goal is to allow users who have both a "Social" and a "Host" profile to seamlessly toggle between the two experiences. This will be achieved by creating a `ModeSwitcher` component that updates a user's `active_role` in the database via a Convex mutation. The application's root tab navigator will reactively render the correct UI based on this role. The plan also covers the "add-a-role" flow, enabling existing users to become Hybrid Users.

### 2. Current Relevant Directory Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (onboarding)/
│   ├── _layout.tsx
│   ├── (host)/
│   │   ├── host-profile-setup.tsx
│   │   └── verification-prompt.tsx
│   ├── (social)/
│   │   ├── initial-photo.tsx
│   │   └── profile-setup.tsx
│   └── role-selection.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── (host)/
│   │   └── dashboard.tsx
│   ├── (social)/
│   │   ├── discover.tsx
│   │   ├── events.tsx
│   │   ├── memory-book.tsx
│   │   └── social-profile.tsx
│   ├── account.tsx
│   └── settings.tsx
└── _layout.tsx
...
components/
├── ContactMethodManager.tsx
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
├── UserInfo.tsx
└── VerificationPromptBanner.tsx
...
convex/
├── _generated/
├── auth.config.ts
├── files.ts
├── http.ts
├── schema.ts
├── tests/
│   └── user.test.mts
├── tsconfig.json
└── user.ts
```

### 3. Data Model Changes (`convex/schema.ts`)

No changes are required. The necessary field, `active_role`, was added to the `users` table in a previous story, defined as:
`active_role: v.optional(v.union(v.literal("social"), v.literal("host")))`

### 4. Backend Implementation (`convex/`)

- **Files to Create**: None.
- **Files to Modify**: `convex/user.ts`
  - **Add `createHostProfile` mutation**: This mutation will handle the "add-a-role" flow for a participant becoming a host. It will take `hostProfile` data as input, add it to the current user's document, and set their `active_role` to `'host'` for the first time.
  - **Add `setActiveRole` mutation**: This mutation will accept a `role` (`'social'` or `'host'`) and update the `active_role` field for the currently authenticated user. This will be called by the `ModeSwitcher` component.

### 5. Frontend Implementation (`app/`, `components/`)

- **Files to Create**:
  - `components/ModeSwitcher.tsx`: A new reusable component, likely a segmented control, to allow Hybrid Users to toggle between "Social" and "Host" modes. It will display the current `active_role` and call the `setActiveRole` mutation on change.

- **Files to Modify**:
  - `app/(tabs)/_layout.tsx`: This file will contain the core navigation logic. It will fetch the current user's data and roles. Based on the `active_role` (for Hybrid Users) or their single role, it will conditionally render either the Social tab bar or the Host tab bar.
  - `app/(tabs)/settings.tsx`: This screen will be updated to conditionally render the new `ModeSwitcher` component at the top, but only for Hybrid Users (those with both `socialProfile` and `hostProfile`).
  - `app/(tabs)/(social)/social-profile.tsx`: A "Become a Host" Call-to-Action (CTA) will be added to this screen. It will only be visible if the user does _not_ already have a `hostProfile`. Tapping it will navigate the user to the host onboarding flow.
  - `app/(tabs)/(host)/dashboard.tsx`: A "Join Events Socially" CTA will be added here. It will only be visible if the user does _not_ already have a `socialProfile`. Tapping it will navigate the user to the social profile onboarding flow.

### 6. Step-by-Step Task Breakdown

1.  **Backend - Mutations**: In `convex/user.ts`, implement the `createHostProfile` and `setActiveRole` mutations.
2.  **Component - ModeSwitcher**: Create the `components/ModeSwitcher.tsx` component.
3.  **Settings Screen Integration**: Modify `app/(tabs)/settings.tsx` to render the `ModeSwitcher` for Hybrid Users.
4.  **Core Navigation Logic**: Update `app/(tabs)/_layout.tsx` to read the user's `active_role` and render the correct tab bar layout.
5.  **"Add-a-Role" CTA (Social to Host)**: Add the "Become a Host" CTA to the `app/(tabs)/(social)/social-profile.tsx` screen.
6.  **"Add-a-Role" CTA (Host to Social)**: Add the "Join Events Socially" CTA to the `app/(tabs)/(host)/dashboard.tsx` screen.
7.  **Testing**: Thoroughly test the "add-a-role" flows and the mode-switching functionality for a seamless user experience.

### 7. Open Questions & Assumptions

- **Assumption**: The host and social onboarding flows at `app/(onboarding)/...` are complete and can be navigated to from the new CTAs.
- **Assumption**: A query to get the current user's complete data, including both profiles (`socialProfile`, `hostProfile`), already exists in `convex/user.ts`.
- **Assumption**: The `ModeSwitcher` component should be placed in the `settings.tsx` screen as this seems to be the most consistent location described across the documentation.
