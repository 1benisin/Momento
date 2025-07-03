# App Features

This document is organized into the following sections.

- [1. User Profiles & Verification](#1-user-profiles--verification)
  - [Phone-First Authentication](#phone-first-authentication--us-only-launch)
  - [The Authentic Photo](#the-authentic-photo)
  - [User Verification](#user-verification)
- [2. Monetization & Payments](#2-monetization--payments)
- [3. Hosting](#3-hosting)
  - [Host Tools & Controls](#host-tools)
- [4. Interest Building Flow: The Momento Preview](#4-interest-building-flow-the-momento-preview)
- [5. The Invitation](#5-the-invitation)
  - [Algorithm Transparency: The "Why"](#algorithm-transparency-the-why)
  - [Declining an Invitation](#declining-an-invitation-capturing-user-intent)
  - [Calendar Integration](#post-confirmation--calendar-integration)
- [6. Event Preferences & Filtering](#6-event-preferences-filtering)
- [7. The Arrival Experience: The Signal](#7-the-arrival-experience-the-signal)
  - [The Host Sets the Stage](#the-host-sets-the-stage)
  - [The Deck of Cards](#the-arrival-flow-the-deck-of-cards)
- [8. Post-Event Interaction](#8-post-event-interaction)
  - [Peer-to-Peer Kudos](#peer-to-peer-kudos)
- [9. The Memory Book & The Face Card](#9-the-memory-book--the-face-card)
  - [The Face Card Lifecycle](#the-face-card-lifecycle)
  - [Social Connect](#social-connect-effortless-social-sharing)
- [10. Shared Event Galleries & Camera Roll](#10-shared-event-galleries--camera-roll)
- [11. User Safety: Blocking & Reporting](#11-user-safety-blocking--reporting)
  - [A Three-Tiered System](#a-three-tiered-system)
  - [Community Reliability: Cancellations & No-Shows](#community-reliability-cancellations--no-shows)
  - [Reporting & Consequence Framework](#reporting--consequence-framework)
- [12. Discovering Your Interests](#12-discovering-your-interests)
- [13. Discovering Your Type](#13-discovering-your-type)
- [14. Notifications](#14-notifications)

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

### The Interest Constellation

To showcase a user's personality beyond a simple list of hobbies, profiles will feature an "Interest Constellation." This data visualization moves beyond superficial tags to show the multifaceted nature of a user's character.

- **How it Works:** The backend will analyze a user's activity—such as liked event cards, attended events, and positive ratings—and use clustering algorithms to group related interests into 2-3 distinct "personas" (e.g., "Thrill Seeker," "Cozy Creative," "Intellectual Explorer").
- **Profile Visualization:** On the user's profile, these personas will be displayed as a minimalist, interactive constellation graphic. Each major "star" represents a persona. Tapping on a star could reveal the key concepts or types of experiences that define it (e.g., tapping "Thrill Seeker" might show keywords like `Rock Climbing`, `Live Music`, `Spontaneous Travel`).
- **Impact:** This feature provides a rich, at-a-glance understanding of a user's character, showing _how_ their interests connect rather than just _what_ they are. It emphasizes depth and multifaceted personality, aligning with Momento's core value of fostering genuine connection.

### Kudos Showcase

To offer a form of social proof that is more meaningful than a simple rating, profiles will feature a "Kudos Showcase." This section highlights a user's positive social qualities as recognized by people they have actually met at events.

- **How it Works:** After an event, attendees can give anonymous, private "kudos" to each other (e.g., "Great Listener," "Welcoming Vibe"). The backend system aggregates these kudos over time.
- **Profile Visualization:** The profile will display a section titled "What people appreciate about [Name]:" showcasing the top 2-3 kudos the user has received most frequently. This is presented visually with elegant icons or badges, not as a raw score, turning peer feedback into a qualitative summary of their social character.
- **Impact:** This feature provides an authentic, peer-validated glimpse into a user's personality in a social context, which is far more powerful and trustworthy than self-described attributes. It rewards positive community members with a richer profile.

### Event DNA

To give users a way to express their character through their actions, not just their words, profiles will feature an "Event DNA" section. This is a curated gallery of a user's favorite past experiences on Momento.

- **How it Works:** From their event history, a user can select 3-5 past events that they attended and rated highly to showcase on their public profile.
- **Profile Visualization:** This will be displayed as a visually rich gallery of the selected event cards. Seeing that a user chose to highlight their attendance at a "Backcountry Camping Trip," a "Japanese Pottery Workshop," and a "Silent Book Club" tells a much more compelling and authentic story than a simple list of interests.
- **Impact:** This feature transforms a user's profile from a static page into a living testament to their adventures and passions. It provides concrete, verifiable examples of their interests, offering a deep and immediate insight into their personality.

### The Vibe Summary (AI-Generated)

As a capstone feature that synthesizes all of a user's activity into a compelling narrative, profiles can feature an AI-generated "Vibe Summary."

- **How it Works:** The system will use a large language model to analyze a user's complete Momento footprint: their interest vectors, the kudos they've received, and their showcased "Event DNA." It then generates a short, narrative paragraph that captures the essence of their character.
- **Profile Visualization:** The summary will be displayed prominently on the profile. For example: _"Looks like someone who is just as comfortable discussing philosophy over wine as they are on a windswept trail. People who have met them seem to appreciate their thoughtful questions and welcoming energy."_
- **User Control:** This feature is opt-in. A user can choose to generate their summary, and they will always have the final say. They can approve the generated text, ask for a new version, or choose not to display it at all.
- **Impact:** This feature provides the ultimate "show, don't tell" profile component. It weaves together disparate data points into a holistic, easy-to-read summary that feels both personal and authentic.

> **Future Enhancement (Phase 3):** > **Feature:** In-App Camera Requirement.
> **Rationale:** Requiring at least one profile picture to be taken through the in-app camera (instead of just incentivizing it) would more strongly guarantee that photos are recent and unedited, further increasing platform trust.

### Phone-First Authentication & US-Only Launch

To create a seamless onboarding experience that ties directly into our core SMS invitation feature, Momento will use phone-first authentication.

- **US-Only for MVP:** For the initial launch, sign-up will be limited to users with a valid US phone number.
- **International Waitlist:** If a user attempts to sign up with a non-US number, the app will inform them that we are not yet available in their country. It will offer to save their number to a waitlist, and we will notify them via SMS when Momento launches in their region.
- **One-Time Passwords (OTP):** Both sign-up and login will be handled via a secure one-time password to the user's phone, eliminating the need for users to remember a traditional password.

### Handling Phone Number Recycling

To prevent unauthorized account access and user lockouts due to phone number recycling, Momento will implement a robust verification process.

- **Systematic Detection:** When a user attempts to sign up with a phone number that is already associated with a Momento account, the system will check for signs of dormancy or use on a new device to assess the risk of it being a recycled number.
- **Clarifying User Intent:** The user will be asked if they are the original owner of the account associated with the number. This creates two distinct paths:
  1.  **New User (Recycled Number):** If the user indicates they are new, the system will initiate a security waiting period (e.g., 24 hours) to protect the original owner's data. The original owner will be notified via email (if available), and their account will be archived by unlinking it from the phone number. The new user will be notified via SMS when they can complete their sign-up.
  2.  **Existing User (New Device):** If the user indicates they are the original owner, they will be asked to complete a second-factor authentication step to ensure security. This may involve verifying via a recovery email, completing an ID verification check, or confirming personal details like their date of birth.

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

## 3. Hosting

- Individuals and organizations can both create and host events.
- Hosts will have a dedicated Host Profile with ratings from past events.
- **Host Tools**:
  - Access to information and best practices for creating highly-rated events.
  - Insights from feedback on previous successful events.
  - A notification 15 minutes after their event starts, informing them if any attendees have not yet checked in.
- **Host Controls**:
  - Hosts must be present at their events; they can be both host and participant. They can also be a business host.
  - **Minimum Age:** Hosts can set a minimum age requirement for their event (e.g., 21+). Our matching algorithm will not match users who do not meet this requirement.
  - **Host as Attendee:** A checkbox on the event creation screen for the host to indicate they will be participating in the event, not just organizing it. If selected, the host will occupy one spot, counting towards the `max_participants` limit. They are automatically considered "confirmed" for the event and are exempt from the $5 event fee. This option is only available for hosts who also have a participant social profile.
  - **Public Social Links for Hosts**: `User Hosts` have the option to make specific social media profiles public on their Host Profile. This allows potential attendees to vet the host and get a better sense of their style and offerings, building trust and transparency. `Community Hosts` (venues, organizations) can also publicly display links like their official website or Instagram page.
  - **Event Itinerary:** Hosts can build dynamic events with one or more stops. For each stop, they must define both a **start time** and an **end time**, and can add a location by either searching for a venue or business (e.g., a restaurant via Google Maps) or dropping a precise pin on the map for locations without a formal address (e.g., a specific spot in a park). This ensures a clear schedule for attendees and for calendar integrations.
  - **Collaborators:** Hosts can add other people involved in the event, such as a co-host, instructor, or guide. If the collaborator is a Momento user, the host can link directly to their profile. If they are not, the host can simply enter their name and role. This provides clarity and recognizes everyone contributing to the experience.

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
- **"Too far away"** or **"Too expensive"**: This signals a logistical or financial mismatch. It does not negatively affect the user's interest profile. Instead, it triggers a **Contextual Nudge**, a one-time prompt asking the user if they'd like to set their travel or price preferences to receive more relevant invitations in the future.
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

## 6. Event Preferences & Filtering

To give users more control over their invitations and reduce noise, Momento provides a set of powerful, optional preferences. These are introduced contextually when a user declines an event for a related reason, rather than overwhelming them during onboarding.

- **Distance Preference**: Users can set a maximum travel radius from their home (e.g., 5, 10, or 25 miles). The matching algorithm will use this as a **hard filter**, meaning the user will not receive invitations for events outside this radius.
- **Price Sensitivity**: Users can select a general price comfort level (e.g., $, $$, $$$). This is also a **hard filter**. The app will only show them events whose `Estimated Event Cost` falls within their selected range.

These features ensure that the invitations a user sees are not only a good match for their interests but also for their real-world logistics and budget.

## 7. The Arrival Experience: The Signal

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
    - **Attendee Cards:** Subsequent cards show every other checked-in attendee in the order they arrived.

This flow ensures that even if attendees arrive before the host, they can still identify and connect with each other, turning a moment of potential awkwardness into the first moment of connection. When the host finally does check in, their card's status updates, and a notification can be sent to all attendees: **"Your host, Sarah, has arrived!"**

### Automated Check-in Reminder

To ensure accurate attendance data and help users who forget, the app will send a time-based reminder to check in shortly after an event begins.

- **Functionality:** This is a simple, server-side cron job or scheduled function.
- **Trigger:** Approximately 15 minutes after an event's official `start_time`, the system will check for any confirmed attendees who have not yet checked in.
- **User Experience:** Those users receive a simple push notification: "'[Event Title]' has started! If you've arrived, don't forget to check in to find your group." This gently nudges the user without needing complex location permissions for the MVP.

> **Future Enhancement (Phase 2):** > **Feature:** Geofenced Check-in Reminders.
> **Rationale:** A geofenced reminder would provide a more magical, context-aware experience than the time-based one. By triggering the check-in prompt the moment a user arrives in the event's vicinity, we reduce friction and improve the accuracy of arrival data.

## 8. Post-Event Interaction

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

## 9. The Memory Book & The Face Card

To foster lasting connections beyond a single event, the app will feature a dedicated "Memory Book." This screen serves as a private, organized record of every person a user has met at Momento events. It is a gallery of collected memories, not just a list of contacts.

### The Face Card Lifecycle

The core of the Memory Book is the **Face Card**, a dynamic, collectible memento that represents each connection. It evolves with the user.

1.  **The First Event & The First Photo:** When checking in to their first event, an attendee will be prompted to take an in-app photo. This is for identification, ensuring other guests can find them. This raw, authentic photo becomes their very first Face Card, which might feature a special "First Event" badge.
2.  **The Immutable Snapshot:** When this Face Card is added to another attendee's Memory Book, it is stored as an **immutable snapshot**. It will forever look exactly as it did at that first meeting, preserving the memory. Even if the original user updates their own Face Card later, it will not change in the Memory Books of those who have already collected it.
3.  **Styling & Upgrades:** After the event, the user unlocks the ability to "stylize" their Face Card, transforming their authentic photo into a piece of art using Momento's signature AI-driven style.
4.  **Customization:** Over time, users can earn or unlock new ways to customize their Face Card, such as decorative borders or frames or new image stylizations, by reaching milestones (e.g., hosting their first event, attending five events, receiving high ratings).

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

## 10. Shared Event Galleries & Camera Roll

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

## 11. User Safety: Blocking & Reporting

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
      - The system will permanently prevent them from being matched in any future event.
      - Users will have a "Blocked Users" list in their app settings to manage and, if they choose, unblock individuals.

3.  **Community Violation: "Report"**
    - **Functionality:** This is a formal flag raised to the Momento review team when a user has violated community standards. Reporting a user automatically triggers a "Block" as described above.
    - **User Experience:** To discourage misuse and ensure quality reports, the process is structured and educational.
      - **Guided Flow:** The user is asked to categorize the violation from a predefined list (e.g., Harassment, Inappropriate Content, Misrepresentation, In-Person Misconduct).
      - **Educational Messaging:** The interface will provide clear examples of what constitutes a reportable offense, while also presenting the "Block" feature as the appropriate tool for situations that don't violate guidelines (e.g., "I just didn't enjoy their vibe").
      - **Managed Expectations:** The app will clearly state that a review team will assess the report and take appropriate action based on the evidence and our internal policies.

### Community Reliability: Cancellations & No-Shows

To protect the quality of events and respect the commitment of hosts and fellow attendees, Momento has a clear, non-refundable cancellation policy. This framework is designed to create a reliable and committed community.

- **Non-Refundable Fee:** The $5 event confirmation fee is **non-refundable** in all cancellation scenarios initiated by the participant. This fee represents a commitment to attend.

- **Exception for Host-Initiated Changes:** The non-refundable policy has one critical exception: if a host makes a material change to the event (e.g., time, location) after a user has confirmed and paid, the fee becomes fully refundable. The user will be notified and given the choice to accept the new details or receive an automatic, one-click refund. This ensures users are protected from last-minute changes outside their control.

The system distinguishes between several scenarios, each with a different impact on a user's internal `absentee_rating`:

1.  **Early Cancellation (Outside 24 hours of event start)**

    - **Action:** User cancels via the app.
    - **Outcome:** No penalty to their internal rating. The system will attempt to fill the vacant spot by sending a new, time-sensitive invitation to another well-matched user.

2.  **Late Cancellation (Within 24 hours of event start)**

    - **Action:** User cancels via the app.
    - **Outcome:** A **moderate penalty** is applied to the user's `absentee_rating`. This is seen as less reliable than an early cancellation. The spot will not be filled.

3.  **The "No-Show"**

    - **Action:** The user does not cancel and does not check in to the event. They are marked as a no-show by the host or other attendees during post-event feedback.
    - **Outcome:** A **severe penalty** is applied to the user's `absentee_rating`.

4.  **The "Check-in & Bail" (Worst-Case Scenario)**
    - **Action:** The user checks in upon arrival (or spoofs their location) and then leaves the event without participating. This is the most disruptive behavior as it misleads the host and attendees.
    - **Outcome:** This must be reported by the host or another attendee post-event. It results in the **most severe penalty** to a user's `absentee_rating` and, if repeated, could lead to temporary suspension from the platform.

> **💡 Design Philosophy: The "Cost of a Handshake"**
>
> The decision to make the $5 event fee non-refundable is intentional. It's not primarily a revenue driver; it's a behavioral mechanism. We call it the "Cost of a Handshake."
>
> - **It Represents Commitment:** The small financial stake elevates the RSVP from a casual "maybe" to a firm commitment, which is the foundation of a reliable community. It ensures that when a user accepts, they have skin in the game, just like the host who is investing their time and effort.
> - **It Simplifies the System:** A universal no-refund policy eliminates the complexity of tiered refunds, payment processor fees for reversals, and potential user confusion. The rule is simple and applies to everyone equally.
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

## 12. Discovering Your Interests

To solve the "invite rut" problem and allow users to continuously refine their tastes, the app will feature a dedicated discovery mode. This serves both as an interest-building tool and an internal marketing feature that showcases the quality of experiences on Momento without sacrificing the exclusivity of future events.

- **Headline:** **"Help us Discover your Interests"**
- **Functionality**: Users are presented with a swipeable, full-screen deck of cards representing real, highly-rated **past events**.
- **Content**: Each card will feature the event's title, its evocative description, and the public, host-provided **cover image**. All information about the host and attendees is kept anonymous.
- **Interaction**: Users can swipe right or left. This action is primarily a signal for the matching algorithm and does not mean the user will be invited to that specific event if it runs again.
- **Backend Signal**: Each right swipe provides a strong, positive signal to the user's `positive_interest_vector`, helping the algorithm understand their current tastes. This is a primary mechanism for evolving a user's preferences over time.

## 13. Discovering Your Type

To help the matching algorithm understand a user's "type" in potential connections, the app features a second discovery mode focused on people. This moves beyond simple "liking" and frames the action as an intentional search for compatibility.

- **Headline:** **"Help us Discover your Type"**
- **Functionality**: Users are presented with a swipeable deck of profile cards. This feed is populated based on the user's `interested_in` preferences. It will not show users outside of these preferences.
- **Interaction**: The language is designed to be intentional and aligned with Momento's values.
  - **Swipe Right:** The button or action is labeled **"I'd like to create a memory with them."** This signals a potential for genuine connection.
  - **Swipe Left:** The button or action is labeled **"Not the connection I'm looking for."**
- **Backend Signal**: Each right swipe is a crucial signal. It does not send a "like" to the other user. Instead, it helps the algorithm build the user's `person_attraction_vector`—a nuanced, mathematical representation of their "type." This vector is a key component in calculating person-to-person compatibility for the "Social Graph" algorithm, moving far beyond simple gender preferences to understand the _vibe_ of people a user connects with.

## 14. Notifications

A robust notification system is critical to the user experience, ensuring users are informed about timely events like invitations, reminders, and social interactions. The system will use a combination of Push Notifications (via Expo) and SMS (via Twilio), with all logic orchestrated by secure backend functions.

- **Granular User Control:** Users will have a dedicated "Notification Settings" screen to opt in or out of different categories of notifications (e.g., `sms_invitations`, `push_direct_messages`). The backend will always respect these preferences.
- **Event-Driven:** Notifications will be triggered by key events in the app lifecycle:
  - **Invitations:** New and expiring invitations.
  - **Event Logistics:** Confirmations, reminders (24-hour, 1-hour), updates, and cancellations.
  - **Social:** New direct messages, kudos received, and mutual connection matches.
  - **Account & Safety:** Payment confirmations and report status updates.
- **Intelligent Delivery:** The system will employ strategies like message bundling for chat to avoid overwhelming users and deep linking to take users directly to the relevant content in the app.
