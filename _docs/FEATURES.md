# App Features

This document outlines the core features of the Momento application.

## 1. User Profiles

User profiles will contain three categories of information:

- **Public Information**: Profile images, first name, etc.
- **Private Information**: Phone number, email, etc., visible only to the user.
- **Internal Information**: Data used by the app for ranking and matching purposes, not visible to the user. This includes:
  - A record of profiles the user has liked.
  - An "absentee rating" (for tracking no-shows or lateness).
  - An internal "attractiveness rating" to assist in matching users with others in a similar range.
- **Future Experiment**: Requiring at least one profile picture to be taken through the in-app camera to ensure it is recent and unedited.

### The Authentic Photo

To build a foundation of trust and authenticity, Momento will include a feature to verify that a user's photo is recent and genuine.

- **In-App Camera:** Users will be prompted to take a photo of themselves from within the Momento app, using the native camera functionality.
- **"Authentic" Badge:** A photo taken this way receives a special "Authentic" badge, which is displayed on the user's profile and on their Face Card in the Memory Book.
- **12-Month Expiry:** To ensure photos remain current, the "Authentic" status and badge for a photo will automatically expire after 12 months. The user will then be prompted to take a new one.

## 2. Interest Building Flow

This is a critical onboarding process to understand users' passions and interests.

- The flow will walk users through theoretical event scenarios to gauge their interest.
- The goal is to build a multidimensional map of interests to create user clusters for better matching.
- It will include deeper questions about life goals, values, and political views.
- **Future Experiment**: An AI-driven voice conversation to conduct a user interview, with key information extracted from the transcript.
- **Future Experiment**: Allowing a user's selected friends or family to have a conversation with the AI to provide an outside perspective on the user.

## 3. Browsing Profiles

- Users will be able to browse a selection of other user profiles.
- They can "like" profiles, which provides data for the matching algorithm and helps determine the user's "type."

## 4. The Invitation

The invitation is a core part of the weekly user experience.

- Ideally, users receive one event invitation per week and have 24 hours to respond.
- Invitations will be sent via text message, featuring an image and a link to the app.
- **Future Ideal**: The host can choose from several AI-generated invitation images. The chosen image could be a looping GIF with subtle animations (e.g., leaves moving in a breeze, a sparkling line art design).
- The in-app invitation page will provide full details:
  - Event description, time, and a full itinerary, including an interactive map of all locations.
  - Estimated costs (e.g., average menu prices, ticket fees).
  - Minimum and maximum number of participants (min. 4).
  - Ratings for the host and/or venue.
- The app will curate invitees based on who is the best match for the event and other participants.
- A balanced male-to-female ratio will be a goal.
- Participants will not see who else is attending until after they arrive (or possibly after they accept).
- Participants will be able to message the host before the event for logistical questions.

#### Post-Confirmation & Calendar Integration

Once a user's attendance is confirmed (payment successful), they will be presented with an "Add to Calendar" option.

- **Functionality:** Tapping this will download a standard calendar file (`.ics`) that can be imported into their native calendar app (Google Calendar, Apple Calendar, etc.).
- **Details:** The calendar event will contain all relevant details:
  - Event Title
  - Full Itinerary (including all stop locations and descriptions)
  - Start and End Times
  - A link back to the event page in the Momento app.

## 5. Hosting

- Users and businesses can both create and host events.
- Hosts will have a dedicated Host Profile with ratings from past events.
- **Host Tools**:
  - Access to information and best practices for creating highly-rated events.
  - Insights from feedback on previous successful events.
- **Host Controls**:
  - Hosts must be present at their events; they can be both host and participant. They can also be a business host.
  - **Minimum Age:** Hosts can set a minimum age requirement for their event (e.g., 21+). Our matching algorithm will not match users who do not meet this requirement.
  - **Host as Attendee:** A checkbox on the event creation screen for the host to indicate they will be participating in the event, not just organizing it. If selected, the host will occupy one spot, counting towards the `max_participants` limit. They are automatically considered "confirmed" for the event and are exempt from the $5 event fee.
  - **Event Itinerary:** Hosts can build dynamic events with one or more stops. For each stop, they must define both a **start time** and an **end time**, and can add a location by either searching for a business (e.g., a restaurant via Google Maps) or dropping a precise pin on the map for locations without a formal address (e.g., a specific spot in a park). This ensures a clear schedule for attendees and for calendar integrations.
  - **Collaborators:** Hosts can add other people involved in the event, such as a co-host, instructor, or guide. If the collaborator is a Momento user, the host can link directly to their profile. If they are not, the host can simply enter their name and role. This provides clarity and recognizes everyone contributing to the experience.
- **Future Experiment**: AI tools to help with event creation, including:
  - AI-generated event names and descriptions.
  - AI-generated invitation images.
  - AI-powered idea generation and augmentation, suggesting ways to make an event more memorable based on feedback from similar events.

## 6. Post-Event Interaction

- The day after the event, participants will be prompted to provide feedback on the event and the host.
- They will also report if any participants were late or did not show up.
- After submitting feedback, participants will unlock the ability to message other attendees one-on-one.
- **Future Experiment**:
  - To combat "check-in and bail" scenarios, we will request and store the user's location at the moment they tap "I'm Here". If a user is reported as a "no-show" after having checked in, this creates a "disputed" attendance status. Such cases will be reviewed, and if a user is found to have left after checking in, it will negatively impact their internal rating more severely than a standard no-show.
  - Allowing message posting on the event page itself (e.g., for a thank-you note from the host).
  - A feature for attendees to post pictures they took at the event.

The design will subtly encourage users to wait until after the event to exchange contact information, reinforcing that they can connect through the app.

## 7. Monetization & Payments

- **Model**: Participants will be charged a $5 fee upon accepting an event invitation. This fee confirms their spot and helps reduce no-shows. Hosts who choose to be an attendee for their own event are exempt from this fee.
- **Payment Flow**: Users can add a credit card to their private profile information at any time. If a user does not have a payment method on file when they accept their first invitation, they will be prompted to add one before their acceptance is confirmed.
- **Integration**: This requires integration with a third-party payment processor (e.g., Stripe) to securely handle credit card storage and transactions.
- **User-Facing Features**:
  - A dedicated "Payment Methods" screen where users can add or remove credit cards.
  - A "Transaction History" screen where users can see a list of their past payments.
  - Clear in-app prompts and confirmations for all charges.
  - Email receipts for successful payments.
- **Backend Requirements**:
  - Server-side logic to create and manage Stripe Customer objects.
  - Secure endpoints to handle payment intent creation and confirmation.
  - Webhooks to listen for payment status updates from Stripe (e.g., `charge.succeeded`).

## 8. The Memory Book & The Face Card

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

## 9. User Safety: Blocking & Reporting

To build a safe and trustworthy community, users will have access to a multi-tiered system for managing their interactions with others. The design prioritizes user comfort and provides clear, distinct tools for different situations.

### A Three-Tiered System

1.  **Preference Signal: "Don't Connect Again"**

    - **Functionality:** This is a private, lightweight signal to the matching algorithm. It is the inverse of the "Connect Again" feature. The user is indicating a preference to not be placed in future events with a specific person.
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

## 10. User Verification

User verification is a cornerstone of accountability. It will be implemented in phases to balance trust-building with user convenience. The process will be handled by a secure, third-party service (Stripe Identity) to ensure user privacy.

### A Phased Approach

1.  **Phase 1: Optional Verification (The "Verified" Badge)**

    - **Functionality:** Any user can choose to verify their identity using a government-issued ID. We will never store the ID itself, only a confirmation of validity.
    - **User Experience:** Verified users receive a "Verified" badge on their profile, signaling trustworthiness to other users.

2.  **Phase 1: Mandatory Host Verification**

    - **Functionality:** All hosts (both User and Business hosts) are required to complete identity verification before they are allowed to create a Host Profile or host their first event.
    - **User Experience:** This is a one-time, mandatory step during the host onboarding process, ensuring a high level of accountability for all event organizers.

3.  **Phase 2: Triggered, Mandatory Verification**
    - **Functionality:** As part of the safety framework, a user who is reported will have a mandatory verification check triggered.
    - **User Experience:** Their account is temporarily limited until they complete verification. Refusal or failure results in suspension or a ban.

## 11. The Arrival Experience: The Signal

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
