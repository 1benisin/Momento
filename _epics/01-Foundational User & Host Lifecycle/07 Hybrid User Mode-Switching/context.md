- **Story 07: Hybrid User Mode-Switching**
  - **Goal**: Implement a UI control and the corresponding backend logic for users who have both social and host roles to switch between the two contexts. This also includes the "add-a-role" flows for existing users.

### 1. Feature Overview

This story introduces the concept of **"Hybrid Users"**—users who have both a `socialProfile` and a `hostProfile`. The core task is to build the UI and backend logic that allows these users to seamlessly switch between two distinct application contexts: **"Social Mode"** and **"Host Mode"**. This prevents UI clutter and provides a focused experience tailored to the user's current goal.

The feature is comprised of two main parts:

1.  **The "Add-a-Role" Flow**: The process by which a user with a single role (e.g., a Participant) can add the second role (Host) and become a Hybrid User.
2.  **The "Mode Switcher"**: The UI control that enables a Hybrid User to toggle between the two modes.

### 2. Key Concepts & Terminology

- **Social-Only User**: A user with only a `socialProfile`. They only see the participant-focused UI.
- **Host-Only User**: A user with only a `hostProfile`. They only see the host-focused UI (e.g., a business).
- **Hybrid User**: A user with both a `socialProfile` and a `hostProfile`. They will have access to the `ModeSwitcher`.
- **Social Mode**: The app context for participants. The UI includes tabs like Discover, Events, and Memory Book.
- **Host Mode**: The app context for hosts. The UI is a dashboard with tabs like Dashboard, Events, and Inbox.

### 3. Data Model & Backend Logic

The entire feature hinges on the `users` collection in Convex.

- **Determining User Type**: The presence of the `socialProfile` and `hostProfile` embedded objects on a user document determines their type (Social-Only, Host-Only, or Hybrid).
- **Controlling the Active Mode**: The `active_role` field on the `users` document is the source of truth.
  - `active_role: v.string()` can be either `'social'` or `'host'`.
  - This field is only relevant for Hybrid Users.
  - When a user switches modes, a Convex mutation updates this value.
  - The client-side app listens to changes on this field to re-render the navigation.

### 4. User Flows

#### Flow 1: Participant Becomes a Host ("Add-a-Role")

1.  **Trigger**: An existing Participant finds a "Become a Host" CTA within their profile or settings.
2.  **Onboarding**: They are guided through a simplified host onboarding flow, creating a `hostProfile`.
3.  **Backend Update**: A Convex mutation adds the `hostProfile` object to their user document. They are now a Hybrid User.
4.  **UI Introduction**: Upon completion, the app shows a confirmation screen that introduces the new "Host Mode" and points them to the `ModeSwitcher` component.
5.  **Default State**: The user is typically switched into "Host Mode" automatically to see their new dashboard (`active_role` is set to `'host'`).

#### Flow 2: Switching Modes

1.  **Location**: The `ModeSwitcher` control is located within the main `SettingsScreen`.
2.  **Action**: The Hybrid User toggles the control from "Social" to "Host".
3.  **Backend Action**: The client calls a Convex mutation (e.g., `users.setActiveRole({ role: 'host' })`) to update the `active_role` field in the database.
4.  **UI Reaction**: The root tab navigator, which is subscribed to the user's data, detects the change in `active_role` and dynamically re-renders the entire tab bar to show the appropriate set of tabs for the selected mode.

### 5. Technical Implementation Details

- **Primary Component**: A new `ModeSwitcher.tsx` component needs to be created. This will likely be a custom segmented control.
- **State Management**: The global app state, specifically the navigation structure, will be driven by the real-time Convex query that fetches the current user's data (`useQuery(api.users.getCurrentUser)`).
- **Navigation**: The core logic will reside in `app/(tabs)/_layout.tsx`. This file will:
  - Fetch the current user's data.
  - Check for the presence of `socialProfile` and `hostProfile` to determine if the user is Hybrid.
  - Read the `active_role` field.
  - Use conditional logic to render the correct `<Tabs>` component with the appropriate set of `<Tabs.Screen>` children for either Social Mode or Host Mode.
- **Backend**:
  - A mutation in `convex/user.ts` is required to handle the `active_role` update.
  - The query to fetch the user's data must expose the necessary fields (`socialProfile`, `hostProfile`, `active_role`).
