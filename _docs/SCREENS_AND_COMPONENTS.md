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

- **`SplashScreen`**: Initial launch screen.
- **`AuthScreen`**: Options for "Log In", "Sign Up", and "Become a Host". This screen also includes a small, less prominent "Contact Support" link in the footer for users who are locked out or unable to sign in.
- **`UnauthenticatedSupportScreen`**: A simple, public-facing form for users who cannot log in.
  - **Accessed From**: The "Contact Support" link on the `AuthScreen`.
  - **Fields**: A basic form with fields for `name`, `reply_to_email`, `phone_number` (to identify their account), and a `body` for their message.
  - **Functionality**: This form submits to a public Convex `httpAction` that creates a `support_tickets` document without requiring user authentication.
- **`SignUpFlow (Participant)`**:
  - `PhoneInputScreen`: For entering a US-based phone number. If the number is already registered, the user is diverted to the `PhoneNumberConflictScreen` instead of the `OTPScreen`.
  - `PhoneNumberConflictScreen`: A screen that asks the user if they are the original owner of the account associated with the phone number, forking the user flow.
  - `OTPScreen`: For entering the one-time password received via SMS to verify the phone number.
    - **Error State**: Displays messages like "Invalid code, please try again."
    - **"Resend Code" Button**: Appears after a cooldown (e.g., 30 seconds). Tapping it triggers a new SMS. If abused (e.g., >3 attempts), the button is disabled for a longer period.
  - `SecondFactorAuthScreen`: A screen that prompts an existing user on a new device to verify their identity through a secondary method (e.g., recovery email, ID verification).
  - `ProfileSetupScreen`: For entering initial public profile information (name, bio).
  - `InitialPhotoScreen`: For taking or uploading the first profile photo. This may include a prompt to use the in-app camera to earn an "Authentic" badge.
    - **Permission Denied State**: If camera permission is denied, the UI hides the "Take Photo" button and emphasizes the "Upload from Library" option.
  - `InterestDiscoveryScreen`: A swipeable deck of "Possibility Cards" to establish the user's initial interest vectors. This is designed to feel like an adventure, not a survey.
- **`LoginScreen`**: For returning users to sign in using their phone number and a one-time password.
- **`InternationalWaitlistScreen`**: A screen that informs non-US users that Momento is not yet available in their country and invites them to join a waitlist.
  - **Success State**: After a user successfully joins the waitlist, the UI provides immediate feedback. The "Notify Me" button becomes disabled and its text changes to "You're on the list!".
- **`AIOnboardingInterviewScreen` (Future)**: A guided, AI-driven voice conversation to conduct a user interview, as an enhancement to the standard `InterestBuilderScreen`.

### 2. Host Onboarding Flow (for Organizations)

- **`CommunityHostSignUpScreen`**: For new `Community Hosts` to sign up with an email and password. This leads into the `HostProfileSetupScreen`.
- **`HostProfileSetupScreen`**: A dedicated screen for `Community Hosts` to enter their organization name, bio, address, website, and upload brand photos.
- **`UserHostOnboardingFlow`**: A multi-step flow for existing participants to become a host, launched from a CTA on their `ProfileTab`.
  1.  **`HostBenefitsScreen`**: Showcases the value proposition of hosting.
  2.  **`HostProfileCreationScreen`**: A simple form to confirm their `host_name` (pre-populated) and add a `host_bio`. Sets `host_type` to `'user'`.
  3.  **`HostOnboardingCompleteScreen`**: A final screen congratulating the user, directing them to the new `ModeSwitcher`, and providing a strong CTA to begin identity verification.

### 3. Core App Navigation (Tab Bar)

_This tab bar represents the primary navigation. Its layout and functionality are determined by the `users.active_role` field, which defaults to `'social'`. For users with only one role (e.g., `Social-Only`), this view is static. For `Hybrid Users` (those with both `socialProfile` and `hostProfile`), this `active_role` can be changed using the `ModeSwitcher` component, which dynamically re-renders the tab bar to match the selected context._

#### Social Mode Navigation

_This is the view for `Social-Only` and `Hybrid` users who are in "Social Mode." It is focused on participation and connection._

- **`HomeTab`**: The main dashboard. Displays upcoming events and pending invitations.
- **`EventsTab`**: Hub for all event-related activities, including "Invitations," "Confirmed," and "Past" events.
- **`DiscoveryTab`**: A main tab with two modes for discovering new things.
  - **Interests Mode**: The "Help us Discover your Interests" flow, with a swipeable deck of past events.
  - **People Mode**: The "Help us Discover your Type" flow, with a swipeable deck of user profiles.
- **`MemoryBookTab`**: Gallery of "Face Cards" for every person met.
- **`MessagesTab`**: List of all 1-on-1 conversations with other participants.
- **`ProfileTab`**: The user's own `Social Profile`. This is the entry point for `Settings` and the `UserHostOnboardingFlow` (via a "Become a Host" CTA). It contains the **`ModeSwitcher`** component for `Hybrid Users`.

#### Host Mode Navigation

_This is the view for `Host-Only` and `Hybrid` users who are in "Host Mode." It is a streamlined dashboard focused on event management._

- **`DashboardTab`**: Key metrics at a glance: revenue, ratings, upcoming event headcounts.
- **`EventsTab`**: Manage all created events (drafts, upcoming, past). Entry point to the `CreateEventFlow`.
- **`InboxTab`**: A dedicated inbox for messages from attendees of the host's events.
- **`ProfileTab`**: Manage the public `Host Profile`, brand photos, payout settings, etc. Contains the **`ModeSwitcher`** for `Hybrid Users`.

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
- **`ModeSwitcher`**: A UI control (e.g., a segmented control) located on the `ProfileTab` for `Hybrid Users`. It is only rendered for users who have both a `socialProfile` and a `hostProfile`. Its state is tied directly to the `users.active_role` field in the database. When the user selects a mode ('Social' or 'Host'), the component triggers a backend mutation to update this field. The app's root navigation component listens to changes in this value to dynamically render the appropriate tab bar layout (`Social Mode Navigation` or `Host Mode Navigation`).

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
  - **Error State**: If a payment fails (e.g., during first event confirmation), the screen displays a non-blocking toast/banner with a clear error message like, "Payment failed. Please check your card details or try another method."
- **`TransactionHistoryScreen`**: For viewing past payments made to Momento.
- **`NotificationSettingsScreen`**: A single, consolidated screen for managing all push and SMS preferences. The UI on this screen will be grouped by context (e.g., "Social & Connections," "Host Notifications") as defined in `_docs/3_engineering/NOTIFICATIONS_PLAN.md`.
- **`LegalScreen`**: Contains links to legal and policy documents.
  - **`PrivacyPolicyScreen`**: A screen displaying the company's privacy policy.
  - **`TermsOfServiceScreen`**: A screen displaying the company's terms of service.
- **`HelpCenterScreen`**: The entry point for contacting support. For logged-in users, it contains a "Contact Support" button that opens the standard, authenticated support ticket form. It may also contain links to FAQs.

---

#### Tab 2: Participant (Social Profile Settings)

_Manages the user's public identity as an event attendee and their discovery preferences._

- **`EditProfileScreen`**: For updating the user's public-facing social profile (`preferred_name`, `bio`, etc.).
- **`CameraRollScreen`**: To manage personal photos and access shared event albums.
- **`FaceCardStylingScreen`**: To customize the visual style of the `FaceCard`.
- **`EventPreferencesScreen`**: A unified screen for managing all event-related preferences, divided into two sections:
  - **Hard Filters**: Contains the `DistancePreferenceSlider` and `PriceSensitivitySelector`. This section has prominent helper text explaining these are strict exclusion rules.
  - **Soft Preferences**: Contains the `NoticePreferenceSlider` for ideal lead time and the `AvailabilityGrid` for setting detailed day-and-night availability.
- **`MySocialLinksScreen`**: For managing private social media links that can be shared one-to-one with connections.
- **`HelpCenterScreen`**: The entry point for contacting support. For logged-in users, it contains a "Contact Support" button that opens the standard, authenticated support ticket form. It may also contain links to FAQs.

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
  - **Body**: "You and [User's Name] are both confirmed for '[Event Title]' which is happening soon. To ensure a smooth experience for everyone, you cannot block this user until after the event. If you don't feel comfortable attending, you can still cancel your spot."
  - **Buttons**: "Cancel Attendance" (navigates to the cancellation flow) and "OK" (dismisses the modal).
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
