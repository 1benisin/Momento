## 6. Making a Connection (Post-Event)

**Goal:** To provide users with private, intuitive tools to manage the connections they've made, reflect on their interactions, and seamlessly transition an in-person connection to an online one if they choose.

**Actors:**

- **Participant:** The user who attended an event.
- **Momento App (Client):** The React Native/Expo application.
- **Momento Backend (Convex):** The Convex server handling data storage and relationships.

---

### Flow Steps

This flow begins after a user has attended an event and completed the mandatory post-event feedback flow, which unlocks these features.

#### 1. Accessing the Memory Book

- **User Action:** The user navigates to the `MemoryBookTab` from the main application navigator.
- **User Experience (UI/UX):**
  - The screen displays a gallery of `FaceCard`s for every person the user has met at all past Momento events.
  - By default, the cards are sorted chronologically by "Last Met."
  - The user can use search and sort tools to find specific people or events.

#### 2. Interacting with a Connection's Face Card

- **User Action:** The user taps on a specific `FaceCard` in their Memory Book.
- **User Experience (UI/UX):**
  - The app navigates to a `ConnectionDetailScreen`, which shows a larger version of the `FaceCard`.
  - Tapping the card can "flip" it, revealing the interactive back which contains the connection's `InterestConstellation`, `KudosShowcase`, and `EventDNA`.
  - A toolbar or menu on this screen provides several private actions.

#### 3. Using Private Connection Tools

- **User Action:** From the `ConnectionDetailScreen`, the user utilizes one of the private management tools. These actions are **visible only to the user** and are designed for personal organization and signaling intent to the backend.
- **Flows & Backend Services:**
  1.  **Add Private Notes:**
      - **UX:** Tapping a "Notes" icon opens a simple text editor.
      - **Backend:** The client calls `connections.updatePrivateNotes({ connectionId, notes })`. The `private_notes` field on the `connections` document is updated.
  2.  **Toggle Favorite (⭐):**
      - **UX:** Tapping a star icon toggles its state. This can be used for a "Favorites" filter in the main Memory Book view.
      - **Backend:** Calls `connections.toggleFavorite({ connectionId })`, which flips the `is_favorite` boolean.
  3.  **Signal "Connect Again":**
      - **UX:** Tapping a "Connect Again" (🔗) button signals interest in seeing this person at future events. The UI provides positive feedback. If the other user has also signaled this, a "Mutual Connection" badge might appear.
      - **Backend:** Calls `connections.setWantsToConnectAgain({ connectionId, value: true })`. This updates the `wants_to_connect_again` boolean, which is a key input for the matching algorithm.
  4.  **Signal "Don't Connect Again":**
      - **UX:** From a sub-menu, the user selects "Don't see again." This is the "soft block."
      - **Backend:** Calls `connections.setDoesNotWantToConnectAgain({ connectionId, value: true })`. This updates the `does_not_want_to_connect_again` boolean, telling the matching algorithm to avoid pairing these users.

#### 4. Initiating a Private Message

- **User Action:** From the `ConnectionDetailScreen`, the user taps a "Message" button.
- **User Experience (UI/UX):** The app navigates to a standard one-on-one chat screen.
- **Backend & Services:**
  - The client first checks if a `conversation` between these two users already exists.
  - If not, it calls `conversations.create({ participantIds: [userId1, userId2] })`.
  - Once a `conversationId` is established, sending a message calls the `messages.send({ conversationId, content })` mutation. Messages are stored in the `messages` collection.

#### 5. Using "Social Connect"

This flow allows for the private, one-way sharing of social media links.

- **User Action (Sharer):**
  1.  Navigates to their own profile settings and adds their social media links (e.g., Instagram) to the `socialLinks` array in their `users` document. This is private by default.
  2.  From a connection's `FaceCard` in the Memory Book, they tap the "Share Socials" button.
  3.  A modal appears showing the sharer's available links. They select the one(s) they want to share with this specific person.
- **Backend & Services (Sharer):**
  - For each selected link, the client calls `socialConnections.share({ receiverId, platform })`.
  - This creates a new document in the `social_connections` collection, effectively creating a permission grant from the sharer to the receiver for a specific platform.
- **User Experience (Receiver):**
  - The receiver is **not** notified. This is a silent action.
  - The next time the receiver views the sharer's `FaceCard` in their Memory Book, the corresponding social media icon (e.g., Instagram) will now be visible and tappable.
  - Tapping the icon will launch the external social media app or website.
  - A small, one-time prompt might appear: "[Sharer's Name] shared their Instagram with you. Share yours back?" This makes reciprocation a single tap.
