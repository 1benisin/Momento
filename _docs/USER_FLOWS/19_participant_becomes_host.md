## 9. A Social User Becomes a Host

**Goal:** To provide a seamless upgrade path for an existing `Participant` to become a `User Host`, enabling them to create their own events and access the hosting-specific features of the app.

**Actors:**

- **User (Participant):** An existing, active user who wants to start hosting.
- **Momento App (Client):** The React Native/Expo application.
- **Momento Backend (Convex):** The Convex server handling the user role upgrade.
- **Stripe:** May be needed for identity verification if not already completed.

---

### Flow Steps

This flow begins with an existing `Participant` using the app in its standard "Social Mode."

#### 1. Discovering the Host Path

- **User Action:** The user finds a Call-to-Action (CTA) to become a host.
- **User Experience (UI/UX):**
  - This CTA is strategically placed in areas a curious power-user might explore, such as:
    - A "Become a Host" banner in their main `ProfileTab`.
    - An option within the app's `SettingsScreen`.
  - Tapping the CTA leads to an introductory screen that explains the benefits of hosting (sharing passions, meeting new people, etc.).

#### 2. Host Profile Creation

- **User Action:** The user proceeds to create their `hostProfile`.
- **User Experience (UI/UX):**
  - The user is navigated to a `HostProfileSetupScreen`.
  - Since they are a `User Host` (an individual, not a business), the form is simple, asking for:
    - `host_name`: This can default to their `socialProfile.first_name` but is editable.
    - `host_bio`: A separate bio focused on their hosting style and interests.
- **System Action (Verification Check):**
  - The system checks the `is_verified` flag on their `users` document.
  - **If `true`:** The user can proceed directly.
  - **If `false`:** The user is seamlessly routed through the mandatory Stripe Identity verification flow first, as detailed in the "Host Onboarding" flow. They are returned to this step upon successful verification.

#### 3. Upgrading the User Role

- **User Action:** The user submits their host profile information.
- **Backend & Services:**
  - **Client -> Backend:** The client calls the `users.createHostProfile({ hostData })` mutation.
  - **Backend (Convex):**
    1.  The mutation finds the user's document.
    2.  It adds a new `hostProfile` embedded object containing the submitted data and setting `host_type` to `'user'`.
    3.  The user document now contains both a `socialProfile` and a `hostProfile`, officially making them a `Hybrid User`.

#### 4. Introducing "Host Mode" & the Mode Switcher

- **System Action:** The client app detects the change in the user's data model.
- **User Experience (UI/UX):**
  - Upon successful creation of the host profile, the user is shown a confirmation screen.
  - This screen explicitly introduces the concept of the **"Mode Switcher"**. It might say: "Congratulations, you're now a host! You'll find a new 'Mode Switcher' in your profile to toggle between your Social and Host dashboards."
  - The `ProfileTab` now permanently displays the `ModeSwitcher` component, allowing the user to toggle between the two experiences.
  - By default, the user is switched into "Host Mode" for the first time to explore the new interface.

#### 5. First-Time Host Experience

- **User Experience (UI/UX):**
  - The app's UI transforms. The main tab bar changes to show the `HostDashboardScreen` and other hosting-related tabs. The `MemoryBookTab` and social discovery feeds are hidden.
  - A welcome message or a short, optional tour might highlight key features of the host dashboard, like the "Create New Event" button.
- **System Action:** The `active_role` field in the user's document is updated to `'host'`, so the app remembers which mode they were last in when they next open it.
