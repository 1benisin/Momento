## 4. Event Lifecycle (Participant's View)

**Goal:** To guide a confirmed participant through the entire event experience, from pre-arrival reminders and a seamless check-in to post-event feedback and connection, reinforcing Momento's values of presence and genuine interaction.

**Actors:**

- **Participant:** The user who has confirmed their attendance.
- **Momento App (Client):** The React Native/Expo application.
- **Momento Backend (Convex):** The Convex server handling logic and scheduled tasks.
- **Twilio/Expo:** Services for sending SMS/Push reminders.

---

### Flow Steps

This flow begins after a user has confirmed their attendance for an event.

#### 1. Pre-Event Reminders

- **System Action:** Scheduled functions on the backend trigger notifications at set intervals before the event.
- **Backend (Convex):**
  1.  A scheduled function runs 24 hours before the event `start_time`, querying for all confirmed attendees and sending a "Get Ready!" push notification.
  2.  Another scheduled function runs 1 hour before, sending a final reminder via both push and (if opted-in) SMS.
- **User Experience (UI/UX):** The user receives timely, helpful reminders, building anticipation for the event.

#### 2. The Arrival & Check-In ("The Signal")

- **User Action:** The participant travels to the first location specified in the event's itinerary, guided by the address and the host-provided `arrival_signpost` description (e.g., "Look for the table with the small potted succulent.").
- **User Experience (UI/UX):**
  - Upon opening the app near the event's start time, the `EventDetailScreen` is in an "Arrival State," prominently featuring a large "I'm Here" button.
- **User Action:** User taps the "I'm Here" button.
- **System Action (Backend):**
  1.  The `events.checkIn({ eventId })` mutation is called.
  2.  It validates that the user is a confirmed attendee and that the check-in is happening within a reasonable time window of the event's start.
  3.  A new document is created in the `attendance` collection with a status of `attended`. For verification, the user's current lat/long can be stored with the check-in record.

#### 3. First-Time Attendee "Authentic Photo"

- **System Action:** The backend detects that this is the user's first-ever check-in.
- **User Experience (UI/UX):**
  - Before revealing the "Deck of Cards," the user is presented with a one-time modal: "Welcome to your first event! To help others find you, please take a quick, authentic photo."
  - The in-app camera is launched.
  - This photo is saved as their primary `FaceCard` image and is automatically given the "Authentic" badge, as detailed in `_docs/FEATURES.md`.

#### 4. The "Deck of Cards" Reveal

- **System Action:** After the user has successfully checked in, the UI of the `EventDetailScreen` updates.
- **User Experience (UI/UX):**
  - The "I'm Here" button is replaced by the `DeckOfCardsAttendee` component.
  - This component is a horizontally swipeable gallery of `FaceCard`s for every other participant (and the host) who has also checked in. This allows attendees to confidently find each other without awkward "Are you here for...?" conversations.
  - If the host has not yet arrived, their card is visually distinct and marked with a "NOT YET ARRIVED" status.

#### 5. Host Arrival

- **System Action:** The host checks in.
- **Backend (Convex):** A push notification is triggered and sent to all attendees who are already checked in.
- **User Experience (UI/UX):**
  - The participant receives a notification: "Your host, [Host Name], has arrived!"
  - The host's card in the "Deck of Cards" UI updates its status to "ARRIVED."

#### 6. Post-Event Feedback Prompt

- **System Action:** A scheduled function runs a set time after the event `end_time` (e.g., 12 hours later).
- **Backend (Convex):** The function sends a push notification to all users with an `attendance` status of `attended`.
- **User Experience (UI/UX):**
  - The user receives a notification: "How was '[Event Title]'? Share your feedback to see who you met and unlock messaging."
  - Tapping the notification (or a prompt in the app) leads to the feedback flow.

#### 7. Rating & Kudos Flow

- **User Action:** The user proceeds through a series of simple, focused screens.
- **User Experience (UI/UX):**
  1.  **Rate the Event:** A screen prompts for a 1-5 star rating for the overall event experience.
  2.  **Rate the Host:** A screen prompts for a 1-5 star rating for the host and an optional public comment.
  3.  **Give Kudos:** The user is shown a grid of fellow attendees' `FaceCard`s and can tap on them to anonymously give pre-defined positive affirmations (e.g., "Welcoming Vibe," "Great Listener"). This is a key mechanism for populating the `Kudos Showcase` and calculating the `contribution_score`.
- **Backend & Services:** Each step in this flow calls a specific Convex mutation (`ratings.submitEventRating`, `ratings.submitHostRating`, `kudos.giveKudo`) to store the feedback data.

#### 8. Unlocking Connections

- **System Action:** Upon completion of the feedback flow, the final layer of post-event features is unlocked.
- **User Experience (UI/UX):**
  - The user is navigated to the `EventDetailScreen`'s "Post-Event State."
  - A "Memories" or "Connections" tab now appears. Tapping it reveals the `FaceCard`s of everyone who attended.
  - From here, the user can tap on a connection to view their full profile, add private notes, or initiate a private, one-on-one message.
- **Backend (Convex):**
  - The user's `connections` are automatically created in the backend as soon as attendance is mutually verified.
  - Completing the feedback flow simply sets a flag on the client-side to reveal the UI that allows interaction with those connections.
