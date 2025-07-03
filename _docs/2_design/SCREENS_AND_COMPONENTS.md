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
  - `PhoneInputScreen`: For entering a US-based phone number. If the number is already registered, the user is diverted to the `PhoneNumberConflictScreen` instead of the `OTPScreen`.
  - `PhoneNumberConflictScreen`: A screen that asks the user if they are the original owner of the account associated with the phone number, forking the user flow.
  - `OTPScreen`: For entering the one-time password received via SMS to verify the phone number.
  - `SecondFactorAuthScreen`: A screen that prompts an existing user on a new device to verify their identity through a secondary method (e.g., recovery email, ID verification).
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
- **`DiscoveryTab`**: A main tab with two modes for discovering new things.
  - **Interests Mode**: The "Help us Discover your Interests" flow, with a swipeable deck of past events.
  - **People Mode**: The "Help us Discover your Type" flow, with a swipeable deck of user profiles.
- **`MemoryBookTab`**: Gallery of "Face Cards" for every person met.
- **`MessagesTab`**: List of all 1-on-1 conversations with other participants.
- **`ProfileTab`**: The user's own `Social Profile`. This is the entry point for `Settings` and contains the **`ModeSwitcher`** component for `Hybrid Users`.

#### Host Mode Navigation

_This is the view for `Host-Only` and `Hybrid` users who are in "Host Mode." It is a streamlined dashboard focused on event management._

- **`DashboardTab`**: Key metrics at a glance: revenue, ratings, upcoming event headcounts.
- **`EventsTab`**: Manage all created events (drafts, upcoming, past). Entry point to the `CreateEventFlow`.
- **`InboxTab`**: A dedicated inbox for messages from attendees of the host's events.
- **`ProfileTab`**: Manage the public `Host Profile`, brand photos, payout settings, etc. Contains the **`ModeSwitcher`** for `Hybrid Users`.

### 4. Invitation & Event Details

- **`InvitationDetailScreen`**: Displays all details for a pending event invitation. It prominently features the `MatchReasonBanner` at the top to immediately personalize the experience.
- **`EventDetailScreen`**: A multi-state screen for a confirmed event.
  - **Upcoming State**: Shows full itinerary, logistics, collaborator info, and a clear `CostBreakdown` component that separates the **Confirmation Fee** (paid to Momento) from the **Estimated Event Cost** (paid to the host/venue).
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
- **`ShareSocialsModal`**: A modal launched from the `ConnectionDetailScreen` that allows a user to select which of their saved social media links they want to share with a specific connection.
- **`InterestDiscoveryScreen`**: The swipeable deck of `PastEventCard` components used to discover a user's interests.
- **`ProfileDiscoveryScreen`**: The swipeable deck of user profile cards used to discover a user's type.
- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.
- **`CameraRollScreen`**: A personal gallery for a user to manage their photos, organized into three sections:
  - **My Profile Photos**: Photos used for their public `social_profile`.
  - **My Event Uploads**: A grid of every photo they have personally uploaded across all event galleries.
  - **Event Albums**: A list of all attended events, acting as shortcuts to each `SharedEventGalleryScreen`.
    _Note: This screen is for participants. Business hosts manage their photos from the `HostDashboardScreen`._
- **`InAppNotificationBanner`**: A banner/toast for displaying notifications while the user is inside the app.
- **`ModeSwitcher`**: A UI control, likely a dropdown or segmented control in the `ProfileTab`, that allows a `Hybrid User` to toggle between "Social Mode" and "Host Mode."

### 6. Settings & User Management

The main `SettingsScreen` will feature a tabbed interface to organize all user-configurable options clearly. This keeps all settings in a single, predictable location while separating them by context.

- **`SettingsScreen`**: The container screen with the three tabs described below.

---

#### Tab 1: Account (Global Settings)

_Handles core, private settings tied to the `users` account._

- **`PrivateInfoScreen`**: To manage private details like email and last name.
- **`SecurityAndPrivacyScreen`**: Hub for safety features.
  - **`BlockedUsersScreen`**: A sub-screen to view and manage blocked users.
  - **`VerificationScreen`**: The UI flow for identity verification.
- **`PaymentMethodsScreen`**: For adding/removing payment methods.
- **`TransactionHistoryScreen`**: For viewing past payments made to Momento.
- **`NotificationSettingsScreen`**: A single, consolidated screen for managing all push and SMS preferences. The UI on this screen will be grouped by context (e.g., "Social & Connections," "Host Notifications") as defined in `_docs/3_engineering/NOTIFICATIONS_PLAN.md`.
- **`LegalScreen`**: Contains links to legal and policy documents.
  - **`PrivacyPolicyScreen`**: A screen displaying the company's privacy policy.
  - **`TermsOfServiceScreen`**: A screen displaying the company's terms of service.
- **`HelpCenterScreen`**: The entry point for contacting support.

---

#### Tab 2: Participant (Social Profile Settings)

_Manages the user's public identity as an event attendee and their discovery preferences._

- **`EditProfileScreen`**: For updating the user's public-facing social profile (`preferred_name`, `bio`, etc.).
- **`CameraRollScreen`**: To manage personal photos and access shared event albums.
- **`FaceCardStylingScreen`**: To customize the visual style of the `FaceCard`.
- **`InvitationPreferencesScreen`**: For "soft" preferences like ideal event lead-time and weekly availability.
- **`EventPreferencesScreen`**: For "hard" filters like max travel distance and price sensitivity. This screen is the destination for contextual nudges.
- **`MySocialLinksScreen`**: For managing private social media links that can be shared one-to-one with connections.

---

#### Tab 3: Host (Hosting-Specific Settings)

_A dynamic tab that is only visible to users with a `host_profiles` record._

- **`EditHostProfileScreen`**: To manage the public host bio, name, and brand/marketing photos (`host_photos`).
- **`ManagePublicSocialsScreen`**: A view (likely reusing `MySocialLinksScreen`) where hosts can toggle the `is_public_on_host_profile` flag for their social links.
- A shortcut to the **`EventsTab`** in Host Mode to manage created events.
- A section for **`Payouts` (Future)**, which will eventually link to a screen for managing bank details.

---

- **`ReportUserFlow`**: A guided flow for submitting a formal report against another user. This can be accessed from multiple places, including the `HelpCenterScreen`.
- **`ReportPhotoModal`**: A modal for reporting an inappropriate photo from the `SharedEventGalleryScreen`.
- **`CoachingModuleScreen`**: A guided, mandatory walkthrough on community standards for users who have received a serious report.

### 7. Hosting Flow

- **`HostDashboardScreen`**: A dashboard for hosts to manage their events.
- **`CreateEventFlow`**: A multi-step process for creating and defining a new event. The flow must support:
  - Defining event details (title, description, age limits, etc.).
  - Setting a real-world `arrival_signpost` cue for attendees.
  - Building a detailed itinerary with multiple `ItineraryStop` components (each with a location, start time, and end time).
  - Adding co-hosts or instructors via the `CollaboratorInput`.
- **`ManageEventScreen`**: The host's view for managing an active or upcoming event.
- **`CollaboratorSearchScreen`**: A sub-screen or modal for hosts to find and add collaborators by searching for other Momento users.

### 8. Safety & Moderation

- **`ReportAndBlockModal`**: Presents the user with clear options to "Block" or "Report" another user.

### 9. Discovery & Content

- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.

---

## Components

This section catalogs the reusable UI elements that form the building blocks of the application's screens.

### Modals & Overlays

- **`DeclineFeedbackModal`**: A modal presented after a user declines an invitation, asking for a reason. Includes options for "Too short notice," "Too far away," and "Too expensive."
- **`EventChangeConfirmationModal`**: A modal that appears when a host has made a material change to an event (e.g., time or location) after an attendee has already confirmed. It clearly states the change and gives the user the choice to "Keep My Spot" or "Cancel & Request Refund".
- **`ContextualNudgeModal`**: A one-time, educational modal that appears after a user action (like declining an event for being "Too far away") to deep-link them to a relevant setting.
- **`MatchReasonBanner`**: An elegant banner displayed prominently on the `InvitationDetailScreen`. It's designed to feel insightful and personal, not like a system debug message. It features a small icon (e.g., ✨) and a short, friendly text that explains why the user was invited to this specific event.

### Indicators & Badges

- **`ShortNoticeBadge`**: A small, non-intrusive badge displayed on invitation cards for events with a lead-time shorter than the user's preference.

### Domain-Specific Components

- **`InterestConstellation`**: An interactive, minimalist graphic displayed on a user's profile. It visualizes their core "interest personas" as stars in a constellation. Tapping a star reveals keywords and concepts related to that persona (e.g., "Adventurous Side: Hiking, Spontaneous Travel"). This component provides a rich, at-a-glance view of a user's character.
- **`KudosShowcase`**: A UI component that displays a user's top 2-3 most-received peer-to-peer kudos as elegant badges or icons (e.g., "Welcoming Vibe," "Great Listener"). It provides a qualitative, authentic summary of their social character, validated by others. The design should gracefully handle states with few or no kudos.
- **`EventDNAGallery`**: A visually rich gallery on a user's profile that displays the event cards for 3-5 of their favorite past events. This component serves as a curated highlight reel of their experiences, showing their interests through action. The design should gracefully handle states with few or no showcased events.
- **`VibeSummary`**: A text component that displays a short, AI-generated narrative paragraph summarizing a user's personality based on their activity. The user has full control to generate, approve, or hide this summary.
- **`CostBreakdown`**: A UI component used on the `EventDetailScreen` that clearly distinguishes between the two types of costs.
  - **Line Item 1**: "Confirmation Fee: $5" with a subtitle explaining this is paid to Momento to secure a spot and encourage commitment.
  - **Line Item 2**: "Estimated Event Cost: $$" with a subtitle explaining this is an estimate paid directly to the host or venue and is not processed by Momento.

### Controls & Inputs

- **`NoticePreferenceSlider`**: A slider control allowing users to set their ideal lead-time for event invitations (from 0 to 14 days).
- **`DistancePreferenceSlider`**: A slider control allowing a user to set their maximum travel distance for events (e.g., 1-25 miles). Ideally, this control would be overlaid on a map that visually adjusts a circle representing their travel radius from their home address.
- **`PriceSensitivitySelector`**: A segmented control allowing a user to set their typical price comfort level for events.
  - `$` (e.g., Free - $15)
  - `$$` (e.g., $15 - $40)
  - `$$$` (e.g., $40 - $75)
  - `$$$$` (e.g., $75+)
- **`DayWeekendToggle`**: A simple toggle or segmented control for setting basic "Weekday" vs. "Weekend" availability preferences.
- **`AvailabilityGrid`**: A 7x2 grid for setting detailed availability preferences for each day and night of the week. Activated via an "Advanced" dropdown in the `InvitationPreferencesScreen`.

- **`AIHypeManModal` (Future)**: A modal that can be triggered before an event to build a user's confidence with personalized conversation starters and reminders of their positive qualities, as described in the marketing strategy.
