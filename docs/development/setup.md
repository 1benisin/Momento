# Development Setup Guide

This guide will help you set up your development environment for the Momento project.

## Prerequisites

### Required Software

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)

### Recommended Tools

- **VS Code** with recommended extensions
- **React Native Debugger** for debugging
- **Flipper** for advanced debugging and network inspection

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Momento
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

#### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Backend
EXPO_PUBLIC_CONVEX_URL=your_convex_url

# Stripe Payments
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Postmark Email
POSTMARK_API_KEY=your_postmark_api_key

# Google Maps (optional for development)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Environment Setup Steps

1. **Clerk Setup**:

   - Create a Clerk account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy the publishable key and secret key
   - Configure authentication methods (phone, email)

2. **Convex Setup**:

   - Create a Convex account at [convex.dev](https://convex.dev)
   - Create a new project
   - Copy the deployment URL
   - Set up your database schema

3. **Stripe Setup**:

   - Create a Stripe account at [stripe.com](https://stripe.com)
   - Get your publishable and secret keys
   - Configure webhook endpoints

4. **Postmark Setup**:
   - Create a Postmark account at [postmarkapp.com](https://postmarkapp.com)
   - Get your API key
   - Configure email templates

### 4. Database Setup

#### Convex Schema

The database schema is defined in `convex/schema.ts`. Ensure your Convex project is properly configured:

```bash
# Install Convex CLI
npm install -g convex

# Login to Convex
npx convex login

# Deploy schema and functions
npx convex dev
```

### 5. Development Server

#### Start the Development Server

```bash
# Start Expo development server
npm start
# or
yarn start
```

#### Run on Different Platforms

```bash
# iOS Simulator
npm run ios
# or
yarn ios

# Android Emulator
npm run android
# or
yarn android

# Web Browser
npm run web
# or
yarn web
```

## Development Workflow

### 1. Code Structure

```
Momento/
├── app/                    # Expo Router app directory
├── components/            # Reusable React components
├── convex/               # Backend functions and schema
├── constants/            # App constants and configuration
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── docs/                 # Documentation
└── _old planning docs/   # Legacy planning documentation
```

### 2. Development Commands

#### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testNamePattern="UserProfile"

# Run tests with coverage
npm run test:coverage
```

#### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Check TypeScript types
npm run type-check
```

#### Building

```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod

# Create development build
npx expo run:ios
npx expo run:android
```

### 3. Debugging

#### React Native Debugger

1. Install React Native Debugger
2. Start the debugger before running your app
3. Enable debugging in your app (shake device or Cmd+D in simulator)

#### Flipper

1. Install Flipper
2. Start Flipper before running your app
3. Use Flipper plugins for network inspection, crash reporting, etc.

#### Console Logging

Use the `devLog` utility for consistent logging:

```typescript
import { devLog } from "../utils/devLog";

devLog("User profile updated", { userId, changes });
```

## Platform-Specific Setup

### iOS Development

#### Requirements

- **macOS** (required for iOS development)
- **Xcode** (latest version from App Store)
- **iOS Simulator** or physical iOS device

#### Setup Steps

1. Install Xcode from the Mac App Store
2. Open Xcode and accept license agreements
3. Install iOS Simulator
4. Run `npx expo run:ios` to build and run on iOS

### Android Development

#### Requirements

- **Android Studio**
- **Android SDK**
- **Android Emulator** or physical Android device

#### Setup Steps

1. Download and install Android Studio
2. Install Android SDK through Android Studio
3. Create an Android Virtual Device (AVD)
4. Run `npx expo run:android` to build and run on Android

### Web Development

#### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Setup Steps

1. Run `npm run web` to start web development server
2. Open browser to `http://localhost:8081`

## Troubleshooting

### Common Issues

#### Metro Bundler Issues

```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache
npx expo start --reset-cache
```

#### iOS Build Issues

```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Reinstall iOS dependencies
npx expo run:ios --clear
```

#### Android Build Issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Reinstall Android dependencies
npx expo run:android --clear
```

#### Convex Issues

```bash
# Redeploy Convex functions
npx convex dev --once

# Reset Convex development environment
npx convex dev --reset
```

### Getting Help

1. **Check Documentation**: Review this setup guide and other docs in `/docs`
2. **Search Issues**: Check existing GitHub issues for similar problems
3. **Ask Questions**: Use the project's communication channels
4. **Debug Logs**: Check console logs and error messages carefully

## Next Steps

After completing setup:

1. **Read the Architecture Documentation**: Understand the system design
2. **Review the Data Models**: Learn about the database schema
3. **Explore User Flows**: Understand the user experience
4. **Check Coding Standards**: Review the development guidelines
5. **Start with a Simple Task**: Pick an easy issue to get familiar with the codebase

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

**Last Updated:** 2024-12-19
