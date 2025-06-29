# Momento

Momento is a social app designed to help people connect through curated, invite-only events. The goal is to move beyond traditional dating apps and foster genuine connections, both platonic and romantic, in small group settings.

## About The App

The core of Momento is the "event" — a thoughtfully planned gathering hosted by a fellow user, a local business, or a service provider. Participants are invited based on a deep, multi-dimensional understanding of their interests, passions, and personalities. Our goal is to move past superficial profiles and create the ideal conditions for authentic friendships and relationships to blossom.

The app encourages living in the moment, assuring users that connection and communication with other attendees can happen through the app after the event, freeing them to be present and engaged during the experience itself.

## Design Philosophy

Our user interface is inspired by the elegance and intentionality found in art and architecture. The aesthetic is an esoteric-tarot meets Art Deco mash-up, guided by:

**Inspiration:** The clean lines of games like Monument Valley and Gris, and the intricate beauty of Islamic geometric tilework.

**Visuals:** Delicate line work, celestial and botanical iconography, and minimal palettes (black/cream with metallic gold accents).

**Experience:** An interactive, "living blueprint" feel, with subtle animations that create a sense of magic and anticipation, like a gilded invitation coming to life.

## Technology Stack

- **Framework:** React Native with Expo
- **Backend:** Supabase (Database, Auth, Edge Functions)
- **Navigation:** Expo Router
- **Styling:** NativeWind
- **Payments:** Stripe (using `@stripe/stripe-react-native`)
- **User Verification:** Stripe Identity
- **Notifications:** Expo Push Notifications and Twilio for SMS
- **Mapping:** `react-native-maps` for map-based features
- **AI/ML:** Vector embeddings (via APIs like OpenAI) for matching and AI image generation for creative features.
- **Build Service:** Expo Application Services (EAS) Build

## Core Features (High-Level)

- **User Profiles:** Multi-faceted profiles that capture personality and interests.
- **Interest Building:** An in-depth onboarding flow to understand user passions, potentially enhanced by AI-driven conversations.
- **Curated Invitations:** Weekly, personalized event invitations with a 24-hour response window, presented as beautiful, animated digital cards.
- **Hosting Tools:** Resources for users, services, and businesses to design and host memorable events. Hosts are rated to ensure quality.
- **Post-Event Connection:** After providing feedback, attendees can connect with each other, view shared photos from the event, and continue the conversation.

## User Types

The Momento ecosystem is comprised of three key roles:

- **Participants:** Attend events they are invited to.
- **User Hosts:** App users who also create and host their own events.
- **Business Hosts:** Businesses (e.g., restaurants, cafes) or Service Providers (e.g., tour guides, instructors) that use Momento to host events, promote their offerings, and gather ratings.

## Documentation

This project is documented in detail within the [`_docs`](/_docs) directory. For a comprehensive understanding of the project, please refer to the following key documents:

- **Product & Vision**
  - [`FEATURES.md`](_docs/FEATURES.md): A complete list of all app features.
  - [`ROADMAP.md`](_docs/ROADMAP.md): The phased development plan.
- **Design & User Experience**
  - [`DESIGN_SYSTEM.md`](_docs/DESIGN_SYSTEM.md): The core visual and experiential aesthetic.
  - [`USER_PERSONAS.md`](_docs/USER_PERSONAS.md): Definitions of our target users.
  - [`USER_FLOWS.md`](_docs/USER_FLOWS.md): Key user journeys within the app.
  - [`SCREENS_AND_COMPONENTS.md`](_docs/SCREENS_AND_COMPONENTS.md): A blueprint of the app's UI.
- **Technical Implementation**
  - [`ARCHITECTURE.md`](_docs/ARCHITECTURE.md): System architecture and data flow diagrams.
  - [`DATA_MODELS.md`](_docs/DATA_MODELS.md): Detailed database schemas for Supabase.
  - [`MATCHING_ALGORITHM.md`](_docs/MATCHING_ALGORITHM.md): The strategy for matching users with events.

## Getting Started

> Instructions on how to install, configure, and run the project can now be found in [`_docs/DEVELOPMENT_PROCESS.md`](_docs/DEVELOPMENT_PROCESS.md).

```bash
# Example setup commands
git clone [repository-url]
cd momento
npm install
npx expo start
```
