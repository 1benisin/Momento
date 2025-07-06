---
description: 
globs: 
alwaysApply: false
---
---
description:
globs:
alwaysApply: false
---

# Rule: AI-Assisted PRD Generation Workflow

## Goal

To guide an AI assistant in creating detailed Product Requirements Documents (PRDs) in Markdown format, based on an initial user prompt. The PRD should be clear, actionable, and suitable for a junior developer to understand and implement the feature. This workflow ensures an organized and scalable project structure for PRD documentation.

## Core Principles

- **Separate Artifacts from State**: Feature planning artifacts (PRDs) are stored permanently in a stable, version-controlled location. Their development status (e.g., planning, in progress, done) is tracked using dedicated project management tools (e.g., GitHub Issues and Project Boards).
- **Traceability**: Maintain a clear, unbroken link from the initial feature concept to the final code implementation.
- **Scalability**: Design a system that works efficiently for a solo developer and scales gracefully to a larger team for PRD management.

## Process

The workflow focuses on defining the Epic (PRD Generation):

1.  **Define the Epic (PRD Generation)**:
2.  **Receive Initial Prompt**: The user provides a brief description or request for a new feature or functionality.
3.  **Ask Clarifying Questions**: Before writing the PRD, the AI must ask clarifying questions to gather sufficient detail. The goal is to understand the "what" and "why" of the feature, not necessarily the "how" (which the developer will figure out).
4.  **Generate PRD**: Based on the initial prompt and the user's answers, generate a detailed PRD using the structure outlined below.
5.  **Save PRD**: Save the generated document as `prd.md` inside a new, numbered epic directory (refer to the "Directory Structure" section): `/_epics/[epic-id]-[feature-name]/prd.md`.
    - **Note for User**: After PRD generation, the user will manually create a GitHub Issue (e.g., `[Epic] [Feature Name] - #[epic-id]`) and link directly to the newly generated `prd.md` file in the repository.

## Directory Structure

The following directory structure ensures all project artifacts are well-organized, version-controlled, and easily traceable.

```
/
├── .github/              # GitHub-specific configurations (e.g., PR templates)
├── _docs/                # General, long-lived project documentation (e.g., architecture, user personas)
│   ├── PROJECT_OVERVIEW.md
│   ├── USER_PERSONAS.md
│   └── ...
├── _epics/               # Your home for feature-specific planning documents (PRDs)
│   ├── 001-user-profile-v1/
│   │   ├── prd.md        # The AI-generated Product Requirements Document for this epic
│   ├── 002-event-invitation-flow/
│   │   ├── prd.md
│   └── ...
├── src/                  # Your application source code
├── README.md
└── ...
```

### Rationale for `/_epics` Structure:

- **Unique Identification**: Each feature (or "epic") is assigned a unique, sequential ID (e.g., 001). This ID serves as a consistent reference across issues, branches, and commits.
- **Co-location**: `prd.md` for a specific feature is kept within its dedicated epic folder, ensuring easy access and logical grouping.
- **Stable Paths**: The location of these documents never changes. This results in a clean, stable Git history, avoiding unnecessary `git mv` commands and reducing merge conflict potential.
- **Scalability**: This structure easily accommodates a growing number of features without becoming unwieldy.

## Clarifying Questions (Examples for PRD Generation)

The AI should adapt its questions based on the initial prompt, but here are some common areas to explore before generating the PRD:

- **Problem/Goal**: "What specific problem does this feature aim to solve for the user or the business?" or "What is the main objective or desired outcome of this feature?"
- **Target User**: "Who is the primary user demographic or persona for this feature?"
- **Core Functionality**: "Can you describe the essential actions a user should be able to perform using this feature?"
- **User Stories**: "Could you provide a few example user stories? (e.g., 'As a [type of user], I want to [perform an action] so that [benefit].')"
- **Acceptance Criteria**: "How will we know when this feature is successfully implemented and meets expectations? What are the key success criteria?"
- **Scope/Boundaries**: "Are there any specific things this feature _should not_ do (non-goals) or existing functionalities it should interact with?"
- **Data Requirements**: "What kind of data does this feature need to display, manipulate, or store?"
- **Design/UI**: "Are there any existing design mockups, wireframes, or UI guidelines we should refer to?" or "Can you describe the desired look and feel?"
- **Edge Cases**: "Are there any potential edge cases, error conditions, or unusual scenarios we should consider?"

## PRD Structure

The AI-generated PRD (`prd.md`) should include the following sections:

1.  **Introduction/Overview**: Briefly describe the feature and the problem it solves. State the overall goal.
2.  **Goals**: List the specific, measurable objectives for this feature.
3.  **User Stories**: Detail the user narratives describing feature usage and benefits.
4.  **Functional Requirements**: List the specific functionalities the feature must have. Use clear, concise language (e.g., "The system must allow users to upload a profile picture."). Number these requirements for easy referencing.
5.  **Non-Goals (Out of Scope)**: Clearly state what this feature will not include to manage scope and expectations.
6.  **Design Considerations (Optional)**: Link to mockups, describe UI/UX requirements, or mention relevant components/styles if applicable.
7.  **Technical Considerations (Optional)**: Mention any known technical constraints, dependencies, or suggestions (e.g., "Should integrate with the existing Auth module," "Data stored in Supabase").
8.  **Success Metrics**: How will the success of this feature be measured? (e.g., "Increase user engagement by 10%", "Reduce support tickets related to X by 5%").
9.  **Open Questions**: List any remaining questions or areas needing further clarification from the product owner.

## Target Audience

Assume the primary reader of the PRD is a junior developer. Therefore, requirements should be explicit, unambiguous, and avoid jargon where possible. Provide enough detail for them to understand the feature's purpose and core logic.

## Output

- **Format**: Markdown (`.md`)
- **Location**: `/_epics/[epic-id]-[feature-name]/prd.md`
- **Filename**: `prd.md`

## Final Instructions for the AI

- Do NOT start implementing the feature or writing code. Your role is to generate the PRD documentation.
- Always ask clarifying questions before generating the PRD.
- Ensure the PRD is clear, concise, and structured as defined above.
