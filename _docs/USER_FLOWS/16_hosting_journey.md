## 5. Hosting Journey (User Host's View)

**Goal:** To provide a `User Host` with a powerful yet intuitive set of tools to create a unique event, manage it effectively, and gather valuable feedback, all while being able to participate in the experience themselves.

**Actors:**

- **User Host:** A user with both `socialProfile` and `hostProfile`.
- **Momento App (Client):** The React Native/Expo application, in "Host Mode."
- **Momento Backend (Convex):** The Convex server handling event creation, state changes, and notifications.

---

### Flow Steps

This flow assumes the user has already created a `hostProfile` and is in "Host Mode."

#### 1. Event Creation

- **User Action:** From the `HostDashboardScreen`, the host taps a "Create New Event" button.
- **User Experience (UI/UX):** This initiates the `CreateEventFlow`, a multi-step wizard.
  1.  **Core Details:** The host enters the `title`, `description`, `min_attendees`, `max_attendees`, and any `age_min`/`age_max` restrictions.
  2.  **Itinerary Builder:** A dynamic interface allows the host to add one or more stops. For each stop, they define a `title`, `description`, `start_time`, `end_time`, and select a `location` (either by searching Google Places or dropping a pin on a map).
  3.  **Arrival Signal:** The host must fill in the `arrival_signpost` text field, providing a clear real-world cue for attendees.
  4.  **Host as Attendee:** A crucial checkbox appears: "I will be participating in this event." If checked, the host occupies one spot, counting towards `max_attendees`. This option is only available to `User Host` types.
- **Backend & Services:**
  - **Client -> Backend:** Once the wizard is complete, the client calls the `events.create({ eventData })` mutation.
  - **Backend (Convex):**
    1.  A new document is created in the `events` collection with a `status` of `'draft'`.
    2.  The `itinerary` is stored as an embedded array of objects.
    3.  The backend generates an `event_vector` from the event's title and description for matching purposes.

#### 2. Event Publishing & Monitoring

- **User Action:** The host reviews their draft and taps "Publish."
- **Backend (Convex):**
  1.  The `events.publish({ eventId })` mutation is called.
  2.  The event `status` is changed from `'draft'` to `'published'`.
  3.  This status change is the trigger for the matching algorithm to start finding and inviting suitable participants.
- **User Experience (UI/UX):**
  - The `HostDashboardScreen` now shows the event as "Published."
  - The host can see a real-time count of confirmed attendees as they accept invitations.
  - The host receives push notifications when the event is confirmed (meets `min_attendees`) and when it's full.

#### 3. Pre-Event Interaction

- **User Action:** The host can engage with confirmed attendees before the event.
- **User Experience (UI/UX):**
  - The host can access a dedicated message board for the event (`EventPostsScreen`) to share updates, answer questions, or build excitement.
- **Backend & Services:** New posts on the message board are stored in the `event_posts` collection, and real-time updates are pushed to all participants.

#### 4. Day of Event: The Host/Participant

- **User Action:** The host arrives at the event and taps the "I'm Here" button, just like any other participant.
- **System Action:** This check-in is critical. It signals to all other checked-in attendees that the host has arrived, updating their "Deck of Cards" UI and sending a push notification.
- **User Experience (UI/UX):** Since the host is also a participant, they also see the `DeckOfCardsAttendee` component and can use it to find their guests.

#### 5. Post-Event Responsibilities

- **System Action:** 12 hours after the event, the host receives a push notification prompting them for feedback.
- **User Action:** The host proceeds through a dedicated feedback flow.
- **User Experience (UI/UX):**
  1.  **Attendance Confirmation:** The host is presented with a list of all confirmed attendees. They must mark anyone who did not show up as a `no_show`. This is a critical input for the community's `absentee_rating` system.
  2.  **Event Feedback (Optional):** The host can add private notes about how the event went, what could be improved, etc.
- **Backend & Services:** The submitted attendance data updates the `status` field for the relevant records in the `attendance` collection.

#### 6. Viewing Results

- **User Action:** After the feedback window closes, the host can view the results of their event.
- **User Experience (UI/UX):**
  - The `HostDashboardScreen` displays the aggregated, anonymous ratings the event received from participants.
  - The host can also access the shared `EventPhotoGallery` to see memories captured by the attendees and has moderation rights to remove inappropriate photos.
- **Backend & Services:** The backend aggregates data from the `ratings` collection to provide the summary statistics for the host's dashboard.
