# App Features

This document is organized into the following sections.

- [1. User Profiles & Verification](#1-user-profiles--verification)
  - [Phone-First Authentication](#phone-first-authentication--us-only-launch)
  - [The Authentic Photo](#the-authentic-photo)
  - [User Verification](#user-verification)
- [2. Monetization & Payments](#2-monetization--payments)
- [3. Hosting & Event Creation](#3-hosting--event-creation)
  - [Host Types & Onboarding](#host-types--onboarding)
  - [Switching Between Social & Host Modes](#switching-between-social--host-modes)
  - [Publishing Events: The Verification Gate](#publishing-events-the-verification-gate)
  - [Host Tools & Controls](#host-tools)
  - [The Event Lifecycle (Host's View)](#the-event-lifecycle-host's-view)
- [4. Interest Building Flow: The Momento Preview](#4-interest-building-flow-the-momento-preview)
- [5. The Invitation](#5-the-invitation)
  - [Algorithm Transparency: The "Why"](#algorithm-transparency-the-why)
  - [Declining an Invitation](#declining-an-invitation-capturing-user-intent)
  - [Calendar Integration](#post-confirmation--calendar-integration)
- [6. Dynamic Duos: Attend with a Friend](#6-dynamic-duos-attend-with-a-friend)
- [7. Event Preferences & Filtering](#7-event-preferences-filtering)
- [8. The Arrival Experience: The Signal](#8-the-arrival-experience-the-signal)
  - [The Host Sets the Stage](#the-host-sets-the-stage)
  - [The Deck of Cards](#the-arrival-flow-the-deck-of-cards)
- [9. Post-Event Interaction](#9-post-event-interaction)
  - [Peer-to-Peer Kudos](#peer-to-peer-kudos)
- [10. The Memory Book & The Face Card](#10-the-memory-book--the-face-card)
  - [The Face Card Lifecycle](#the-face-card-lifecycle)
  - [Social Connect](#social-connect-effortless-social-sharing)
- [11. Shared Event Galleries & Camera Roll](#11-shared-event-galleries--camera-roll)
- [12. User Safety: Blocking & Reporting](#12-user-safety-blocking--reporting)
  - [A Three-Tiered System](#a-three-tiered-system)
  - [Contacting Support](#contacting-support)
  - [Community Reliability: Cancellations & No-Shows](#community-reliability-cancellations--no-shows)
- [13. Discovering Your Interests](#13-discovering-your-interests)
- [14. Discovering Your Type](#14-discovering-your-type)
- [15. Notifications](#15-notifications)

---

This document outlines the core features of the Momento application.

## 1. User Profiles & Verification

User profiles will contain three categories of information:

- **Public Information**: Profile images, first name, etc.
- **Private Information**: Phone number for authentication and SMS notifications, an optional email for account recovery, etc. All private information is visible only to the user.
- **Internal Information**: Data used by the app for ranking and matching purposes, not visible to the user. This includes:
  - A record of profiles the user has liked.
  - An "absentee rating" (for tracking no-shows or lateness).
  - An internal "attractiveness rating" to assist in matching users with others in a similar range.
  - A "contribution score" that gamifies positive social engagement. This score is influenced by receiving "kudos" from peers, good attendance, and participating in pre-event activities. The system will track the counts of each type of kudo received, allowing for metrics like a kudos-per-event ratio. A higher score can increase a user's likelihood of being invited to high-demand events.
- **Identity & Preferences**: To facilitate our unique matching, users provide:
  - **`gender`**: A single selection from a comprehensive list (e.g., Woman, Man, Non-binary, Transgender Woman, etc.).
  - **`interested_in`**: A multiple-selection field indicating the genders they are interested in connecting with.
  - **`pronouns`**: An optional field that, if filled out, is displayed on their public profile.

### User Account Management & Settings

To provide a clear and robust user experience, we divide settings into two distinct areas, accessed via a menu from the custom user icon in the app header:

1.  **Profile & Security (Custom Built)**: This destination is a dedicated, custom-built screen that serves as the single source of truth for core account and security management. While it gives us full native UI control, it is powered entirely by Clerk's hooks (`useUser`, etc.). Its responsibilities include:

    - Updating profile information (name, etc.) via `user.update()`.
    - Managing and verifying the user's email address and phone number.
    - Providing a path to change passwords and manage multi-factor authentication (MFA).
    - Viewing active sessions and signing out of other devices.

### Pausing & Deleting Your Account

To give users full control over their account lifecycle while encouraging user retention, Momento provides both a "pause" and a "delete" option.

- **Pause Account (Hibernation Mode)**: This is a non-permanent way for a user to take a break.

  - **Functionality**: When paused, a user's `status` in the database is set to `'paused'`. This makes them socially invisible. They will not receive any new invitations or notifications (except for critical security alerts), and their profile will not appear in any public discovery feeds.
  - **User Experience**: A paused user can still log in, view their Memory Book, and exchange messages with existing connections. However, they cannot engage in any new social activities. A persistent banner with a "Reactivate Account" button will be displayed, making it easy to return.

- **Delete Account (Permanent Action)**: This is a permanent, irreversible action.
  - **The "Nudge-to-Pause" Flow**: To prevent accidental deletion and retain users, the "Delete Account" button first opens a modal that presents pausing as a preferable alternative.
  - **Modal Content**:
    - **Title**: "Before you go..."
    - **Body**: Explains that deletion is permanent, while pausing is a temporary break that preserves their data and connections.
    - **Actions**: The modal offers three clear choices: "Pause Account" (primary action), "Delete Permanently" (destructive action), and "Cancel".
  - **Backend Process**: If the user proceeds with deletion, their user record in Clerk is deleted. A `user.deleted` webhook then triggers the deletion of their corresponding record in the Convex database.

2.  **App Preferences (Managed by Momento)**: This is our fully custom-built settings screen where we house all of Momento's unique application-level preferences. This screen contextually displays settings based on the user's active mode.

This hybrid approach allows us to have a fully native and branded experience while still relying on Clerk's powerful and secure backend for the complex parts of account management.

### The Interest Constellation

To showcase a user's personality beyond a simple list of hobbies, profiles will feature an "Interest Constellation." This data visualization moves beyond superficial tags to show the multifaceted nature of a user's character.

- **How it Works:** The backend will analyze a user's full spectrum of activity to identify 2-3 distinct "personas" (e.g., "Thrill Seeker," "Cozy Creative," "Intellectual Explorer"). While this process begins with explicit signals from the "Discover Your Interests" feature, it is continuously refined by real-world behavior. The system gives more weight to implicit, high-commitment actions—like attending an event and rating it highly.
- **Profile Visualization:** On the user's profile, these personas will be displayed as a minimalist, interactive constellation graphic. Each major "star" represents a "persona" (a neighborhood in the underlying data) that the user has an affiliation with. The larger the similarity or closeness to, or affinity for, that particular cluster of data points that has been given a name (a persona), the larger or brighter the star appears in their constellation. Tapping on a star could reveal the key concepts or types of experiences that define it (e.g., tapping "Thrill Seeker" might show keywords like `Rock Climbing`, `Live Music`, `Spontaneous Travel`). Figuring out how to visually display this underlying set of data as a constellation will be a future thing to figure out.
- **Impact:** This feature provides a rich, at-a-glance understanding of a user's character, showing _how_ their interests connect rather than just _what_ they are. It emphasizes depth and multifaceted personality, aligning with Momento's core value of fostering genuine connection.

### Kudos Showcase

To offer a form of social proof that is more meaningful than a simple rating, profiles will feature a "Kudos Showcase." This section highlights a user's positive social qualities as recognized by people they have actually met at events.

- **How it Works:** After an event, attendees can give anonymous, private "kudos" to each other (e.g., "Great Listener," "Welcoming Vibe"). The backend system aggregates these kudos over time.
- **Profile Visualization:** The profile will display a section titled "What people appreciate about [Name]:" showcasing the top 2-3 kudos the user has received most frequently. This is presented visually with elegant icons or badges, not as a raw score, turning peer feedback into a qualitative summary of their social character.
- **Impact:** This feature provides an authentic, peer-validated glimpse into a user's personality in a social context, which is far more powerful and trustworthy than self-described attributes. It rewards positive community members with a richer profile.

### Event DNA

To give users a way to express their character through their actions, not just their words, profiles will feature an "Event DNA" section. This is a curated gallery of a user's favorite past experiences on Momento, acting as a powerful form of profile authentication.

- **How it Works:** From their event history, a user can **select** 3-5 past events that they attended and rated highly to showcase on their public profile.
- **Profile Visualization:** This will be displayed as a visually rich gallery of the selected event cards. Seeing that a user chose to highlight their attendance at a "Backcountry Camping Trip," a "Japanese Pottery Workshop," and a "Silent Book Club" tells a much more compelling and authentic story than a simple list of interests.
- **Impact:** This feature transforms a user's profile from a static page into a living testament to their adventures and passions. It provides concrete, verifiable examples of their interests, offering a deep and immediate insight into their personality. It serves as a real meeting feature, turning past attendance into social proof.

### The Vibe Summary (AI-Generated)

As a capstone feature that synthesizes all of a user's activity into a compelling narrative, profiles can feature an AI-generated "Vibe Summary."

- **How it Works:** The system will use a large language model to analyze a user's complete Momento footprint: their interest vectors, the kudos they've received, and their showcased "Event DNA." It then generates a short, narrative paragraph that captures the essence of their character.
- **Profile Visualization:** The summary will be displayed prominently on the profile. For example: _"Looks like someone who is just as comfortable discussing philosophy over wine as they are on a windswept trail. People who have met them seem to appreciate their thoughtful questions and welcoming energy."_
- **User Control:** This feature is opt-in. A user can choose to generate their summary, and they will always have the final say. They can approve the generated text, ask for a new version, or choose not to display it at all.
- **Impact:** This feature provides the ultimate "show, don't tell" profile component. It weaves together disparate data points into a holistic, easy-to-read summary that feels both personal and authentic.

> **Future Enhancement (Phase 3):** > **Feature:** In-App Camera Requirement.
> **Rationale:** Requiring at least one profile picture to be taken through the in-app camera (instead of just incentivizing it) would more strongly guarantee that photos are recent and unedited, further increasing platform trust.

### Unified Authentication & US-Only Launch

To create a flexible and accessible onboarding experience, Momento uses a unified authentication system powered by Clerk. This allows users to sign up and log in using the method most convenient for them, while eliminating the need for a traditional password.

- **Sign-Up Methods**: Users can choose to sign up with:
  - A phone number, using a secure one-time password (OTP) for verification.
  - An email address and password.
- **US-Only for MVP:** For the initial launch, sign-up will be limited to users with a valid US phone number if they choose that option. This is a setting enforced within our Clerk configuration.

### Handling Phone Number Recycling

Account security, including the handling of recycled phone numbers and account recovery, is managed by Clerk. Clerk provides robust, user-friendly flows to verify ownership and prevent unauthorized account access, removing the need for a custom-built solution.

### The Authentic Photo

To build a foundation of trust and authenticity, Momento will include a feature to verify that a user's photo is recent and genuine.

- **In-App Camera:** Users will be prompted to take a photo of themselves from within the Momento app, using the native camera functionality.
- **"Authentic" Badge:** A photo taken this way receives a special "Authentic" badge, which is displayed on the user's profile and on their Face Card in the Memory Book.
- **12-Month Expiry:** To ensure photos remain current, the "Authentic" status and badge for a photo will automatically expire after 12 months. The user will then be prompted to take a new one.

## 2. Monetization & Payments

- **Model**: Participants will be charged a flat **`Confirmation Fee`** (e.g., $5) upon accepting an event invitation. This fee secures their spot and is the primary monetization for Momento's curation service.
- **Host Costs**: Any additional costs (e.g., tickets, food) are handled directly between the participant and the host/venue. These are clearly labeled in the app as the **`Estimated Event Cost`** to avoid confusion. Momento does not process these payments or take a cut.
- **Payment Flow**: Users can add a credit card to their private profile. If a user does not have a payment method on file when they accept their first invitation, they will be prompted to add one before their acceptance is confirmed.
- **Integration**: This requires integration with a third-party payment processor (e.g., Stripe) to securely handle credit card storage and transactions.
- **User-Facing Features**:
  - A dedicated "Payment Methods" screen where users can add or remove credit cards.
  - A "Transaction History" screen where users can see a list of their past payments.
  - Clear in-app prompts and confirmations for all charges.
  - Email receipts for successful payments, sent to the user's optional email address if provided.
- **Backend Requirements**:
  - Server-side logic to create and manage Stripe Customer objects.
  - Secure endpoints to handle payment intent creation and confirmation.
  - Webhooks to listen for payment status updates from Stripe (e.g., `charge.succeeded`).

## 3. Hosting & Event Creation

This section details the features and flows for users who create and manage events on the Momento platform.

### The Intent-Driven Onboarding Flow

Momento's onboarding is designed to be **intent-driven**. Immediately after creating a core account, a new user is asked to choose their primary goal, which directs them to a tailored onboarding path. This ensures every user, whether a participant or a host, has a logical and streamlined first experience.

- **The Entry Point:** The journey begins at a single `SignUpScreen` where a user can create an account with either a phone number or an email/password.
- **The Fork in the Road:** Upon successful account creation, the user is navigated to a `RoleSelectionScreen` where they choose their initial path: "I want to attend events" or "I want to host events."
- **Participant Onboarding:** If the user selects "attend," they are guided through the standard participant flow: creating their `socialProfile`, taking an `AuthenticPhoto`, and completing the "Discovering Your Interests" experience.
- **Host Onboarding:** If the user selects "host," they are guided through the host setup flow, which includes creating a `hostProfile` and being prompted to start the identity verification process. This path is designed for both `User Hosts` (individuals) and `Community Hosts` (businesses).

### Adding a Role Later (The Hybrid User)

The system is designed for flexibility, allowing single-role users to add a second role later.

- **Participant Becomes Host:** A user with only a `socialProfile` will see a "Become a Host" CTA on their `ProfileTab`. Tapping this initiates the `UserHostOnboardingFlow`, guiding them to create their `hostProfile`.
- **Host Becomes Participant:** A user with only a `hostProfile` will see a "Join Events Socially" CTA on their `ProfileTab`. Tapping this initiates the `ParticipantOnboardingFlow`.

Upon completing the second onboarding flow, the user becomes a `Hybrid User`, and the `ModeSwitcher` component appears on their `ProfileTab`, granting them access to both UI contexts.

### Switching Between Social & Host Modes

For users who are both participants and hosts (`Hybrid Users`), the application provides a `ModeSwitcher` to ensure the interface remains clean and contextually relevant. This control prevents UI clutter by presenting only the tools needed for the user's current goal.

- **The Control:** A `ModeSwitcher` component is displayed prominently within our custom **"App Preferences"** screen.
- **The Mechanism:** When a user toggles between "Social Mode" and "Host Mode," the app updates the `users.active_role` field in the database to either `'social'` or `'host'`. This choice is persisted across sessions.
- **The Impact:** The value of `active_role` acts as a global state that dictates the entire navigation structure. It determines which version of the main tab bar is rendered, ensuring that a user in "Host Mode" sees their hosting dashboard, event management tools, and host inbox, while a user in "Social Mode" sees their invitations, Memory Book, and social discovery feeds. This separation creates a focused and intuitive experience for users who wear multiple hats in the Momento ecosystem.

### Publishing Events: The Verification Gate

To ensure the safety and trust of the community, all hosts must be verified before they can make an event public.

- **The Rule:** A host cannot change an event's status from `'draft'` to `'published'` unless their `users.is_verified` status is `true`.
- **The Process:** The verification is handled via **Stripe Identity**. Both `User Hosts` and `Community Hosts` will be prompted by a persistent `VerificationPromptBanner` in their hosting dashboard to complete this step.
- **The Implementation:** This rule is enforced on the backend through a validation check in the "publish event" mutation. The UI will also reflect this by disabling the "Publish" button on the `ManageEventScreen` for unverified hosts, with a tooltip explaining the requirement.

### The Event Lifecycle (Host's View)

This section describes the end-to-end journey for a host managing a single event.

1.  **Drafting:** The initial creation stage where the host defines all event details, itinerary, and collaborators. The event is only visible to the host.
2.  **Published & Matching:** After the host publishes the event, its status changes, and it becomes eligible for the matching algorithm. The backend now actively finds and sends invitations to well-matched users.
3.  **Confirmed & Upcoming:** Once the event reaches its `min_attendees` threshold, it is officially confirmed. The host can now see a live headcount of confirmed attendees on the `ManageEventScreen` and has the ability to message them for any pre-event coordination.
4.  **Event Day & Check-in:** On the day of the event, the host uses their version of the "Deck of Cards" UI to see who has arrived and to check them in, ensuring an accurate record of attendance.
5.  **The "Wrap-Up" (Post-Event):**
    - **Attendance Confirmation:** In a 24-hour window after the event's end time, the host is prompted to confirm the final attendance list via the `AttendanceConfirmationList` component. They must mark any confirmed attendees who were "No-Shows". This action is the final source of truth for applying `absentee_rating` penalties.
    - **Viewing Feedback:** After submitting the final attendance, the host unlocks the `PastEventSummaryScreen`. Here they can view the aggregated feedback for the event, including average ratings and an AI-generated summary of all written comments.

### Handling Host-Initiated Event Changes

To handle cases where a host needs to modify a published event, this flow ensures attendees are informed and treated fairly.

- **Defining a Material Change:** A "material change" is defined as any modification to an event's **date, time, or location**. Changes to text fields like title or description do not trigger this flow.
- **The Host's Experience:** When a host saves a material change to a published event, they are shown a `HostEditWarningModal`. This modal explains that all confirmed attendees will be notified and given the option to cancel for a full refund, but their spots are otherwise secure. Upon confirmation, an entry is added to the host's `reliabilityLog`.
- **The Attendee's Experience:**
  1.  All confirmed attendees are immediately notified of the change via Push Notification and SMS.
  2.  The attendee's `invitation.status` is updated to `pending_reconfirmation`.
  3.  On the `EventDetailScreen`, the attendee sees the `EventChangeConfirmationModal`, which clearly displays the "before" and "after" of the change.
  4.  The attendee can choose to "Keep My Spot" (which reverts their status to `confirmed`) or "Cancel & Get Refund". There is no deadline, and if the user does nothing, their spot remains secure.
- **Host Accountability:** The `reliabilityLog` allows the system to track patterns of behavior. If a host frequently changes or cancels events, especially close to the start time, the system can automatically trigger warnings or flag the account for manual review to protect the community experience.

### Host Tools & Controls

- **Host Profile:** All hosts have a dedicated public profile with their name, bio, and average rating from past events.
- **Insights & Best Practices:** Hosts will have access to information and best practices for creating highly-rated events, along with insights from feedback on their own previous events.
- **Minimum Age:** Hosts can set a minimum age requirement for their event (e.g., 21+). Our matching algorithm will not match users who do not meet this requirement.
- **Host as Attendee:** A checkbox on the event creation screen for the host to indicate they will be participating in the event, not just organizing it. If selected, the host will occupy one spot, counting towards the `max_participants` limit. They are automatically considered "confirmed" for the event and are exempt from the $5 event fee. This option is only available for hosts who also have a participant social profile.
- **Public Social Links:** `User Hosts` and `Community Hosts` can make specific social media profiles or websites public on their Host Profile. This builds trust and allows attendees to vet the host.
- **Event Itinerary:** Hosts can build dynamic events with one or more stops. For each stop, they must define both a **start time** and an **end time**, and can add a location by either searching for a venue (via Google Maps) or dropping a precise pin on the map.
- **Collaborators:** Hosts can add other people involved in the event, such as a co-host or instructor. If the collaborator is a Momento user, the host can link directly to their profile.

> **Future Enhancement (Phase 2):** > **Feature:** Event Encore Signals.
> **Rationale:** To encourage hosts to repeat successful events, we can provide them with anonymous, aggregated feedback. On their dashboard, a host could see a highly-rated past event with a note like "✨ 26 people have expressed interest in an event like this again!" This signal would be sourced from "likes" on the event in the public Discovery Feed.

> **Future Enhancement (Phase 3):** > **Feature:** AI-Powered Hosting Assistant.
> **Rationale:** Providing hosts with AI tools for event name/description generation and suggesting event enhancements based on historical data would lower the barrier to hosting high-quality events and improve the overall ecosystem.

## 4. Interest Building Flow: The Momento Preview

This is a critical onboarding process designed to feel like the start of an adventure, not a boring survey. It gives the user a tantalizing glimpse of the experiences to come while simultaneously building a deep, multi-dimensional map of their interests. This is the foundation of our matching algorithm. For full technical details, see `_docs/MATCHING_ALGORITHM.md`.

- **The "Possibility Card" Deck:** Instead of a simple checklist, the user is presented with a beautiful, full-screen, swipeable deck of 8-10 fictitious "Event Cards."
- **Evocative Content:** Each card features a stunning image, an intriguing title (e.g., "Secret Garden Soirée"), and a short, evocative description of the experience.
- **Interactive Swiping:** The user swipes right ("I'm Interested") or left ("Not for Me"). This interaction is designed to be fluid, premium, and satisfying.
- **Backend Vector Creation:** Each swipe is a powerful signal.
  - A "like" helps form the user's **`positive_interest_vector`**, defining the experiences they are drawn to.
  - A "dislike" helps form a **`negative_interest_vector`**, defining the things they want to avoid.
  - These vectors place the user within our multi-dimensional "interest space," allowing for nuanced, concept-based matching that goes far beyond simple keywords.

> **Future Enhancement (Phase 3):** > **Feature:** AI-Assisted Interest Building.
> **Rationale:** An AI-driven voice conversation to conduct a user interview could capture more nuance and personality than a standard questionnaire. The AI could also interview a user's friends to provide an outside perspective, creating a richer, more holistic profile for matching. The transcript from this conversation would be converted into a highly accurate set of interest vectors, as described in the matching algorithm documentation.

## 5. The Invitation

The invitation is a core part of the weekly user experience.

- Ideally, users receive one event invitation per week and have 24 hours to respond.
- Invitations will be sent via text message, featuring an image and a link to the app.
- The in-app invitation page will provide full details:
  - Event description, time, and a full itinerary, including an interactive map of all locations.
  - Estimated costs (e.g., average menu prices, ticket fees).
  - Minimum and maximum number of participants (min. 4).
  - Ratings for the host and/or venue.
- The app will curate invitees based on who is the best match for the event and other participants.
- A balanced male-to-female ratio will be a goal.
- Participants will not see who else is attending until after they arrive (or possibly after they accept).
- The app curates invitees using a "Social Graph" algorithm. The goal is to create groups with the highest potential for social and romantic connections, ensuring that no attendee is a "dead-end" in the group's dynamic. Every invitee is chosen because they have at least one potential incoming _and_ outgoing connection within the group, based on a nuanced, person-to-person compatibility score.
- Participants will not see who else is attending until after they arrive, preserving the magic of discovery.
- Participants will be able to message the host before the event for logistical questions.

#### Algorithm Transparency: The "Why"

To build trust and make the experience feel more personalized, every invitation includes a short, friendly message explaining why the user was matched with that specific event. This transforms the invitation from a random notification into a thoughtful suggestion.

- **Functionality:** A `MatchReasonBanner` is displayed at the top of the `InvitationDetailScreen`.
- **Example Reasons:**
  - _"We thought you'd like this because you're interested in **Hiking** and **Japanese Cuisine**."_
  - _"This seems right up your alley! It's similar to the **'Secret Garden Soirée'** experience you were interested in."_
  - _"An event just for you, right in your neighborhood! It's only **5 miles away**."_
- **Impact:** This feature makes the matching process feel less like a black box and more like a personalized service, reinforcing that Momento understands the user's unique tastes.

#### Declining an Invitation: Capturing User Intent

To avoid misinterpreting a user's reason for declining an event, the app will ask for a reason. This provides a powerful signal to the matching algorithm to improve future invitations. When a user taps "Decline," they will be presented with a few options:

- **"I'm busy that day"**: This signals a logistical conflict, not a lack of interest. The user's interest profile will not be negatively affected.
- **"This event isn't for me"**: This is a strong negative signal. The event's characteristics will be used to update the user's `negative_interest_vector`, making them less likely to see similar events.
- **"I'm looking to try new things"**: This is an explicit request for variety. The algorithm will temporarily increase the "exploration" factor for this user, prioritizing events outside their typical interests.
- **"Too far away"** or **"Too expensive"**: This signals a logistical or financial mismatch. It does not negatively affect the user's interest profile. Instead, if the user has not been prompted before (tracked via the `contextualNudges` object), it triggers a **`PreferencePromptModal`**. This one-time prompt asks if they'd like to set their travel or price preferences to receive more relevant invitations. After they interact with the prompt (either setting the preference or dismissing it), the system flags that nudge as seen to prevent it from reappearing.
- **"The vibe doesn't feel right"**: A softer "no" that can be logged for analytics without heavily penalizing the event type in the user's profile.

> **Future Enhancement (Phase 3):** > **Feature:** AI-Generated Animated Invitations.
> **Rationale:** Allowing hosts to generate unique, subtly animated invitation images would elevate the user experience, making each invitation feel like a special, magical artifact. This aligns with the "living blueprint" design concept from the `DESIGN_SYSTEM.md`.

#### Post-Confirmation & Calendar Integration

Once a user's attendance is confirmed (payment successful), they will be presented with an "Add to Calendar" option.

- **Functionality:** Tapping this will download a standard calendar file (`.ics`) that can be imported into their native calendar app (Google Calendar, Apple Calendar, etc.).
- **Details:** The calendar event will contain all relevant details:
  - Event Title
  - Full Itinerary (including all stop locations and descriptions)
  - Start and End Times
  - A link back to the event page in the Momento app.

## 6. Dynamic Duos: Attend with a Friend

To directly address the natural anxiety of attending a social event alone and to create a new vector for shared experiences, Momento introduces "Dynamic Duos." This feature allows two friends to signal their intent to attend their next event together, transforming the matching process into a curated experience for a pair.

This is not a traditional "+1" feature. It is a pre-declared pact between two existing Momento users, ensuring that the integrity of the group curation is not just maintained, but enhanced.

### The Philosophy: It's a Pact, Not a Plus One

- **Pre-emptive, Not Reactive:** Duos are formed _before_ an invitation is sent. Users proactively declare, "For our next adventure, we want to go together."
- **A Shared Journey:** The system's goal is no longer just to find an event for one person, but to find the perfect event that bridges the worlds of two people.
- **Privacy-First:** Duos are formed by searching for friends via a user's phone contacts, ensuring users can find their real-world friends without turning Momento into a generic social network with searchable user lists. The `MemoryBook` remains a sacred space for connections made _at_ Momento events.
- **One Pact at a Time:** To keep the experience simple and clear, a user can only have one active (or pending) Duo pact at a time. They cannot send or receive new invitations until the existing pact is fulfilled or expires.

### The Duo Lifecycle

1.  **Forming the Duo:** A user can invite a friend (who is also a Momento user) to form a Duo. The friend is found by granting temporary access to the user's phone contacts.
2.  **The Handshake:** The friend receives and accepts the Duo invitation.
3.  **The Pact:** The Duo is now considered `active` for a set period (e.g., two weeks) or until they attend an event together. During this time, the matching algorithm treats them as a single, combined entity.
4.  **The Paired Invitation:** When the algorithm finds an event that is a strong match for the Duo's composite interests, a special "Paired Invitation" is sent to both users simultaneously. The `MatchReasonBanner` will explicitly mention the partnership: _"We found an event that bridges your love for **Hiking** with David's interest in **Japanese Cuisine**."_
5.  **Individual Acceptance:** Once the Paired Invitation is sent each user can now accept or decline the invitation individually. If one friend declines, the other can still accept and attend, preserving their own opportunity to connect. The curated group dynamic is slightly altered, but this prioritizes individual user freedom.

## 7. Event Preferences: Hard Filters & Soft Preferences

To give users more control over their invitations and reduce noise, Momento provides a set of powerful, optional preferences on a single `EventPreferencesScreen`. These settings are introduced contextually when a user declines an event for a related reason, rather than overwhelming them during onboarding.

This screen is divided into two distinct types of settings to give users both fine-grained control and flexibility.

### Hard Filters (Exclusion Rules)

These are strict rules that will **exclude** a user from receiving an invitation. Setting these may significantly reduce the number of invites a user sees, but ensures those they do see are highly relevant to their logistics and budget.

- **Distance Preference**: Users can set a maximum travel radius from their home (e.g., 5, 10, or 25 miles). The matching algorithm will use this as a **hard filter**, meaning the user will not receive invitations for events outside this radius.
- **Price Sensitivity**: Users can select a general price comfort level (e.g., $, $$, $$$). This is also a **hard filter**. The app will only show them events whose `Estimated Event Cost` falls within their selected range.

### Soft Preferences (Matching Signals)

These preferences act as powerful signals to the matching algorithm. They do not exclude a user from seeing an event, but they will heavily influence their `MatchScore`, making it much more likely they receive invitations that fit their schedule and lifestyle. This aligns with the `LeadTimePenalty` and `AvailabilityPenalty` logic in the `MATCHING_ALGORITHM.md` document.

- **Ideal Lead Time**: Users can set their preferred minimum notice for event invites (e.g., "at least 3 days in advance"). An event with less notice isn't filtered out, but it will be penalized in the matching score.
- **Weekly Availability**: Users can set their general availability for each day and night of the week (e.g., "available Tuesday evenings," "unavailable on weekends"). An event on a less-preferred day will be penalized in the matching score but not entirely excluded.

## 8. The Arrival Experience: The Signal

One of the most intimidating moments of any social event is the arrival—that brief, awkward period of finding your group. Momento transforms this moment of friction into a standardized, confidence-building ritual with a "secret society" feel. We call it **"The Signal."**

The goal is to eliminate ambiguity and give both hosts and attendees a clear, simple set of actions so they can connect with confidence.

### The Host Sets the Stage

When creating an event, the host defines one key element for the arrival:

1.  **The Signpost (Physical Cue):** A required text field where the host describes the real-world identifier for the group. This tells attendees exactly what to look for.
    - _Example: "I'll be at a table near the back of the cafe, look for a small potted succulent."_
    - _Example: "Ask the restaurant hostess for the reservation under 'Momento'."_

### The Arrival Flow: The Deck of Cards

Instead of a "secret password," the arrival is centered around a "Deck of Cards"—a simple, glanceable UI that helps people find each other without getting lost in their phones.

1.  **Attendee Checks In:** An attendee arrives, finds the spot described in the **Signpost**, and taps the **"I'm Here"** button. This action records their location for verification purposes and adds them to the event's check-in list.

2.  **The Deck is Revealed:** Once at least two people have checked in (including any combination of attendees and the host), the **Deck of Cards** UI is revealed to all of them. This is designed to solve the "I'm here, but is that person also here for the event?" problem.
    - The UI is a simple, horizontally swipeable set of cards. Each card displays a large profile picture and the person's first name.
    - **The Host Card:** The first card in the deck is always the host. It is visually distinct and displays a clear status stamp, such as "ARRIVED" or "NOT YET ARRIVED." This gives attendees an immediate anchor point.
    - **Dynamic Duo Cards:** If two attendees were invited as a Duo and **both have checked in**, their `FaceCard`s will feature a special, dynamic duo badge (e.g., a designed stamp element over a corner of the card. like a passport stamp). This provides context to the group, clarifying that these two individuals arrived together.
    - **Attendee Cards:** Subsequent cards show every other checked-in attendee in the order they arrived.

This flow ensures that even if attendees arrive before the host, they can still identify and connect with each other, turning a moment of potential awkwardness into the first moment of connection. When the host finally does check in, their card's status updates, and a notification can be sent to all attendees: **"Your host, Sarah, has arrived!"**

### Automated Check-in Reminder

To ensure accurate attendance data and help users who forget, the app will send a time-based reminder to check in shortly after an event begins.

- **Functionality:** This is a simple, server-side cron job or scheduled function.
- **Trigger:** Approximately 15 minutes after an event's official `start_time`, the system will check for any confirmed attendees who have not yet checked in.
- **User Experience:** Those users receive a simple push notification: "'[Event Title]' has started! If you've arrived, don't forget to check in to find your group." This gently nudges the user without needing complex location permissions for the MVP.

> **Future Enhancement (Phase 2):** > **Feature:** Geofenced Check-in Reminders.
> **Rationale:** A geofenced reminder would provide a more magical, context-aware experience than the time-based one. By triggering the check-in prompt the moment a user arrives in the event's vicinity, we reduce friction and improve the accuracy of arrival data.

> **Future Enhancement (Phase 2):** > **Feature:** Reverification for Sensitive Actions.
> **Rationale:** To enhance security for critical user actions, we can leverage Clerk's `useReverification()` hook. This would prompt a user to re-authenticate (e.g., with their password or a biometric scan) before performing a sensitive operation like deleting their account or changing their primary email address. This adds a professional layer of security and user trust with minimal implementation effort.

## 9. Post-Event Interaction

- The day after the event, participants will be prompted to provide feedback on the event and the host.
- They will also report if any participants were late or did not show up.
- After submitting feedback, participants will unlock the ability to message other attendees one-on-one.
- **Peer-to-Peer Kudos**: To encourage a culture of positive participation, after rating the host, users will be prompted to give anonymous, private "kudos" to fellow attendees who made the experience special. These are presented as collectible badges that the recipient can see in their own profile.
  - **Example Kudos Badges:** "Great Listener," "Made Me Laugh," "Welcoming Vibe," "Amazing Storyteller," "Brought the Energy," "Deep Thinker."
  - This feedback is a key input for the internal "Contribution Score." While the giver is anonymous, the recipient collects the badge, reinforcing positive community behavior.

> **Future Enhancement (Phase 2):** > **Feature:** Enhanced Post-Event Interaction.
> **Rationale:**
>
> - **Dispute No-Shows:** To combat "check-in and bail" scenarios, we can request location at check-in. Disputed no-shows (where a user checked in but was reported absent) would negatively impact internal ratings more severely.
> - **Public Event Feed:** Allowing message posting on the event page itself (e.g., for a thank-you note from the host) would add another layer of community interaction.

The design will subtly encourage users to wait until after the event to exchange contact information, reinforcing that they can connect through the app after the event.

## 10. The Memory Book & The Face Card

To foster lasting connections beyond a single event, the app will feature a dedicated "Memory Book." This screen serves as a private, organized record of every person a user has met at Momento events. It is a gallery of collected memories, not just a list of contacts.

### The Face Card Lifecycle

The core of the Memory Book is the **Face Card**, a dynamic, collectible memento that represents each connection. It evolves with the user.

1.  **The First Event & The First Photo:** When checking in to their first event, an attendee will be prompted to take an in-app photo. This is for identification, ensuring other guests can find them. This raw, authentic photo becomes their very first Face Card, which might feature a special "First Event" badge.
2.  **The Immutable Snapshot:** When this Face Card is added to another attendee's Memory Book, it is stored as an **immutable snapshot**. It will forever look exactly as it did at that first meeting, preserving the memory. Even if the original user updates their own Face Card later, it will not change in the Memory Books of those who have already collected it.
3.  **Styling & Upgrades:** After their first event, the user unlocks the ability to "stylize" their Face Card. This is done on the `FaceCardStylingScreen`, where they can transform their authentic photo into a piece of art using Momento's curated set of artistic filters. Users can preview these styles and revert to a previous design if they wish.
4.  **Changing the Source Photo:** While the first Face Card is generated from the initial in-app photo, users can change the source image at any time on the `FaceCardStylingScreen`. They can select any of their other verified `photos` to create a new look.
5.  **Unlocking Customizations:** Over time, users can earn new ways to customize their Face Card by reaching community milestones. This gamifies positive participation and provides a visual representation of a user's journey.
    - **Attend 3 Events:** Unlocks "Vintage" and "Monochrome" photo styles.
    - **Receive 10 Kudos:** Unlocks a decorative "Gilded" border.
    - **Host Your First Event:** Unlocks an exclusive "Curator" frame.
      When a user unlocks a new item, they are notified via a non-interruptive `CustomizationUnlockToast`.

### Memory Book Functionality

- **Automatic Population:** When a user successfully checks in to an event, they are immediately and automatically added to the Memory Book of every other attendee who is also checked in. If a user is later marked as a "no-show," they will be removed from the Memory Books of those they were connected with at that event.
- **View & Organization:**
  - The default view is a gallery of Face Cards, sorted chronologically by the last event attended.
  - Users can search the list by a person's name or the event name.
  - Sorting options will include: First Name (A-Z), Last Met.
- **Connection Tools:**
  - **Private Notes:** Users can add private notes to each Face Card.
  - **Favorites (⭐):** A private bookmarking tool for personal organization.
  - **Connect Again (🔗):** A private signal to the backend that influences future event curation. If mutual, a special indicator is displayed on the Face Card.

### The Interactive Face Card: Revealing Character

The Face Card is more than just a static image; it's an interactive memento that reveals the character of the person behind it. The front of the card will display the user's name and their authentic photo. Tapping the card will reveal its "back," which contains the rich, narrative components of their profile:

- **The Interest Constellation**
- **The Kudos Showcase**
- **Their Event DNA gallery**

This interaction model keeps the initial view clean and focused on the person, while allowing users to dive deeper into the story of a connection they've made. For new users, these sections will contain gentle prompts encouraging them to participate in events to build out their own story.

### Social Connect: Effortless Social Sharing

To bridge the gap between a memorable event and an ongoing connection, users can privately share their social media profiles through the Memory Book. This feature removes the awkwardness of asking for handles and keeps the focus on in-person connection during the event.

- **Private by Default:** Users can add their social media links (Instagram, Twitter, etc.) in their private profile settings. This information is never public on their profile.
- **Silent, One-to-One Sharing:** From a connection's Face Card in the Memory Book, a user can choose to share one or more of their saved social links. This is a deliberate, one-way action. The other user is **not** notified; they will discover the shared link the next time they view the sharer's Face Card, creating a moment of quiet discovery.
- **Reciprocal Flow:** When a user receives a shared social link, it appears on the sender's Face Card in their Memory Book. A prompt will ask if they'd like to "Share back," making reciprocation seamless.
- **User Control:** A user can revoke a shared link at any time, removing it from the other person's view.

## 11. Shared Event Galleries & Camera Roll

To extend the life of an event and give attendees a way to share their collective memories, the app will feature a robust photo-sharing system.

### Shared Event Galleries

- **Functionality:** After an event has concluded and attendance has been verified, a "Photos" tab will appear on the post-event screen. This is a collaborative gallery visible only to those who attended.
- **Uploading:** Any attendee or the event host can upload photos from their phone's library to the shared gallery.
- **Downloading:** Users can download any single photo they wish. They will also have an option to download the entire event album as a single compressed (`.zip`) file.
- **Host Moderation:** The event host has the ability to remove any photo from the gallery.
- **User Reporting:** Any attendee can report a photo for being inappropriate or for privacy reasons (e.g., "I'm in this photo and I want it removed"). Reports are sent to the host and/or a central moderation team.

### Personal Camera Roll

To give users a central place for all their visual memories within the app, a "My Camera Roll" section will be accessible from their main profile. This area will be organized into distinct sections:

- **My Profile Photos:** Manage photos used for their public `social_profile`.
- **My Event Uploads:** A view of every photo they have personally uploaded across all their events.
- **Event Albums:** A chronological gallery of all events attended, acting as shortcuts to each event's shared gallery.

_Note: The "My Camera Roll" feature is for participants. Community hosts (representing a venue or organization) manage their brand photos (e.g., logos, venue shots) through their dedicated Host Dashboard._

## 12. User Safety: Blocking & Reporting

To build a safe and trustworthy community, users will have access to a multi-tiered system for managing their interactions with others. The design prioritizes user comfort and provides clear, distinct tools for different situations.

### A Three-Tiered System

1.  **Preference Signal: "Don't Connect Again"**

    - **Functionality:** This is a private, lightweight signal to the matching algorithm. It is the inverse of the "Connect Again" feature. The user is indicating a preference to not be placed in future events with a specific person. This feature governs interactions between participants who have met at an event.
    - **User Experience:** This is a "soft block." The two users can still see each other in their Memory Books and message one another. It simply tells our system to avoid future pairings. This is handled via the `connections` table.

2.  **Safety Control: "Block"**

    - **Functionality:** This is a hard stop for all direct interaction between two users.
    - **User Experience:** When User A blocks User B, the action is silent (User B is not notified).

      - User A and User B are immediately and mutually removed from each other's Memory Book.
      - All messaging capabilities between them are disabled.
      - The system will permanently prevent them from being matched in any future event. When one user blocks another, neither user will be able to see the other's profile, content, or receive messages from them.
      - Users will have a "Blocked Users" list in their app settings to manage and, if they choose, unblock individuals.

    - **Blocking in an Event Context:** To prevent logistical issues with upcoming events, the block feature has a specific safeguard:
      - If a user attempts to block another user with whom they share a confirmed, upcoming event (e.g., a participant blocking the host, or vice-versa), the action will be disallowed.
      - The user will be shown a `BlockActionErrorModal` explaining that they cannot block the person until after the event is over. They are given the alternative option to cancel their attendance if they do not feel safe.
      - This rule does not apply to past events or events where the user is not a confirmed attendee.

3.  **Community Violation: "Report"**
    - **Functionality:** This is a formal flag raised to the Momento review team when a user has violated community standards. Reporting a user automatically triggers a "Block" as described above.
    - **User Experience:** To discourage misuse and ensure quality reports, the process is structured and educational.
      - **Guided Flow:** The user is asked to categorize the violation from a predefined list (e.g., Harassment, Inappropriate Content, Misrepresentation, In-Person Misconduct).
      - **Educational Messaging:** The interface will provide clear examples of what constitutes a reportable offense, while also presenting the "Block" feature as the appropriate tool for situations that don't violate guidelines (e.g., "I just didn't enjoy their vibe").
      - **Managed Expectations:** The app will clearly state that a review team will assess the report and take appropriate action based on our internal policies.

### Contacting Support

To ensure users can always get help, Momento provides clear channels for contacting support, accessible to both logged-in and locked-out users.

- **Authenticated Support:**

  - **Access Point:** Logged-in users can access the `HelpCenterScreen` from their settings.
  - **Process:** From here, they can open a structured support ticket. The system automatically attaches their user ID and other diagnostic metadata, allowing the support team to quickly understand the context of the issue. This is the standard path for general questions, bug reports, and payment issues.

- **Unauthenticated Support (For Locked-Out Users):**
  - **Access Point:** A "Contact Support" link is available on the main `AuthScreen`.
  - **Process:** This link leads to a simplified public support form that does not require login. Users must manually provide their account-identifying information (e.g., phone number) and their issue. This flow is critical for account recovery scenarios where a user cannot log in to use the standard support channel.

### Community Reliability: Cancellations & No-Shows

To protect the quality of events and respect the commitment of hosts and fellow attendees, Momento has a clear cancellation policy. This framework is designed to create a reliable and committed community.

#### Participant-Initiated Cancellations

The system distinguishes between several scenarios, each with a different impact on a user's internal `absentee_rating`. The $5 event confirmation fee is **non-refundable** in all cancellation scenarios initiated by the participant.

1.  **The Cancellation Flow:** A confirmed attendee can cancel their spot from the `EventDetailScreen`. They will be presented with a `ParticipantCancelModal` that clearly explains the consequences of their action before they confirm.

2.  **Early Cancellation (Outside 24 hours of event start)**

    - **Outcome:** No penalty to their internal rating. The system will attempt to fill the vacant spot by sending a new, time-sensitive "Last-Minute Invitation" to another well-matched user. This invitation will have a short expiry (e.g., 1-2 hours) to ensure the spot is filled quickly.

3.  **Late Cancellation (Within 24 hours of event start)**

    - **Outcome:** A **moderate penalty** is applied to the user's `absentee_rating`. This is seen as less reliable than an early cancellation. The spot will not be filled.

4.  **Dynamic Duo Cancellations:** If one member of an active Duo cancels their attendance (either early or late), it does not affect the other member. The remaining partner is still confirmed and can attend the event as planned.

#### Host-Initiated Cancellations

While hosts are encouraged to see their events through, sometimes cancellations are unavoidable.

1.  **The Cancellation Flow:** A host can cancel their event from the `ManageEventScreen`. They must confirm this action in a `HostCancelConfirmationModal`, which makes it clear the action is irreversible and triggers refunds.
2.  **Attendee Refunds:** When a host cancels, all confirmed attendees will automatically receive a **full refund** of their $5 Confirmation Fee.
3.  **Attendee Notifications:** All confirmed attendees will be notified immediately via **Push Notification and SMS** that the event was cancelled by the host and that their refund has been processed.
4.  **Host Accountability:** The cancellation is logged. While occasional cancellations are understandable, repeated or last-minute cancellations will trigger a manual review of the host's account to maintain community trust.

#### The "No-Show"

- **Action:** The user does not cancel and does not check in to the event. They are marked as a no-show by the host or other attendees during post-event feedback.
- **Outcome:** A **severe penalty** is applied to the user's `absentee_rating`.

#### The "Check-in & Bail" (Worst-Case Scenario)

- **Action:** The user checks in upon arrival (or spoofs their location) and then leaves the event without participating. This is the most disruptive behavior as it misleads the host and attendees.
- **Outcome:** This must be reported by the host or another attendee post-event. It results in the **most severe penalty** to a user's `absentee_rating` and, if repeated, could lead to temporary suspension from the platform.

> **💡 Design Philosophy: The "Cost of a Handshake"**
>
> The decision to make the $5 event fee non-refundable is intentional. It's not primarily a revenue driver; it's a behavioral mechanism. We call it the "Cost of a Handshake."
>
> - **It Represents Commitment:** The small financial stake elevates the RSVP from a casual "maybe" to a firm commitment, which is the foundation of a reliable community. It ensures that when a user accepts, they have skin in the game, just like the host who is investing their time and effort.
> - **It Simplifies the System:** A universal no-refund policy eliminates the complexity of tiered refunds, payment processor fees for reversals, and potential user confusion. The rule is simple and applies to everyone equally.
> - **Exception for Host-Initiated Changes or Cancellations:** The non-refundable policy has one critical exception: if a host makes a material change to the event (e.g., time, location) or cancels it entirely after a user has confirmed and paid, the fee becomes fully refundable. This ensures users are protected from last-minute changes outside their control.
> - **It Defines Our "Worst Case":** We've defined the worst-case scenario not as someone who doesn't show up, but as someone who shows up and _then_ bails. This is the most damaging action to the social fabric of an event. Our penalty system is weighted to reflect this, punishing deception more than absence. By having users commit financially, we can focus our "punishments" on the behavioral metrics that truly matter for community health.

### Reporting & Consequence Framework

To ensure accountability, reports will trigger specific, escalating actions.

1.  **Light Report:**

    - **Trigger:** A single report for a low-severity issue.
    - **Consequence:** Triggers a **Mandatory Verification** check. The user's account is temporarily limited (cannot be invited to new events) until they successfully verify their identity.

2.  **Serious Report:**

    - **Trigger:** A report for a high-severity issue (e.g., in-person misconduct) or an accumulation of multiple reports.
    - **Consequence:** Triggers an immediate **Temporary Suspension** (e.g., 30-day ban from attending events). To be reinstated, the user must complete both **Mandatory Verification** and a mandatory **Behavioral Coaching Module** (a guided walkthrough on community standards).

3.  **Severe Report:**
    - **Trigger:** A violation that represents a serious threat to the community.
    - **Consequence:** A **Permanent Ban** from the platform.

## 13. Discovering Your Interests

To solve the "invite rut" problem and allow users to continuously refine their tastes, the app will feature a dedicated discovery mode. This serves both as an interest-building tool and an internal marketing feature that showcases the quality of experiences on Momento without sacrificing the exclusivity of future events. This experience is a focused utility designed to efficiently discover a user's unique "Interest Personas."

- **Headline:** **"Help us Discover your Interests"**
- **Functionality**: The experience is divided into two distinct phases to manage user expectations and deliver a moment of insight.

### Phase 1: The Calibration Phase

- **Goal:** To quickly understand the breadth of a user's interests by exposing them to a wide variety of event types.
- **User Experience:** For the first ~30 swipes, the user sees a progress indicator with a message like, _"Help us chart your map of interests. The more you swipe, the better our recommendations."_
- **The Deck:** Users are presented with a swipeable, full-screen deck of cards representing real, highly-rated **past events**. The initial deck is curated for maximum diversity, ensuring a user sees a balanced mix from all of Momento's core event categories.

### Phase 2: The Persona Discovery & Refinement Phase

- **Goal:** To identify the user's distinct "Interest Personas" and allow them to refine them over time.
- **The "Persona Reveal" Moment:** After the calibration phase, the user is shown a summary of what the app has learned. For example: _"Fascinating! It looks like you have a few different sides to you. We're seeing a pattern around things like **'Thrill Seeker'** and **'Cozy Creative'**."_ This moment transforms the feature from a simple quiz into a moment of insightful self-discovery.
- **The Deck:** The deck now shifts to showing the user more events that are highly similar to their newly discovered personas, helping to solidify and refine them. It will still sprinkle in "wild card" events to allow for continued exploration.
- **Continued Swiping:** The user is informed that they can return at any time to further refine their personas, but the core discovery task is complete, discouraging endless swiping.

- **Content**: Each card will feature the event's title, its evocative description, and the public, host-provided **cover image**. All information about the host and attendees is kept anonymous.
- **Interaction**: Users can swipe right or left. This action is primarily a signal for the matching algorithm and does not mean the user will be invited to that specific event if it runs again.
- **Backend Signal**: Each right swipe provides a strong, positive signal to the user's `positive_interest_vector`, helping the algorithm understand their current tastes. This is a primary mechanism for evolving a user's preferences over time.

## 14. Discovering Your Type

To help the matching algorithm understand a user's "type" in potential connections, the app features a second discovery mode focused on people. This moves beyond simple "liking" and frames the action as an intentional search for compatibility. This feature is not an endless swipe feed; it is a focused utility designed to efficiently build a user's `person_attraction_vector`.

- **Headline:** **"Help us Discover your Type"**
- **Functionality**: Users are presented with a swipeable deck of profile cards. This feed is populated based on the user's `interested_in` preferences. It will not show users outside of these preferences. The experience is divided into two distinct phases to manage user expectations and gather data efficiently.

### Phase 1: The Calibration Phase

- **Goal:** To quickly understand the breadth of a user's preferences without making any assumptions.
- **User Experience:** For the first ~30 swipes, the user sees a progress indicator with a message like, _"Help us calibrate your compass. The more you swipe, the better we can navigate to your type."_
- **The Deck:** The initial profiles are deliberately diverse, showing a balanced mix of ages, styles, and "Interest Constellations" to establish a broad baseline.

### Phase 2: The Refinement Phase

- **Goal:** To hone in on the user's "type" and build a robust `person_attraction_vector`.
- **User Experience:** After the initial calibration, the progress indicator is replaced by a message indicating completion: _"Thanks, your compass is calibrated! We now have a good sense of your type."_ To encourage transparency, another message appears: _"We're now sorting people we think you'll connect with to the top."_
- **The Deck:** The profile deck is now a strategic blend. The majority of profiles shown are those the algorithm believes the user will be interested in, based on their previous swipes. To avoid an echo chamber, the deck will also include "serendipity" profiles that are a bit different.
- **Continued Swiping:** The user is informed that they can return at any time to further refine their preferences, but the core task is complete. This framing discourages endless swiping.

- **Interaction**: The language is designed to be intentional and aligned with Momento's values.
  - **Swipe Right:** The button or action is labeled **"I'd like to create a memory with them."** This signals a potential for genuine connection.
  - **Swipe Left:** The button or action is labeled **"Not the connection I'm looking for."**
- **Backend Signal**: Each right swipe is a crucial signal. It does not send a "like" to the other user. Instead, it helps the algorithm build the user's `person_attraction_vector`—a nuanced, mathematical representation of their "type." This vector is a key component in calculating person-to-person compatibility for the "Social Graph" algorithm, moving far beyond simple gender preferences to understand the _vibe_ of people a user connects with.

## 15. Notifications

A robust notification system is critical to the user experience, ensuring users are informed about timely events like invitations, reminders, and social interactions. The system will use a combination of Push Notifications (via Expo), SMS (via Twilio), and targeted Email (via Postmark), with all logic orchestrated by secure backend functions.

- **Granular User Control:** Users will have a dedicated "Notification Settings" screen to opt in or out of different categories of notifications (e.g., `sms_invitations`, `push_direct_messages`, `email_account_and_safety`). The backend will always respect these preferences.
- **Event-Driven:** Notifications will be triggered by key events in the app lifecycle:
  - **Invitations:** New and expiring invitations.
  - **Event Logistics:** Confirmations, reminders (24-hour, 1-hour), updates, and cancellations.
  - **Social:** New direct messages, kudos received, and mutual connection matches.
  - **Account & Safety:** Payment receipts (via Stripe), report status updates, and critical security alerts.
- **Intelligent Delivery:** The system will employ strategies like message bundling for chat to avoid overwhelming users and deep linking to take users directly to the relevant content in the app.
