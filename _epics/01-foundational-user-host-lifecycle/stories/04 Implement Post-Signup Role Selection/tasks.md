# Tasks for Post-Signup Role Selection

## Relevant Files

- `app/(onboarding)/role-selection.tsx` - The new screen for the user to choose their initial role.
- `app/_layout.tsx` - To update the root navigation logic to direct new users to the role selection screen.
- `app/(onboarding)/_layout.tsx` - To register the new role selection screen in the onboarding navigation stack.

### Notes

- This feature is entirely client-side; no backend changes are needed.
- Testing requires simulating a fresh user sign-up. It's recommended to delete any existing test user in the Clerk dashboard before testing the flow.

## Tasks

- [ ] 1.0 Create the Role Selection Screen

  - [ ] 1.1 Create a new file at `app/(onboarding)/role-selection.tsx`.
  - [ ] 1.2 Import `React`, `View`, `Text`, `Button`, `StyleSheet` from React Native, and `useRouter` from `expo-router`.
  - [ ] 1.3 Lay out the component with a title, such as "How would you like to start?".
  - [ ] 1.4 Add a button styled for the "Attend Events" option.
  - [ ] 1.5 Add a second button for the "Host Events" option. This button should be styled to look disabled or clearly indicate it's a placeholder.
  - [ ] 1.6 Initialize the router using `const router = useRouter();`.
  - [ ] 1.7 Implement the `onPress` handler for the "Attend Events" button to call `router.push('/(onboarding)/profile-setup')`.
  - [ ] 1.8 Ensure the "Host Events" button is not pressable or triggers an alert stating it's "Coming Soon."

- [ ] 2.0 Update the Onboarding Navigator

  - [ ] 2.1 Open the file `app/(onboarding)/_layout.tsx`.
  - [ ] 2.2 Inside the `<Stack>` component, add a new screen definition: `<Stack.Screen name="role-selection" options={{ headerShown: false }} />`.
  - [ ] 2.3 Ensure it is placed alongside the other screen definitions for `profile-setup` and `initial-photo`.

- [ ] 3.0 Update the Root Navigation Logic

  - [ ] 3.1 Open the root layout file `app/_layout.tsx`.
  - [ ] 3.2 Locate the `InitialLayout` component and the `useEffect` hook within it.
  - [ ] 3.3 Find the condition `if (userData.status === UserStatuses.PENDING_ONBOARDING)`.
  - [ ] 3.4 Modify the logic inside this block. It should now check `if (!inOnboardingGroup)` and then unconditionally navigate the user to the new screen using `router.replace("/(onboarding)/role-selection")`.
  - [ ] 3.5 Remove the previous, more complex logic that checked for `userData.first_name` to decide between `profile-setup` and `initial-photo`.

- [ ] 4.0 Test the Full Onboarding Flow
  - [ ] 4.1 Delete your test user from the Clerk developer dashboard to ensure a clean sign-up experience.
  - [ ] 4.2 Launch the application and complete the sign-up process.
  - [ ] 4.3 **Assert**: After sign-up, you are automatically navigated to the new role selection screen.
  - [ ] 4.4 **Assert**: Tapping the "Attend Events" button successfully navigates you to the profile setup screen.
  - [ ] 4.5 **Assert**: The "Host Events" button is visually distinct and non-functional (or displays a placeholder message).
