# 1. Title: {PRD for {project}}

<version>1.0.0</version>

## Status: { Draft | Approved }

## Intro

{ Short 1-2 paragraph describing the what and why of what the prd will achieve}

## Goals

{

- Clear project objectives
- Measurable outcomes
- Success criteria
- Key performance indicators (KPIs)
  }

## Features and Requirements

{

- Functional requirements
- Non-functional requirements
- User experience requirements
- Integration requirements
- Compliance requirements
  }

## Epic List

This PRD concerns the primary epic. Future or related epics can be listed here for context.

- **This Epic**: {Epic Name, e.g., User Profile System}
- **Future Epic**: {e.g., Social Feed Integration}

---

## Story List for this Epic

This section is the primary output of the PRD planning phase. It breaks the epic into concrete, implementable stories.

_Story descriptions should be high-level. The detailed technical plan will be created in the `story-plan.md` for each story._

- **Story {epic_id}-01: {Title}**
  - **Goal**: {A one-sentence goal for the story.}
- **Story {epic_id}-02: {Title}**
  - **Goal**: {A one-sentence goal for the story.}
- **Story {epic_id}-NN: {Title}**
  - **Goal**: {A one-sentence goal for the story.}

<example>
- Story 001-01: NestJS Configuration
  - Goal: Install NestJS CLI and create a new project.
- Story 001-02: Hacker News Retrieval API Route
  - Goal: Create an API route to fetch top posts from Hacker News.
</example>

## Strategic Context & Core Documents

To fully understand the scope and architectural impact of this epic, the following core project documents should be consulted. They can be found in the root `/_docs` directory. These provide the high-level "why" and "how" for the project.

Example:

- **Architecture:** `/_docs/ARCHITECTURE.md`
- **Development Process & Structure:** `/_docs/DEVELOPMENT_PROCESS.md`
- **User Flow(s):** (e.g., `/_docs/USER_FLOWS/01_new_user_onboarding.md`)
- **Feature Brief:** `/_docs/FEATURES.md` (e.g., Section: "User Profiles")
- **Data Models:** `/_docs/DATA_MODELS.md`

## Technology Stack

{ Table listing choices for languages, libraries, infra, etc...}

  <example>
  | Technology | Description |
  | ------------ | ------------------------------------------------------------- |
  | Kubernetes | Container orchestration platform for microservices deployment |
  | Apache Kafka | Event streaming platform for real-time data ingestion |
  | TimescaleDB | Time-series database for sensor data storage |
  | Go | Primary language for data processing services |
  | GoRilla Mux | REST API Framework |
  | Python | Used for data analysis and ML services |
  </example>

## Reference

{ Mermaid Diagrams for models tables, visual aids as needed, citations and external urls }

## Data Models, API Specs, Schemas, etc...

{ As needed - may not be exhaustive - but key ideas that need to be retained and followed into the architecture and stories }

<example>
### Sensor Reading Schema

```json
{
  "sensor_id": "string",
  "timestamp": "datetime",
  "readings": {
    "temperature": "float",
    "pressure": "float",
    "humidity": "float"
  },
  "metadata": {
    "location": "string",
    "calibration_date": "datetime"
  }
}
```

</example>

## Project Structure

{ Diagram the folder and file organization structure along with descriptions }

<example>

````
// Start of Selection
```text
src/
├── services/
│   ├── gateway/        # Sensor data ingestion
│   ├── processor/      # Data processing and validation
│   ├── analytics/      # Data analysis and ML
│   └── notifier/       # Alert and notification system
├── deploy/
│   ├── kubernetes/     # K8s manifests
│   └── terraform/      # Infrastructure as Code
└── docs/
    ├── api/           # API documentation
    └── schemas/       # Data schemas
````

</example>

## Change Log

{ Markdown table of key changes after document is no longer in draft and is updated, table includes the change title, the story id that the change happened during, and a description if the title is not clear enough }

<example>
| Change               | Story ID | Description                                                   |
| -------------------- | -------- | ------------------------------------------------------------- |
| Initial draft        | N/A      | Initial draft prd                                             |
| Add ML Pipeline      | story-4  | Integration of machine learning prediction service story      |
| Kafka Upgrade        | story-6  | Upgraded from Kafka 2.0 to Kafka 3.0 for improved performance |
</example>
