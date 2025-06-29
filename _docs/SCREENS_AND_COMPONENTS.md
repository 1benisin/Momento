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
- **`AuthScreen`**: Options for "Log In" or "Sign Up".
- **`SignUpFlow`**:
  - `PhoneInputScreen`: For entering a US-based phone number. This screen will also handle non-US numbers by directing them to the `InternationalWaitlistScreen`.
  - `OTPScreen`: For entering the one-time password received via SMS to verify the phone number.
  - `ProfileSetupScreen`: For entering initial public profile information (name, bio).
  - `InitialPhotoScreen`: For taking or uploading the first profile photo. This may include a prompt to use the in-app camera to earn an "Authentic" badge.
  - `InterestDiscoveryScreen`: A swipeable deck of "Possibility Cards" to establish the user's initial interest vectors. This is designed to feel like an adventure, not a survey.
- **`LoginScreen`**: For returning users to sign in using their phone number and a one-time password.
- **`InternationalWaitlistScreen`**: A screen that informs non-US users that Momento is not yet available in their country and invites them to join a waitlist.
- **`AIOnboardingInterviewScreen` (Future)**: A guided, AI-driven voice conversation to conduct a user interview, as an enhancement to the standard `InterestBuilderScreen`.

### 2. Core App Navigation (Tab Bar)

- **`HomeTab`**: The main dashboard. Displays upcoming events and pending invitations. Can be expanded in the future to include curated content (articles, videos).
- **`EventsTab`**: Hub for all event-related activities.
  - Contains sub-views for "Invitations," "Confirmed," and "Past" events.
- **`MemoryBookTab`**: Gallery of "Face Cards" for every person met.
- **`MessagesTab`**: List of all 1-on-1 conversations.
- **`ProfileTab`**: The user's own profile view, showing their `Social Profile` and `Host Profile` (if applicable). This is the main entry point for the `SettingsScreen` and `My Camera Roll`.
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
- **`UserProfileScreen`**: The public profile view of another user.
- **`FaceCardStylingScreen`**: Where a user can apply AI-driven styles, borders, and other customizations to their Face Card photo after an event.
- **`ShareSocialsModal`**: A modal launched from the `ConnectionDetailScreen` that allows a user to select which of their saved social media links they want to share with a specific connection.
- **`DiscoveryFeedScreen`**: A dedicated screen, potentially a main tab, where users can browse and interact with a swipeable deck of `PastEventCard` components to signal their current interests to the matching algorithm.
- **`ContentDetailScreen`**: For displaying long-form content like articles or videos, likely launched from the `HomeTab`.
- **`CameraRollScreen`**: A personal gallery for a user to manage their photos, organized into three sections:
  - **My Profile Photos**: Photos used for their public `social_profile`.
  - **My Event Uploads**: A grid of every photo they have personally uploaded across all event galleries.
  - **Event Albums**: A list of all attended events, acting as shortcuts to each `SharedEventGalleryScreen`.
- **`InAppNotificationBanner`**: A banner/toast for displaying notifications while the user is inside the app.

### 5. Settings & User Management

- **`SettingsScreen`**: Main menu for all settings.
- **`EditProfileScreen`**: For updating the user's public profile.
- **`NotificationSettingsScreen`**: For managing push and SMS notification preferences.
- **`PaymentMethodsScreen`**: For adding/removing payment methods.
- **`TransactionHistoryScreen`**: For viewing past payments.
- **`MySocialLinksScreen`**: For managing the user's own social media links to be shared via "Social Connect."
- **`SecurityAndPrivacyScreen`**: Hub for safety features, including the blocked users list.
- **`BlockedUsersScreen`**: A screen to view and manage blocked users.
- **`VerificationScreen`**: The UI flow for identity verification.

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
- **`ReportUserFlow`**: A guided flow for submitting a formal report against another user.
- **`ReportPhotoModal`**: A modal for reporting an inappropriate photo from the `SharedEventGalleryScreen`.
- **`CoachingModuleScreen`**: A guided, mandatory walkthrough on community standards for users who have received a serious report.

### 8. Discovery & Content

- **`ProfileBrowseScreen`**: A dedicated screen for browsing and "liking" other user profiles to feed the matching algorithm.
- **`Card`**: The base container for previews and info, with Art Deco/gilded styling.
- **`Avatar`**: For user profile pictures.
- **`Icon`**: A consistent wrapper for our icon library.
- **`Modal`**: A generic component for pop-ups.
- **`ActionSheet`**: A slide-up menu from the bottom of the screen, used for contextual actions like "Block" or "Report".
- **`Spinner`**: To indicate loading states.
- **`Switch`**: For settings toggles.
- **`EmptyState`**: A reusable component for screens that have no content yet (e.g., no invitations, no memories), typically containing an icon, title, and message.
- **`StyledText`**: To enforce consistent typography (`title`, `heading`, `body`).

---

## Components

### 1. Core UI Primitives (The Building Blocks)

- **`Button`**: For all primary actions (`primary`, `secondary`, `outline` variants).
- **`Input`**: Standard text input for forms.
- **`AddNoteInput`**: A larger text area, specifically for the private notes feature on the `ConnectionDetailScreen`.
- **`Card`**: The base container for previews and info, with Art Deco/gilded styling.
- **`Avatar`**: For user profile pictures.
- **`Icon`**: A consistent wrapper for our icon library.
- **`Modal`**: A generic component for pop-ups.
- **`Spinner`**: To indicate loading states.
- **`Switch`**: For settings toggles.
- **`StyledText`**: To enforce consistent typography (`title`, `heading`, `body`).

### 2. Layout & Navigation Components

- **`ScreenWrapper`**: Handles safe areas, backgrounds, and scrolling for every screen.
- **`Header`**: A custom header with title, back button, and action buttons.
- **`MapView`**: A wrapper for an interactive map component to display event locations and itineraries.

### 3. Domain-Specific Components (The App's "Lego Bricks")

- **`EventListItem`**: A compact preview of an event for lists, used on the `EventsTab` to show invitations, confirmed events, and past events.
- **`EventPostFeed`**: A component for the `EventDetailScreen` that displays a list of `EventPostItem` components.
- **`EventPostItem`**: A component to render a single message in an event's public message feed.
- **`FaceCard`**: The signature, highly-stylized component for the Memory Book.
- **`PastEventCard`**: A full-screen, visually rich card used in the `DiscoveryFeedScreen`. It displays the details of a real, highly-rated past event to help users refine their interest profile.
- **`PossibilityCard`**: The swipeable, interactive card used in the `InterestDiscoveryScreen` during onboarding to gauge a user's interest in fictitious events.
- **`ItineraryStop`**: Renders a single stop in an event's itinerary.
- **`CollaboratorInput`**: A form component in the `CreateEventFlow` for adding collaborators, which launches the `CollaboratorSearchScreen`.
- **`ConversationListItem`**: A row in the messages list (avatar, name, message preview).
- **`ChatMessage`**: The chat bubble for DMs.
- **`KudoBadge`**: The small, collectible badge for peer-to-peer kudos.
- **`RatingInput`**: Interactive star-based rating component.
- **`SettingRow`**: A reusable row for settings screens.
- **`DeckOfCardsAttendee`**: The card used in the arrival flow showing an attendee's photo. This must have a visually distinct **`HostCard`** variant to clearly identify the host in the arrival deck.
- **`AIImageGenerator` (Future)**: A component for the `CreateEventFlow` that allows hosts to generate unique invitation images based on event details.
