# Screens & Components

This document outlines the application's UI, broken down into two main parts:

- **[Screens](#screens)**: A comprehensive list of all user-facing screens, organized by their corresponding user flow (e.g., Onboarding, Core Navigation, Hosting).
- **[Components](#components)**: A catalog of reusable UI elements, categorized into core primitives, layout helpers, and domain-specific "Lego Bricks" that make up the app.

---

This document outlines the high-level structure of the Momento application, detailing the screens and, eventually, the reusable components that will form the UI. This serves as a blueprint for development.

## Table of Contents

- **[Screens](#screens)**
  - [1. Onboarding & Authentication Flow](#1-onboarding--authentication-flow)
  - [2. Host Onboarding Flow (for Organizations)](#2-host-onboarding-flow-for-organizations)
  - [3. Core App Navigation (Tab Bar)](#3-core-app-navigation-tab-bar)
  - [4. Invitation & Event Details](#4-invitation--event-details)
  - [5. Connection & Profile Details](#5-connection--profile-details)
  - [6. Settings & User Management](#6-settings--user-management)
  - [7. Hosting Flow](#7-hosting-flow)
  - [8. Safety & Moderation](#8-safety--moderation)
  - [9. Discovery & Content](#9-discovery--content)
- **[Components](#components)**
  - [10. Modals & Overlays](#10-modals--overlays)
  - [11. Indicators & Badges](#11-indicators--badges)
  - [12. Domain-Specific Components](#12-domain-specific-components)
  - [13. Dynamic Duos](#13-dynamic-duos)
  - [14. Controls & Inputs](#14-controls--inputs)

## Screens

### 1. Onboarding & Authentication Flow

This flow is now managed by Clerk, which handles user sessions and the complexities of OTP-based phone authentication. We will build custom UI that leverages Clerk's hooks (`useSignIn`, `useSignUp`) for a seamless native experience.

- **`SplashScreen`**: Initial launch screen.
- **`AuthScreen`**: A simple entry screen with "Log In" and "Sign Up" buttons. It might also include a "Contact Support" link.
- **`(auth)` Route Group Screens**: These screens live in the `app/(auth)/` directory and are wrapped in a layout that redirects already authenticated users to the core app.
  - **`SignInScreen`**: For returning users. It contains UI for entering a phone number or an email address to receive a one-time verification code. This entire state machine is managed by Clerk's `useSignIn()` hook.
  - **`SignUpScreen`**: For new users. Similar to the sign-in screen, this uses the `useSignUp()` hook to manage the process of creating a new user account with either a phone number or an email address and verifying with a one-time code.
- **Post-Authentication & Intent-Driven Onboarding Flow**: Once a user is authenticated via Clerk, they are directed to choose their path.
  - **`RoleSelectionScreen`**: A new, mandatory screen shown immediately after a user's first successful sign-up. It asks the user to choose their primary goal: "I want to attend events" or "I want to host events". Their choice determines which onboarding flow they enter.
  - **`ClerkLoading/ClerkLoaded`**: To prevent a "flash" of the wrong screen when the app first loads, the root layout will use Clerk's control components. It will show a loading indicator via `<ClerkLoading>` while Clerk initializes, and then render the main content inside `<ClerkLoaded>` for a smooth transition.
  - **Participant Onboarding Branch**:
    - **`ProfileSetupScreen`**: For entering initial public profile information (name, bio).
    - **`InitialPhotoScreen`**: For taking or uploading the first profile photo.
    - **`InterestDiscoveryScreen`**: The swipeable deck of "Possibility Cards" to establish the user's initial interest vectors.

The following screens from the previous design are now **DEPRECATED** as their functionality is handled by Clerk or is no longer needed:

- `PhoneInputScreen`
- `RecycleAccountScreen`
- `OTPScreen`
- `SecondFactorAuthScreen`
- `LoginScreen`
- `InternationalWaitlistScreen`

### 2. Host Onboarding Flow

This section describes the various paths for a user to create a `hostProfile`.

- **Primary Host Onboarding Flow**: This is the path for a new user who selects "I want to host events" on the `RoleSelectionScreen`.

  - **`HostTypeSelectionScreen`**: (Optional but recommended) A screen that asks if they are hosting as an "Individual" or for a "Business/Organization". This helps tailor the next step.
  - **`HostProfileSetupScreen`**: A form for entering host details. For `Community Hosts`, this will include fields like business address and website. For `User Hosts`, it's simpler, focusing on their host name and bio.
  - **`HostOnboardingCompleteScreen`**: A final screen congratulating the user, directing them to Host Mode, and providing a strong CTA to begin identity verification.

- **Secondary "Add-a-Role" Flow (Participant to Host)**:
  - **`UserHostOnboardingFlow`**: This is the original flow, now used for an existing participant who decides to become a host. It is launched from a CTA on their `ProfileTab`.
  1.  **`HostBenefitsScreen`**: Showcases the value proposition of hosting.
  2.  **`HostProfileCreationScreen`**: A simple form to confirm their `host_name` (pre-populated) and add a `host_bio`. Sets `host_type` to `'user'`.
  3.  **`HostOnboardingCompleteScreen`**: A final screen congratulating the user, directing them to the new `ModeSwitcher`, and providing a strong CTA to begin identity verification.

### 3. Core App Navigation (Tab Bar)

_This tab bar represents the primary navigation. Its layout and functionality are determined by the `users.active_role` field, which defaults to `'social'`. For users with only one role (e.g., `Social-Only`), this view is static. For `Hybrid Users` (those with both `socialProfile` and `hostProfile`), this `active_role` can be changed using the `ModeSwitcher` component, which dynamically re-renders the tab bar to match the selected context._

#### Social Mode Navigation

_This is the view for `Social-Only` and `Hybrid` users who are in "Social Mode." It is focused on participation and connection._

- **`Discover`**: The main discovery hub (points to `index.tsx`).
- **`Events`**: Hub for all event-related activities, including "Invitations," "Confirmed," and "Past" events.
- **`Memory Book`**: Gallery of "Face Cards" for every person met.
- **`Social Profile`**: The user's own `Social Profile`. This is the entry point for `Settings` and the `UserHostOnboardingFlow` (via a "Become a Host" CTA). It contains the **`ModeSwitcher`** component for `Hybrid Users`.

#### Host Mode Navigation

_This is the view for `Host-Only` and `Hybrid` users who are in "Host Mode." It is a streamlined dashboard focused on event management._

- **`DashboardTab`**: Key metrics at a glance: revenue, ratings, upcoming event headcounts.
- **`EventsTab`**: Manage all created events (drafts, upcoming, past). Entry point to the `CreateEventFlow`.
- **`InboxTab`**: A dedicated inbox for messages from attendees of the host's events.
- **`HostProfileTab`**: Manage the public `Host Profile`, brand photos, payout settings, etc. Contains the **`ModeSwitcher`** for `Hybrid Users`.

### 4. Invitation & Event Details

- **`InvitationDetailScreen`**: Displays all details for a pending event invitation. It prominently features the `MatchReasonBanner` at the top to immediately personalize the experience.
- **`EventDetailScreen`**: A multi-state screen for a confirmed event.
  - **Upcoming State**: Shows full itinerary, logistics, collaborator info, and a clear `CostBreakdown` component that separates the **Confirmation Fee** (paid to Momento) from the **Estimated Event Cost** (paid to the host/venue). For confirmed attendees, this state also includes a "Cancel Attendance" button.
  - **Arrival State**: Reveals the "Deck of Cards" UI for check-in once at least two attendees have arrived.
  - **Post-Event State**: Hub for feedback, messaging, the shared photo gallery, and an event-specific message board (`EventPostFeed`).

### 5. Connection & Profile Details

- **`ConnectionDetailScreen`**: Detailed view of a "Face Card" from the Memory Book. This is the primary screen for viewing a connection's full character profile after an event. It includes:
  - An interactive view that, upon tapping, flips over and reveals the connection's `InterestConstellation`, `KudosShowcase`.
  - Private notes section.
  - Toggles for "Connect Again" and "Don't Connect Again" preference signals.
  - A button to launch the `ShareSocialsModal`.
  - Display of any social media links shared by the other user.
- **`UserProfileScreen`**: The public profile view of another user, featuring their photos, bio, their `InterestConstellation`, a `KudosShowcase`, their `EventDNAGallery`, and an optional `VibeSummary`.
- **`FaceCardStylingScreen`**: Where a user can apply AI-driven styles, borders, and other customizations to their Face Card photo after an event.
  - **Locked State**: For users who have not yet attended an event, this screen is view-only, showing a preview of the feature with a message explaining how to unlock it.
  - **Unlocked State**: After attending their first event, all controls are enabled.
  - **Components**:
    - `FaceCardPreview`: A large preview of the Face Card that updates in real-time.
    - `SourcePhotoSelector`: A horizontal carousel of the user's verified profile photos.
    - `StyleSelector`: A grid of available photo styles (e.g., "Vintage"). Locked styles are visually disabled and show their unlock criteria (e.g., "Attend 3 Events").
    - `BorderSelector`: A grid for available borders and frames, which also shows locked/unlocked states.
    - `ApplyChangesButton`: A button to save the changes, which shows a loading indicator while the new image is being generated and saved.
- **`ShareSocialsModal`**: A modal launched from the `ConnectionDetailScreen` that allows a user to select which of their saved social media links they want to share with a specific connection.
- **`InterestDiscoveryScreen`**: The swipeable deck of `PastEventCard` components used to discover a user's interests. This screen has two distinct states:
  - **Calibration State**: The initial state for a new user. It displays the `CalibrationProgressBar` and is focused on gathering signals from a diverse set of events.
  - **Refinement State**: After calibration and the "persona reveal," this state shows events targeted at refining the user's discovered personas.
- **`ProfileDiscoveryScreen`**: The swipeable deck of user profile cards used to discover a user's type. This screen has two distinct states:
  - **Calibration State**: The initial state for a new user. It displays the `CalibrationProgressBar` and is focused on gathering the first ~30 swipes to build a baseline profile.
  - **Refinement State**: After the initial calibration is complete, the screen shows the `CalibratedStateIndicator` and a message explaining that the feed is now sorted to help them refine their type.
- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.
- **`CameraRollScreen`**: A personal gallery for a user to manage their photos, organized into three sections:
  - **My Profile Photos**: Photos used for their public `social_profile`.
  - **My Event Uploads**: A grid of every photo they have personally uploaded across all event galleries.
  - **Event Albums**: A list of all attended events, acting as shortcuts to each `SharedEventGalleryScreen`.
    _Note: This screen is for participants. Business hosts manage their photos from the `HostDashboardScreen`._
- **`InAppNotificationBanner`**: A banner/toast for displaying notifications while the user is inside the app.

### 6. User Management: Profile, Settings & Preferences

To provide a clear and organized experience, all user management functions are centralized in a custom-built account screen. This approach gives us full native control over the UI while still leveraging Clerk's powerful backend hooks for security and data management.

- **Custom User Icon**:

  - **Location**: Placed in the header of the main `(tabs)` layout.
  - **Functionality**: On press, it navigates the user directly to the main `AccountScreen`.

- **`AccountScreen` (`/account`)**:

  - **Purpose**: This screen is our custom, native replacement for Clerk's web-based `<UserProfile />`. It serves as the secure hub for core identity and security management, built using Clerk's hooks like `useUser()`. Its responsibilities include:
    - Displaying user information (name, email, phone).
    - Providing forms to update profile details (e.g., `user.update()`).
    - Allowing users to manage their email address and phone number.
    - A clear "Sign Out" option.
    - A "Danger Zone" with options to "Pause Account" and "Delete Account", guiding users toward pausing as a non-permanent alternative.
  - **File Path**: `app/(tabs)/account.tsx`.

- **`SettingsScreen` (`/settings`)**:

  - **Purpose**: This remains our fully custom, native screen for all Momento-specific settings and preferences, accessible from the `AccountScreen`. Its content is context-aware and changes based on the user's `active_role`.
  - **File Path**: `app/(tabs)/settings.tsx`.
  - **Core Layout & Universal Sections (Always Visible)**:
    - **`ModeSwitcher`**: For `Hybrid Users`, this is the primary control at the top of the screen to switch between 'Social' and 'Host' contexts. It is only rendered for users who have both a `socialProfile` and a `hostProfile`.
    - **`NotificationSettingsScreen`**: A single, consolidated screen for managing all push and SMS preferences.
    - **`PaymentAndHistoryScreen`**: A section for managing payment methods and viewing past transactions.
    - **`SecurityAndPrivacyScreen`**: Hub for Momento-specific safety features, including the `BlockedUsersScreen`.
    - **`HelpCenterScreen`**: The entry point for contacting support.
    - **`LegalScreen`**: Contains links to the `PrivacyPolicyScreen` and `TermsOfServiceScreen`.
  - **Contextual Sections (Mode-Dependent)**:
    - **If in 'Social' Mode (Participant Settings)**:
      - **`EditProfileScreen`**: For updating the public-facing social profile (`preferred_name`, `bio`).
      - **`EventPreferencesScreen`**: A unified screen for managing all event-related preferences, divided into:
        - **Hard Filters**: Contains the `DistancePreferenceSlider` and `PriceSensitivitySelector`.
        - **Soft Preferences**: Contains the `NoticePreferenceSlider` and `AvailabilityGrid`.
      - **`MySocialLinksScreen`**: For managing private social media links.
    - **If in 'Host' Mode (Host Settings)**:
      - This section will contain host-specific settings like `EditHostProfileScreen` and `ManagePublicSocialsScreen`.

- **`ReportUserFlow`**: A guided flow for submitting a formal report against another user. This can be accessed from multiple places, including the `HelpCenterScreen`.
- **`ReportPhotoModal`**: A modal for reporting an inappropriate photo from the `SharedEventGalleryScreen`.

### 7. Hosting Flow

- **`HostDashboardScreen`**: A summary view showing key lifetime metrics (total revenue, overall average rating) and a list of the next 3 upcoming events with their current headcount. It will also display a persistent `VerificationPromptBanner` if the host is not yet verified.
- **`CreateEventFlow`**: A multi-step process for creating and defining a new event.
- **`ManageEventScreen`**: The host's primary screen for managing an active or upcoming event. It includes an "Edit Event" button that, upon saving a material change, triggers the `HostEditWarningModal`. During the post-event "Wrap-Up" phase, this screen will display the `AttendanceConfirmationList` component. It will also display the `VerificationPromptBanner` if the host is not yet verified.
- **`PastEventSummaryScreen`**: A read-only screen where a host can view the details and feedback from a completed event. It visually displays the metrics from the `event_summary` object, including final attendance, average ratings, and an AI-generated summary of comments.
- **`CollaboratorSearchScreen`**: A modal for hosts to find and add collaborators by searching for other Momento users.

### 8. Safety & Moderation

- **`ReportAndBlockModal`**: Presents the user with clear options to "Block" or "Report" another user.
- **`AttendanceConfirmationList`**: An interactive component displayed on the `ManageEventScreen` during the post-event "Wrap-Up" phase. It shows a list of all confirmed attendees and allows the host to mark users as a "No-Show".

### 9. Discovery & Content

- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.

---

## Components

This section catalogs the reusable UI elements that form the building blocks of the application's screens.

### 10. Modals & Overlays

- **`BlockActionErrorModal`**: A modal displayed when a user attempts to block another user but is disallowed by a system rule (e.g., they are both confirmed for the same upcoming event).
  - **Title**: "Cannot Block User"
  - **Body**: "You and [User's Name] are both confirmed for '[Event Title]' which is happening soon. To ensure a smooth experience for everyone, you cannot block this user until after the event. If you don't feel comfortable attending, you can still cancel your attendance."
  - **Buttons**: "Cancel Attendance" (navigates to the cancellation flow) and "OK" (dismisses the modal).
- **`PauseOrDeleteModal`**: A modal that appears when a user taps "Delete Account". It is designed to be a user-retention mechanism that nudges the user toward pausing instead of deleting.
  - **Title**: "Before you go..."
  - **Body**: "Deleting your account is permanent and will erase all your memories and connections. If you just need a break, you can **pause your account** instead. This will hide your profile from public view and stop all new invitations, but you can still message your connections and reactivate anytime."
  - **Buttons**: "Pause Account" (primary), "Delete Permanently" (destructive), "Cancel" (secondary).
- **`PausedAccountBanner`**: A persistent banner or overlay shown to a user whose account status is `'paused'`.
  - **Body**: "Your account is currently paused."
  - **Button**: "Reactivate Account".
- **`CustomizationUnlockToast`**: A non-interruptive toast notification that appears when a user unlocks a new Face Card customization. It displays a message like "🎉 You've unlocked the 'Gilded' border!" and includes an optional "Customize Now" button that deep-links to the `FaceCardStylingScreen`.
- **`DeclineFeedbackModal`**: A modal presented after a user declines an invitation, asking for a reason. Includes options for "Too short notice," "Too far away," and "Too expensive."
- **`EventChangeConfirmationModal`**: A modal shown to an attendee after a host makes a material change to an event. It must clearly display the "before" and "after" of the change (e.g., "Time changed from **7 PM** to **8 PM**"). The buttons are clearly labeled "Keep My Spot" and "Cancel & Get Refund", and there is no deadline or countdown.
- **`HostCancelConfirmationModal`**: A modal for a host who initiates an event cancellation. It requires them to confirm the action is irreversible and acknowledges that all attendees will be notified and fully refunded.
- **`HostEditWarningModal`**: A confirmation dialog shown to a host after they save a material change to an event. It forces them to acknowledge that all attendees will be notified and given the option to cancel for a full refund before the change is finalized.
- **`MatchReasonBanner`**: An elegant banner displayed prominently on the `InvitationDetailScreen`. It's designed to feel insightful and personal, not like a system debug message. It features a small icon (e.g., ✨) and a short, friendly text that explains why the user was invited to this specific event.
- **`ParticipantCancelModal`**: A modal for a participant who initiates a cancellation. The content dynamically changes based on the timing:
  - **Early Cancellation:** A soft warning reminding the user that the $5 fee is non-refundable but confirming there is no rating penalty.
  - **Late Cancellation:** A stronger warning explicitly stating that the action will negatively impact their `absentee_rating` and that the fee is non-refundable.
- **`PreferencePromptModal`**: A one-time, educational modal triggered by specific user actions (like declining an event for being "Too far away"). Its content is dynamic based on the trigger.
  - **Example (Distance Trigger):**
    - **Title:** "Tired of the Commute?"
    - **Body:** "You can set a maximum travel distance to only get invites for events near you. This can be changed at any time."
    - **Buttons:** "Set Travel Preference" and "Maybe Later".
  - **Behavior:** Both buttons dismiss the modal and trigger a backend mutation to mark the nudge as seen, ensuring it doesn't appear again.

### 11. Indicators & Badges

- **`ShortNoticeBadge`**: A small, non-intrusive badge displayed on invitation cards for events with a lead-time shorter than the user's preference.
- **`DuoBadge`**: A visual indicator (e.g., a overlay element over a corner of the card like a passport stamp) displayed on a `FaceCard` within the `DeckOfCardsAttendee` UI. This badge signals to other attendees that the two users have joined the event as a pre-formed pair.
- **`VerificationPromptBanner`**: A persistent banner displayed at the top of the `HostDashboardScreen` and `ManageEventScreen` for unverified hosts. It contains a message like "Verify your identity to publish your first event" and a "Get Verified" button that launches the Stripe Identity verification flow.

### 12. Domain-Specific Components

- **`InterestConstellation`**: An interactive, minimalist graphic displayed on a user's profile. It visualizes their core "interest personas" as stars in a constellation. Tapping a star reveals keywords and concepts related to that persona (e.g., "Adventurous Side: Hiking, Spontaneous Travel"). This component provides a rich, at-a-glance view of a user's character.
- **`KudosShowcase`**: A UI component that displays a user's top 2-3 most-received peer-to-peer kudos as elegant badges or icons (e.g., "Welcoming Vibe," "Great Listener"). It provides a qualitative, authentic summary of their social character, validated by others. The design should gracefully handle states with few or no kudos.
- **`EventDNAGallery`**: A visually rich gallery on a user's profile that displays the event cards for 3-5 of their favorite past events. This component serves as a curated highlight reel of their experiences, showing their interests through action. The design should gracefully handle states with few or no showcased events.
- **`VibeSummary`**: A text component that displays a short, AI-generated narrative paragraph summarizing a user's personality based on their activity. The user has full control to generate, approve, or hide this summary.
- **`CostBreakdown`**: A UI component used on the `EventDetailScreen` that clearly distinguishes between the two types of costs.
  - **Line Item 1**: "Confirmation Fee: $5" with a subtitle explaining this is paid to Momento to secure a spot and encourage commitment.
  - **Line Item 2**: "Estimated Event Cost: $$" with a subtitle explaining this is an estimate paid directly to the host or venue and is not processed by Momento.
- **`CalibrationProgressBar`**: A UI component displayed on the `ProfileDiscoveryScreen` during the initial "Calibration State." It provides a visual indication of progress as the user works through their first ~30 profile swipes, accompanied by text like _"Help us calibrate your compass."_
- **`CalibratedStateIndicator`**: A UI component that replaces the `CalibrationProgressBar` on the `ProfileDiscoveryScreen` once the initial calibration is complete. It could be a simple checkmark icon with text like _"Thanks, your compass is calibrated! We're now sorting people we think you'll connect with to the top."_
- **`PersonaRevealSummary`**: A UI component used on the `InterestDiscoveryScreen` after a user completes the "Calibration State." It presents the names of the 1-3 "Interest Personas" the algorithm has identified (e.g., "Thrill Seeker," "Cozy Creative") and serves as the transition into the "Refinement State." It's a moment of insight designed to make the user feel understood.

### 13. Dynamic Duos

- **`DuoHomeScreen`**: A central hub for managing Duo pacts. It would feature tabbed navigation for:
  - **Active Duo**: Shows the current Duo partner and the pact's expiration date.
  - **Pending Invites**: Shows incoming Duo requests from other users to be accepted or declined.
  - **Past Duos**: A history of previous Duo partnerships and the events attended together.
- **`FormDuoScreen`**: A screen that, after getting user permission, accesses the phone's contacts to display a list of friends who are also on Momento, allowing the user to select one to send a Duo invitation to.

### 14. Controls & Inputs

- **`NoticePreferenceSlider`**: A slider control allowing users to set their ideal lead-time for event invitations (from 0 to 14 days).
- **`DistancePreferenceSlider`**: A slider control allowing a user to set their maximum travel distance for events (e.g., 1-25 miles). Ideally, this control would be overlaid on a map that visually adjusts a circle representing their travel radius from their home address.
- **`PriceSensitivitySelector`**: A segmented control allowing a user to set their typical price comfort level for events.
  - `$` (e.g., Free - $15)
  - `$$` (e.g., $15 - $40)
  - `$$$` (e.g., $40 - $75)
  - `$$$$` (e.g., $75+)
- **`AvailabilityGrid`**: A 7x2 grid for setting detailed availability preferences for each day and night of the week. It directly manipulates the structured `availability_preferences` object in the user's data model.

- **`AIHypeManModal` (Future)**: A modal that can be triggered before an event to build a user's confidence with personalized conversation starters and reminders of their positive qualities, as described in the marketing strategy.
