# Epic 1: Foundation & Core Infrastructure

**Expanded Goal:** This epic establishes the foundational infrastructure and core user management capabilities that all subsequent features will build upon. It delivers a working authentication system with role-based onboarding, ensuring users can sign up, select their role (participant or host), and begin their journey on the platform. The epic focuses on creating a solid technical foundation while delivering immediate user value through the onboarding experience.

## Story 1.1: Project Setup and Development Environment

As a developer,
I want a properly configured React Native project with Expo, Convex backend, and essential integrations,
so that I can begin building the Momento platform with the correct technical foundation.

**Acceptance Criteria:**

1. React Native project initialized with Expo SDK
2. Convex backend configured with basic schema and functions
3. Clerk authentication integration set up with custom UI components
4. Stripe integration configured for payments and identity verification
5. Development environment supports hot reloading and debugging
6. Basic project structure follows monorepo organization
7. Essential dependencies installed and configured
8. Environment variables properly configured for development

## Story 1.2: User Authentication Flow

As a new user,
I want to sign up using SMS or email/password authentication,
so that I can create my account and access the Momento platform.

**Acceptance Criteria:**

1. Sign-up screen with SMS or email/password options
2. US-only phone number validation for SMS authentication
3. Email validation and password requirements enforcement
4. Successful account creation with Clerk integration
5. Error handling for invalid credentials or network issues
6. Loading states and user feedback during authentication
7. Secure token management and session persistence
8. Logout functionality with proper session cleanup

## Story 1.3: Role Selection and Onboarding

As a newly authenticated user,
I want to select my role (participant or host) and complete tailored onboarding,
so that I can access the appropriate features and begin using the platform.

**Acceptance Criteria:**

1. Post-authentication role selection screen
2. Clear explanation of participant vs host capabilities
3. Tailored onboarding flow for participant mode
4. Tailored onboarding flow for host mode
5. Ability to change role selection before completion
6. Progress indicators throughout onboarding process
7. Skip options for non-essential onboarding steps
8. Successful completion leads to appropriate main interface

## Story 1.4: Basic User Profile Creation

As a user completing onboarding,
I want to create a basic profile with essential information,
so that the platform can begin personalizing my experience and matching me with events.

**Acceptance Criteria:**

1. Profile creation form with essential fields (name, age, location)
2. Photo upload capability with image validation
3. Basic bio and interests input fields
4. Privacy settings for profile visibility
5. Profile preview before saving
6. Edit profile functionality after creation
7. Data validation and error handling
8. Profile data stored securely in Convex database

## Story 1.5: Navigation and Core UI Framework

As a user,
I want intuitive navigation between different sections of the app,
so that I can easily access all platform features and maintain context.

**Acceptance Criteria:**

1. Bottom tab navigation for main app sections
2. Stack navigation for authentication and onboarding flows
3. Modal navigation for overlays and quick actions
4. Consistent navigation patterns throughout the app
5. Back button functionality and gesture support
6. Deep linking support for key app sections
7. Navigation state persistence across app sessions
8. Accessibility support for navigation elements

---
