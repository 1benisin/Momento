# Screens & Components

This document outlines the application's UI, broken down into two main parts:

- **[Screens](#screens)**: A comprehensive list of all user-facing screens, organized by their corresponding user flow (e.g., Onboarding, Core Navigation, Hosting).
- **[Components](#components)**: A catalog of reusable UI elements, categorized into core primitives, layout helpers, and domain-specific "Lego Bricks" that make up the app.

---

This document outlines the high-level structure of the Momento application, detailing the screens and, eventually, the reusable components that will form the UI. This serves as a blueprint for development.

## Screens

The application will be organized into several key user flows and screen groups.

### 1. Onboarding & Authentication Flow

- **`SplashScreen`**: Initial launch screen.
- **`AuthScreen`**: Options for "Log In", "Sign Up", and "Become a Host".
- **`SignUpFlow (Participant)`**:
  - `PhoneInputScreen`: For entering a US-based phone number. This screen will also handle non-US numbers by directing them to the `InternationalWaitlistScreen`.
  - `OTPScreen`: For entering the one-time password received via SMS to verify the phone number.
  - `ProfileSetupScreen`: For entering initial public profile information (name, bio).
  - `InitialPhotoScreen`: For taking or uploading the first profile photo. This may include a prompt to use the in-app camera to earn an "Authentic" badge.
  - `InterestDiscoveryScreen`: A swipeable deck of "Possibility Cards" to establish the user's initial interest vectors. This is designed to feel like an adventure, not a survey.
- **`LoginScreen`**: For returning users to sign in using their phone number and a one-time password.
- **`InternationalWaitlistScreen`**: A screen that informs non-US users that Momento is not yet available in their country and invites them to join a waitlist.
- **`AIOnboardingInterviewScreen` (Future)**: A guided, AI-driven voice conversation to conduct a user interview, as an enhancement to the standard `InterestBuilderScreen`.

### 2. Host Onboarding Flow (for Organizations)

- **`HostSignUpScreen`**: For hosts to sign up with an email and password.
- **`HostProfileSetupScreen`**: A dedicated flow for hosts to enter their organization or venue name, bio, and address, and upload brand photos (logo, venue pictures) for their `host_profiles` record.

### 3. Core App Navigation (Tab Bar)

_This tab bar represents the primary navigation. The visible tabs and their functionality are determined by the user's active **mode**. A `Hybrid User` can switch between these modes, while single-role users will have a static view._

#### Social Mode Navigation

_This is the view for `Social-Only` and `Hybrid` users who are in "Social Mode." It is focused on participation and connection._

- **`HomeTab`**: The main dashboard. Displays upcoming events and pending invitations.
- **`EventsTab`**: Hub for all event-related activities, including "Invitations," "Confirmed," and "Past" events.
- **`DiscoveryFeedTab` (or nested here)**: The swipeable deck of past events for refining interests.
- **`MemoryBookTab`**: Gallery of "Face Cards" for every person met.
- **`MessagesTab`**: List of all 1-on-1 conversations with other participants.
- **`ProfileTab`**: The user's own `Social Profile`. This is the entry point for `Settings` and contains the **`ModeSwitcher`** component for `Hybrid Users`.

#### Host Mode Navigation

_This is the view for `Host-Only` and `Hybrid` users who are in "Host Mode." It is a streamlined dashboard focused on event management._

- **`DashboardTab`**: Key metrics at a glance: revenue, ratings, upcoming event headcounts.
- **`EventsTab`**: Manage all created events (drafts, upcoming, past). Entry point to the `CreateEventFlow`.
- **`InboxTab`**: A dedicated inbox for messages from attendees of the host's events.
- **`ProfileTab`**: Manage the public `Host Profile`, brand photos, payout settings, etc. Contains the **`ModeSwitcher`** for `Hybrid Users`.

---

- **`EventDetailScreen`**: A multi-state screen for a confirmed event.
  - **Upcoming State**: Shows full itinerary, logistics, and collaborator info.
  - **Arrival State**: Reveals the "Deck of Cards" UI for check-in once at least two attendees have arrived.
  - **Post-Event State**: Hub for feedback, messaging, the shared photo gallery, and an event-specific message board (`EventPostFeed`).
- **`FirstEventCheckInPhotoScreen`**: A one-time screen shown when a user checks into their first event, prompting them to take their initial "authentic" photo to create their first Face Card.
- **`PostEventFeedbackFlow`**: A multi-step modal flow presented after an event concludes, replacing the simple `FeedbackModal`.
  - Step 1: `RatingScreen` for rating the event and host.
  - Step 2: `PeerKudosScreen` for giving private, anonymous kudos to fellow attendees.
- **`SharedEventGalleryScreen`**: View for the shared photo album for a past event. Includes uploader, downloader, and a "report photo" feature.
- **`AIHypeManModal` (Future)**: A modal that can be triggered before an event to build a user's confidence with personalized conversation starters and reminders of their positive qualities, as described in the marketing strategy.

### 4. Connection & Profile Details

- **`ConnectionDetailScreen`**: Detailed view of a "Face Card" from the Memory Book. Includes:
  - Private notes section.
  - Toggles for "Connect Again" and "Don't Connect Again" preference signals.
  - A button to launch the `ShareSocialsModal`.
  - Display of any social media links shared by the other user.
- **`UserProfileScreen`**: The public profile view of another user.
- **`FaceCardStylingScreen`**: Where a user can apply AI-driven styles, borders, and other customizations to their Face Card photo after an event.
- **`ShareSocialsModal`**: A modal launched from the `ConnectionDetailScreen` that allows a user to select which of their saved social media links they want to share with a specific connection.
- **`DiscoveryFeedScreen`**: A dedicated screen, potentially a main tab, where users can browse and interact with a swipeable deck of `PastEventCard` components to signal their current interests to the matching algorithm.
- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.
- **`CameraRollScreen`**: A personal gallery for a user to manage their photos, organized into three sections:
  - **My Profile Photos**: Photos used for their public `social_profile`.
  - **My Event Uploads**: A grid of every photo they have personally uploaded across all event galleries.
  - **Event Albums**: A list of all attended events, acting as shortcuts to each `SharedEventGalleryScreen`.
    _Note: This screen is for participants. Business hosts manage their photos from the `HostDashboardScreen`._
- **`InAppNotificationBanner`**: A banner/toast for displaying notifications while the user is inside the app.
- **`ModeSwitcher`**: A UI control, likely a dropdown or segmented control in the `ProfileTab`, that allows a `Hybrid User` to toggle between "Social Mode" and "Host Mode."

### 5. Settings & User Management

- **`SettingsScreen`**: Main menu for all settings.
- **`EditProfileScreen`**: For updating the user's public profile.
- **`NotificationSettingsScreen`**: For managing push and SMS notification preferences.
- **`PaymentMethodsScreen`**: For adding/removing payment methods.
- **`TransactionHistoryScreen`**: For viewing past payments.
- **`MySocialLinksScreen`**: For managing the user's own social media links to be shared via "Social Connect." For hosts, this screen includes a toggle for each link to make it publicly visible on their Host Profile.
- **`SecurityAndPrivacyScreen`**: Hub for safety features, including the blocked users list.
- **`BlockedUsersScreen`**: A screen to view and manage blocked users.
- **`VerificationScreen`**: The UI flow for identity verification.
- **`ReportUserFlow`**: A guided flow for submitting a formal report against another user.
- **`ReportPhotoModal`**: A modal for reporting an inappropriate photo from the `SharedEventGalleryScreen`.
- **`CoachingModuleScreen`**: A guided, mandatory walkthrough on community standards for users who have received a serious report.

### 6. Hosting Flow

- **`HostDashboardScreen`**: A dashboard for hosts to manage their events.
- **`CreateEventFlow`**: A multi-step process for creating and defining a new event. The flow must support:
  - Defining event details (title, description, age limits, etc.).
  - Setting a real-world `arrival_signpost` cue for attendees.
  - Building a detailed itinerary with multiple `ItineraryStop` components (each with a location, start time, and end time).
  - Adding co-hosts or instructors via the `CollaboratorInput`.
- **`ManageEventScreen`**: The host's view for managing an active or upcoming event.
- **`CollaboratorSearchScreen`**: A sub-screen or modal for hosts to find and add collaborators by searching for other Momento users.

### 7. Safety & Moderation

- **`ReportAndBlockModal`**: Presents the user with clear options to "Block" or "Report" another user.

### 8. Discovery & Content

- \*\*`
