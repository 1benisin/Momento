# Tasks for Hybrid User Mode-Switching

This task list breaks down the implementation of the Hybrid User Mode-Switching feature. It is based on the technical plan and is designed to guide a developer through the necessary backend and frontend changes.

## Relevant Files

- `convex/user.ts` - For adding the backend logic to manage user roles.
- `components/ModeSwitcher.tsx` - The new UI component for toggling between roles.
- `app/(tabs)/_layout.tsx` - To implement the dynamic navigation logic that shows the correct UI for the user's active role.
- `app/(tabs)/settings.tsx` - To integrate the `ModeSwitcher` component for Hybrid Users.
- `app/(tabs)/(social)/social-profile.tsx` - To add the "Become a Host" CTA.
- `app/(tabs)/(host)/dashboard.tsx` - To add the "Join Events Socially" CTA.

### Notes

- Remember to handle loading and error states gracefully in the UI, especially when fetching data or calling mutations.
- Use `npx convex dev` to run your local Convex backend and see changes in real-time.

## Tasks

- [ ] **1.0 Implement Backend Mutations**

  - [ ] 1.1 In `convex/user.ts`, create a new mutation named `setActiveRole`.
    - [ ] It should accept one argument: `role: v.union(v.literal("social"), v.literal("host"))`.
    - [ ] Inside the mutation, get the current user's identity.
    - [ ] Update the user's document, setting the `active_role` field to the provided `role`.
  - [ ] 1.2 In `convex/user.ts`, create a new mutation named `createHostProfile`.
    - [ ] This will be used for the "add-a-role" flow. It should accept `hostProfile` data as an argument.
    - [ ] Get the current user's identity.
    - [ ] Update the user's document by adding the `hostProfile` object.
    - [ ] As part of the same update, set `active_role` to `'host'` to ensure the user is switched to the new context upon completion.

- [ ] **2.0 Create the ModeSwitcher Component**

  - [ ] 2.1 Create a new file at `components/ModeSwitcher.tsx`.
  - [ ] 2.2 Build a segmented control with two options: "Social" and "Host".
  - [ ] 2.3 The component should accept `currentRole` and `onRoleChange` as props.
  - [ ] 2.4 Use the `currentRole` prop to highlight the currently active segment.
  - [ ] 2.5 When a new segment is tapped, call the `onRoleChange` function with the corresponding role (`'social'` or `'host'`).

- [ ] **3.0 Integrate ModeSwitcher into Settings Screen**

  - [ ] 3.1 Open `app/(tabs)/settings.tsx`.
  - [ ] 3.2 Use the `useQuery` hook to fetch the current user's data.
  - [ ] 3.3 Conditionally render the `<ModeSwitcher />` component only if `user.socialProfile` and `user.hostProfile` both exist.
  - [ ] 3.4 Pass the user's `active_role` to the `currentRole` prop.
  - [ ] 3.5 Create a handler function for the `onRoleChange` prop that calls the `setActiveRole` mutation using the `useMutation` hook.

- [ ] **4.0 Implement Core Role-Based Navigation**

  - [ ] 4.1 Open `app/(tabs)/_layout.tsx`.
  - [ ] 4.2 Fetch the current user data using `useQuery`. Make sure to include `active_role`, `socialProfile`, and `hostProfile`.
  - [ ] 4.3 Implement a loading state (e.g., return `<ActivityIndicator />`) while the user data is loading to prevent UI flashing.
  - [ ] 4.4 Determine the user's effective role:
    - If they are a Hybrid User, use `user.active_role`.
    - If they have only a `socialProfile`, the role is `'social'`.
    - If they have only a `hostProfile`, the role is `'host'`.
  - [ ] 4.5 Use the effective role to conditionally render the `<Tabs.Screen>` components.
    - **If role is 'social'**: Render screens for Discover, Events, Memory Book, and Social Profile.
    - **If role is 'host'**: Render screens for Dashboard, Events, Inbox, and Host Profile.
    - **Gotcha**: Ensure the `(social)/events` and `(host)/events` tabs point to the correct files within their respective route groups.

- [ ] **5.0 Implement "Add-a-Role" CTAs**

  - [ ] 5.1 In `app/(tabs)/(social)/social-profile.tsx`:
    - [ ] Fetch the current user's data.
    - [ ] If `!user.hostProfile`, render a "Become a Host" button.
    - [ ] On press, navigate the user to the host onboarding flow (e.g., `/onboarding/host/host-profile-setup`).
  - [ ] 5.2 In `app/(tabs)/(host)/dashboard.tsx`:
    - [ ] Fetch the current user's data.
    - [ ] If `!user.socialProfile`, render a "Join Events Socially" button.
    - [ ] On press, navigate the user to the social onboarding flow (e.g., `/onboarding/social/profile-setup`).

- [ ] **6.0 Final Testing**
  - [ ] 6.1 Test the participant-to-host flow: sign up as a participant, use the CTA to become a host, and verify the `ModeSwitcher` appears and functions correctly.
  - [ ] 6.2 Test the host-to-participant flow: sign up as a host, use the CTA to add a social profile, and verify the `ModeSwitcher` appears and functions.
  - [ ] 6.3 Test that the app persists the selected role between sessions.
  - [ ] 6.4 Test that single-role users do _not_ see the `ModeSwitcher` and have the correct, static tab bar.
