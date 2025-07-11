# Tasks for Story 05: Build Host Onboarding Flow

## Relevant Files

- `convex/user.ts`: To add the new backend mutation for creating a host profile.
- `app/(onboarding)/role-selection.tsx`: To update the navigation path for new hosts.
- `app/(onboarding)/host/host-profile-setup.tsx`: The new screen for the user to create their host profile.
- `app/(onboarding)/host/verification-prompt.tsx`: The new screen to prompt the user for identity verification.
- `components/VerificationPromptBanner.tsx`: A new reusable component for unverified hosts (to be used in a later story).

### Notes

- Tasks related to creating new directories and files can be done using the file explorer in your IDE.
- Run `npx convex dev` in a terminal to have the backend running and to apply any database schema or function changes as you save them.

## Tasks

- [ ] 1.0 Implement Backend Logic

  - [ ] 1.1 Open `convex/user.ts`.
  - [ ] 1.2 Import `mutation` from `'./_generated/server'`.
  - [ ] 1.3 Create a new exported `mutation` named `createHostProfile`.
  - [ ] 1.4 Define its arguments using `args`: `{ host_name: v.string(), host_bio: v.string() }`.
  - [ ] 1.5 Inside the mutation, use `ctx.auth.getUserIdentity()` to get the current user's Clerk ID.
  - [ ] 1.6 Query the `users` table using the `by_clerkId` index to find the user's document.
  - [ ] 1.7 If the user is found, use `ctx.db.patch(user._id, { ... })` to update their document.
  - [ ] 1.8 In the patched data, set `active_role: 'host'`.
  - [ ] 1.9 In the patched data, set the `hostProfile` object with `{ host_name, host_bio, host_type: 'user' }`.
  - [ ] 1.10 Add a comment above the `host_type` line: `// TODO: Allow for 'community' host_type creation`.

- [ ] 2.0 Set Up Frontend Directory Structure

  - [ ] 2.1 In the `app/(onboarding)/` directory, create a new subdirectory named `host`.

- [ ] 3.0 Build the Host Profile Setup Screen

  - [ ] 3.1 Create a new file: `app/(onboarding)/host/host-profile-setup.tsx`.
  - [ ] 3.2 Add the basic React Native and Expo Router boilerplate for a new screen component.
  - [ ] 3.3 Add `useState` hooks for `hostName` and `hostBio` to hold the form input.
  - [ ] 3.4 Add a `Themed.Text` component for the screen title, e.g., "Create Your Host Profile".
  - [ ] 3.5 Add a styled `TextInput` for `hostName`.
  - [ ] 3.6 Add a styled, multiline `TextInput` for `hostBio`.
  - [ ] 3.7 Add a "Continue" `Button` component, which will be wired up in the next step.

- [ ] 4.0 Connect Profile Setup to Backend

  - [ ] 4.1 In `host-profile-setup.tsx`, import `useMutation` from `"convex/react"` and the generated `api` from `"../../../convex/_generated/api"`.
  - [ ] 4.2 Initialize the mutation: `const createHostProfile = useMutation(api.user.createHostProfile);`.
  - [ ] 4.3 Create an `async` handler function for the "Continue" button's `onPress` event.
  - [ ] 4.4 Inside the handler, call `await createHostProfile({ host_name: hostName, host_bio: hostBio });`.
  - [ ] 4.5 Add basic loading and error handling around the mutation call.

- [ ] 5.0 Build the Verification Prompt Screen

  - [ ] 5.1 Create a new file: `app/(onboarding)/host/verification-prompt.tsx`.
  - [ ] 5.2 Add the basic boilerplate for a screen component.
  - [ ] 5.3 Add `Themed.Text` to explain that verification is required to publish events.
  - [ ] 5.4 Add a primary "Verify Now" button.
  - [ ] 5.5 Add a secondary "Do This Later" button.

- [ ] 6.0 Implement Onboarding Navigation

  - [ ] 6.1 Open `app/(onboarding)/role-selection.tsx`.
  - [ ] 6.2 In the `onPress` handler for the "Host Events" option, use `router.push` to navigate to `'(onboarding)/host/host-profile-setup'`.
  - [ ] 6.3 In `host-profile-setup.tsx`, after the `createHostProfile` mutation succeeds, use the router to navigate to `'(onboarding)/host/verification-prompt'`.
  - [ ] 6.4 In `verification-prompt.tsx`, add `onPress` handlers to both the "Verify Now" and "Do This Later" buttons that navigate the user to the main app layout, e.g., `router.push('/(tabs)/')`.
  - [ ] 6.5 **Note**: Before the final navigation in step 6.4, ensure client-side user state is synchronized. Awaiting the mutation is a good first step, but a manual refetch of the user query may be needed to guarantee the `(tabs)` layout renders in Host Mode correctly.

- [ ] 7.0 Create the Reusable Verification Banner
  - [ ] 7.1 Create a new file: `components/VerificationPromptBanner.tsx`.
  - [ ] 7.2 Build a simple component that renders a `View` containing `
