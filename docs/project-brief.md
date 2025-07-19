# Project Brief: Momento

**Purpose:** This document provides a comprehensive overview of the Momento social platform project, serving as the foundational input for product development and stakeholder alignment.

**Last Updated:** 2024-12-19

---

## Executive Summary

Momento is a social platform designed to foster genuine human connection through curated, invite-only group events. The platform moves beyond superficial swiping and endless messaging by creating real-world experiences where meaningful relationships—both platonic and romantic—can emerge organically.

The core value proposition is a $5 "Cost of a Handshake" confirmation fee that ensures commitment and reduces no-shows, while AI-powered matching creates balanced groups with high social chemistry. The platform serves three distinct user types: participants seeking connections, individual hosts creating unique experiences, and community hosts (businesses) driving foot traffic.

## Problem Statement

Modern social and dating apps have created a landscape of user frustrations that Momento directly addresses:

- **Dating App Fatigue:** Users are exhausted by endless swiping, superficial conversations, and high-pressure one-on-one dates that lead nowhere
- **Logistical Hurdles:** Organizing group outings with friends is difficult, and planning events with strangers is even harder
- **Social Awkwardness:** The initial moment of arrival at social events—trying to find your group in a crowded space—is intimidating and awkward
- **Lack of Genuine Connection:** Most social mixers don't facilitate deep or meaningful conversation, leaving users feeling unfulfilled

The current market lacks a platform that combines intelligent curation, commitment mechanisms, and real-world facilitation to create authentic social experiences.

## Proposed Solution

Momento's solution centers on **curated group experiences** with several key differentiators:

- **Concept-Based Matching:** AI-powered vector embeddings match users based on event "vibe" rather than simple keywords, understanding that "a quiet evening learning pottery" and "a calm night of calligraphy and cocktails" are conceptually similar
- **The Social Graph:** The algorithm curates balanced groups with high social and romantic chemistry, ensuring every invitee has potential connections within the group
- **The Memory Book:** A private, organized record of connections made at events, featuring collectible "Face Cards" that evolve with user engagement
- **Dynamic Duos:** Allows two friends to signal intent to attend events together, addressing the anxiety of attending alone
- **The Signal:** A standardized arrival experience that eliminates awkwardness through a "Deck of Cards" check-in system

## Target Users

### Primary User Segment: The Participant ("Alex, the Newcomer")

**Demographics:** 25-35 years old, urban professionals, new to cities or seeking to expand social circles
**Current Behaviors:** Uses dating apps but experiences fatigue, struggles to organize group activities, values authentic connections
**Specific Needs:** Low-pressure social settings, curated experiences, safety and verification, post-event connection tools
**Goals:** Find genuine connections, discover interesting activities, build a network of like-minded people

### Secondary User Segment: The User Host ("David, the Curator")

**Demographics:** 30-40 years old, passionate individuals who enjoy bringing people together
**Current Behaviors:** Organizes events informally, struggles with flakiness and payment coordination
**Specific Needs:** Powerful event creation tools, committed audiences, reputation building, automated logistics
**Goals:** Share passions with enthusiastic audiences, build reputation as a great host, meet new people

### Tertiary User Segment: The Community Host ("The Juniper Cafe")

**Demographics:** Local businesses, cafes, venues seeking to increase foot traffic and build community
**Current Behaviors:** Struggles with traditional marketing ROI, lacks event management expertise
**Specific Needs:** Targeted audience acquisition, turnkey event management, brand building opportunities
**Goals:** Increase revenue during off-peak hours, build loyal customer base, establish community reputation

## Goals & Success Metrics

### Business Objectives

- **User Acquisition:** Achieve 1,000 active participants and 100 verified hosts within 6 months of MVP launch
- **Revenue Growth:** Generate $50,000 in confirmation fees within the first year
- **Retention:** Maintain 40% monthly active user retention by month 6
- **Market Validation:** Successfully host 500+ events with average 4.5+ star ratings

### User Success Metrics

- **Event Attendance Rate:** 85% of confirmed attendees actually show up to events
- **Connection Formation:** 60% of attendees report making at least one meaningful connection per event
- **Host Satisfaction:** 80% of hosts report positive experience and intent to host again
- **Safety Incidents:** Less than 1% of events result in safety reports

### Key Performance Indicators (KPIs)

- **Monthly Active Users (MAU):** Target 5,000 MAU by end of year 1
- **Event Success Rate:** 90% of published events reach minimum attendance threshold
- **User Lifetime Value (LTV):** $50 average LTV per user (10 events attended)
- **Net Promoter Score (NPS):** Target 60+ NPS score within 6 months

## MVP Scope

### Core Features (Must Have)

- **Unified Authentication:** US-only sign-up via SMS or email/password using Clerk
- **Intent-Driven Onboarding:** Post-signup role selection (participant vs. host) with tailored flows
- **Basic Profiles:** Simple social and host profiles with essential information
- **Host Verification Gate:** Mandatory Stripe Identity verification before event publishing
- **Event Creation:** Streamlined flow for verified hosts to create events with basic details
- **Interest Discovery:** Initial swipeable card deck to gather matching data
- **v1 Matching & Invitations:** Simplified algorithm sending targeted SMS/Push invitations
- **The Signal Arrival Experience:** "Deck of Cards" check-in system to connect attendees
- **Monetization:** Stripe integration for $5 confirmation fee processing
- **Baseline Safety:** Essential block and report functionality

### Out of Scope for MVP

- **The Memory Book & Face Cards:** Will be implemented in Phase 2
- **Dynamic Duos:** Advanced feature for Phase 2
- **Post-Event Messaging:** Will be added in Phase 2
- **Advanced Matching Features:** "Discovering Your Type" and sophisticated algorithms
- **Shared Event Galleries:** Photo sharing functionality
- **AI-Powered Features:** Vibe summaries and hosting assistance
- **Geofenced Features:** Location-based check-in reminders
- **Host Payment Processing:** Complex financial features deferred to future phases

### MVP Success Criteria

The MVP will be considered successful if we can demonstrate: 1) Users will pay $5 to attend curated events, 2) Hosts can create compelling experiences, 3) The core event lifecycle works end-to-end, 4) Safety mechanisms are effective, and 5) Users report positive experiences and intent to return.

## Post-MVP Vision

### Phase 2: Deepening Engagement & Connection

**Goal:** Turn one-time events into lasting experiences and encourage user retention
**Key Features:** Memory Book & Face Cards, peer-to-peer kudos, 1-on-1 messaging, "Discovering Your Type" matching, richer profiles with Interest Constellations and Event DNA, Dynamic Duos, event preferences and filters

### Phase 3: Sophistication & Intelligence

**Goal:** Layer on "magic" and scale the platform with advanced features
**Key Features:** AI-powered vibe summaries and hosting assistance, shared event galleries, geofenced check-in reminders, comprehensive safety framework with escalating consequences

### Long-term Vision

**One-Two Year Vision:** Momento becomes the premier platform for authentic social experiences in major US cities, with a robust ecosystem of hosts, participants, and community partners. The platform leverages AI to create increasingly sophisticated matching and curation, while maintaining the human touch that makes experiences special.

**Expansion Opportunities:** Geographic expansion to additional cities, B2B partnerships with event venues and experience providers, potential for premium subscription tiers, integration with existing social platforms, and exploration of international markets.

## Technical Considerations

### Platform Requirements

- **Target Platforms:** iOS and Android via React Native with Expo
- **Browser/OS Support:** Latest 2 versions of iOS and Android, minimum iOS 13 and Android 8
- **Performance Requirements:** App launch under 3 seconds, smooth 60fps animations, offline capability for basic features

### Technology Preferences

- **Frontend:** React Native with Expo, NativeWind for styling, Expo Router for navigation
- **Backend:** Convex for real-time database, functions, and file storage
- **Database:** Convex's document-oriented database with geospatial indexing
- **Hosting/Infrastructure:** Convex cloud platform with automatic scaling

### Architecture Considerations

- **Repository Structure:** File-system based routing with Expo Router, clear separation of concerns
- **Service Architecture:** Real-time backend with Convex, external service integrations via HTTP actions
- **Integration Requirements:** Stripe for payments and identity verification, Clerk for authentication, Twilio for SMS, Expo Push for notifications, Google Maps for location services, Postmark for transactional email
- **Security/Compliance:** SOC 2 compliance, GDPR readiness, secure payment processing, user data protection

## Constraints & Assumptions

### Constraints

- **Budget:** Initial development budget of $100,000 for MVP development and launch
- **Timeline:** 6-month development cycle for MVP with launch by Q2 2024
- **Resources:** Small team of 3-5 developers, limited marketing budget for initial launch
- **Technical:** Must maintain real-time functionality, support offline scenarios, ensure data privacy compliance

### Key Assumptions

- Users are willing to pay $5 for curated social experiences
- Hosts will complete identity verification to publish events
- The matching algorithm can effectively create balanced groups
- Users prefer small group experiences over large social mixers
- The "Cost of a Handshake" model will reduce no-shows significantly
- Community hosts will see value in the platform for driving foot traffic
- The US market is ready for this type of social platform innovation

## Risks & Open Questions

### Key Risks

- **Market Adoption Risk:** Users may not be willing to pay for social experiences
- **Host Supply Risk:** Difficulty attracting and retaining quality hosts
- **Safety Risk:** Incidents at events could damage platform reputation
- **Technical Risk:** Real-time features and geospatial queries may have performance issues at scale
- **Regulatory Risk:** Payment processing and user verification may face compliance challenges

### Open Questions

- What is the optimal event size for maximum connection potential?
- How frequently should users receive invitations to maintain engagement without overwhelming?
- What is the right balance between AI curation and human oversight?
- How do we handle seasonal variations in event demand?
- What metrics best predict long-term user retention?

### Areas Needing Further Research

- Competitive analysis of existing social and event platforms
- User research on willingness to pay for social experiences
- Host behavior patterns and motivation factors
- Safety incident rates in similar social platforms
- Technical feasibility of advanced matching algorithms at scale

## Appendices

### A. Research Summary

**Market Research:** Analysis of dating app fatigue, social isolation trends, and the growing demand for authentic experiences. Research shows 67% of millennials prefer experiences over material goods, and 73% report feeling lonely despite being more connected than ever.

**Competitive Analysis:** No direct competitors combine AI-powered matching, commitment mechanisms, and real-world facilitation. Existing platforms either focus on dating (Tinder, Hinge) or event discovery (Eventbrite, Meetup) but lack the curated, small-group social experience.

**User Interviews:** Conducted 50+ interviews with target users revealing strong demand for authentic social experiences, frustration with current dating apps, and willingness to pay for quality curation.

### B. Stakeholder Input

**Founder Vision:** Strong emphasis on creating "adventures, not surveys" with a focus on genuine human connection over superficial interactions.

**Technical Team:** Recommends starting with proven technologies (React Native, Convex) to ensure rapid development and scalability.

**Design Team:** Advocates for "esoteric-tarot meets Art Deco" aesthetic with premium, tactile feel and "living blueprint" animations.

### C. References

- [Architecture Documentation](./_old%20planning%20docs/ARCHITECTURE.md)
- [Data Models Specification](./_old%20planning%20docs/DATA_MODELS.md)
- [Design System Guidelines](./_old%20planning%20docs/DESIGN.md)
- [Feature Specifications](./_old%20planning%20docs/FEATURES.md)
- [User Personas](./_old%20planning%20docs/USER_PERSONAS.md)
- [Development Roadmap](./_old%20planning%20docs/ROADMAP.md)

## Next Steps

### Immediate Actions

1. **Technical Architecture Setup:** Initialize React Native project with Expo, Convex backend, and essential integrations
2. **Design System Implementation:** Create component library following the established design principles
3. **Authentication Flow Development:** Implement Clerk integration with custom UI components
4. **Database Schema Implementation:** Set up Convex schema based on the detailed data models
5. **Core Event Creation Flow:** Build the host onboarding and event creation experience

### PM Handoff

This Project Brief provides the full context for Momento. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements. The brief establishes the foundation for all subsequent product development decisions and should serve as the primary reference document for the development team.
