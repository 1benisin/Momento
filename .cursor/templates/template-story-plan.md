# {EpicID}-{StoryID} - {Story Title}

**As a** {role}
**I want** {action}
**so that** {benefit}

- **Status**: {Draft | Ready for Dev | In Progress | Complete}
- **Epic**: {EpicID} - {Name of parent Epic}
- **Story Points**: {Estimate}

---

## 1. All Needed Context

_This section provides all the background information the developer AI needs. It is the output of the Tech Lead's research phase._

### Tactical Documentation & References

_To implement this story correctly, you MUST reference the following specific sections of the project documentation and external resources. Adhere strictly to the patterns and definitions you find there. Product Documentation can be found in the root `/_docs` directory. Reference what sections of the documentation are relevant to this story from any of the files in the `/_docs` directory._

```yaml
# Project-Specific Documentation
- file: /_docs/DEVELOPMENT_PROCESS.md
  section: "Full Directory Tree"
  why: "To correctly place the new component files."
- file: /_docs/CONVEX_DATA_MODELS.md
  section: "User"
  why: "The new component will fetch and display user data."
- file: /_docs/ARCHITECTURE.md
  section: "State Management"
  why: "Describes how to handle component state."

# Existing Code Patterns to Follow
- file: /components/core/Button.tsx
  why: "Follow this pattern for creating the new interactive element."

# External Documentation
- url: https://react.dev/reference/react/useState
  why: "For managing component state."
```

### Integration Points

_A checklist of interactions with other parts of the system that are required for this story to be complete._

- [ ] **Database**: {e.g., Add `is_featured` column to `posts` table via a new migration file.}
- [ ] **Config / Environment**: {e.g., Add `POSTS_PER_PAGE=10` to `.env.example` and load it in `config.py`.}
- [ ] **API Routes**: {e.g., Register the new `posts_router` in the main `main.py` application factory.}

### Known Gotchas & Library Quirks

_Critical information to prevent common errors._

- `CRITICAL`: {e.g., The foobar library requires async functions for all I/O.}
- `GOTCHA`: {e.g., This ORM doesn't support batch inserts over 1000 records.}

### Anti-Patterns to Avoid

_Specific things NOT to do in this implementation._

- ❌ Don't create new database connection methods; always use `common.db.get_connection()`.
- ❌ Don't use `dict` for responses; always use the Pydantic models defined below.

---

## 2. Test-First Blueprint

_This section defines the feature's contract through tests, and then provides the implementation details required to make those tests pass._

### A. Behavior & Test Cases

_This is the **most important** section. Define the test cases that describe the feature's behavior. The Developer AI's primary goal is to make these tests pass._

**Unit Tests for `service.ts`**

```typescript
it("should create a user when given valid data", () => {
  // TODO: Implement test
});

it("should throw a validation error if the email is invalid", () => {
  // TODO: Implement test
});

it("should throw a database error if the database write fails", () => {
  // TODO: Implement test
});
```

**Integration Tests for `api.ts`**

```
POST /users with valid data -> returns 201 Created
POST /users with missing name -> returns 400 Bad Request
```

### B. Data Models / Schema

_All Pydantic models, database schemas, or other data structures go here._

```typescript
// Example for a User model
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### C. Project Structure

_Diagram of the folder and file organization structure, highlighting new files to be created._

```
/src
└── /features
    └── /new-feature      <-- CREATE THIS FOLDER
        ├── api.ts        <-- CREATE THIS FILE
        ├── service.ts    <-- CREATE THIS FILE
        ├── tests/
        │   └── service.test.ts <-- CREATE THIS FILE
        └── types.ts      <-- CREATE THIS FILE
```

### D. Implementation Tasks

_The developer AI will mark these as complete (`[x]`) as it works. These tasks are designed to fulfill the test cases defined above._

- [ ] **Task 1**: Create the folder structure and files outlined above.
- [ ] **Task 2**: Define the `User` interface in `types.ts`.
- [ ] **Task 3**: Write the test skeletons in `service.test.ts` as defined in section 2.A.
- [ ] **Task 4**: Implement the `createUser` function in `service.ts` until the unit tests pass.
- [ ] **Task 5**: Create the `POST /users` endpoint in `api.ts`.

### E. Pseudocode for Complex Logic

_Annotated pseudocode to guide implementation of tricky parts._

```typescript
// service.ts -> createUser
async function createUser(userData: UserData): Promise<User> {
  // PATTERN: Always validate input first (see src/common/validators.ts)
  const validated = validateInput(userData);

  // GOTCHA: This library requires connection pooling.
  const db = await getDbConnection(); // From src/common/db.ts

  // CRITICAL: Ensure you hash the password before saving.
  const hashedPassword = await hashPassword(validated.password);
  const newUser = await db.users.create({
    ...validated,
    password: hashedPassword,
  });

  return newUser;
}
```

---

## 3. Validation Loop

_The developer AI **MUST** run these commands after every meaningful change. If any command fails, the AI must stop, read the error, fix its code, and re-run the command until it passes._

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npx eslint src/features/new-feature/ --fix
npx prettier src/features/new-feature/ --write

# Expected: No errors.
```

### Level 2: Unit Tests

_The test cases are defined in section 2.A. This command runs them._

```bash
# Run and iterate until passing:
npx jest src/features/new-feature/tests/service.test.ts

# If failing: Read error, understand root cause, fix code, re-run.
```

### Level 3: Integration Test

```bash
# After starting the service, run this test:
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Expected: HTTP/1.1 201 Created
```

---

## 4. Post-Implementation Review Checklist

_The QA/Architect AI will use this checklist in the final review step._

- [ ] All tasks in the plan are marked `[x]`.
- [ ] All validation loop commands pass.
- [ ] New code is consistent with existing project patterns.
- [ ] The feature is correctly integrated with other parts of the application.
- [ ] Any necessary updates to the main `prd.md` or `architecture.md` have been identified.

---

## 5. Developer Notes

_The Developer AI will add notes here during implementation about any discoveries, decisions made, or deviations from the original plan. This section should be reviewed by the QA AI and the human reviewer._
