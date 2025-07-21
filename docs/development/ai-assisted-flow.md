# AI-Assisted Product Development Flow (BMad Method)

This document outlines a structured, AI-assisted workflow for product development, leveraging the BMad Method's agents, tasks, and templates. This process is designed to guide you from initial idea to implementation.

## The BMad Method Agents

You have the following agents available to assist you. You can invoke them by typing `@` followed by their name (e.g., `@pm`).

- `@bmad-master`: A master agent that can execute any task.
- `@bmad-orchestrator`: An agent that helps manage the overall workflow.
- `@architect`: Specializes in software architecture and system design.
- `@analyst`: Focused on requirements gathering and analysis.
- `@dev`: The development agent, responsible for implementation.
- `@pm`: The product manager agent, guiding product strategy.
- `@po`: The product owner agent, focused on the product backlog and user stories.
- `@qa`: The quality assurance agent, responsible for testing.
- `@sm`: The scrum master agent, facilitating the agile process.
- `@ux-expert`: The user experience expert, guiding UI/UX design.

## Development Workflows

The BMad method provides several workflows to guide you through the development process. You can choose a workflow based on your project type.

### Greenfield Projects (New Projects)

For new projects, you can use one of the following workflows:

- `greenfield-fullstack.yaml`: For new projects that involve both front-end and back-end development.
- `greenfield-service.yaml`: For new projects that are primarily service-based.
- `greenfield-ui.yaml`: For new projects that are primarily UI-focused.

### Brownfield Projects (Existing Projects)

For existing projects, you can use one of the following workflows:

- `brownfield-fullstack.yaml`: For existing projects that involve both front-end and back-end development.
- `brownfield-service.yaml`: For existing projects that are primarily service-based.
- `brownfield-ui.yaml`: For existing projects that are primarily UI-focused.

## Step-by-Step Product Development Flow

Here is a typical flow you can follow. This is a general guide; you can adapt it to your specific needs.

### 1. Project Initiation and Brainstorming

1.  **Invoke the Product Manager Agent**: Start by getting help from the PM agent to define the product vision and strategy.
    - **Agent**: `@pm`
    - **Goal**: Clarify the project's goals, target audience, and market position.

2.  **Facilitate a Brainstorming Session**: Use the `facilitate-brainstorming-session.md` task to generate ideas.
    - **Agent**: `@bmad-master`
    - **Command**: `*task facilitate-brainstorming-session`
    - **Output**: A structured document with ideas, which can be based on `brainstorming-output-tmpl.yaml`.

3.  **Validate Product Plan**: The `@pm` runs the `pm-checklist.md` to ensure the product vision, strategy, and goals are solid before moving forward.
    - **Agent**: `@pm`
    - **Task**: `execute-checklist.md pm-checklist.md`

### 2. Research and Analysis

1.  **Market and Competitor Analysis**: Use the analyst to perform research.
    - **Agent**: `@analyst`
    - **Task**: Use the `create-deep-research-prompt.md` to guide the research.
    - **Templates**:
      - `market-research-tmpl.yaml`
      - `competitor-analysis-tmpl.yaml`

2.  **Deeper Requirements Elicitation**: For complex projects, the `@analyst` can perform deeper requirements gathering.
    - **Agent**: `@analyst`
    - **Task**: `advanced-elicitation.md`

### 3. Documentation and Planning

1.  **Create a Project Brief**: Use the `create-doc` task with the project brief template.
    - **Agent**: `@bmad-master`
    - **Command**: `*create-doc project-brief-tmpl`

2.  **Create a Product Requirements Document (PRD)**:
    - **Agent**: `@bmad-master`
    - **Command**: `*create-doc prd-tmpl`
    - **Note**: For existing projects, you might use `brownfield-prd-tmpl.yaml`.

3.  **Validate Product Backlog**: After the PRD is created, the `@po` runs the `po-master-checklist.md` to validate the product backlog.
    - **Agent**: `@po`
    - **Task**: `execute-checklist.md po-master-checklist.md`

4.  **Create Front-End Specification**: For projects with a UI component, the `@ux-expert` can create a detailed front-end specification.
    - **Agent**: `@ux-expert`
    - **Task**: `create-doc front-end-spec-tmpl`

5.  **Define the Architecture**:
    - **Agent**: `@architect`
    - **Task**: Use the `create-doc` task with an architecture template.
    - **Templates**:
      - `architecture-tmpl.yaml`
      - `fullstack-architecture-tmpl.yaml`
      - `front-end-architecture-tmpl.yaml`
      - `brownfield-architecture-tmpl.yaml`

6.  **Validate Architecture**: After defining the architecture, the `@architect` agent runs the `architect-checklist.md` to ensure it is robust and well-designed.
    - **Agent**: `@architect`
    - **Task**: `execute-checklist.md architect-checklist.md`

### 4. Epics and User Stories

1.  **Create an Epic**: For larger features, start with an epic.
    - **Agent**: `@po`
    - **Task**: `brownfield-create-epic.md` (can be adapted for greenfield).

2.  **Create User Stories**: Break down epics into user stories.
    - **Agent**: `@po`
    - **Task**: `create-next-story.md` or `create-brownfield-story.md`.
    - **Template**: `story-tmpl.yaml`

3.  **Validate User Story Draft**: Before development begins, the `@sm` agent runs the `story-draft-checklist.md` to ensure the story is ready.
    - **Agent**: `@sm`
    - **Task**: `execute-checklist.md story-draft-checklist.md`

### 5. Development and Implementation

1.  **Development**: The `@dev` agent takes the user stories and implements them.

2.  **Front-end Prompting**: For UI work, the `generate-ai-frontend-prompt.md` can be useful.
    - **Agent**: `@dev`
    - **Task**: `generate-ai-frontend-prompt`

3.  **Validate Definition of Done**: After implementation, the `@dev` agent runs the `story-dod-checklist.md` to ensure all criteria are met before review.
    - **Agent**: `@dev`
    - **Task**: `execute-checklist.md story-dod-checklist.md`

### 6. Testing and QA

1.  **Quality Assurance**: The `@qa` agent is responsible for testing the implementation against the user story requirements.
2.  **Review Story**: The `review-story.md` task can be used to formalize the review process.
    - **Agent**: `@qa` or `@po`
    - **Task**: `review-story`

### 7. Change Management

1.  **Assess Impact of Changes**: If project scope or requirements change, use the `change-checklist.md` to assess the impact.
    - **Agent**: `@pm` or `@po`
    - **Task**: `execute-checklist.md change-checklist.md`

### 8. Documentation and Housekeeping

1.  **Document the Project**: As you build, keep the documentation up to date.
    - **Task**: `document-project.md`
2.  **Index Documents**: To make your documents searchable, use the indexing task.
    - **Task**: `index-docs.md`
3.  **Shard Documents**: For very large documents, you can break them up.
    - **Task**: `shard-doc.md`

## How to Use This Document

1.  **Start with a Workflow**: Choose a workflow (`greenfield-*` or `brownfield-*`) that best fits your project.
2.  **Follow the Steps**: Go through the steps in this guide, using the recommended agents and tasks.
3.  **Use the Templates**: Leverage the templates to create consistent and comprehensive documentation.
4.  **Adapt as Needed**: This is a flexible framework. Feel free to adapt it to your specific project and team dynamics.
