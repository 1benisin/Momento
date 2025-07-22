# Tasks for Social Profile Creation

## Relevant Files

- `convex/schema.ts` - To update the `users` table with a `socialProfile` object and new status fields.
- `convex/files.ts` - To create a mutation for generating file upload URLs.
- `convex/user.ts` - To add mutations for creating a social profile and adding a profile photo.
- `convex/http.ts` - To update the Clerk webhook to handle the new user data structure.
- `components/ImageUploader.tsx` - A reusable component for uploading images from the library or camera.
- `app/(onboarding)/_layout.tsx` - A new layout to manage and protect the multi-step onboarding flow.
- `app/(onboarding)/profile-setup.tsx` - The new screen for users to enter their first name and bio.
- `app/(onboarding)/initial-photo.tsx` - The new screen for users to upload their first profile photo.
- `app/_layout.tsx` - The root layout, which will be modified to redirect new users to the onboarding flow.

### Notes

- This story requires installing new dependencies: `npx expo install expo-image-picker expo-camera`.
- Unit and integration tests are crucial, especially for the `ImageUploader` component and the redirection logic. Use `npx jest` to run tests.
- After making schema changes, remember to run `npx convex dev` to apply them to your backend environment.

## Tasks

- [x] 1.0 Backend Setup
  - [x] 1.1 In `convex/schema.ts`, modify the `users` table schema:
    - [x] 1.1.1 Add `phone_number: v.string()` and `status: v.string()`.
    - [x] 1.1.2 Add the `socialProfile` object as defined in `plan.md`, including `first_name`, `bio`, and `photos` array.
    - [x] 1.1.3 Remove the top-level `name` field, as it's replaced by `socialProfile.first_name`.
    - [x] 1.1.4 Run `npx convex dev` to push schema changes.
  - [x] 1.2 Create `convex/files.ts` and implement the `generateUploadUrl` mutation.
  - [x] 1.3 In `convex/user.ts`, update user management logic:
    - [x] 1.3.1 Add a `getCurrentUser` query that returns the document for the currently authenticated user.
    - [x] 1.3.2 Modify the `store` mutation to set a new user's `status` to `"pending_onboarding"`.
    - [x] 1.3.3 Implement the `createSocialProfile` mutation to accept `{ firstName: string, bio?: string }` and update the user document.
    - [x] 1.3.4 Implement the `addProfilePhoto` mutation to accept `{ storageId: string, isAuthentic: boolean }`.
    - [x] 1.3.5 Inside `addProfilePhoto`, ensure it generates a file URL, adds the photo to the `socialProfile.photos` array, sets `current_photo_url`, and **atomically** updates the user `status` to `'active'`. This is the final, critical step of onboarding.
  - [x] 1.4 In `convex/http.ts`, update the Clerk webhook to correctly pass data to the modified `store` user mutation.

- [x] 2.0 Frontend Component Development
  - [x] 2.1 Install required packages: `npx expo install expo-image-picker expo-camera`.
  - [x] 2.2 Create the `components/ImageUploader.tsx` component.
    - [x] 2.2.1 Implement UI to allow picking from the photo library or taking a new photo.
    - [x] 2.2.2 Implement permission handling for camera and photo library, linking to device settings if denied.
    - [x] 2.2.3 Encapsulate the Convex upload flow: call `generateUploadUrl`, upload the file, and return the `storageId` via an `onUploadSuccess` callback.
    - [x] 2.2.4 Implement clear UI states for loading (e.g., a spinner while uploading) and errors (e.g., a toast message on failure).

- [x] 3.0 Onboarding Screens Implementation
  - [x] 3.1 Create the `app/(onboarding)/` route group and its `_layout.tsx`.
    - [x] 3.1.1 The layout should manage the state of the onboarding flow to prevent users from navigating to steps out of order.
  - [x] 3.2 Build the `app/(onboarding)/profile-setup.tsx` screen.
    - [x] 3.2.1 Include text inputs for `first_name` and an optional `bio`.
    - [x] 3.2.2 Add a "Continue" button that calls the `createSocialProfile` mutation and navigates to `/initial-photo`. Ensure the button is disabled while the mutation is in flight.
  - [x] 3.3 Build the `app/(onboarding)/initial-photo.tsx` screen.
    - [x] 3.3.1 Integrate the `ImageUploader` component.
    - [x] 3.3.2 Add a checkbox/toggle for the user to indicate if the photo was "taken just now" to set the `is_authentic` flag.
    - [x] 3.3.3 On successful upload, call the `addProfilePhoto` mutation with the `storageId` and `is_authentic` flag.
    - [x] 3.3.4 After the `addProfilePhoto` mutation succeeds, navigate to the app root (`/`) to let the root layout handle the final redirection to the main app.
    - [x] 3.3.5 Implement UI feedback for upload success or failure, and disable the save button during the mutation call.

- [ ] 4.0 Routing and Integration
  - [x] 4.1 In `app/_layout.tsx`, implement the onboarding redirection logic.
    - [x] 4.1.1 Fetch the current user's auth state from Clerk and profile data from Convex using the new `getCurrentUser` query.
    - [x] 4.1.2 Display a loading indicator until both Clerk is loaded and the Convex query has returned data to prevent UI flicker.
    - [x] 4.1.3 If `user.status === 'pending_onboarding'`, redirect to the correct step (`/profile-setup` or `/initial-photo`) based on their profile data.
    - [x] 4.1.4 If `user.status === 'active'`, allow access to the main app `(tabs)` layout.
  - [ ] 4.2 Perform end-to-end testing of the entire social profile creation flow.
    - [ ] 4.2.1 Test the "happy path" for a brand new user.
    - [ ] 4.2.2 Test interrupting the flow (e.g., closing the app) and ensuring the user is redirected back to the correct step upon reopening.
    - [ ] 4.2.3 Test permission denial for the camera/library.
    - [ ] 4.2.4 Test UI handling of a failed image upload.
    - [ ] 4.2.5 Test the Clerk/Convex sync edge case: Refresh the app immediately after sign-up to ensure the loading state in the root layout correctly handles the delay before the Convex user record is created.
