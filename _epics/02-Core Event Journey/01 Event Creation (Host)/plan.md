# Plan: Event Creation (Host)

---

## 1. High-Level Summary

This plan outlines the implementation of the **Event Creation** feature, a cornerstone of the Momento platform. It will enable verified hosts to create, edit, save as drafts, and publish events. The core of this feature is a guided, multi-step flow on the frontend and a robust set of Convex mutations and actions on the backend to handle data persistence, business logic, and verification gating.

The technical approach involves extending the Convex schema with `events` and `locations` tables, implementing mutations for the event lifecycle (`create`, `update`, `publish`), and building a new set of React Native components to form the `CreateEventFlow`. A critical constraint is that only hosts verified via Stripe Identity will be permitted to publish events, a check that will be enforced on the backend.

---

## 2. Current Relevant Directory Structure

```
app/
├── (auth)/
│   ├── ...
├── (onboarding)/
│   ├── ...
├── (tabs)/
│   ├── (host)/
│   │   ├── dashboard.tsx
│   │   ├── events.tsx
│   │   ├── host-profile.tsx
│   │   └── inbox.tsx
│   ├── (social)/
│   │   ├── ...
│   ├── account.tsx
│   └── settings.tsx
...
components/
├── ModeSwitcher.tsx
├── VerificationPromptBanner.tsx
...
convex/
├── schema.ts
├── user.ts
...
```

---

## 3. Alternative Approaches (Optional)

- **Single-Screen Form vs. Multi-Step Flow:** A single, long-form screen for event creation was considered but rejected in favor of a multi-step flow. The multi-step approach provides a better, less overwhelming user experience on mobile, allows for more focused validation at each stage, and makes it easier to save and resume drafts.

---

## 4. Data Flow / State Diagram

```mermaid
flowchart TD
    subgraph Frontend
        A[Host Clicks "Create" on EventsTab] --> B(app/host/create-event.tsx);
        B --> C{Event Details Form};
        C --> D[Location Input w/ Map/Search];
        D --> E[Itinerary & Collaborators];
        E --> F[Save Draft Button];
        E --> G[Publish Button];
    end

    subgraph Backend (Convex)
        F --> H[mutation: saveEventDraft];
        G --> I[mutation: publishEvent];
        I -- Checks user.is_verified --> J{Is Host Verified?};
        J -- Yes --> K[1. Set status: "published"];
        K --> L[2. action: generateEventVector];
        L --> M[3. Event is live];
        J -- No --> N[Return Error];
        H --> O[db: events (status='draft')];
        D -- New Location --> P[mutation: createLocation];
        P --> Q[db: locations];
    end

    subgraph Downstream
        M --> R(Matching & Invitation System);
    end

    N --> S[Show VerificationPromptBanner];
```

---

## 5. Data Model Changes (`convex/schema.ts`)

Two new tables are required: `events` and `locations`.

**`locations` Collection**
Stores structured geospatial data for event locations.

```typescript
locations: defineTable({
  name: v.string(),
  address: v.optional(v.string()),
  latitude: v.number(),
  longitude: v.number(),
  google_place_id: v.optional(v.string()),
}).index("by_position", ["latitude", "longitude"]),
```

**`events` Collection**
The central entity for all event details.

```typescript
events: defineTable({
  hostId: v.id("users"),
  title: v.string(),
  description: v.string(),
  event_vector: v.optional(v.array(v.float64())),
  status: v.string(), // 'draft', 'published', 'completed', 'cancelled'
  min_attendees: v.number(),
  max_attendees: v.number(),
  age_min: v.optional(v.number()),
  age_max: v.optional(v.number()),
  arrival_signpost: v.optional(v.string()),
  confirmation_fee: v.number(),
  estimated_event_cost: v.any(), // JSON object
  itinerary: v.array(v.object({
    location_id: v.id("locations"),
    order: v.number(),
    title: v.string(),
    description: v.string(),
    start_time: v.number(),
    end_time: v.number(),
  })),
  collaborators: v.optional(v.array(v.object({
    userId: v.optional(v.id("users")),
    role: v.string(),
    first_name: v.string(),
  }))),
  // event_summary object omitted for brevity
}).index("by_hostId_and_status", ["hostId", "status"]),
```

---

## 6. Backend Implementation (`convex/`)

**Files to Create:**

- `convex/events.ts`: For public mutations and queries related to events.
- `convex/locations.ts`: For mutations and queries related to locations.
- `convex/lib/actions.ts`: For actions like vector generation.

**Files to Modify:**

- `convex/schema.ts`: Add `events` and `locations` tables.
- `convex/user.ts`: Add an internal query `isHostVerified(ctx)` that checks `user.is_verified` and Stripe Identity status.

**New Functions:**

- **`convex/locations.ts`**:
  - `getOrCreateLocation(name, address, lat, lon, google_place_id)`: A mutation that finds an existing location or creates a new one, returning its `_id`.
- **`convex/events.ts`**:
  - `createOrUpdateDraft(args)`: A mutation that accepts all event fields. If an `_id` is passed, it updates an existing draft; otherwise, it creates a new one with `status: 'draft'`. It will call `getOrCreateLocation` for itinerary stops.
  - `publishEvent(_id)`: A mutation that:
    1.  Checks if the user is the event owner.
    2.  Calls the internal query `isHostVerified`. Throws an error if not verified.
    3.  Updates the event `status` to `'published'`.
    4.  Schedules an action to generate the `event_vector`.
  - `getMyEvents()`: A query that returns all events for the logged-in host, separated by status (drafts, published, past).
- **`convex/lib/actions.ts`**:
  - `generateEventVector(eventId)`: An internal action that reads the event's title/description, calls an embedding API (e.g., OpenAI), and patches the `event_vector` field on the event document.

---

## 7. Frontend Implementation (`app/`, `components/`)

**Files to Create:**

- **`app/(tabs)/(host)/create-event.tsx`**: The main screen for the multi-step event creation flow. Will use React state or a state management library to manage the event object across steps.
- **`components/forms/EventDetailsForm.tsx`**: A component for the first step, capturing title, description, capacity, etc.
- **`components/forms/EventItineraryForm.tsx`**: A component for the second step, allowing the user to add one or more stops.
  - This will include a **`LocationSearchInput`** component that uses a mapping API (e.g., Google Places Autocomplete) to find and select locations, providing the necessary data for the `getOrCreateLocation` mutation.
- **`components/forms/EventPublishForm.tsx`**: The final step, showing a summary and the "Save Draft" / "Publish" buttons.

**Files to Modify:**

- **`app/(tabs)/(host)/events.tsx`**: Add a "Create Event" FAB (Floating Action Button) that navigates to the `create-event` screen. This screen will also be updated to fetch and display lists of draft and published events using the `getMyEvents` query.
- **`app/(tabs)/(host)/_layout.tsx`**: Add the `create-event` screen to the stack navigator.

---

## 8. Testing Strategy

- **Unit Tests (`convex/`)**:
  - Test that `createOrUpdateDraft` correctly creates and updates event documents.
  - Test that `publishEvent` correctly throws an error for unverified hosts.
  - Test that `publishEvent` successfully updates status and schedules the action for verified hosts.
  - Test that `getOrCreateLocation` correctly handles new and existing locations.
- **Integration Tests**:
  - Write a test that simulates the full flow: create a draft, then publish it.
  - Test the verification gate: an unverified user's attempt to call `publishEvent` should fail gracefully.
- **End-to-End (E2E) Tests (Manual)**:
  1.  Log in as a host who is not verified.
  2.  Navigate to the "Events" tab and start creating an event.
  3.  Fill out all details and click "Publish".
  4.  **Expectation**: An error message is shown, and the `VerificationPromptBanner` is displayed. The event should be saved as a draft.
  5.  Simulate completing verification.
  6.  Return to the draft and click "Publish" again.
  7.  **Expectation**: The event is successfully published and appears in the "Published" list.

---

## 9. Open Questions & Assumptions

- **Assumption:** We will use a third-party service like Google Places API for location search and autocomplete on the frontend. This may have API key and cost implications.
- **Assumption:** The `user.is_verified` field is reliably updated via a separate flow (e.g., Stripe Identity webhooks).
- **Open Question:** What is the policy for editing **published** events? For MVP, we can restrict editing to drafts only. Material changes to published events require a more complex notification and re-confirmation flow which can be added later.
- **Open Question:** How will the confirmation fee and estimated cost be determined? For MVP, these will be simple numeric inputs.

---

## 10. Edge Cases & Gotchas

- **Auto-save Drafts:** Drafts are auto-saved on each step/field change. Users are warned about unsaved changes if navigating away.
- **Verification Gating:** On publish, if verification fails, show a clear, actionable message. Optionally, poll for verification status after Stripe flow.
- **Manual Location Entry:** If Google Places API fails, allow manual entry as a fallback and flag such events for review.
- **Itinerary Sorting:** Itinerary items are always sorted by time (both frontend and backend).
- **Missing/Invalid Fields:** UI highlights missing/invalid required fields and shows an error summary before publish. Backend enforces required fields.
- **Multi-Device Consistency:** Always fetch the latest draft from backend on screen load. Use last-edited timestamps for conflict resolution.
- **Simultaneous Edits:** Use optimistic locking or last-modified timestamps to prevent overwrites from simultaneous edits/publishes.
- **Event Time Zone:** Always display event times in the event's time zone, appending the time zone abbreviation to the time string.
- **Robust Error Handling:** All API and external service errors are caught and shown to the user with actionable feedback (toasts, banners).
- **Accessibility & Mobile Usability:** UI is tested for accessibility and mobile usability, with large touch targets and accessible labels.
- **API Rate Limits/Failures:** Handle rate limits and failures for Google Places and embedding APIs gracefully, with user-friendly error messages.

These are addressed in the implementation tasks and should be validated during development and testing.
