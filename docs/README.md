# Momento Documentation

Welcome to the Momento documentation! This is your comprehensive guide to understanding, developing, and contributing to the Momento platform.

## 🎯 What is Momento?

Momento is a social platform built to foster genuine human connection. Our mission is to move beyond the world of superficial swiping and endless, low-quality messaging. We believe that connection happens best in the real world, over shared experiences. By curating small, invite-only group events, we create the ideal conditions for genuine relationships—both platonic and romantic—to emerge organically.

Our guiding philosophy is that this should be an **adventure, not a survey**. Every interaction with Momento is designed to be an exciting step towards a new experience, not a chore.

## 🚀 Quick Start

### For Developers

1. **Setup**: See [Development Setup](./development/setup.md)
2. **Architecture**: Review [High-Level Architecture](./architecture/high-level-architecture.md)
3. **Data Models**: Understand [Data Models](./architecture/data-models.md)
4. **Features**: Explore [Features Documentation](./features.md)

### For Product & Design

1. **User Personas**: Understand [Target Audience](./user-personas.md)
2. **User Flows**: Review [User Journey Flows](./user-flows.md)
3. **Design System**: See [UI Components](./design/ui-components.md)

### For Business & Strategy

1. **Monetization**: Review [Revenue Model](./business/monetization.md)
2. **Roadmap**: Check [Development Roadmap](./business/roadmap.md)
3. **Matching Algorithm**: Understand [Core Logic](./business/matching-algorithm.md)

## 📚 Documentation Structure

### Core Documentation

- **[Features](./features.md)** - Comprehensive feature documentation
- **[User Flows](./user-flows.md)** - All user journey flows and interactions
- **[User Personas](./user-personas.md)** - Target audience and user types

### Technical Documentation

- **[Architecture](./architecture/)** - System design and technical specifications
  - [High-Level Architecture](./architecture/high-level-architecture.md)
  - [Data Models](./architecture/data-models.md)
  - [API Specification](./architecture/api-specification.md)
  - [Tech Stack](./architecture/tech-stack.md)
  - [Security](./architecture/security.md)
  - [Testing Strategy](./architecture/testing-strategy.md)
  - [Deployment](./architecture/deployment.md)

### Development Documentation

- **[Development](./development/)** - Development guides and standards
  - [Setup](./development/setup.md)
  - [Coding Standards](./development/coding-standards.md)
  - [Component Library](./development/component-library.md)
  - [Testing Guide](./development/testing-guide.md)

### Business Documentation

- **[Business](./business/)** - Business logic and strategy
  - [Monetization](./business/monetization.md)
  - [Matching Algorithm](./business/matching-algorithm.md)
  - [Notifications](./business/notifications.md)
  - [Roadmap](./business/roadmap.md)

### Design Documentation

- **[Design](./design/)** - Design system and UX guidelines
  - [UI Components](./design/ui-components.md)
  - [User Experience](./design/user-experience.md)
  - [Accessibility](./design/accessibility.md)

## 🎭 The Problem We're Solving

Modern social and dating apps often lead to a specific set of user frustrations that Momento is designed to solve:

- **Dating App Fatigue:** Users are tired of the endless swiping, superficial conversations, and high-pressure one-on-one dates that lead to nowhere.
- **Logistical Hurdles:** Organizing group outings with friends is difficult, and planning events with strangers is even harder.
- **Social Awkwardness:** The initial moment of arrival at a social event—trying to find your group in a crowded space—can be intimidating and awkward.
- **Lack of Genuine Connection:** Most social mixers don't facilitate deep or meaningful conversation, leaving users feeling unfulfilled.

## 💡 The Solution: Curated Group Experiences

Momento's core solution is the **curated event**. Each week, our system invites small, thoughtfully assembled groups of users to unique experiences hosted by fellow members or local community partners. The app encourages living in the moment, assuring users that connection and communication with other attendees can happen through the app _after_ the event, freeing them to be present and engaged during the experience itself.

## 👥 Target Audience

We serve three key roles within the Momento ecosystem:

1. **The Participant ("Alex, the Newcomer"):** The core user looking to attend events, meet like-minded people, and find genuine connections in a low-pressure setting.
2. **The User Host ("David, the Curator"):** An individual user passionate about creating and hosting unique events for others.
3. **The Community Host ("The Juniper Cafe"):** A local business using Momento to drive foot traffic and build community.

## 🔧 Technology Stack

Our technology stack is chosen to support a modern, cross-platform, and real-time user experience:

- **Framework:** React Native with Expo
- **Navigation:** Expo Router
- **Styling:** NativeWind
- **Backend:** Convex
- **Authentication:** Clerk
- **Payments:** Stripe
- **Verification:** Stripe Identity
- **Transactional Email:** Postmark

For detailed technical information, see [Tech Stack](./architecture/tech-stack.md).

## 💰 Monetization: The "Cost of a Handshake"

Momento's primary revenue stream is a flat **$5 Confirmation Fee** charged to a participant when they accept an event invitation. This model is designed with two key principles in mind:

1. **Commitment, Not Just Profit**: The fee's main purpose is to act as a **commitment device**. We call it the "Cost of a Handshake." It elevates an RSVP from a casual "maybe" to a firm commitment, which significantly reduces no-shows and creates a more reliable experience for both participants and hosts.

2. **Clarity and Transparency**: We are very clear that this fee is for securing a spot in a curated event. We do **not** process payments for any other event-related costs (e.g., tickets, food). Such costs are handled directly between the participant and the host, and are always clearly labeled as an "Estimated Event Cost."

## 🚧 Development Status

This project is currently in active development. For the latest status and roadmap, see [Development Roadmap](./business/roadmap.md).

## 📝 Contributing

For information on how to contribute to the project, see [Development Setup](./development/setup.md) and [Coding Standards](./development/coding-standards.md).

---

**Last Updated:** 2024-12-19
