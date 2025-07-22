# Development Process

This document outlines the scalable and efficient development process for Momento.

- **[Core Development Principles](#core-development-principles)**: Establishes the "Expo First" rule and the philosophy of using the file system for artifacts and dedicated tools for tracking state.
- **[Recommended Directory Structure](#recommended-directory-structure)**: Introduces the `/_epics` directory for feature-specific planning documents.
- **[The 3-Step Workflow, Redesigned](#the-3-step-workflow-redesigned)**: Details the process of defining epics, generating tasks, and implementing features using GitHub Issues and feature branches.
- **[Getting Started](#getting-started)**: Provides the standard setup instructions for a new developer to get the project running locally.
- **[Summary](#summary)**: Recaps the benefits of this professional workflow, including durable documentation and traceability.

---

This document outlines a scalable and efficient development process for Momento. The system is designed to be simple, repeatable, and scale from a solo developer to a full team.

## Core Development Principles

- **Expo First**: We will use the Expo ecosystem for development. Where possible, we should prefer using packages from the Expo SDK (`expo-...`) over other third-party or core React Native packages to ensure maximum compatibility and stability.
- **File System for Artifacts, Tools for State**: We use the file system for storing artifacts (like PRDs), but use dedicated tools (like GitHub Issues) for tracking their state.

The core principle we'll follow is: **Use the file system for storing artifacts, but use dedicated tools for tracking their state.**

We will leverage the power of Git and repository hosting services (like GitHub or GitLab) for what they do best. We'll keep non-code artifacts in a stable, predictable location and use Issues and Project Boards to track their status.

## Recommended Directory Structure

A well-defined directory structure is the bedrock of a scalable and maintainable application. This structure is designed to be logical, embrace conventions from our tech stack (Expo, Convex, NativeWind), and make it immediately clear where any given file should go.

### Top-Level Directory Guide

This table provides a high-level map of the project. Use it to quickly understand the purpose of each top-level directory and where to place new files.

| Directory     | Purpose                                                                                                                                     | Example Files & Use Cases                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `_docs/`      | **Project Documentation.** Contains all long-lived planning and design documents that define the product, design, and engineering strategy. | `PROJECT_OVERVIEW.md`, `FEATURES.md`, `ARCHITECTURE.md`  |
| `_epics/`     | **Feature-Specific Planning.** Holds the detailed planning artifacts (PRDs, task lists) for a specific, large-scale feature or "epic."      | `/001-user-profile-v1/prd.md`, `/002-auth-flow/tasks.md` |
| `app/`        | **Application Screens & Routing.** The heart of the user-facing app, powered by Expo Router's file-system-based navigation.                 | `/home.tsx`, `/(auth)/login.tsx`, `/(tabs)/_layout.tsx`  |
| `assets/`     | **Static Assets.** All static files like images, icons, and custom fonts that are used in the application.                                  | `/images/logo.png`, `/fonts/SpaceMono-Regular.ttf`       |
| `components/` | **Reusable UI Components.** The "Lego bricks" of our UI, organized by their scope and purpose.                                              | `/core/Button.tsx`, `/domain/EventCard.tsx`              |
| `constants/`  | **App-Wide Constants.** Stores unchanging values used across the app, like color palettes or layout dimensions.                             | `Colors.ts`, `Layout.ts`                                 |
| `convex/`     | **Backend Logic & Schema.** Contains all server-side code, including database schema, queries, mutations, and HTTP actions.                 | `schema.ts`, `users.ts`, `events.ts`, `http.ts`          |
| `hooks/`      | **Custom React Hooks.** Reusable, non-UI logic encapsulated into custom hooks.                                                              | `useAuth.ts`, `useNotifications.ts`                      |
| `lib/`        | **Shared Libraries & Helpers.** Utility functions, typed API wrappers, and other shared logic that isn't a React hook.                      | `utils.ts`, `api.ts` (for Convex client)                 |
| `navigation/` | **Navigation Types.** Centralized TypeScript definitions for navigators and route parameters.                                               | `types.ts`                                               |
| `styles/`     | **Global Styles.** Configuration for our styling system (NativeWind/Tailwind).                                                              | `global.css` (if needed)                                 |

### Full Directory Tree

This is a more detailed view of the recommended structure for our source code.

```
/
├── .github/              # GitHub-specific configs (PR templates, etc.)
├── _docs/                # Long-lived planning docs
├── _epics/               # Feature-specific planning docs
│
├── app/                  # --- EXPO ROUTER APP DIRECTORY ---
│   ├── (tabs)/           # Layout route for the main tab navigation
│   │   ├── _layout.tsx   # Defines the tab navigator itself
│   │   ├── home.tsx      # Screen for the first tab
│   │   └── ...           # Other tab screens
│   ├── (auth)/           # Layout route for the authentication flow
│   ├── modal.tsx         # Example of a modal route defined by Expo Router
│   └── _layout.tsx       # Root layout for the entire app (fonts, providers)
│
├── assets/               # Static assets like images and fonts
│
├── components/           # --- SHARED UI COMPONENTS ---
│   ├── core/             # Atomic, reusable primitives (Button, Input, Card)
│   ├── layout/           # Layout helpers (Container, Grid, Spacer)
│   └── domain/           # App-specific components (EventCard, ProfileAvatar)
│
├── constants/            # App-wide constants (Colors, Layout, API keys)
│
├── convex/               # --- CONVEX BACKEND ---
│   ├── schema.ts         # Database schema definition
│   ├── users.ts          # Queries & mutations related to users
│   ├── events.ts         # Queries & mutations related to events
│   ├── http.ts           # HTTP actions for webhooks (e.g., Stripe)
│   └── _generated/       # Auto-generated Convex client files (do not edit)
│
├── hooks/                # Custom React hooks (e.g., useNotifications, useAuth)
│
├── lib/                  # Shared libraries, helpers, and business logic
│   ├── api.ts            # Typed wrappers for Convex functions
│   ├── utils.ts          # General utility functions (date formatting, etc.)
│   └── stripe.ts         # Client-side Stripe helper functions
│
├── navigation/           # Navigation-specific logic and types
│   └── types.ts          # TypeScript types for navigators and route params
│
├── styles/               # Global styles or theme configuration for NativeWind
│
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── package.json
├── tailwind.config.js    # Tailwind CSS / NativeWind configuration
└── tsconfig.json
```

### Architectural Rationale

This structure is designed for clarity, scalability, and maintainability.

1.  **Clear Separation of Concerns**: The top-level directories create a very clear distinction between different parts of the application:
    - `app/`: UI and routing (what the user sees).
    - `convex/`: All backend logic and database schema. This is the standard and required convention for Convex.
    - `components/`: Reusable, presentation-only UI elements.
    - `hooks/` & `lib/`: Reusable frontend logic.
    - `_docs/` & `_epics/`: Project planning and documentation.

2.  **Convention-Driven (Expo & Convex)**: This structure fully embraces the conventions of our key technologies.
    - **Expo Router**: The `app/` directory is the heart of Expo's file-system-based routing. Grouping routes with `(parentheses)` is the standard way to create layout routes without adding segments to the URL, which is perfect for organizing flows like `(tabs)` and `(auth)`.
    - **Convex**: The `convex/` directory is where Convex expects to find all backend functions and the schema. This clear boundary makes it easy to reason about what code runs on the server vs. the client.

3.  **Scalable Component Architecture**: Splitting `components/` into `core`, `layout`, and `domain` prevents it from becoming a messy, flat folder as the project grows.
    - `core` components are completely generic and could be used in any project.
    - `layout` components help maintain a consistent structure across screens.
    - `domain` components are specific to Momento's features. This makes them easy to find and reuse.

4.  **Enhanced Type Safety**: The `navigation/types.ts` file becomes a single source of truth for all navigation-related TypeScript definitions. This is crucial for ensuring that when you navigate from one screen to another, you are passing the correct parameters.

5.  **Centralized Logic**: Placing reusable, non-UI logic in `hooks/` and `lib/` prevents code duplication and keeps our screen files in `app/` lean and focused on presentation. Creating typed wrappers in `lib/api.ts` for your Convex functions will also make them much easier and safer to use throughout the client application.

## The 3-Step Workflow, Redesigned

Here's how the LLM-assisted, 3-step process fits into this professional structure.

### Step 1: Define the Epic (The PRD)

1.1 **Create the Epic Folder**: When you decide on the next feature (e.g., "User Profiles"), you create the next numbered folder: `/_epics/001-user-profile-v1/`.
1.2 **Generate the PRD**: Have your LLM assistant generate the Product Requirements Document. Save this file as `/_epics/001-user-profile-v1/prd.md`.

### Step 2: Define the Tasks

2.1 **Generate the Task List**: Have your LLM break down the `prd.md` into a list of actionable development tasks. Save this as `/_epics/001-user-profile-v1/tasks.md`.

### Step 3: Implement the Feature

3.1 **Create a Feature Branch**: Your development work starts here. Create a branch from `main` using the epic's ID:
`bash
    git checkout main
    git pull
    git checkout -b feature/001-user-profile
    `
3.2 **Code & Commit**: Do the development work. Your commit messages can even reference the epic ID for clarity (e.g., `git commit -m "feat(profile): create profile view screen #001"`).
3.3 **Create a Pull Request (PR)**: When the work is ready for review, open a PR.

## Getting Started

To get the project set up on your local machine, follow these steps.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/momento.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd momento
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npx expo start
    ```

### Logging In During Development (Clerk Test Credentials)

To sign in to the application on a simulator during development, you do not need to use a real phone number or email. Our authentication provider, Clerk, provides test credentials that bypass the need for SMS verification.

- **Test Phone Number**: Use any number in the format `+1 (XXX) 555-0100` to `+1 (XXX) 555-0199`. For example: `+12015550100`.
- **Verification Code (for Phone)**: When prompted for the OTP code, use the universal code: `424242`.
- **Test Email / Password**: To test the email flow, you can create and use test accounts from the Clerk Dashboard under "Users & Organizations". These allow you to set an email and password for testing without real email verification.

Using these credentials will allow you to quickly and easily test authentication-protected features of the app.

## Summary

This professional workflow gives you the best of all worlds:

- **Durable Documentation**: Your PRDs and task lists live permanently with the code.
- **Clean Git History**: No more messy file moves.
- **Integrated State Tracking**: Your Kanban board and issues are the source of truth for status.
- **Traceability**: You have a perfect, unbroken chain from the PRD -> the Issue -> the Branch -> the Pull Request -> the final merged code.
