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

# Rule: AI-Assisted Task Generation Workflow

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD). This task list should be comprehensive, actionable, and designed to guide a junior developer through the implementation of a feature. This workflow ensures that tasks are logically structured and co-located with their corresponding PRD within the project's version-controlled structure.

## Core Principles

- Derivation from PRD: Tasks must directly reflect the functional requirements and user stories outlined in the associated PRD.
- Actionable and Granular: Each task should be clearly defined and specific enough for a developer to understand what needs to be done. Sub-tasks provide necessary granularity for implementation details.
- Structured Output: Consistent Markdown formatting ensures readability and ease of integration into project management tools.
- Co-location with PRD: Task lists are stored alongside their respective PRDs in the `/_epics` directory for clear organization and traceability.

## Process

The AI-assisted task generation process is as follows:

1.  **Receive PRD Reference**: The user points the AI to a specific PRD file (e.g., `/_epics/001-user-profile-v1/prd.md`).
2.  **Analyze PRD**: The AI reads and thoroughly analyzes the functional requirements, user stories, and other relevant sections of the specified PRD to understand the full scope of the feature.
3.  **Generate Task List**: Based on the comprehensive PRD analysis, the AI will generate the full task list. This includes:
    - **Parent Tasks**: Define main, high-level development tasks required to implement the feature. These should represent logical phases or significant components of the work.
    - **Sub-Tasks**: Break down each parent task into smaller, actionable sub-tasks. These sub-tasks should cover the necessary implementation details and logical steps.
4.  **Identify Relevant Files**: Based on the tasks and the PRD, identify potential files that will likely need to be created or modified during implementation. List these under a `Relevant Files` section, including corresponding test files if applicable.
5.  **Generate Final Output**: Combine the parent tasks, sub-tasks, relevant files, and any necessary notes into the final Markdown structure specified below.
6.  **Save Task List**: Save the generated document as `tasks.md` inside the same numbered epic directory as the PRD: `/_epics/[epic-id]-[feature-name]/tasks.md`.

## Output

- **Format**: Markdown (`.md`)
- **Location**: `/_epics/[epic-id]-[feature-name]/tasks.md`
- **Filename**: `tasks.md`

## Output Format

The generated task list must follow this structure:

```markdown
# Tasks for [Feature Name from PRD, e.g., User Profile V1]

## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Parent Task Title (e.g., Set up User Profile Database Schema)
  - [ ] 1.1 Create `profiles` table in Supabase.
  - [ ] 1.2 Define columns: `id (UUID, PK)`, `username (text, unique)`, `bio (text)`, `avatar_url (text)`.
- [ ] 2.0 Parent Task Title (e.g., Implement Profile View UI)
  - [ ] 2.1 Create `ProfileView.tsx` component.
  - [ ] 2.2 Display user's username, bio, and avatar.
  - [ ] 2.3 Add a button to navigate to "Edit Profile".
- [ ] 3.0 Parent Task Title (e.g., Develop Profile Update API)
  - [ ] 3.1 Create API route handler for `PUT /api/profile`.
  - [ ] 3.2 Implement Supabase update logic for `profiles` table.
```

## Target Audience

Assume the primary reader of the task list is a junior developer who will implement the feature. Tasks should be explicit, unambiguous, and avoid jargon where possible. Provide enough detail for them to understand the individual steps and core logic required for implementation.

## Final Instructions for the AI

- Do NOT start implementing the feature or writing code. Your role is solely to generate the task list documentation.
- Always analyze the provided PRD thoroughly before generating tasks.
- Ensure the task list is clear, concise, actionable, and structured as defined above.
- Derive parent and sub-tasks directly from the PRD's functional requirements.
