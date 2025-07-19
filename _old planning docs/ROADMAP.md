# Momento App Roadmap

This document outlines the phased development plan for the Momento application. The roadmap is designed to prioritize features strategically, starting with a Minimum Viable Product (MVP) to validate the core concept, followed by phases that deepen user engagement and add sophisticated, "magical" experiences.

Our guiding principle for the MVP is **Speed to Market**, allowing us to test our fundamental business hypothesis with the minimum required feature set before investing in more complex functionality.

---

## Phase 1: Minimum Viable Product (MVP) - The Core Loop

**Goal:** To validate the fundamental hypothesis of the app: _Will users pay a small fee to attend curated events with new people, and can hosts create compelling experiences?_ This phase focuses exclusively on the critical path to make one event happen successfully from end-to-end.

### Key Features:

#### 1. Foundational User & Host Lifecycle

- **Unified Authentication:** Secure, US-only sign-up/login via SMS or Email/Password, managed by Clerk.
- **Intent-Driven Onboarding:** A new post-signup flow where users choose to onboard as a participant or a host.
- **Basic Profiles:** A simple `socialProfile` (name, photo) and `hostProfile`.
- **Host Verification Gate:** Mandatory Stripe Identity verification before a host can publish an event. A critical, non-negotiable safety feature for launch.
- **Mode-Switcher:** A basic UI toggle for hybrid users to switch between social and host contexts.

#### 2. The Core Event Journey

- **Event Creation:** A streamlined flow for verified hosts to draft an event (title, description, time, location, participant count).
- **"Discovering Your Interests" Flow:** The initial swipeable card deck to gather essential data for matching.
- **v1 Matching & Invitations:** A simplified matching algorithm to send targeted SMS/Push invitations.
- **The Invitation:** A screen where a user can view invite details, see the "Why you were matched" banner, and accept or decline.
- **The Arrival Experience ("The Signal"):** The "Deck of Cards" check-in flow to solve the "first five minutes" problem and connect attendees.
- **Post-Event Host Action:** A simple flow for the host to confirm the final attendance and mark any "no-shows," providing critical data for community reliability.

#### 3. Core Monetization & Safety

- **Monetization:** Stripe integration to process the non-refundable `$5 Confirmation Fee`.
- **Baseline Safety:** Essential "Block" and "Report" functionality available from day one.

---

## Phase 2: Deepening Engagement & Connection

**Goal:** With the core loop validated, we will now focus on features that make the app "sticky." This phase is about turning a one-time event into a lasting experience and encouraging users to build a history with Momento.

### Key Features:

- **The Memory Book & Face Card:** The flagship feature of this phase. A private gallery of connections made at events, introducing collection, customization, and a home for memories.
- **Post-Event Interaction:**
  - **Peer-to-Peer Kudos:** Allowing users to give positive feedback to fellow attendees.
  - **1-on-1 Messaging:** Unlocking the ability to chat with connections from the Memory Book.
- **Smarter Matching:**
  - **"Discovering Your Type":** Adding the second discovery feed to improve the person-to-person aspect of matching.
- **Richer Profiles:**
  - **Interest Constellation, Kudos Showcase, Event DNA:** Begin visualizing the rich data we've collected to create more compelling, narrative-driven profiles.
- **Advanced User Options:**
  - **Dynamic Duos:** The ability to form a pact with a friend to attend an event together.
  - **Event Preferences:** Introducing hard filters (Distance, Price) and soft preferences (Lead Time, Availability).

---

## Phase 3: Sophistication & Intelligence

**Goal:** To layer on the "magic" and scale the platform. These are advanced features that will create a truly unique, intelligent, and delightful user experience that is difficult for competitors to replicate.

### Key Features:

- **AI-Powered Features:**
  - **AI "Vibe Summary":** Generate compelling, narrative profile summaries.
  - **AI Hosting Assistant:** Tools to help hosts create better events.
- **Enhanced Media Experience:**
  - **Shared Event Galleries:** Collaborative photo albums for attendees.
  - **Personal Camera Roll:** A central place for a user to manage their photos within the app.
- **Advanced User Journeys:**
  - **Geofenced Check-in Reminders:** Context-aware notifications for arrival.
  - **Handling Host-Initiated Changes:** A robust flow for notifying users of material event changes.
- **Comprehensive Safety Framework:**
  - **The Full Three-Tiered System:** Implementing escalating consequences for reports (e.g., mandatory verification, behavioral coaching, suspensions).
