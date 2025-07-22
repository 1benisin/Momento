# Requirements

## Functional Requirements

**FR1:** The system shall provide unified authentication supporting US-only sign-up via SMS or email using Clerk integration.

**FR2:** The system shall implement post-signup role selection allowing users to choose between participant and host modes with tailored onboarding flows.

**FR3:** The system shall support basic profile creation for both social participants and hosts with essential information fields.

**FR4:** The system shall require mandatory Stripe Identity verification for hosts before allowing event publishing capabilities.

**FR5:** The system shall provide verified hosts with streamlined event creation tools including basic event details, location, and timing.

**FR6:** The system shall implement initial interest discovery through swipeable card deck interface to gather user preference data.

**FR7:** The system shall provide v1 matching algorithm that sends targeted SMS/Push invitations to users based on event compatibility.

**FR8:** The system shall implement "The Signal" arrival experience using a "Deck of Cards" check-in system to connect attendees at events.

**FR9:** The system shall integrate Stripe payment processing for $5 confirmation fee collection and management.

**FR10:** The system shall provide baseline safety features including user blocking and incident reporting functionality.

## Non-Functional Requirements

**NFR1:** The application shall support iOS and Android platforms via React Native with Expo, targeting latest 2 versions with minimum iOS 13 and Android 8.

**NFR2:** The system shall maintain app launch time under 3 seconds and smooth 60fps animations for optimal user experience.

**NFR3:** The system shall provide offline capability for basic features to ensure functionality in areas with poor connectivity.

**NFR4:** The backend shall use Convex for real-time database operations with automatic scaling to handle user growth.

**NFR5:** The system shall achieve 85% event attendance rate through the confirmation fee mechanism and commitment signals.

**NFR6:** The system shall maintain 40% monthly active user retention by month 6 post-MVP launch.

**NFR7:** The system shall process payments securely with SOC 2 compliance and GDPR readiness for data protection.

**NFR8:** The system shall support geospatial indexing for location-based event discovery and matching.

---
