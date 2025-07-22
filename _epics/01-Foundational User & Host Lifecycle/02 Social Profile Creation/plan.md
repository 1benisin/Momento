### 1. High-Level Summary

This plan outlines the implementation for the **Social Profile Creation** story. After a new user successfully authenticates via Clerk, the application will check if they have a `socialProfile`. If not, it will redirect them to a mandatory two-step onboarding flow. The first screen (`profile-setup`) will collect their `first_name` and an optional `bio`. The second screen (`initial-photo`) will prompt them to upload or take their first profile photo.

The technical approach involves:

1.  Updating the `users` table schema in `convex/schema.ts` to include a rich `socialProfile` object.
2.  Creating new Convex mutations to handle profile creation and photo uploads.
3.  Implementing two new screens for the onboarding flow.
4.  Adding redirection logic to the root layout (`app/_layout.tsx`) to enforce the completion of this flow for new users.

### 2. Current Relevant Directory Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── two.tsx
├── +html.tsx
├── +not-found.tsx
├── _layout.tsx
└── modal.tsx

components/
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
├── __tests__/
├── useClientOnlyValue.ts
├── useClientOnlyValue.web.ts
├── useColorScheme.ts
└── useColorScheme.web.ts

convex/
├── _generated/
├── auth.config.ts
├── clerk.ts
├── http.ts
├── schema.ts
├── tests/
├── tsconfig.json
└── user.ts
```

### 3. Data Model Changes (`convex/schema.ts`)

The existing `users` table is minimal. It needs to be updated to match the application's data model specification for storing profile information.

```typescript
// convex/schema.ts

// ... (imports)

export default defineSchema({
  users: defineTable({
    // --- Existing Fields ---
    tokenIdentifier: v.string(),
    clerkId: v.string(),

    // --- Fields to Add/Modify ---
    phone_number: v.string(), // Make non-optional, required at sign-up
    status: v.string(), // 'pending_onboarding', 'active', etc.

    socialProfile: v.optional(
      v.object({
        first_name: v.string(),
        bio: v.optional(v.string()),
        photos: v.array(
          v.object({
            storageId: v.string(),
            url: v.string(),
            is_authentic: v.boolean(),
            created_at: v.number(),
            authentic_expires_at: v.optional(v.number()),
          }),
        ),
        current_photo_url: v.optional(v.string()),
      }),
    ),

    // --- Fields to Remove ---
    // name: v.optional(v.string()), // This will be stored in socialProfile.first_name
  })
    .index('by_token', ['tokenIdentifier'])
    .index('by_clerk_id', ['clerkId']),
})
```

_Note: The `name` field will be removed from the top level and stored inside `socialProfile` as `first_name`._

### 4. Backend Implementation (`convex/`)

**Files to Create**

- `convex/files.ts`: To handle file upload logic.
  - `generateUploadUrl`: A mutation that generates a URL for the client to upload a file to Convex storage.

**Files to Modify**

- `convex/user.ts`:
  - **Modify `store` mutation**: When a new user is created, set their initial `status` to `"pending_onboarding"`.
  - **Add `createSocialProfile` mutation**: Takes `{ firstName: string, bio?: string }`. It will update the user's `socialProfile` with the provided name and bio.
  - **Add `addProfilePhoto` mutation**: Takes `{ storageId: string, isAuthentic: boolean }`. It will generate a URL for the stored file, add the photo object to the `socialProfile.photos` array, set `socialProfile.current_photo_url`, and **atomically update the `user.status` to `'active'`**, marking the final step of onboarding.
- `convex/http.ts`:
  - The existing Clerk webhook (`POST /api/clerk`) needs to be updated to correctly map data to the new user schema when creating a user record. Specifically, it should call the modified `store` mutation.

### 5. Frontend Implementation (`app/`, `components/`)

**Files to Create**

- **Screens**:
  - `app/(onboarding)/_layout.tsx`: A new layout for the profile creation flow. It will protect the routes and ensure a user can't skip steps by redirecting them to the correct step if they try to navigate manually.
  - `app/(onboarding)/profile-setup.tsx`: The first screen where users enter their name and bio.
  - `app/(onboarding)/initial-photo.tsx`: The second screen where users upload or take their first profile photo. This screen must gracefully handle potential upload errors from the backend.
- **Components**:
  - `components/ImageUploader.tsx`: A reusable component to handle both picking from the device library and taking a new photo with the camera. It will encapsulate the logic of getting an upload URL from Convex, uploading the file, and returning the `storageId`. It must also handle cases where permissions are denied, prompting the user with a way to open device settings.

**Files to Modify**

- `app/_layout.tsx`:
  - The root layout will manage the initial routing logic. It will display a loading indicator until the user's auth and profile status are fetched to prevent a UI "flicker". Based on the user's data, it will implement robust redirection:
    - If `user.status === 'pending_onboarding'`:
      - If `user.socialProfile.first_name` exists but `user.socialProfile.photos` is empty, redirect to `/initial-photo`.
      - Otherwise, redirect to `/profile-setup`.
    - If the user is fully onboarded, allow access to the main `(tabs)` layout.
      This handles users who drop off mid-flow.
- `app/(auth)/sign-up.tsx`:
  - After a successful sign-up via Clerk, the app will redirect to the main app, where the logic in `app/_layout.tsx` will catch the new user and redirect them to the onboarding flow. No direct changes may be needed here if the root layout handles the redirect correctly.

### 6. Step-by-Step Task Breakdown

1.  **Backend Setup**:
    1.  Modify `convex/schema.ts` to update the `users` table as specified.
    2.  Create `convex/files.ts` and implement the `generateUploadUrl` mutation.
    3.  Update the `store` user mutation in `convex/user.ts` to set the initial `status`.
    4.  Implement `createSocialProfile` and `addProfilePhoto` in `convex/user.ts`. Ensure `addProfilePhoto` also updates the user's `status` to `'active'`.
    5.  Update the Clerk webhook in `convex/http.ts` to align with the new schema.
2.  **Frontend Component**: 6. Build the `components/ImageUploader.tsx` component, ensuring it handles permission denial gracefully by linking to device settings.
3.  **Frontend Screens**: 7. Create the `app/(onboarding)/` route group with a `_layout.tsx` that prevents users from skipping steps. 8. Build the `app/(onboarding)/profile-setup.tsx` screen. 9. Build the `app/(onboarding)/initial-photo.tsx` screen, ensuring it handles upload failures.
4.  **Routing & Integration**: 10. Implement the refined redirection logic in `app/_layout.tsx` to show a loading state and handle interrupted onboarding flows. 11. Test the end-to-end flow, including denying permissions, interrupting the flow, and upload failures.

### 7. Open Questions & Assumptions

- **Assumption**: We will use `expo-image-picker` and `expo-camera` for photo handling and will need to request necessary permissions from the user.
- **Assumption**: Convex file storage is available and requires no additional infrastructure setup.
- **Question**: Where should the user be redirected after completing the `initial-photo` screen? The user flow suggests the `InterestDiscoveryScreen` is next. This plan only covers the social profile part; the final navigation will need to target the next step in the onboarding sequence.
- **Question**: What should the UI look like for the "Authentic" badge prompt? For MVP, we can have a simple checkbox or toggle on the `initial-photo` screen asking "Did you take this photo just now?" to set the `is_authentic` flag.
