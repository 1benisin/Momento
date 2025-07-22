# Story 1.3: Role Selection and Onboarding

## Status

Draft

## Story

**As a** newly authenticated user,
**I want** to select my role (participant or host) and complete tailored onboarding,
**so that** I can access the appropriate features and begin using the platform.

## Acceptance Criteria

1. Role selection screen with clear comparison of participant vs host capabilities
2. Participant role onboarding with interest selection and profile photo upload
3. Host role onboarding with business information and identity verification requirements
4. Role switching functionality with confirmation and progress preservation
5. Progress tracking with visual indicators and navigation between steps
6. Data collection and validation for all user inputs
7. Onboarding completion with success confirmation and next steps
8. Error handling and recovery for interrupted flows

## Tasks / Subtasks

- [x] Create role selection interface (AC: 1)
  - [x] Design role comparison screen with visual icons
  - [x] Implement role selection components
  - [x] Add "Learn More" functionality for detailed role information
  - [x] Create side-by-side feature overview
  - [x] Add accessibility features (screen reader support)
  - [x] Implement responsive design for different screen sizes
- [x] Implement participant onboarding (AC: 2)
  - [x] Create welcome screen explaining participant benefits
  - [x] Implement interest selection with predefined categories
  - [x] Add profile photo upload with cropping functionality
  - [x] Set up location permission request and setup
  - [x] Configure notification preferences
  - [x] Add safety and community guidelines acknowledgment
  - [x] Create sample event discovery experience
- [ ] Implement host onboarding (AC: 3)
  - [ ] Create welcome screen explaining host responsibilities
  - [ ] Implement business information collection forms
  - [ ] Add identity verification requirements explanation
  - [ ] Integrate Stripe onboarding for payment processing
  - [ ] Create event creation tutorial or walkthrough
  - [ ] Add safety and liability guidelines acknowledgment
  - [ ] Implement sample event management interface
- [ ] Add role switching functionality (AC: 4)
  - [ ] Implement ability to change role selection before completion
  - [ ] Create confirmation dialog for role changes
  - [ ] Preserve partial progress when switching roles
  - [ ] Add smooth transition between role-specific flows
  - [ ] Implement warning about potential data loss
  - [ ] Add option to complete both role onboards if desired
- [ ] Implement progress tracking and navigation (AC: 5)
  - [ ] Create visual progress bar or step indicators
  - [ ] Add step numbers and titles for each onboarding phase
  - [ ] Implement back/forward navigation between steps
  - [ ] Add save progress functionality for resuming later
  - [ ] Create skip options for non-essential steps
  - [ ] Implement progress persistence across app restarts
- [ ] Set up data collection and validation (AC: 6)
  - [ ] Implement form validation for all user inputs
  - [ ] Add real-time validation feedback
  - [ ] Distinguish required vs optional fields
  - [ ] Implement data sanitization and security measures
  - [ ] Add user consent for data collection
  - [ ] Set up data storage in user profile and Convex
- [ ] Complete onboarding flow (AC: 7)
  - [ ] Create success confirmation screen for each role
  - [ ] Add clear next steps and platform introduction
  - [ ] Implement role-specific feature highlights
  - [ ] Add quick start guide or tutorial options
  - [ ] Integrate with main app navigation
  - [ ] Create user profile and setup
- [ ] Implement error handling and recovery (AC: 8)
  - [ ] Add network connectivity error handling
  - [ ] Implement data validation error messages
  - [ ] Handle graceful handling of incomplete onboarding
  - [ ] Add resume functionality for interrupted flows
  - [ ] Create clear error messages and recovery options
  - [ ] Add fallback options for failed integrations

## Dev Notes

**Technology Integration:**

- Integrates with existing Clerk authentication system
- Uses Convex database for user profile and role storage
- Follows existing onboarding flow patterns
- Integrates with Stripe for host payment processing setup

**Source Tree Integration:**

- Onboarding screens in `app/(onboarding)/` directory
- Role selection in `role-selection.tsx`
- Participant onboarding in `(social)/` subdirectory
- Host onboarding in `(host)/` subdirectory
- User management mutations in `convex/user.ts`

**Testing Standards:**

- Test file location: `__tests__/` directories alongside onboarding components
- Testing framework: Jest + React Native Testing Library
- Test standards: Unit tests for all onboarding flows, integration tests with Convex and Stripe
- E2E tests for complete onboarding journeys
- Cross-platform testing (iOS/Android)

**Key Constraints:**

- Must work with existing authentication flow from Story 1.2
- Must support both iOS and Android platforms
- Must integrate with existing Stripe setup from Story 1.1
- Must maintain backward compatibility with existing user profiles
- Use `devLog` from `utils/devLog.ts` for onboarding debugging

## Testing

**Test File Location:** `__tests__/` directories alongside onboarding components
**Test Standards:** Unit tests for all onboarding flows, integration tests with Convex and Stripe
**Testing Frameworks:** Jest + React Native Testing Library
**Specific Testing Requirements:**

- Unit tests for all onboarding flows
- Integration tests with Convex and Stripe
- E2E tests for complete onboarding journeys
- Cross-platform testing (iOS/Android)
- Accessibility testing with screen readers

## Change Log

| Date       | Version | Description            | Author |
| ---------- | ------- | ---------------------- | ------ |
| 2024-01-01 | 1.0     | Initial story creation | PO     |

## Dev Agent Record

### Agent Model Used

James - Full Stack Developer Agent

### Debug Log References

- Role selection initiated with devLog
- Learn more toggled with devLog
- Failed to update onboarding state with devLog

### Completion Notes List

- Enhanced role selection interface with visual icons and feature comparison
- Implemented "Learn More" functionality for both participant and host roles
- Added comprehensive accessibility features including screen reader support
- Created responsive design with proper loading states and error handling
- Implemented comprehensive test coverage with 16 passing tests
- Fixed loading state management to prevent multiple selections
- Added proper error handling with user-friendly alerts
- Created comprehensive participant onboarding flow with welcome screen, interest selection, location setup, notification preferences, and safety guidelines
- Implemented interest selection with 24 predefined categories across 6 interest areas
- Added location permission handling with proper error states and user guidance
- Created notification preferences with 6 configurable notification types
- Implemented safety guidelines with community standards and safety tips
- Added completion screen with next steps and feature highlights

### File List

**Modified:**

- `app/(onboarding)/role-selection.tsx` - Enhanced role selection interface
- `app/(onboarding)/__tests__/role-selection.test.tsx` - Comprehensive test suite

**Created:**

- `app/(onboarding)/(social)/welcome.tsx` - Participant welcome screen
- `app/(onboarding)/(social)/interest-selection.tsx` - Interest selection with categories
- `app/(onboarding)/(social)/location-setup.tsx` - Location permission and setup
- `app/(onboarding)/(social)/notification-setup.tsx` - Notification preferences
- `app/(onboarding)/(social)/safety-guidelines.tsx` - Community guidelines and safety
- `app/(onboarding)/(social)/completion.tsx` - Onboarding completion screen

**Key Features Implemented:**

- Visual role comparison with icons and feature lists
- Interactive "Learn More" functionality
- Loading states and error handling
- Accessibility support
- Responsive design
- Comprehensive test coverage
- Complete participant onboarding flow with 6 screens
- Interest selection with 24 categories across 6 areas
- Location permission handling with proper UX
- Notification preferences with 6 configurable types
- Safety guidelines with community standards
- Completion screen with next steps

## QA Results

[To be populated by QA agent]
