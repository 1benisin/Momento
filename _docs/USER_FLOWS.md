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
- **[Refining Tastes with the Discovery Feed](#10-refining-tastes-with-the-discovery-feed)**: The flow for continuously evolving a user's interest profile after onboarding.
- **[Managing Photos in a Shared Event Gallery](#11-managing-photos-in-a-shared-event-gallery)**: The flow for attendees to share memories and hosts to maintain a safe environment in a shared event photo album.
- **[Customizing a Face Card](#12-customizing-a-face-card)**: The flow for personalizing a user's public-facing `FaceCard` after their first event.
- **[Cancelling Event Attendance](#8-cancelling-event-attendance)**: The flow for a confirmed attendee to formally cancel attendance and understand the consequences.

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

    - `->` **`InvitationDetailScreen`**: Displays all details for the event: itinerary, host info, description, etc.
    - **User Action**: Taps "Accept."

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

    - **User Action**: Navigates to `SettingsScreen` -> `MySocialLinksScreen`.
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
    - A record is created in the `reports` table for the Momento review team.
    - The reporter receives a push notification confirming the report was received and will be reviewed.

---

## 8. Cancelling Event Attendance

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

## 9. A Social User Becomes a Host

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
8.  **Completion**: The user is returned to their `ProfileTab`. They can now switch to "Host Mode" to begin creating events.

---

## 10. Switching Between Social & Host Modes

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

## 11. Refining Tastes with the Discovery Feed

- **Role:** `Participant`
- **Goal:** Continuously evolve their interest profile after onboarding.

### Flow Steps:

1.  **Entry Point**: User navigates to the `DiscoveryFeedScreen` (potentially from the `HomeTab` or its own dedicated tab).
2.  **Interaction**: The user is presented with a full-screen, swipeable deck of `PastEventCard` components. Each card represents a real, highly-rated past event.
3.  **User Action**: The user swipes right ("I'm Interested") or left ("Not for Me") on each card.
4.  **System Action**: Each swipe provides a new signal to the matching algorithm.
    - A right swipe updates the user's `positive_interest_vector`.
    - A left swipe updates the user's `negative_interest_vector`.
    - This allows the user's taste profile to adapt and change over time.

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
