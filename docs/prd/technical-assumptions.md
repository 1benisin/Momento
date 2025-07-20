# Technical Assumptions

## Repository Structure: Monorepo

The project shall use a monorepo structure with Expo Router for file-system based routing, maintaining clear separation of concerns between frontend components, backend functions, and shared utilities. This approach supports the React Native with Expo architecture while enabling efficient code sharing and deployment.

## Service Architecture

The system shall implement a real-time backend architecture using Convex as the primary service layer. This includes document-oriented database operations, real-time subscriptions, and HTTP actions for external service integrations. The architecture shall support automatic scaling and provide seamless integration with React Native frontend.

## Testing Requirements

The system shall implement Unit + Integration testing approach, focusing on critical user flows and business logic. Unit tests shall cover individual components and functions, while integration tests shall validate end-to-end user journeys including authentication, event creation, and payment processing. Manual testing convenience methods shall be included for rapid iteration during development.

## Additional Technical Assumptions and Requests

- **Authentication:** Clerk integration for unified auth with custom UI components
- **Payments:** Stripe integration for confirmation fees and identity verification
- **Notifications:** Expo Push for mobile notifications and Twilio for SMS
- **Maps:** Google Maps integration for location services and geospatial features
- **Email:** Postmark for transactional email delivery
- **File Storage:** Convex file storage for user uploads and event media
- **Real-time Features:** Convex subscriptions for live updates and notifications
- **Offline Support:** Local storage and sync capabilities for core features
- **Performance:** Optimized bundle sizes and lazy loading for mobile performance
- **Security:** Secure API endpoints, data encryption, and compliance with SOC 2 standards

---
