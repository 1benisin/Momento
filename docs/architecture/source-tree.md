# Source Tree & Project Structure

This document provides a comprehensive overview of the Momento project's source code organization, explaining the purpose and structure of each directory and key files.

## Repository Overview

Momento uses a **monorepo structure** that co-locates the React Native frontend application and Convex backend code within a single Git repository. This approach enables seamless development, testing, and deployment of the full-stack application.

## Root Directory Structure

```
Momento/
├── app/                    # React Native application (Expo Router)
├── components/             # Reusable React Native components
├── convex/                 # Backend code (Convex functions & schema)
├── docs/                   # Project documentation
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions and helpers
├── constants/              # Application constants and configuration
├── assets/                 # Static assets (images, fonts, etc.)
├── _design/                # Design assets and specifications
├── _epics/                 # Feature epics and planning
├── _old planning docs/     # Legacy planning documentation
├── _third-party-docs/      # External service documentation
├── app.config.ts           # Expo configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── eas.json               # Expo Application Services configuration
└── README.md              # Project overview
```

## Frontend Application (`app/`)

The frontend is built with **React Native + Expo Router**, providing a file-based routing system that adapts to the user's role (Participant or Host).

### App Structure

```
app/
├── _layout.tsx            # Root layout with authentication wrapper
├── (auth)/                # Authentication routes
│   ├── _layout.tsx        # Auth layout wrapper
│   ├── sign-in.tsx        # Sign-in screen
│   └── sign-up.tsx        # Sign-up screen
├── (onboarding)/          # User onboarding flows
│   ├── _layout.tsx        # Onboarding layout wrapper
│   ├── role-selection.tsx # User role selection
│   ├── (social)/          # Social user onboarding
│   │   ├── initial-photo.tsx
│   │   └── profile-setup.tsx
│   └── (host)/            # Host user onboarding
│       ├── host-profile-setup.tsx
│       └── verification-prompt.tsx
├── (tabs)/                # Main application tabs
│   ├── _layout.tsx        # Tab navigation layout
│   ├── (social)/          # Social user interface
│   │   ├── discover.tsx   # Event discovery
│   │   ├── events.tsx     # User's events
│   │   ├── memory-book.tsx # Post-event connections
│   │   └── social-profile.tsx # User profile
│   ├── (host)/            # Host user interface
│   │   ├── dashboard.tsx  # Host dashboard
│   │   ├── create-event.tsx # Event creation
│   │   ├── events.tsx     # Host's events
│   │   ├── host-profile.tsx # Host profile
│   │   └── inbox.tsx      # Host communications
│   ├── account.tsx        # Account settings
│   └── settings.tsx       # App settings
├── +html.tsx              # HTML template for web
├── +not-found.tsx         # 404 error page
└── modal.tsx              # Modal screen template
```

### Key Frontend Patterns

- **Role-Based Routing**: Separate route groups for social and host users
- **File-Based Navigation**: Expo Router automatically creates navigation based on file structure
- **Layout Composition**: Nested layouts for authentication, onboarding, and main app
- **Modal Support**: Dedicated modal screen for overlay interactions

## Reusable Components (`components/`)

A library of domain-specific, reusable React Native components that promote consistency and maintainability.

### Component Organization

```
components/
├── forms/                 # Form components and inputs
│   ├── CustomTimePicker.tsx
│   ├── EventDetailsForm.tsx
│   ├── EventItineraryForm.tsx
│   ├── EventPublishForm.tsx
│   ├── LocationPicker.tsx
│   ├── LocationSearchInput.tsx
│   └── MapViewModal.tsx
├── __tests__/             # Component test files
│   └── StyledText-test.js
├── ContactMethodManager.tsx
├── EditScreenInfo.tsx
├── ExternalLink.tsx
├── ImageUploader.tsx
├── ModeSwitcher.tsx       # Role switching component
├── SignOutButton.tsx
├── StyledText.tsx
├── Themed.tsx
├── UserInfo.tsx
└── VerificationPromptBanner.tsx
```

### Component Design Principles

- **Domain-Specific**: Components are designed for specific use cases rather than generic reusability
- **Consistent Styling**: All components use NativeWind for consistent styling
- **Type Safety**: Full TypeScript support with proper prop interfaces
- **Accessibility**: Built-in accessibility features and ARIA support
- **Testing**: Comprehensive test coverage for critical components

## Backend Architecture (`convex/`)

The backend is built entirely on **Convex**, providing serverless functions, real-time database, and file storage in a unified platform.

### Convex Structure

```
convex/
├── _generated/            # Auto-generated TypeScript types
│   ├── api.d.ts           # Function type definitions
│   ├── dataModel.d.ts     # Database schema types
│   └── server.d.ts        # Server-side type definitions
├── lib/                   # Shared backend utilities
│   └── actions.ts         # Common action patterns
├── tests/                 # Backend test files
│   ├── events.test.mts
│   └── user.test.mts
├── auth.config.ts         # Authentication configuration
├── events.ts              # Event-related functions
├── files.ts               # File storage functions
├── http.ts                # HTTP action handlers
├── locations.ts           # Location and geospatial functions
├── schema.ts              # Database schema definition
├── tsconfig.json          # TypeScript configuration
└── user.ts                # User-related functions
```

### Backend Function Types

1. **Queries** (`query`): Read-only functions for fetching data
   - Real-time by default
   - Optimized for performance
   - Example: `getNearbyEvents`, `getUserProfile`

2. **Mutations** (`mutation`): Functions that modify database state
   - Atomic operations
   - Data consistency guaranteed
   - Example: `createEvent`, `updateUserProfile`

3. **Actions** (`action`): Functions for external API calls and side effects
   - Can call external services
   - Handle long-running operations
   - Example: `processPayment`, `sendNotification`

### Database Schema (`schema.ts`)

The schema defines the document-oriented data model optimized for read performance:

- **users**: Aggregate root for all user data
- **events**: Event details with embedded itinerary
- **locations**: Geospatial location data
- **invitations**: User-event relationships
- **connections**: Post-event social connections

## Custom Hooks (`hooks/`)

Reusable React hooks that encapsulate common logic and state management patterns.

```
hooks/
├── useClientOnlyValue.ts
├── useClientOnlyValue.web.ts
├── useColorScheme.ts
└── useColorScheme.web.ts
```

### Hook Patterns

- **Platform-Specific**: Separate implementations for mobile and web
- **State Management**: Integration with Convex's real-time state
- **Cross-Platform**: Shared logic with platform-specific optimizations

## Utilities (`utils/`)

Shared utility functions and development tools.

```
utils/
└── devLog.ts              # Development logging utility
```

### Utility Functions

- **devLog**: Consistent logging for development and debugging
- **Type Helpers**: TypeScript utility types and helpers
- **Validation**: Input validation and sanitization
- **Formatting**: Data formatting and display helpers

## Constants (`constants/`)

Application-wide constants and configuration values.

```
constants/
└── Colors.ts              # Color palette and theming
```

### Configuration Areas

- **Colors**: Consistent color palette for theming
- **API Endpoints**: External service URLs and configurations
- **Feature Flags**: Feature toggle configurations
- **Limits**: Application limits and constraints

## Static Assets (`assets/`)

Images, fonts, and other static resources.

```
assets/
├── fonts/
│   └── SpaceMono-Regular.ttf
└── images/
    ├── adaptive-icon.png
    ├── favicon.png
    ├── icon.png
    └── splash-icon.png
```

### Asset Organization

- **Fonts**: Custom typography assets
- **Images**: App icons, splash screens, and UI graphics
- **Branding**: Logo and brand assets

## Configuration Files

### Root Configuration

- **app.config.ts**: Expo application configuration
- **package.json**: Dependencies and npm scripts
- **tsconfig.json**: TypeScript compiler options
- **eas.json**: Expo Application Services configuration
- **jest.config.js**: Testing framework configuration
- **vitest.config.mts**: Alternative testing configuration

### Key Configuration Patterns

- **Environment-Specific**: Different configurations for development, staging, and production
- **Platform-Specific**: Separate configurations for iOS, Android, and web
- **Feature Flags**: Configuration-driven feature toggles

## Documentation (`docs/`)

Comprehensive project documentation organized by domain.

```
docs/
├── architecture/          # Technical architecture documentation
│   ├── high-level-architecture.md
│   ├── data-models.md
│   ├── api-specification.md
│   ├── tech-stack.md
│   ├── source-tree.md     # This document
│   └── index.md
├── development/           # Development guides and standards
│   ├── setup.md
│   └── coding-standards.md
├── business/              # Business and product documentation
│   ├── monetization.md
│   └── roadmap.md
├── README.md              # Main documentation entry point
├── features.md            # Feature specifications
├── user-personas.md       # User research and personas
└── user-flows.md          # User journey documentation
```

## Planning and Design (`_design/`, `_epics/`)

Project planning, design assets, and feature epics.

```
_design/
└── v1.txt                 # Design version documentation

_epics/
├── 01-Foundational User & Host Lifecycle/
│   ├── 01 User Authentication Setup/
│   ├── 02 Social Profile Creation/
│   ├── 03 Add Email Authentication/
│   ├── 04 Implement Post-Signup Role Selection/
│   ├── 05 Build Host Onboarding Flow/
│   ├── 06 Host Verification with Stripe Identity/
│   ├── 07 Hybrid User Mode-Switching/
│   └── epic01-prd.md
└── 02-Core Event Journey/
    ├── 01 Event Creation (Host)/
    └── epic02-prd.md
```

## Legacy Documentation (`_old planning docs/`)

Historical planning documents being migrated to the new documentation structure.

```
_old planning docs/
├── USER_FLOWS/            # Detailed user flow documentation
├── assets/                # Legacy design assets
├── ARCHITECTURE.md        # Legacy architecture documentation
├── DATA_MODELS.md         # Legacy data model documentation
├── DESIGN.md              # Legacy design documentation
├── DEVELOPMENT_PROCESS.md # Legacy development process
├── FEATURES.md            # Legacy feature documentation
├── MATCHING_ALGORITHM.md  # Legacy algorithm documentation
├── NOTIFICATIONS_PLAN.md  # Legacy notification planning
├── PROJECT_OVERVIEW.md    # Legacy project overview
├── README.md              # Legacy documentation index
├── ROADMAP.md             # Legacy roadmap documentation
├── SCREENS_AND_COMPONENTS.md
├── TESTING_STRATEGY.md    # Legacy testing documentation
├── USER_PERSONAS.md       # Legacy user research
└── MARKETING_STRATEGY.md  # Legacy marketing documentation
```

## External Documentation (`_third-party-docs/`)

Documentation for external services and integrations.

```
_third-party-docs/
├── Clerk/                 # Authentication service documentation
├── Expo/                  # Expo platform documentation
└── Stripe/                # Payment and identity service documentation
```

## Development Workflow

### File Organization Principles

1. **Domain-Driven**: Code is organized by business domain rather than technical layer
2. **Co-location**: Related files are kept together (components with their tests)
3. **Clear Boundaries**: Clear separation between frontend, backend, and shared code
4. **Scalable Structure**: Organization supports growth and team expansion

### Naming Conventions

- **Files**: kebab-case for file names (e.g., `user-profile.tsx`)
- **Components**: PascalCase for React components (e.g., `UserProfile`)
- **Functions**: camelCase for JavaScript/TypeScript functions
- **Constants**: UPPER_SNAKE_CASE for constants
- **Types**: PascalCase for TypeScript interfaces and types

### Import Organization

1. **External Dependencies**: Third-party libraries
2. **Internal Dependencies**: Project-specific imports
3. **Relative Imports**: Local file imports
4. **Type Imports**: TypeScript type-only imports

## Build and Deployment

### Development Environment

- **Local Development**: Expo development server with hot reloading
- **Testing**: Vitest for unit tests, convex-test for backend tests
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for consistent code formatting

### Production Deployment

- **Mobile Apps**: Expo Application Services (EAS) for iOS and Android
- **Backend**: Convex handles deployment and scaling automatically
- **File Storage**: Convex File Storage for user uploads
- **CDN**: Static assets served via Expo's CDN

## Security Considerations

### Code Organization Security

- **Authentication**: Clerk integration with secure token management
- **Authorization**: Role-based access control in Convex functions
- **Data Validation**: Input validation at both client and server layers
- **Secure Storage**: Sensitive data handled by external services (Stripe, Clerk)

### Development Security

- **Environment Variables**: Secure configuration management
- **API Keys**: External service credentials managed securely
- **Code Review**: All changes reviewed for security implications
- **Dependency Scanning**: Regular security audits of dependencies

## Performance Optimization

### Frontend Performance

- **Code Splitting**: Automatic code splitting via Expo Router
- **Image Optimization**: Optimized image loading and caching
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Lazy Loading**: Components and routes loaded on demand

### Backend Performance

- **Real-time Queries**: Optimized for real-time data synchronization
- **Geospatial Indexing**: Efficient location-based queries
- **Vector Similarity**: Fast matching using vector embeddings
- **Caching Strategy**: Intelligent caching at multiple layers

## Monitoring and Observability

### Development Monitoring

- **devLog**: Consistent logging for development debugging
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance Metrics**: Real-time performance monitoring
- **User Analytics**: User behavior and engagement tracking

### Production Monitoring

- **Convex Dashboard**: Built-in monitoring for backend performance
- **Expo Analytics**: Mobile app analytics and crash reporting
- **External Service Monitoring**: Stripe, Clerk, and Google Maps monitoring
- **Custom Metrics**: Business-specific performance indicators

This source tree documentation provides a comprehensive understanding of the Momento project's organization, enabling developers to quickly understand the codebase structure and locate relevant files for development and maintenance tasks.
