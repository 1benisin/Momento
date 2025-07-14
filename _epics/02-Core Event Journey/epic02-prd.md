# Core Event Journey – Product Requirements Document (PRD)

## 1. Introduction/Overview

The Core Event Journey epic delivers the end-to-end experience that defines Momento’s core value proposition: enabling participants to discover, join, and attend curated group events, and empowering hosts to create and manage these experiences. This epic validates the fundamental hypothesis that users will pay a small fee to attend thoughtfully curated events, and that hosts can reliably create compelling experiences. It addresses key user pain points—dating app fatigue, logistical hurdles, social awkwardness, and lack of genuine connection—by providing a seamless, low-pressure, real-world group event flow.

## 2. Goals

- Allow verified hosts to create, edit, and publish events.
- Enable participants to discover their interests and receive personalized event invitations.
- Implement a matching and invitation system that curates groups for each event.
- Provide a transparent, actionable invitation experience (with clear “why you were matched” messaging).
- Facilitate smooth event arrival and attendee connection via the Deck of Cards check-in flow.
- Allow hosts to confirm attendance and mark no-shows post-event.
- Enable basic post-event messaging between attendees.
- Track all relevant data for analytics and future matching improvements.

## 3. User Stories

- As a **participant**, I want to complete an interest discovery flow so that I receive invitations to events that match my tastes.
- As a **participant**, I want to receive clear, personalized invitations and understand why I was matched to an event.
- As a **participant**, I want to check in at the event and easily identify/connect with other attendees.
- As a **participant**, I want to message other attendees after the event.
- As a **host**, I want to create and publish events, specifying all key details (title, description, time, location, participant count).
- As a **host**, I want to confirm attendance and mark no-shows after the event to help maintain community reliability.

## 4. Functional Requirements

1. **Event Creation (Host)**
   - The system must allow verified hosts to create, edit, and publish events, specifying title, description, time, location, and participant count.
   - Only verified hosts (via Stripe Identity) can publish events.
2. **Interest Discovery (Participant)**
   - The system must present new users with a swipeable card deck to establish their interest vectors.
   - User interest data must be stored and used for future matching.
3. **Matching & Invitations**
   - The system must run a matching algorithm to select participants for each event based on interest vectors, preferences, and group chemistry.
   - Invitations must be sent via SMS and/or push notification.
   - Each invitation must include a clear, user-facing “why you were matched” reason.
4. **Invitation Handling (Participant)**
   - Participants must be able to view invitation details, accept, or decline within the app.
   - Upon acceptance, the system must process a non-refundable $5 confirmation fee via Stripe.
   - Declining an invitation must prompt the user for a reason (to improve future matching).
5. **Arrival & Check-In (The Signal)**
   - The system must provide a check-in flow for attendees upon arrival at the event location.
   - The Deck of Cards UI must be available as soon as any attendee arrives, showing the host card and all checked-in attendees. Attendees who have not arrived are not shown until they check in.
   - The host’s card must be visually distinct and indicate arrival status.
6. **Post-Event Host Action**
   - After the event, the host must be prompted to confirm final attendance and mark any no-shows.
   - Marked no-shows must affect the participant’s absentee rating.
7. **Post-Event Messaging**
   - After the event, participants must be able to message other attendees (1-on-1 messaging only) through the app.
8. **Feedback Collection**
   - The system should prompt participants and hosts to provide feedback after the event (e.g., ratings, comments), if feasible for MVP.
9. **Data Tracking**
   - The system must track event creation, invitations, responses, check-ins, attendance, no-shows, messaging, and feedback for analytics and future matching.

## 5. Non-Goals (Out of Scope)

- Advanced post-event features (e.g., kudos, public event feeds, group chat).
- AI-generated event summaries or feedback aggregation.
- Payment processing for event costs beyond the $5 confirmation fee (e.g., ticketing, food).
- Advanced host tools (e.g., insights, encore signals, AI hosting assistant).
- Community host-specific features (focus is on individual hosts for MVP).

## 6. Design Considerations (Optional)

- Reference the following screens/components from `SCREENS_AND_COMPONENTS.md`:
  - Event Creation Screen (Host)
  - Interest Discovery Screen (Participant)
  - Invitation Detail Screen (Participant)
  - Deck of Cards Check-In UI (Arrival)
  - Attendance Confirmation List (Host, post-event)
  - Messaging UI for post-event 1-on-1 chat
- Design should be clean, confidence-building, and low-pressure, emphasizing real-world connection and clarity.
- Use the MatchReasonBanner for transparent invitation messaging.
- Deck of Cards UI should update in real time as attendees check in.

## 7. Technical Considerations (Optional)

- Use Convex as the backend for all data storage and business logic.
- Use Clerk for authentication and user management.
- Use Stripe for payment processing (confirmation fee) and host verification (Stripe Identity).
- Integrate with the notification system for SMS and push (Expo, Twilio).
- Matching algorithm must use vector embeddings for interest/persona matching (see MATCHING_ALGORITHM.md).
- Geospatial queries for event location filtering (see ARCHITECTURE.md).
- Real-time updates for Deck of Cards and messaging (Convex subscriptions or similar).
- Ensure privacy and safety in post-event messaging (e.g., block/report, only available to event attendees).

## 8. Success Metrics

- Number of events created and published by hosts.
- Percentage of invitations accepted by participants.
- Attendance rate (vs. no-shows).
- Participant and host feedback scores (if collected).
- Number of post-event messages sent.
- Time from event creation to event completion.
- Engagement with feedback prompts.

## 9. Edge Cases & Error Handling

- If a participant cancels after confirming, their spot may be filled if early; fee is non-refundable; absentee rating is affected if late.
- If a host changes event details after invitations are sent, all confirmed attendees must be notified and prompted to reconfirm.
- If a participant is marked as a no-show, this must affect their absentee rating and future matching.
- If a participant or host is blocked or reported, messaging and future matching must be restricted accordingly.
- If a participant tries to check in outside the event location or time window, show an appropriate error.

## 10. Open Questions

- Should feedback collection (ratings/comments) be required or optional for MVP?
- Are there additional host verification steps required beyond Stripe Identity?
- What is the minimum viable set of analytics to collect for future matching improvements?
