# User Flows

This document maps out the key user journeys within the Momento application.

- **[New User Onboarding & First Invitation Acceptance](#1-new-user-onboarding--first-invitation-acceptance)**: The journey of a brand new user from first launch to accepting their first event invitation.
- **[Non-US User Onboarding (Waitlist)](#2-non-us-user-onboarding-waitlist)**: The flow for a user who attempts to sign up from outside the initial launch country (US).
- **[Host Onboarding (for Venues & Organizations)](#3-host-onboarding-for-venues--organizations)**: The journey for a business or service provider to create a host-only account and publish a first event.
- **[Event Lifecycle (Participant's View)](#3-event-lifecycle-participants-view)**: The complete experience for a participant, from pre-event reminders and arrival to post-event feedback and connection.
- **[Hosting Journey (User Host's View)](#4-hosting-journey-user-hosts-view)**: The process for a user to become a host, then create, manage, and complete a successful event.
- **[Making a Connection (Post-Event)](#5-making-a-connection-post-event)**: How users manage their connections in the Memory Book and privately share social media links after an event.
- **[User Safety: Blocking Another User](#6-user-safety-blocking-another-user)**: The flow for permanently and silently preventing all interaction with another user.
- **[User Safety: Reporting Another User](#7-user-safety-reporting-another-user)**: The flow for formally reporting another user for a community standards violation.
- **[A Social User Becomes a Host](#8-a-social-user-becomes-a-host)**: The journey for an existing participant to create a host profile and gain access to "Host Mode."
- **[Switching Between Social & Host Modes](#9-switching-between-social--host-modes)**: How a `Hybrid User` navigates between the participant and host experiences.
- **[Discovering Your Interests](#10-discovering-your-interests)**: The flow for continuously evolving a user's interest profile after onboarding.
- **[Discovering Your Type](#11-discovering-your-type)**: The flow for helping the algorithm understand what types of people a user connects with.
- **[Managing Photos in a Shared Event Gallery](#12-managing-photos-in-a-shared-event-gallery)**: The flow for attendees to share memories and hosts to maintain a safe environment in a shared event photo album.
- **[Customizing a Face Card](#13-customizing-a-face-card)**: The flow for personalizing a user's public-facing `FaceCard` after their first event.
- **[Cancelling Event Attendance](#14-cancelling-event-attendance)**: The flow for a confirmed attendee to formally cancel attendance and understand the consequences.
- **[Contacting Support](#15-contacting-support)**: The flow for a user to send a direct message to the Momento support team.
- **[User Safety: Reporting a User (via Help Center)](#16-user-safety-reporting-a-user-via-help-center)**: The flow for reporting a user through the help center, which is critical if the reporting user has already been blocked.
- **[Invitation Preferences](#17-invitation-preferences)**: The flow for configuring soft invite lead-time and day/week availability preferences.
- **[User Declines Invite (Contextual Onboarding)](#18-user-declines-invite-contextual-onboarding)**: The flow for when a user declines an event, and how the app uses that moment to contextually introduce preference settings.

---

This document maps out the key user journeys within the Momento application. Each flow describes the step-by-step path a user takes to accomplish a specific goal, referencing the screens and components defined in `SCREENS_AND_COMPONENTS.md`.

---

## 1. New User Onboarding & First Invitation Acceptance

This flow describes the journey of a brand new user from first launch to accepting their first event invitation.

- **Role:** `Participant` (default for all new users)
- **Goal:** Create an account, set up a basic profile, and confirm attendance for an event.

### Flow Steps:

1.  **Entry Point**: User opens the app for the first time.

    - `->` **`SplashScreen`**: Displays the Momento logo.

2.  **Authentication Choice**:

    - `->` **`AuthScreen`**: Presents "Sign Up" and "Log In" options.
    - **User Action**: Taps "Sign Up".

3.  **Account Creation (US-Based User)**:

    - `->` **`SignUpFlow`**
    - **`PhoneInputScreen`**: User enters a valid US phone number.
    - **User Action**: Taps "Continue".
    - `->` **`OTPScreen`**: User receives an SMS with a one-time password and enters it.
    - Upon successful verification, the flow continues to the profile creation steps:
    - **`ProfileSetupScreen`**: User provides their public `first_name` and a short `bio`.
    - **`InitialPhotoScreen`**: User uploads or takes their first profile photo. The UI encourages using the in-app camera to earn the "Authentic" badge.
    - **`InterestDiscoveryScreen`**: The user is presented with a swipeable deck of "Possibility Cards." They swipe right or left on a series of beautifully designed, fictitious event concepts. This engaging flow establishes their initial interest vectors for the matching algorithm.

4.  **Landing in the App**:

    - Upon successful sign-up, the user is directed to the main app interface.
    - `->` **`HomeTab`**: The main dashboard. It may be in an empty state, perhaps with a welcome message.

5.  **Receiving First Invitation**:

    - **Trigger**: The backend matching algorithm identifies the new user as a good fit for an event.
    - **Notification**: The user receives a push notification and/or an SMS.
    - **`InAppNotificationBanner`**: If the user is in the app, a banner appears.
    - **User Action**: Taps the notification or a prompt on the `HomeTab`.

6.  **Viewing the Invitation**:

    - `->` **`InvitationDetailScreen`**: Displays all details for the event: itinerary, host info, description, etc. Upon opening the screen, the user first sees the `MatchReasonBanner` at the top, explaining why they were invited (e.g., "We thought you'd like this because you're interested in Live Music."). This immediately reassures the user that the invitation is personalized. The UI will also prominently display a `ShortNoticeBadge` if the event's lead-time is less than the user's preference.
    - **User Actions**:
      - Taps "Accept." (Proceeds to Step 7)
      - Taps "Decline."
        - `->` **`DeclineFeedbackModal`**: A modal appears asking for a reason.
        - **User Action**: Selects the "Too short notice" option.
        - **System Action**: The user's `min_lead_time` preference is slightly increased. The invitation is dismissed.

7.  **First-Time Payment**:

    - **Trigger**: The system detects the user has no saved payment method.
    - `->` **`PaymentMethodsScreen`**: Prompted modally for the user to add a credit card.
    - **User Action**: Enters card details and saves.

8.  **Confirmation**:
    - The payment is processed for the $5 event fee.
    - `->` **`EventDetailScreen` (Upcoming State)**: The user sees the confirmed event details. The screen prominently features an "Add to Calendar" button.
    - **User Action**: User can optionally tap "Add to Calendar" to download an `.ics` file.

---

## 2. Non-US User Onboarding (Waitlist)

This flow describes the journey for a user who attempts to sign up from outside the initial launch country (US).

- **Role:** `Prospective User`
- **Goal:** To be informed about country availability and join a waitlist.

### Flow Steps:

1.  **Entry Point**: User opens the app and navigates to the sign-up flow.

    - `->` **`AuthScreen`**: Presents "Sign Up" and "Log In" options.
    - **User Action**: Taps "Sign Up".

2.  **Phone Number Entry**:

    - `->` **`PhoneInputScreen`**: User enters a non-US phone number.
    - **System Action**: The app detects the country code is not `+1` (United States).

3.  **Joining the Waitlist**:

    - `->` **`InternationalWaitlistScreen`**: The user is shown a message explaining that Momento is not yet available in their country.
    - The screen includes a button like "Notify Me When You Launch Here."
    - **User Action**: Taps the button to confirm.
    - **System Action**: The user's phone number is securely stored in the `waitlist_users` table for future communication.
    - The flow ends here for the user.

---

## 3. Host Onboarding (for Venues & Organizations)

This flow describes the journey for a business or service provider who wants to join Momento exclusively to host events.

- **Role:** `Community Host`
- **Goal:** Create a host-only account and publish a first event.

### Flow Steps:

1.  **Entry Point**: User opens the app for the first time.

    - `->` **`SplashScreen`**: Displays the Momento logo.

2.  **Authentication Choice**:

    - `->` **`AuthScreen`**: Presents "Sign Up," "Log In," and a distinct "Become a Host" option.
    - **User Action**: Taps "Become a Host."

3.  **Account Creation (Community Host)**:

    - `->` **`HostSignUpScreen`**: User signs up using a business email and password.
    - An email verification step may be required.

4.  **Profile & Verification**:

    - `->` **`VerificationScreen`**: The user is required to complete mandatory ID verification for the primary business contact.
    - `->` **`HostProfileSetupScreen`**: After verification, the user sets up their public `host_profiles` record. They enter the business name, bio, and address, and can upload brand images (like a logo and venue photos) to the new `host_photos` table.
    - This flow entirely bypasses the participant onboarding (e.g., `InterestDiscoveryScreen`).

5.  **Landing in the App**:

    - Upon successful sign-up, the user is directed to a tailored version of the app.
    - `->` **`HostDashboardScreen`**: The main dashboard focuses on event management. Features for participants, like the `MemoryBookTab` and `DiscoveryFeedScreen`, are not present.

6.  **Creating First Event**:
    - The user is guided to create their first event.
    - `->` The flow proceeds directly into the **`CreateEventFlow`**, as described in the "Hosting Journey" below.

---

## 4. Event Lifecycle (Participant's View)

- **Role:** `Participant`
- **Goal:** Experience an event from pre-arrival to post-event connection.

### Flow Steps:

1.  **Pre-Event Reminders**:

    - **Trigger**: 24 hours and 1 hour before the event `start_time`.
    - **Notification**: User receives `push_event_reminders` and/or `sms_reminders`.

2.  **Day of Event / Arrival**:

    - User navigates to the event's first `ItineraryStop` location, guided by the `arrival_signpost` description (e.g., "Look for the green picnic blanket").
    - **(Optional) Automated Reminder**: About 15 minutes after the event start time, if the user has not yet checked in, they receive a push notification: "'[Event Title]' has started! If you've arrived, don't forget to check in."
    - User opens the app. `->` **`EventDetailScreen` (Arrival State)**.
    - **User Action**: Taps the "I'm Here" button.
    - **System Action**: The app records the user's location for check-in verification.

3.  **First-Time Attendee Experience**:

    - **Trigger**: This is the user's very first event check-in.
    - `->` **`FirstEventCheckInPhotoScreen`**: The user is prompted to take an in-app photo of themselves. This photo becomes their first "Authentic" `FaceCard`.

4.  **The "Deck of Cards" Reveal**:

    - **Trigger**: At least two people (attendees or host) have checked in.
    - The `EventDetailScreen` now displays the `DeckOfCardsAttendee` component.
    - Users can swipe through the `FaceCard` of each checked-in attendee to identify each other. The `HostCard` variant is visually distinct.

5.  **Host Arrival Notification**:

    - **Trigger**: The event host successfully checks in.
    - **Notification**: All currently checked-in attendees receive a push notification: "Your host, [Host Name], has arrived!"

6.  **Post-Event Feedback**:

    - **Trigger**: The day after the event.
    - **Notification**: User receives a push notification prompting for feedback.
    - **User Action**: Tapping the notification (or a prompt in the `EventsTab`) opens the `PostEventFeedbackFlow`.

7.  **Submitting Feedback & Unlocking Connections**:

    - `->` **`PostEventFeedbackFlow`**:
    - **Step 1: `RatingScreen`**: User rates the event and host, and reports any "no-shows" or instances of "check-in & bail" where an attendee was present for check-in but did not participate.
    - **Step 2: `PeerKudosScreen`**: User gives anonymous, private kudos to fellow attendees.
    - **System Action**: Upon completion, the backend unlocks post-event features for this user.

8.  **Post-Event Hub**:
    - `->` **`EventDetailScreen` (Post-Event State)**: The screen now includes new tabs or sections for:
    - The `EventPostFeed` for public messages.
    - Access to the `SharedEventGalleryScreen`.
    - Direct messaging is now enabled with other attendees who have also submitted feedback.

---

## 5. Making a Connection (Post-Event)

- **Role:** `Participant`
- **Goal:** Privately manage connections and share social media links after an event.

### Flow Steps:

1.  **Prerequisite**: A user must first add their social media links in their private profile settings.

    - **User Action**: Navigates to `SettingsScreen` -> `Participant Tab` -> `My Social Links`.
    - `->` **`MySocialLinksScreen`**: User adds their Instagram URL. If they are also a host, they see a toggle to "Make public on Host Profile," which they leave off for this private link.

2.  **Accessing Connections**:

    - **Entry Point**: The user has attended an event and submitted their feedback.
    - **User Action**: Navigates to the `MemoryBookTab`.
    - `->` **`MemoryBookTab`**: The user sees a gallery of `FaceCard`s for every person they have met, sorted chronologically.

3.  **Viewing a Specific Connection**:

    - **User Action**: Taps on a `FaceCard`.
    - `->` **`ConnectionDetailScreen`**: Displays the immutable snapshot of the `FaceCard` from the event where they met.

4.  **Interacting with the Connection**:

    - On the `ConnectionDetailScreen`, the user can:
    - Write private notes in the `AddNoteInput`.
    - Toggle a "Favorite" star for their own organization.
    - Set their preference signal: "Connect Again" (for the matching algorithm) or "Don't Connect Again" (a soft block).
    - **User Action**: Taps the "Share Socials" button.

5.  **Sharing Social Media Links**:

    - `->` **`ShareSocialsModal`**: A modal appears, listing the social media profiles the user has saved in their `MySocialLinksScreen`.
    - **User Action**: The user checks the boxes for the links they wish to share with this specific person and confirms.
    - **System Action**: A `social_connections` record is created. The share is silent; the other user receives no notification.

6.  **Receiving Social Media Links (The Discovery Moment)**:

    - **Trigger**: Another user has shared a link with the current user.
    - The user will not be notified. Instead, the next time they view the sharer's `ConnectionDetailScreen`, the relevant social icon will be visible.
    - Tapping the icon opens the link. A "Share Back" button is also displayed to make reciprocation easy.

---

## 6. User Safety: Blocking Another User

- **Role:** Any
- **Goal:** Permanently and silently prevent all interaction with another user.

### Flow Steps:

1.  **Entry Point**: From a user's profile (`UserProfileScreen`) or their `ConnectionDetailScreen`.
2.  **User Action**: User taps the "..." menu and selects "Block [User Name]".
3.  `->` **`ReportAndBlockModal`**: A modal appears, clarifying the distinction between blocking and reporting.
4.  **User Action**: User confirms they want to "Block".
5.  **System Action**:
    - A `blocked_users` record is created.
    - The two users are immediately and mutually removed from each other's `MemoryBookTab`.
    - All direct messaging history and capabilities are severed.
    - The backend algorithm will now permanently prevent them from being matched in any future event.
    - The blocked user is silently added to the current user's `BlockedUsersScreen` in settings. The blocked user is **not** notified.

---

## 7. User Safety: Reporting Another User

- **Role:** Any
- **Goal:** Formally report another user for a community standards violation.

### Flow Steps:

1.  **Entry Point**: From a user's profile (`UserProfileScreen`) or their `ConnectionDetailScreen`.
2.  **User Action**: User taps the "..." menu and selects "Report [User Name]".
3.  `->` **`ReportAndBlockModal`**: A modal appears, clarifying the distinction between blocking and reporting.
4.  **User Action**: User selects "Report".
5.  `->` **`ReportUserFlow`**: A guided, multi-step process begins.
    - **Step 1 (Categorize)**: The user selects the reason for the report from a predefined list (e.g., Harassment, In-Person Misconduct).
    - **Step 2 (Describe)**: The user provides detailed comments about the incident.
    - **Step 3 (Confirm)**: The user reviews and submits the report.
6.  **System Action**:
    - A "Block" is automatically and silently triggered between the two users.
    - A record is created in the `reports` table for the Momento review team, including a link to the `event_id` if the report was initiated from an event context.
    - The reporter receives a push notification confirming the report was received and will be reviewed.

---

## 8. A Social User Becomes a Host

This flow describes the journey for an existing participant to create a host profile.

- **Role:** `Participant` -> `Hybrid User`
- **Goal:** To gain the ability to create and manage events.

### Flow Steps:

1.  **Entry Point**: A `Social-Only` user is in their `ProfileTab`.
2.  **User Action**: Taps a "Become a Host" or "Start Hosting" call-to-action button.
3.  `->` **Host Onboarding Intro Screen**: A screen explaining the benefits and responsibilities of hosting.
4.  **User Action**: Confirms they want to proceed.
5.  `->` **`VerificationScreen`**: The user is required to complete mandatory ID verification. This is a critical trust and safety step.
6.  `->` **`HostProfileSetupScreen`**: After verification, the user sets up their public `host_profiles` record. For a `User Host`, this is simpler than for a `Community Host`, focusing on their host bio and name.
7.  **System Action**:
    - A `host_profiles` record is created and linked to the user's `users.id`. The user is now a `Hybrid User`.
    - The **`ModeSwitcher`** component now appears in their `ProfileTab`.
    - The **`Host Tab`** now appears in the main `SettingsScreen`.
8.  **Completion**: The user is returned to their `ProfileTab`. They can now switch to "Host Mode" to begin creating events.

---

## 9. Switching Between Social & Host Modes

This flow describes how a `Hybrid User` navigates between the two core app experiences.

- **Role:** `Hybrid User`
- **Goal:** To seamlessly switch between managing hosting duties and participating socially.

### Flow Steps:

1.  **Entry Point**: A `Hybrid User` is in the app, either in "Social Mode" or "Host Mode."
2.  **User Action**: Navigates to their `ProfileTab`.
3.  The `ProfileTab` displays their currently active profile (`Social` or `Host`). At the top of the screen is the `ModeSwitcher` component.
4.  **User Action**: Taps on the `ModeSwitcher`.
5.  `->` A simple modal or dropdown appears with the options:
    - "Switch to Host Mode" (if currently in Social)
    - "Switch to Social Mode" (if currently in Host)
6.  **User Action**: Selects the desired mode.
7.  **System Action**:
    - The app's entire UI instantly reconfigures. The tab bar changes to the navigation set for the selected mode.
    - The user's `users.active_role` is updated in the database to remember their choice for their next session.
    - The user is now in the chosen mode and can access all its features. For example, switching to "Host Mode" reveals the `DashboardTab` and `CreateEventFlow`. Switching to "Social Mode" reveals the `MemoryBookTab` and `MessagesTab`.

---

## 10. Discovering Your Interests

- **Role:** `Participant`
- **Goal:** Continuously evolve their interest profile after onboarding.

### Flow Steps:

1.  **Entry Point**: User navigates to the `DiscoveryTab` and selects the "Interests" mode.
2.  `->` **`InterestDiscoveryScreen`**: The user sees the headline **"Help us Discover your Interests"**.
3.  **Interaction**: The user is presented with a full-screen, swipeable deck of `PastEventCard` components. Each card represents a real, highly-rated past event.
4.  **User Action**: The user swipes right or left on each card.
5.  **System Action**: Each swipe provides a new signal to the matching algorithm. This allows the user's taste profile to adapt and change over time.

---

## 11. Discovering Your Type

- **Role:** `Participant`
- **Goal:** To provide signals to the matching algorithm about the types of people they would like to connect with.

### Flow Steps:

1.  **Entry Point**: User navigates to the `DiscoveryTab` and selects the "People" mode.
2.  `->` **`ProfileDiscoveryScreen`**: The user sees the headline **"Help us Discover your Type"**.
3.  **Interaction**: The user is presented with a swipeable deck of profile cards, showing only users of the opposite sex.
4.  **User Action**: The user swipes using the intention-driven labels:
    - **Right**: "I'd like to create a memory with them."
    - **Left**: "Not the connection I'm looking for."
5.  **System Action**: Each right swipe provides a private signal to the matching algorithm, influencing the user's `person_attraction_vector`. The other user is not notified.

---

## 12. Managing Photos in a Shared Event Gallery

This flow covers how attendees share memories and how hosts maintain a safe environment.

- **Role:** `Participant`, `User Host`
- **Goal:** Collaboratively build and moderate a shared event photo album.

### Flow A: Uploading a Photo

1.  **Entry Point**: A user (attendee or host) has attended an event, submitted feedback (if an attendee), and is viewing the `EventDetailScreen` (Post-Event State).
2.  **User Action**: Navigates to the "Photos" tab and enters the `SharedEventGalleryScreen`.
3.  **User Action**: Taps the "Upload Photos" button.
4.  The user selects one or more photos from their device's native photo library.
5.  **User Action**: Confirms the upload.
6.  **System Action**: The photos are uploaded to the event's gallery and become visible to all other verified attendees. Other attendees may receive a bundled push notification that new photos have been added.

### Flow B: Host Moderates a Photo

1.  **Entry Point**: A host can either be proactively reviewing photos in their `SharedEventGalleryScreen` or receive a `ReportPhotoModal` notification if an attendee has reported a photo.
2.  **User Action**: The host taps on a photo to view it and finds a "Remove Photo" option.
3.  **User Action**: Confirms the removal in a confirmation dialog.
4.  **System Action**: The photo's `status` is updated in the `event_photos` table, and it is hidden from the gallery. The original uploader may be notified that their photo was removed by the host.

---

## 13. Customizing a Face Card

- **Role:** `Participant`

## 14. Cancelling Event Attendance

This flow outlines what happens when a confirmed attendee decides they can no longer make it to an event.

- **Role:** `Participant`
- **Goal:** To formally cancel attendance and understand the consequences.

### Flow Steps:

1.  **Entry Point**: A user has a confirmed spot for an upcoming event.

    - **User Action**: Navigates to the `EventDetailScreen`.

2.  **Initiating Cancellation**:

    - The user sees a "Can't Make It?" or "Cancel Attendance" button.
    - **User Action**: Taps the button.

3.  **Confirmation & Consequences**:

    - A confirmation modal appears, clearly stating the outcome based on the timing.
    - **Scenario A: More than 24 hours before event start.**
      - **Modal Text:** "Are you sure you want to cancel? Your $5 event fee is non-refundable. Because you are cancelling early, this will not negatively affect your account standing."
    - **Scenario B: Within 24 hours of event start.**
      - **Modal Text:** "Are you sure you want to cancel? Your $5 event fee is non-refundable. Cancelling this close to the event will negatively impact your account's reliability rating."

4.  **User Confirmation**:

    - **User Action**: User confirms the cancellation.

5.  **System Action**:
    - The user's `invitations` record status is updated to `'cancelled'`.
    - If the cancellation was late, their `attendance` record is marked as `'cancelled_late'`, and their internal `absentee_rating` is lowered.
    - If the cancellation was early, the system attempts to fill the spot.
    - The user is returned to the event screen, which now shows their cancelled status.

---

## 15. Contacting Support

This flow describes how a user sends a direct, categorized message to the Momento support team.

- **Role:** Any
- **Goal:** To get help with a specific issue, provide feedback, or ask a question.

### Flow Steps:

1.  **Entry Point**: User navigates to `SettingsScreen` -> `Account Tab` -> `Help & Support`.
2.  `->` **`HelpCenterScreen`**: The user is presented with a list of categories.
3.  **User Action**: Selects a category, for example, "Help with a Payment".
4.  `->` **`SupportTicketFormScreen`**: The form is tailored to the selected category.
    - **Email Confirmation**: The form checks if the user has an email in their `users` record.
      - If yes, it displays a message: "We will respond to: `user@example.com`".
      - If no, it displays a required text input field for the user to enter their email address.
    - A message reminds the user about the non-refundable fee policy.
    - A dropdown is pre-populated with their recent transactions. The user can select one, or choose "General Payment Question."
    - A text field allows them to describe the issue.
5.  **User Action**: Fills out the form and taps "Submit".
6.  **System Action**:
    - A new record is created in the `support_tickets` table, including the `reply_to_email`.
    - The backend automatically attaches relevant metadata (app version, OS, user role, selected event/payment ID).
7.  **Confirmation**: The user sees a confirmation message with a user-facing ticket number (e.g., #1001) and is told to expect a response via email.

---

## 16. User Safety: Reporting a User (via Help Center)

This flow is a critical alternative to the standard reporting flow, ensuring a user can always report someone, even if they have been blocked by them.

- **Role:** Any
- **Goal:** To formally report another user when unable to access their profile.

### Flow Steps:

1.  **Entry Point**: User navigates to `SettingsScreen` -> `Account Tab` -> `Help & Support`.
2.  `->` **`HelpCenterScreen`**: User sees the list of categories.
3.  **User Action**: Selects "Report Another User".
4.  `->` The app initiates the standard **`ReportUserFlow`**, now with more context-gathering steps.
5.  **Step 1: Select Event**:
    - The user is shown a dropdown of their past events, ordered from most recent.
    - **User Action**: Selects the event where the incident occurred. An option for "This didn't happen at a specific event" is also available.
6.  **Step 2: Identify Who/What to Report**:
    - **Trigger**: The user selected an event.
    - A new dropdown appears, populated with everyone and everything associated with that event:
      - The Host
      - All Attendees
      - All Collaborators
      - The Venue / Location
      - An option for "Someone else not on this list"
    - **User Action**: Selects the person, venue, or "Someone else".
7.  **Step 3: Provide Details**:
    - **If "Someone else" was selected**: A text field appears for the user to describe the person.
    - **For all selections**: The flow continues to the standard reporting steps of selecting a violation category and providing detailed comments.
8.  **Step 4: Confirm & Submit**:
    - The user reviews their report and submits it.
9.  **System Action**:
    - A "Block" is automatically triggered between the reporter and the reported user (if a user was selected).
    - A record is created in the `reports` table with all context (reporter, reported entity, event, etc.).
    - A notification is sent to the reporter confirming receipt.

## 17. Invitation Preferences

- **Role:** Participant
- **Goal:** Configure soft invite lead-time and day/week availability preferences.

### Flow Steps:

1.  **Entry Point**: User navigates to `SettingsScreen` -> `Participant Tab` -> `Invitation Preferences`.
2.  `->` **`InvitationPreferencesScreen`**: Displays:
    - **Lead-Time Slider** (`NoticePreferenceSlider`), default 3 days (range 0–14 days).
    - **Day/Week Availability**: Soft Day/Weekend toggle (`DayWeekendToggle`).
    - **[Advanced]** link dropdown to activate `AvailabilityGrid` for detailed day/night preferences.
3.  **User Action**: Adjusts preferences and taps "Save".
4.  **System Action**: Preferences (`user.min_lead_time`, `user.availability`) saved; invites outside preferences show a "Short-Notice" badge for soft deprioritization.

## 18. User Declines Invite (Contextual Onboarding)

- **Role:** `Participant`
- **Goal:** To decline an event invitation and be gently onboarded to a relevant preference setting.

This flow is critical for progressive discovery, ensuring the user isn't overwhelmed with settings during initial onboarding. We introduce a setting at the exact moment it becomes relevant to them.

### Flow Steps:

1.  **Entry Point**: User is viewing an event invitation.

    - `->` **`InvitationDetailScreen`**: Displays all details for an event.

2.  **User Action**: Taps the "Decline" button.

3.  **Decline Reason**:

    - `->` **`DeclineFeedbackModal`**: A modal appears asking for a reason (e.g., "Not interested," "Too busy," "Too far away," "Too expensive").

4.  **Contextual Nudge**:

    - **Trigger 1**: User selects the "Too far away" option.
    - `->` **`ContextualNudgeModal`**: A one-time, educational modal appears.
    - **Message**: "Sorry this one was a bit of a trek! Did you know you can set a preferred travel distance? We'll only show you events inside your radius."
    - **Actions**:

      - **Primary Button**: "Set My Radius"
      - **Secondary Button**: "Not Now"

    - **Trigger 2**: User selects the "Too expensive" option.
    - `->` **`ContextualNudgeModal`**: A one-time, educational modal appears.
    - **Message**: "We get it, budgets are important. Did you know you can set a price comfort level? We'll only show you events that match your preference."
    - **Actions**:
      - **Primary Button**: "Set My Budget"
      - **Secondary Button**: "Not Now"

5.  **Deep-linking to Settings**:

    - **User Action**: User taps "Set My Radius" or "Set My Budget".
    - `->` **`SettingsScreen`**: The user is taken directly to the `Participant Tab` and shown the `EventPreferencesScreen`, with the relevant setting possibly highlighted.
    - The user can now configure their preference. The original invitation is dismissed.

6.  **Dismissal**:
    - **User Action**: User taps "Not Now".
    - The modal is dismissed, and the invitation is removed. The app can choose to not show this specific nudge again for a set period.
