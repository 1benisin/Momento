# Testing & CI/CD Strategy

**Purpose:** This document outlines the comprehensive strategy for testing the Momento application and implementing a CI/CD pipeline to ensure code quality, stability, and efficient delivery.

**Last Updated:** 2024-07-29

---

### Table of Contents

- [The Philosophy: The Testing Pyramid](#1-the-philosophy-the-testing-pyramid)
- [The Layers of Testing](#2-the-layers-of-testing)
  - [Static Analysis (The Foundation)](#static-analysis-the-foundation)
  - [Unit Tests (The Base)](#unit-tests-the-base)
  - [Integration Tests (The Middle)](#integration-tests-the-middle)
  - [End-to-End (E2E) Tests (The Top)](#end-to-end-e2e-tests-the-top)
- [CI/CD Pipeline with GitHub Actions](#3-cicd-pipeline-with-github-actions)
  - [Workflow 1: Continuous Integration (On Pull Request)](#workflow-1-continuous-integration-on-pull-request)
  - [Workflow 2: Continuous Delivery (On Merge to Main)](#workflow-2-continuous-delivery-on-merge-to-main)
- [Recommended Tooling Summary](#4-recommended-tooling-summary)

---

## 1. The Philosophy: The Testing Pyramid

The testing strategy is built on the principle of the "Testing Pyramid." This framework balances different types of tests to achieve maximum confidence in the codebase for the minimum amount of effort and runtime. The pyramid structure emphasizes having many fast, isolated tests at the base and progressively fewer, slower, more integrated tests at the top.

- **Base:** Unit Tests (Many)
- **Middle:** Integration Tests (Some)
- **Top:** End-to-End Tests (Few)
- **Foundation:** Static Analysis (Everywhere)

---

## 2. The Layers of Testing

Each layer of the pyramid serves a specific purpose in our quality assurance process.

### Static Analysis (The Foundation)

This is the first and most immediate line of defense, catching errors and style issues before the code is even run.

- **What it is:** Automated analysis of source code for potential errors, style inconsistencies, and type mismatches.
- **Recommended Tools:**
  - **TypeScript:** Enforces type safety, preventing a large class of runtime errors.
  - **ESLint:** Enforces a consistent coding style and identifies problematic code patterns.
- **Role:** Provides instant feedback in the developer's editor, making it the cheapest and fastest way to maintain code quality.

### Unit Tests (The Base)

This layer forms the bulk of our automated test suite.

- **What it is:** Testing the smallest indivisible "unit" of the application (e.g., a single function, a single React component) in complete isolation.
- **How it works:** We provide known inputs to a unit and assert that it produces the expected output or renders the correct UI. All external dependencies (like API calls or native modules) are mocked.
- **Recommended Tools:**
  - **Jest:** The test runner that discovers, runs, and reports on tests.
  - **React Native Testing Library:** A library for testing components in a way that resembles user interaction, focusing on rendered output rather than internal implementation details.
- **Role:** These tests are fast, stable, and precisely identify the location of bugs when they fail.

### Integration Tests (The Middle)

This layer ensures that different units work together correctly.

- **What it is:** Testing the interaction between several components or modules. This could involve testing a full screen, including its state management and child components.
- **How it works:** We render a complex component or an entire screen with mock data and simulate user interactions (e.g., tapping a button) to verify that the correct functions are called or UI changes occur.
- **Recommended Tools:** Jest and React Native Testing Library.
- **Role:** They provide confidence that the major pieces of the application are wired together correctly.

### End-to-End (E2E) Tests (The Top)

This is the highest level of testing, simulating a complete user journey through the live application.

- **What it is:** An automated script that launches the actual Momento app on a real device or simulator and interacts with it as a user would.
- **How it works:** The script performs critical user flows from start to finish (e.g., sign-up and onboarding, accepting an event invitation). These tests will interact with the real Supabase backend in a staging environment.
- **Recommended Tools:**
  - **Maestro:** A modern, simple-to-use E2E testing framework. Its declarative YAML syntax makes tests easy to write and maintain, making it the preferred choice for Momento.
  - **Detox:** A more powerful, but more complex, JavaScript-based alternative.
- **Role:** E2E tests provide the highest level of confidence that critical user paths are working as expected in a real-world environment. Due to their slow speed and potential for flakiness, they should be used sparingly for the most business-critical flows.

---

## 3. CI/CD Pipeline with GitHub Actions

To automate this testing strategy, we will use a CI/CD (Continuous Integration / Continuous Delivery) pipeline.

- **What it is:** An automated workflow that runs our tests and, if they pass, builds and distributes the application.
- **Recommended Tool:** **GitHub Actions** for workflow automation, combined with **Expo Application Services (EAS)** for building and deploying the app.

### Workflow 1: Continuous Integration (On Pull Request)

This workflow runs on every pull request to ensure that no broken code is merged into the `main` branch.

1.  **Trigger:** Developer opens a Pull Request.
2.  **Action:** A GitHub Actions job starts.
3.  **Steps:**
    - `Checkout Code`: Pulls the code from the feature branch.
    - `Install Dependencies`: Runs `npm install`.
    - `Run Static Analysis`: Runs `npm run lint` and `npx tsc --noEmit`.
    - `Run Unit & Integration Tests`: Runs `npm test`.
4.  **Outcome:** The job reports a "pass" or "fail" status on the Pull Request, blocking merges that do not pass all checks.

### Workflow 2: Continuous Delivery (On Merge to Main)

This workflow runs after a pull request is successfully merged, automatically building the app and deploying it for internal testing.

1.  **Trigger:** A Pull Request is merged into the `main` branch.
2.  **Action:** A second GitHub Actions job starts.
3.  **Steps:**
    - `Checkout Code`: Pulls the latest code from `main`.
    - `Install Dependencies`: Runs `npm install`.
    - `Build with EAS`: Executes the EAS CLI command (`eas build`) to build the `.ipa` (iOS) and `.aab` (Android) files in the cloud.
    - `Deploy to Internal Testing`: On successful build, EAS automatically submits the builds to **TestFlight** (iOS) and **Google Play Internal Testing** (Android).
4.  **Outcome:** A new, testable version of the app is delivered to internal stakeholders without any manual intervention.

---

## 4. Recommended Tooling Summary

| Category      | Tool(s)                                    |
| ------------- | ------------------------------------------ |
| Type Checking | TypeScript                                 |
| Linting       | ESLint                                     |
| Unit/Int      | Jest, React Native Testing Library         |
| End-to-End    | Maestro (recommended), Detox (alternative) |
| CI/CD         | GitHub Actions, Expo Application Services  |
