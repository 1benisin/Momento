# Development Process

This document outlines a scalable and efficient development process for Momento. The system is designed to be simple, repeatable, and scale from a solo developer to a full team.

## Core Development Principles

- **Expo First**: We will use the Expo ecosystem for development. Where possible, we should prefer using packages from the Expo SDK (`expo-...`) over other third-party or core React Native packages to ensure maximum compatibility and stability.
- **File System for Artifacts, Tools for State**: We use the file system for storing artifacts (like PRDs), but use dedicated tools (like GitHub Issues) for tracking their state.

The core principle we'll follow is: **Use the file system for storing artifacts, but use dedicated tools for tracking their state.**

We will leverage the power of Git and repository hosting services (like GitHub or GitLab) for what they do best. We'll keep non-code artifacts in a stable, predictable location and use Issues and Project Boards to track their status.

## Recommended Directory Structure

```
/
├── .github/              # For GitHub-specific configs like PR templates
├── _docs/                # Detailed, long-lived planning docs
│   ├── PROJECT_OVERVIEW.md
│   ├── FEATURES.md
│   ├── USER_PERSONAS.md
│   └── ...
├── _epics/               # <-- Your new "feature planning" home
│   ├── 001-user-profile-v1/
│   │   ├── prd.md        # The LLM-generated Product Requirements Doc
│   │   └── tasks.md      # The LLM-generated task list
│   ├── 002-event-invitation-flow/
│   │   ├── prd.md
│   │   └── tasks.md
│   └── ...
├── app/                  # Your application source code (with Expo)
├── README.md
└── ...
```

### Key Changes & Rationale:

- **A New `/_epics` Directory**: This is the home for all your feature-specific planning documents. An "Epic" is a large body of work, like "Build User Profiles."

- **Numbered Feature Folders**: Each epic gets its own numbered folder (e.g., `001-user-profile-v1`).
  - The number provides a unique, short ID that you can use to reference the feature everywhere (branches, commits, conversations).
  - It keeps related documents (`prd.md`, `tasks.md`) permanently grouped together.
  - The location never changes. You don't move the folder. This results in a clean, a stable Git history.

## The 3-Step Workflow, Redesigned

Here's how the LLM-assisted, 3-step process fits into this professional structure.

### Step 1: Define the Epic (The PRD)

1.  **Create the Epic Folder**: When you decide on the next feature (e.g., "User Profiles"), you create the next numbered folder: `/_epics/001-user-profile-v1/`.
2.  **Generate the PRD**: Have your LLM assistant generate the Product Requirements Document. Save this file as `/_epics/001-user-profile-v1/prd.md`.
3.  **Create a GitHub Issue**:
    - Go to your repository's "Issues" tab.
    - Create a new issue titled: `[Epic] User Profile V1 - #001`.
    - In the issue description, link directly to the PRD file in your repository. This connects the work tracker to the specification.

### Step 2: Define the Tasks

1.  **Generate the Task List**: Have your LLM break down the `prd.md` into a list of actionable development tasks. Save this as `/_epics/001-user-profile-v1/tasks.md`.
2.  **Populate the GitHub Issue**:
    - Go back to the GitHub Issue you created.
    - Use GitHub's task list feature to copy-paste the tasks from your `tasks.md` file into the issue description.

### Step 3: Implement the Feature

1.  **Create a Feature Branch**: Your development work starts here. Create a branch from `main` using the epic's ID:
    ```bash
    git checkout main
    git pull
    git checkout -b feature/001-user-profile
    ```
2.  **Code & Commit**: Do the development work. Your commit messages can even reference the epic ID for clarity (e.g., `git commit -m "feat(profile): create profile view screen #001"`).
3.  **Create a Pull Request (PR)**: When the work is ready for review, open a PR.
    - **Link the Issue**: In the PR description, use a GitHub keyword like `Closes #123` (where `#123` is the ID of your Epic issue). This automatically links the PR to the issue.

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

## Summary

This professional workflow gives you the best of all worlds:

- **Durable Documentation**: Your PRDs and task lists live permanently with the code.
- **Clean Git History**: No more messy file moves.
- **Integrated State Tracking**: Your Kanban board and issues are the source of truth for status.
- **Traceability**: You have a perfect, unbroken chain from the PRD -> the Issue -> the Branch -> the Pull Request -> the final merged code.
