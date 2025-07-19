# Features Documentation

This document outlines the core features of the Momento application, organized by functional areas and user journeys.

## Table of Contents

- [1. User Profiles & Verification](#1-user-profiles--verification)
- [2. Monetization & Payments](#2-monetization--payments)
- [3. Hosting & Event Creation](#3-hosting--event-creation)
- [4. Interest Building Flow](#4-interest-building-flow)
- [5. The Invitation System](#5-the-invitation-system)
- [6. Dynamic Duos](#6-dynamic-duos)
- [7. Event Preferences & Filtering](#7-event-preferences--filtering)
- [8. The Arrival Experience](#8-the-arrival-experience)
- [9. Post-Event Interaction](#9-post-event-interaction)
- [10. The Memory Book & Face Cards](#10-the-memory-book--face-cards)
- [11. Shared Event Galleries](#11-shared-event-galleries)
- [12. User Safety & Moderation](#12-user-safety--moderation)
- [13. Interest Discovery](#13-interest-discovery)
- [14. Type Discovery](#14-type-discovery)
- [15. Notifications](#15-notifications)
- [16. Professional Host Features](#16-professional-host-features)

---

## 1. User Profiles & Verification

### Profile Information Categories

User profiles contain three categories of information:

- **Public Information**: Profile images, first name, bio, interests, etc.
- **Private Information**: Phone number for authentication and SMS notifications, optional email for account recovery, etc.
- **Internal Information**: Data used by the app for ranking and matching purposes, not visible to the user:
  - Record of profiles the user has liked
  - "Absentee rating" (for tracking no-shows or lateness)
  - Internal "attractiveness rating" for matching users in similar ranges
  - "Contribution score" that gamifies positive social engagement

### Identity & Preferences

To facilitate unique matching, users provide:

- **`gender`**: Single selection from comprehensive list (Woman, Man, Non-binary, Transgender Woman, etc.)
- **`interested_in`**: Multiple-selection field indicating genders they're interested in connecting with
- **`pronouns`**: Optional field displayed on public profile

### User Account Management

Settings are divided into two distinct areas:

1. **Profile & Security (Custom Built)**: Powered by Clerk's hooks, handles:

   - Updating profile information via `user.update()`
   - Managing and verifying email address and phone number
   - Password changes and multi-factor authentication (MFA)
   - Viewing active sessions and signing out of other devices

2. **App Preferences (Managed by Momento)**: Custom-built settings screen for Momento-specific preferences, contextually displayed based on user's active mode.

### Account Lifecycle Management

#### Pause Account (Hibernation Mode)

- **Functionality**: Sets user's `status` to `'paused'`, making them socially invisible
- **User Experience**: Can still log in, view Memory Book, exchange messages with existing connections
- **Limitations**: Cannot engage in new social activities
- **Reactivation**: Persistent banner with "Reactivate Account" button on pages with limited functionality from pause status and on the "Profile" screen and in the App Preferences / Settings screen

#### Delete Account (Permanent Action)

- **Nudge-to-Pause Flow**: "Delete Account" button opens modal presenting pausing as preferable alternative
- **Modal Content**: "Before you go..." with three choices: "Pause Account" (primary), "Delete Permanently" (destructive), "Cancel"
- **Backend Process**:
  - Deletes user record in Clerk (hard delete)
  - Triggers webhook to soft delete Convex database record
  - Anonymizes personal data while preserving platform integrity
  - Maintains referential integrity for events, connections, and social features
  - Other users see "User has deactivated their account" instead of broken references

### Advanced Profile Features

#### The Interest Constellation

- **Purpose**: Showcases personality beyond simple hobby lists
- **How it Works**: Backend analyzes user activity to identify 2-3 distinct "personas" (e.g., "Thrill Seeker," "Cozy Creative," "Intellectual Explorer")
- **Visualization**: Minimalist, interactive constellation graphic where each "star" represents a persona
- **Impact**: Shows how interests connect rather than just what they are

#### Kudos Showcase

- **Purpose**: Social proof more meaningful than simple ratings
- **How it Works**: After events, attendees give anonymous, private "kudos" to each other
- **Visualization**: Displays top 2-3 most frequent kudos with elegant icons/badges
- **Impact**: Provides authentic, peer-validated glimpse into social character

#### The Vibe Summary (AI-Generated)

- **Purpose**: Synthesizes all user activity into compelling narrative
- **How it Works**: LLM analyzes complete Momento footprint and generates short paragraph
- **Example**: "Looks like someone who is just as comfortable discussing philosophy over wine as they are on a windswept trail..."
- **User Control**: Opt-in feature with user approval required

### Authentication & Verification

#### Unified Authentication

- **Sign-Up Methods**: Phone number with OTP or email/password
- **US-Only for MVP**: Limited to users with valid US phone numbers
- **Security**: Account security and phone number recycling handled by Clerk

#### The Authentic Photo

- **Purpose**: Build foundation of trust and authenticity
- **Implementation**: In-app camera functionality for profile photos
- **"Authentic" Badge**: Special badge for photos taken through app
- **12-Month Expiry**: Authentic status expires, prompting new photo

---

## 2. Monetization & Payments

### Revenue Model

- **Primary Stream**: Flat **$5 Confirmation Fee** charged when accepting event invitation
- **Purpose**: Acts as commitment device ("Cost of a Handshake")
- **Transparency**: Clear labeling that fee is for curation service, not event costs

### Payment Flow

- **Payment Methods**: Users add credit cards to private profile
- **First-Time Payment**: Prompted to add payment method before first invitation acceptance
- **Integration**: Third-party payment processor (Stripe) for secure handling

### User-Facing Features

- **Payment Methods Screen**: Add/remove credit cards
- **Transaction History**: List of past payments
- **Clear Prompts**: In-app confirmations for all charges
- **Email Receipts**: Sent to optional email address

### Backend Requirements

- **Stripe Integration**: Customer object management
- **Secure Endpoints**: Payment intent creation and confirmation
- **Webhooks**: Payment status updates (e.g., `charge.succeeded`)

---

## 3. Hosting & Event Creation

### Intent-Driven Onboarding Flow

#### Entry Point

- Single `SignUpScreen` for account creation (phone or email/password)
- `RoleSelectionScreen` for choosing initial path: "attend events" or "host events"

#### Participant Onboarding

- Create `socialProfile`
- Take `AuthenticPhoto`
- Complete "Discovering Your Interests" experience

#### Host Onboarding

- Create `hostProfile`
- Start identity verification process
- Designed for both `User Hosts` and `Community Hosts`

### Hybrid User Management

#### Adding Roles Later

- **Participant → Host**: "Become a Host" CTA on `ProfileTab`
- **Host → Participant**: "Join Events Socially" CTA on `ProfileTab`
- **Result**: `Hybrid User` with `ModeSwitcher` component

#### Mode Switching

- **Control**: `ModeSwitcher` in "App Preferences" screen
- **Mechanism**: Updates `users.active_role` field (`'social'` or `'host'`)
- **Impact**: Dictates entire navigation structure and UI context

### Event Publishing & Verification

#### Verification Gate

- **Rule**: Cannot publish events without `users.is_verified` = `true`
- **Process**: Handled via Stripe Identity
- **Implementation**: Backend validation + UI button disabling

### Event Lifecycle (Host's View)

1. **Drafting**: Initial creation stage, event only visible to host
2. **Published & Matching**: Event eligible for matching algorithm, invitations sent
3. **Confirmed & Upcoming**: Reaches `min_attendees` threshold, live headcount visible
4. **Event Day & Check-in**: Host uses "Deck of Cards" UI for arrival tracking
5. **Wrap-Up (Post-Event)**:
   - **Attendance Confirmation**: 24-hour window to confirm final attendance
   - **Feedback Viewing**: Access to aggregated feedback and AI-generated summaries

### Host-Initiated Event Changes

#### Material Changes

- **Definition**: Changes to date, time, or location
- **Host Experience**: `HostEditWarningModal` explaining attendee notification
- **Attendee Experience**:
  - Immediate notification via Push/SMS
  - Status updated to `pending_reconfirmation`
  - `EventChangeConfirmationModal` with before/after display
  - Choice: "Keep My Spot" or "Cancel & Get Refund"
- **Accountability**: Changes logged in `reliabilityLog`

### Host Tools & Controls

- **Host Profile**: Public profile with name, bio, average rating
- **Insights**: Best practices and feedback insights
- **Minimum Age**: Set age requirements for events
- **Host as Attendee**: Checkbox to participate in own events
- **Public Social Links**: Make social media profiles public
- **Event Itinerary**: Dynamic events with multiple stops, times, locations
- **Collaborators**: Add co-hosts or instructors

### Professional Host Features

#### Enhanced Host Dashboard

- **Basic View**: Available to all hosts with event history, attendance rates, basic ratings
- **Advanced View**: Professional hosts get detailed analytics including:
  - Revenue tracking and income analysis
  - Customer insights and participant demographics
  - Event performance metrics and trends
  - Success rate tracking for different event formats

#### Event Templates & Recurring Events

- **Template Creation**: Save successful event formats for easy duplication
- **Template Management**: Create, edit, and organize event templates
- **Quick Event Creation**: Generate new events from templates with minimal setup
- **Performance Tracking**: Track success metrics for each template type

#### Event Performance Tracking

- **Success Metrics**: Track ratings and feedback for each event instance
- **Format Analysis**: Identify which event formats perform best
- **Customer Retention**: Monitor repeat customer rates and satisfaction
- **Algorithm Weighting**: Use historical performance in matching algorithm

#### Calendar Integration

- **External Calendar Sync**: Integrate with Google Calendar, Outlook, etc.
- **Availability Management**: Set and manage availability windows
- **Conflict Detection**: Automatically detect scheduling conflicts
- **Automated Scheduling**: Streamline event scheduling and coordination

#### Quality Control & Optimization

- **Performance Reviews**: Regular analysis of event success patterns
- **Quality Standards**: Maintain high ratings through consistent execution
- **Feedback Loop**: Continuous improvement based on participant feedback
- **Success Replication**: Identify and replicate successful event patterns

---

## 4. Interest Building Flow

### The Momento Preview

- **Purpose**: Critical onboarding process that feels like adventure, not interview
- **Implementation**: "Possibility Card" deck with 8-10 fictitious event cards
- **Interaction**: Swipe right ("I'm Interested") or left ("Not for Me")
- **Content**: Stunning images, intriguing titles, evocative descriptions

### Technical Foundation

- **Matching Algorithm**: Foundation for concept-based matching
- **Vector Embeddings**: Multi-dimensional interest mapping
- **Behavioral Analysis**: Real-world activity refinement

---

## 5. The Invitation System

### Algorithm Transparency

- **The "Why"**: Explain why user was matched to specific event
- **Transparency**: Show matching factors and reasoning
- **Trust Building**: Increase user confidence in platform

### Invitation Management

- **Response Options**: Accept or decline
- **Declining Flow**: Capture user intent for future matching
- **Calendar Integration**: Post-confirmation calendar integration

---

## 6. Dynamic Duos

### Purpose

- **Address Anxiety**: Directly address attending events alone
- **Friend Pairing**: Allow two friends to signal intent to attend together
- **Social Comfort**: Increase confidence in event participation

### Implementation

- **Pact System**: Users can form "Dynamic Duo" pacts
- **Matching Priority**: Algorithm considers duo preferences
- **Arrival Coordination**: Help friends arrive and check in together

---

## 7. Event Preferences & Filtering

### User Preferences

- **Distance**: Maximum travel distance in miles
- **Price Sensitivity**: Maximum price comfort level (1-4)
- **Availability**: Day/week availability preferences
- **Lead Time**: Minimum notice for event invites

### Filtering System

- **Geospatial**: Efficient location-based filtering
- **Interest-Based**: Concept-based matching using vector embeddings
- **Availability Matching**: Align user schedules with event times

---

## 8. The Arrival Experience

### The Signal

- **Host Sets Stage**: Host prepares arrival experience
- **Deck of Cards**: Arrival flow with attendee cards
- **Check-in Process**: Streamlined arrival tracking

### Implementation

- **Visual Interface**: Card-based UI for attendee management
- **Real-time Updates**: Live arrival status
- **Host Tools**: Easy check-in and coordination

---

## 9. Post-Event Interaction

### Peer-to-Peer Kudos

- **Anonymous Feedback**: Private, positive affirmations between attendees
- **Social Recognition**: Highlight positive social qualities
- **Profile Enhancement**: Kudos contribute to user profiles

### Feedback System

- **Event Ratings**: Rate events and experiences
- **Host Feedback**: Provide feedback to hosts
- **Community Building**: Foster positive community culture

---

## 10. The Memory Book & Face Cards

### Memory Book

- **Purpose**: Private, organized record of people met at events
- **Post-Event Connection**: Enable continued communication
- **Private Notes**: Personal notes and memories
- **Future Matching**: Signal backend for improved matching

### Face Card Lifecycle

- **Stylized Photos**: Artistic versions of profile photos
- **Customization**: Unlockable customization options
- **Social Sharing**: Effortless social media sharing

### Social Connect

- **Platform Integration**: Share experiences on social media
- **Privacy Controls**: User-controlled sharing permissions
- **Community Building**: Extend Momento experience beyond app

---

## 11. Shared Event Galleries

### Purpose

- **Photo Sharing**: Shared photo galleries for events
- **Memory Preservation**: Capture and preserve event memories
- **Community Building**: Foster connections through shared experiences

### Implementation

- **Upload System**: Easy photo upload during and after events
- **Privacy Controls**: Attendee-only access to galleries
- **Organization**: Automatic event-based organization

---

## 12. User Safety & Moderation

### Three-Tiered Safety System

#### Tier 1: User-to-User Controls

- **Blocking**: Users can block other users
- **Reporting**: Report inappropriate behavior
- **Privacy Settings**: Control profile visibility

#### Tier 2: Community Moderation

- **Report Review**: Community-based report review
- **Accountability**: Track reliability and behavior patterns
- **Warning System**: Progressive warnings for violations

#### Tier 3: Platform Intervention

- **Support Tickets**: Formal support request system
- **Manual Review**: Platform staff review of serious issues
- **Account Actions**: Suspension or termination for violations

### Community Reliability

- **Cancellations**: Handle event cancellations fairly
- **No-Shows**: Track and address attendance issues
- **Refund Policy**: Clear refund policies for various scenarios

### Support System

- **Help Center**: Comprehensive help documentation
- **Contact Support**: Multiple ways to contact support
- **Safety Resources**: Safety information and resources

---

## 13. Interest Discovery

### Purpose

- **Interest Building**: Help users discover and articulate interests
- **Matching Foundation**: Build foundation for better matching
- **User Engagement**: Engaging onboarding experience

### Implementation

- **Interactive Experience**: Engaging, game-like interface
- **Progressive Disclosure**: Gradually reveal interest complexity
- **Behavioral Learning**: Learn from user interactions

---

## 14. Type Discovery

### Purpose

- **Attraction Mapping**: Understand user attraction patterns
- **Matching Enhancement**: Improve romantic matching
- **User Self-Discovery**: Help users understand their preferences

### Implementation

- **Swipe Interface**: Similar to interest discovery but for people
- **Vector Building**: Build attraction vectors for matching
- **Privacy Focused**: Respectful, private preference learning

---

## 15. Notifications

### Notification Types

- **Event Invitations**: New event invitations
- **Event Updates**: Changes to confirmed events
- **Event Reminders**: Upcoming event notifications
- **Social Interactions**: Kudos, matches, messages
- **Account & Safety**: Payment confirmations, security alerts

### Delivery Methods

- **Push Notifications**: Real-time app notifications
- **SMS**: Critical notifications via text message
- **Email**: Transactional emails and receipts

### User Control

- **Granular Settings**: Control each notification type
- **Delivery Preferences**: Choose preferred delivery methods
- **Quiet Hours**: Set notification quiet hours

---

## Future Enhancements

### Phase 2 Features

- **Event Encore Signals**: Anonymous feedback for event repetition
- **Enhanced Host Tools**: Advanced hosting capabilities
- **Professional Host Dashboard**: Basic and advanced analytics views
- **Event Templates**: Save and duplicate successful event formats
- **Calendar Integration**: External calendar sync and availability management

### Phase 3 Features

- **In-App Camera Requirement**: Mandatory authentic photos
- **AI-Powered Hosting Assistant**: AI tools for event creation
- **Advanced Analytics**: Enhanced insights and metrics
- **Event Performance Tracking**: Detailed success metrics and optimization tools
- **Quality Control Systems**: Advanced quality assurance and rating systems

---

**Last Updated:** 2024-12-19 (Updated with Professional Host Features)
