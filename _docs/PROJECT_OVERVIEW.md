# Project Overview

**Purpose:** This document provides a high-level summary of Momento's vision, core concepts, target audience, and technology. It is the ideal starting point for any new team member.

**Last Updated:** 2024-07-29

---

## Vision & Mission

Momento is a social platform built to foster genuine human connection. Our mission is to move beyond the world of superficial swiping and endless, low-quality messaging. We believe that connection happens best in the real world, over shared experiences. By curating small, invite-only group events, we create the ideal conditions for genuine relationships—both platonic and romantic—to emerge organically.

Our guiding philosophy is that this should be an **adventure, not a survey**. Every interaction with Momento is designed to be an exciting step towards a new experience, not a chore.

## The Problem We're Solving

Modern social and dating apps often lead to a specific set of user frustrations that Momento is designed to solve:

- **Dating App Fatigue:** Users are tired of the endless swiping, superficial conversations, and high-pressure one-on-one dates that lead to nowhere.
- **Logistical Hurdles:** Organizing group outings with friends is difficult, and planning events with strangers is even harder.
- **Social Awkwardness:** The initial moment of arrival at a social event—trying to find your group in a crowded space—can be intimidating and awkward.
- **Lack of Genuine Connection:** Most social mixers don't facilitate deep or meaningful conversation, leaving users feeling unfulfilled.

## The Solution: Curated Group Experiences

Momento's core solution is the **curated event**. Each week, our system invites small, thoughtfully assembled groups of users to unique experiences hosted by fellow members or local community partners. The app encourages living in the moment, assuring users that connection and communication with other attendees can happen through the app _after_ the event, freeing them to be present and engaged during the experience itself.

## Target Audience

We serve three key roles within the Momento ecosystem. For a deeper dive, see our **[USER_PERSONAS.md](./USER_PERSONAS.md)**.

1.  **The Participant ("Alex, the Newcomer"):** The core user looking to attend events, meet like-minded people, and find genuine connections in a low-pressure setting.
2.  **The User Host ("David, the Curator"):** An individual user passionate about creating and hosting unique events for others.
3.  **The Community Host ("The Juniper Cafe"):** A local business using Momento to drive foot traffic and build community.

## Core Concepts & Differentiators

What truly sets Momento apart is the intelligence and thoughtfulness behind our matching and connection features. For more detail, see our **[FEATURES.md](./FEATURES.md)** and **[MATCHING_ALGORITHM.md](./MATCHING_ALGORITHM.md)**.

- **Concept-Based Matching:** We use AI and vector embeddings to match users based on the "vibe" of an event, not just keywords. The system understands that "a quiet evening learning to paint pottery" and "a calm night of calligraphy and cocktails" are conceptually similar, leading to more nuanced and surprising matches.
- **The Social Graph:** We don't just match individuals to events; we curate balanced _groups_ with high social and romantic chemistry. Our algorithm ensures that every invitee has a high potential for connection within the group, so no one feels like a social "dead-end."
- **The Memory Book:** To foster lasting relationships, the app features a "Memory Book." This private, organized record of every person a user has met at events allows for post-event connection, private notes, and signals to our backend for future matching.
- **Dynamic Duos:** We directly address the anxiety of attending events alone with our "Dynamic Duos" feature, which allows two friends to signal their intent to be invited to their next event together as a pair.

## Monetization: The "Cost of a Handshake"

Momento's primary revenue stream is a flat **$5 Confirmation Fee** charged to a participant when they accept an event invitation. This model is designed with two key principles in mind:

1.  **Commitment, Not Just Profit**: The fee's main purpose is to act as a **commitment device**. We call it the "Cost of a Handshake." It elevates an RSVP from a casual "maybe" to a firm commitment, which significantly reduces no-shows and creates a more reliable experience for both participants and hosts.
2.  **Clarity and Transparency**: We are very clear that this fee is for securing a spot in a curated event. We do **not** process payments for any other event-related costs (e.g., tickets, food). Such costs are handled directly between the participant and the host, and are always clearly labeled as an "Estimated Event Cost."

## Technology Stack

Our technology stack is chosen to support a modern, cross-platform, and real-time user experience. For a detailed breakdown of the system design and data flow, see our **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

- **Framework:** React Native with Expo
- **Navigation:** Expo Router
- **Styling:** NativeWind
- **Backend:** Convex
- **Authentication:** Clerk (using `@clerk/clerk-expo` and `convex/react-clerk`)
- **Payments:** Stripe (using `@stripe/stripe-react-native` on the client and `stripe-node` on the server)
- **Verification:** Stripe Identity
- **Transactional Email:** Postmark

---

> **💡 Future Ideas: Out of Scope for MVP**
>
> _This section is a parking lot for concepts that are being considered for future versions of Momento but are explicitly out of scope for the initial launch._
>
> - **Host Payment Processing**: In the future, we may offer hosts the ability to collect and process payments for their event costs (e.g., ticket prices) directly through the app. We are deferring this to avoid the significant financial, tax, and reporting complexities it introduces at this early stage.
