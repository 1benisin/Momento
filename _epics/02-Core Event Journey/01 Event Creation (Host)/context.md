# Context: Event Creation (Host)

## Purpose & Overview

Event Creation is a foundational capability for the Momento platform, enabling verified hosts to design and publish curated group experiences. This feature empowers individuals (User Hosts) to bring their unique event ideas to life, forming the backbone of the app’s real-world social offering. By ensuring only verified hosts (via Stripe Identity) can publish events, Momento maintains a high standard of safety and trust for all participants.

## User Needs

- **Hosts** need a simple, intuitive flow to create, edit, and manage events, specifying all essential details (title, description, time, location, participant count).
- **Participants** rely on high-quality, well-defined events to ensure a positive, low-pressure experience and to build trust in the platform.
- **The Platform** requires structured event data to power downstream features: matching, invitations, notifications, and analytics.

## Business Rationale

- **Quality Control:** Restricting event publishing to verified hosts helps ensure that all public events meet Momento’s standards for safety and reliability.
- **Community Trust:** Host verification (via Stripe Identity) is a critical safety feature, reducing the risk of bad actors and building participant confidence.
- **Scalability:** A robust event creation system is essential for scaling the number and diversity of events, which in turn drives user engagement and retention.

## Key Constraints & Dependencies

- **Verification Gate:** Only hosts who have completed Stripe Identity verification can publish events. Unverified hosts may draft events but cannot make them public.
- **Data Requirements:** Events must capture all required fields for downstream processes (matching, invitations, notifications, analytics). See DATA_MODELS.md for schema details.
- **Integration Points:**
  - **Authentication:** Host must be authenticated via Clerk.
  - **Payments:** Host verification is tied to Stripe Identity.
  - **Notifications:** Event creation triggers notifications to matched participants once published.
  - **Geospatial:** Event location data must be structured for geospatial queries (see ARCHITECTURE.md).
- **User Experience:** The creation flow should be streamlined and mobile-friendly, minimizing friction while ensuring all necessary information is collected.

## Related Epic & Project Context

- This feature is a core part of the "Core Event Journey" epic (see epic02-prd.md), which aims to validate the platform’s core hypothesis: that curated, safe, and engaging group events can drive real-world connection and user commitment.
- Event Creation is the entry point for the entire event lifecycle, enabling all subsequent flows: matching, invitations, check-in, and post-event interaction.

## Data Model & Required Fields (from DATA_MODELS.md)

Events are represented as documents in the `events` collection. Required fields include:

- `title`: Title of the event
- `description`: Detailed description
- `event_vector`: Vector embedding for matching
- `status`: 'draft', 'published', etc.
- `min_attendees`, `max_attendees`: Participant limits
- `age_min`, `age_max`: Optional age restrictions
- `arrival_signpost`: Real-world cue for finding the group
- `confirmation_fee`: Fee in cents to confirm attendance
- `estimated_event_cost`: JSON object for expected cost
- `itinerary`: Array of stops (location, time, description)
- `collaborators`: Optional array for co-hosts
- `event_summary`: Populated post-event for analytics
- All location data must be geospatially structured for efficient querying

## UI/UX Expectations (from SCREENS_AND_COMPONENTS.md)

- The Event Creation Screen should be mobile-first, clear, and guide the host through all required fields.
- Hosts must be able to save drafts and return to complete them later.
- The UI should validate required fields and provide helpful error messages.
- Location selection should leverage map-based or search-based input for accuracy.
- The flow should clearly indicate when verification is required to publish.

## Integration with Matching & Invitations (from MATCHING_ALGORITHM.md, FEATURES.md)

- Upon publishing, the event’s details (including vector embedding and filters) are used by the matching algorithm to select the best-fit participants.
- The event’s geospatial data, timing, and participant limits are used as hard filters in the matching process.
- Once a group is selected, invitations are sent via push/SMS, and the event is tracked for analytics.
- The event’s status transitions from 'draft' to 'published' to 'completed' as it moves through its lifecycle.

## Personas & User Stories (from USER_PERSONAS.md, PROJECT_OVERVIEW.md)

- **David, the Curator (User Host):** Wants powerful but simple tools to create and manage unique events, and to build a reputation as a great host.
- **Alex, the Newcomer (Participant):** Relies on curated, well-described events to feel safe and excited about attending.

## Out of Scope

- Advanced event management tools (e.g., multi-stop itineraries, co-hosts, advanced analytics) are not required for MVP but may be considered in future iterations.
- Community Host-specific features are out of scope for MVP; focus is on individual User Hosts.

---

## Edge Cases & Gotchas

The following edge cases and implementation gotchas have been identified for Event Creation and are addressed in the plan and task list:

- Auto-save drafts and warn users about unsaved changes.
- Verification gating: clear user feedback and optional polling after Stripe flow.
- Manual location entry fallback if Google Places fails, with flagging for review.
- Itinerary items are always sorted by time.
- UI highlights missing/invalid required fields and shows error summary before publish.
- Multi-device/session consistency: always fetch latest draft, use last-edited timestamps.
- Optimistic locking to prevent simultaneous edit/publish overwrites.
- Event times are always displayed in the event's time zone, with abbreviation.
- Robust error handling and actionable user feedback (toasts, banners).
- Accessibility and mobile usability are reviewed and prioritized.
- API rate limits/failures for external services are handled gracefully.

See the plan and tasks for details on how these are implemented and tested.
