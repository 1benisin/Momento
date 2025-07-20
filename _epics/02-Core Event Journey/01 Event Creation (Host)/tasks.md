# Implementation Tasks: Event Creation (Host)

This document breaks down the implementation plan into actionable, sequential tasks.

---

## Phase 1: Backend Setup (Convex)

The focus of this phase is to build the foundational data schema and business logic in Convex.

### 1.1. Data Schema

- **File:** `convex/schema.ts`
- [x] Add the `locations` table definition with a geospatial index.
- [x] Add the `events` table definition with an index on `hostId` and `status`.

### 1.2. Location Logic

- **File:** `convex/locations.ts` (new file)
- [x] Create the `getOrCreateLocation` mutation to handle finding or creating location documents.

### 1.3. Event Logic

- **File:** `convex/events.ts` (new file)
- [x] Implement the `createOrUpdateDraft` mutation for creating/updating events with `status: 'draft'`.
- [x] Implement the `publishEvent` mutation, which includes the critical check against the host's verification status before changing the event status to `'published'`.
- [x] Implement the `getMyEvents` query to fetch all events created by the currently authenticated host.

### 1.4. Supporting Actions

- **File:** `convex/lib/actions.ts` (or a new `convex/actions.ts` if it doesn't exist)
- [x] Implement the `generateEventVector` internal action to be called after an event is successfully published.

### 1.5. Backend Testing

- **File:** `convex/tests/events.test.mts` (new file)
- [x] Write unit tests for the `createOrUpdateDraft` mutation.
- [x] Write unit tests for the `publishEvent` mutation, specifically testing the success case for verified hosts and the failure case for unverified hosts.
- [x] Write a unit test for the `getOrCreateLocation` mutation.

---

## Phase 2: Frontend Implementation (React Native)

This phase focuses on building the user interface and connecting it to the backend mutations and queries.

### 2.1. Navigation

- **File:** `app/(tabs)/(host)/_layout.tsx`
- [x] Add a new route for `create-event` to the host tab's stack navigator.

### 2.2. Event Management Screen

- **File:** `app/(tabs)/(host)/events.tsx`
- [x] Add a "Create Event" Floating Action Button (FAB) that navigates to the new `create-event` screen.
- [x] Use the `useQuery` hook with `api.events.getMyEvents` to fetch the host's events.
- [x] Render two lists on the screen: "Drafts" and "Published," populated from the query results. Allow tapping on a draft to navigate to the `create-event` screen with the draft's data pre-filled.

### 2.3. Event Creation Flow

- **File:** `app/(tabs)/(host)/create-event.tsx` (new file)
- [x] Create the main screen component that will manage the state of the multi-step form.
- [x] Implement the logic to pre-fill the form if navigating from an existing draft.

### 2.4. Form Components

- **File:** `components/forms/EventDetailsForm.tsx` (new file)
- [x] Build the form inputs for the event's core details (title, description, capacity, etc.).
- **File:** `components/forms/EventItineraryForm.tsx` (new file)
- [x] Build the UI for adding/editing itinerary stops.
- [x] Integrate a location search input (e.g., using Google Places Autocomplete API) that provides data for the `getOrCreateLocation` mutation.
- **File:** `components/forms/EventPublishForm.tsx` (new file)
- [x] Build the final summary screen with "Save Draft" and "Publish" buttons.
- [x] Wire the `onPress` for "Save Draft" to the `createOrUpdateDraft` mutation.
- [x] Wire the `onPress` for "Publish" to the `publishEvent` mutation.
- [x] Add error handling to the publish flow to catch the error for unverified hosts and display an alert or the `VerificationPromptBanner`.

---

## Phase 3: Final Integration & Testing

This phase ensures all pieces work together seamlessly.

- [ ] Manually perform the E2E test scenarios outlined in the `plan.md`.
- [ ] Verify that an unverified host is correctly blocked from publishing and shown the verification prompt.
- [ ] Verify that a verified host can successfully create and publish an event.
- [ ] Confirm that new events and drafts appear correctly on the `events.tsx` screen.
- [ ] Code review and merge.

---

## Phase 4: Edge Cases & Gotchas Implementation

- [ ] Implement auto-save for drafts and warn users about unsaved changes when navigating away from the event creation flow.
- [ ] On publish, if verification fails, show a clear, actionable message and optionally poll for verification status after Stripe flow.
- [ ] Allow manual location entry as a fallback if Google Places fails, and flag such events for review.
- [ ] Sort itinerary items by time on both frontend and backend.
- [ ] Add clear UI indication of missing/invalid required fields before publish (e.g., highlight missing fields, show error summary).
- [ ] Ensure multi-device/session consistency by always fetching the latest draft from backend and using last-edited timestamps for conflict resolution.
- [ ] Use optimistic locking or last-modified timestamps to prevent simultaneous edits/publishes from overwriting each other.
- [ ] Always display event times in the event's time zone, and append the time zone abbreviation to the time string.
- [ ] Add robust error handling and user feedback (toasts/banners) throughout the event creation flow.
- [ ] Conduct an accessibility and mobile usability review of the event creation UI.
- [ ] Test and handle API rate limits/failures for external services (Google Places, embedding API), providing user-friendly error messages.
