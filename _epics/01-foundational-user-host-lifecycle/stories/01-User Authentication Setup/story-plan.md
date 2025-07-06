# 001-01 - User Authentication Setup

**As a** new or returning user,
**I want** to securely sign in or sign up using my US-based phone number,
**so that** I can access my Momento account without needing to remember a password.

- **Status**: Ready for Dev
- **Epic**: 001 - Foundational User & Host Lifecycle
- **Story Points**: 8

---

## 1. All Needed Context

### Tactical Documentation & References

_To implement this story correctly, you MUST reference the following specific sections of the project documentation and external resources._

```yaml
# Project-Specific Documentation
- file: /_docs/FEATURES.md
  section: "Phone-First Authentication & US-Only Launch"
  why: "Defines the US-only requirement and the international waitlist behavior."
- file: /_docs/DATA_MODELS.md
  section: "users Collection"
  why: "Defines the schema for storing OTP-related fields."
- file: /_docs/DATA_MODELS.md
  section: "waitlist_users Collection"
  why: "Defines the schema for the international waitlist."
- file: /_docs/SCREENS_AND_COMPONENTS.md
  section: "Onboarding & Authentication Flow"
  why: "Describes the UI/UX for AuthScreen, OTPScreen, and InternationalWaitlistScreen."
- file: /_docs/NOTIFICATIONS_PLAN.md
  section: "Services & Architecture"
  why: "Specifies the use of Twilio for SMS and Convex for backend logic."

# External Documentation
- url: https://docs.convex.dev/auth
  why: "The primary documentation for Convex's built-in authentication system."
- url: https://www.npmjs.com/package/react-native-phone-number-input
  why: "Recommended library for the frontend phone number input."
- url: https://www.npmjs.com/package/libphonenumber-js
  why: "Recommended library for backend phone number parsing and validation."
```

### Integration Points

- [ ] **Database**:
  - Add `otp_hash`, `otp_expires_at`, `otp_attempts`, `otp_last_attempt_at` to the `users` collection schema.
  - Create the new `waitlist_users` collection.
- [ ] **Config / Environment**:
  - Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` to the Convex environment variables.
- [ ] **API Routes**:
  - Register new Convex mutations in `convex/auth.ts`: `requestOtp`, `verifyOtp`, and `joinWaitlist`.

### Known Gotchas & Library Quirks

- `CRITICAL`: Phone numbers **must** be normalized to E.164 format on the backend before any database lookups to ensure consistency.
- `GOTCHA`: `react-native-phone-number-input` requires careful state management to handle the country code and national number separately.

### Anti-Patterns to Avoid

- ❌ Don't store OTPs in plain text. Always hash them before storing.
- ❌ Don't hardcode country codes. Use the recommended libraries to handle parsing and validation.

---

## 2. Test-First Blueprint

### A. Behavior & Test Cases

_The developer AI's primary goal is to make these tests pass._

| Test Case ID | Description                                                                                      |
| :----------- | :----------------------------------------------------------------------------------------------- |
| `TC-01`      | **New User Signup (Success)**: A new user with a valid US phone number can sign up successfully. |
| `TC-02`      | **Returning User Login (Success)**: An existing user can log in successfully.                    |
| `TC-03`      | **Resend OTP**: A user can request a new OTP code after a cooldown.                              |
| `TC-04`      | **Non-US Phone Number**: A user with a non-US number is directed to the waitlist.                |
| `TC-05`      | **Invalid Phone Number Format**: A user entering a malformed number sees a validation error.     |
| `TC-06`      | **Incorrect OTP**: A user entering an incorrect OTP sees an error.                               |
| `TC-07`      | **Expired OTP**: A user entering an expired OTP sees an error.                                   |
| `TC-08`      | **OTP Resend Abuse**: A user abusing the "Resend Code" button gets rate-limited.                 |
| `TC-09`      | **Signup with Existing Number**: An attempt to sign up with an existing number triggers a login. |
| `TC-10`      | **Rate Limiting on `requestOtp`**: A user requesting too many OTPs in a short time is blocked.   |

### B. Data Models / Schema

```typescript
// From convex/schema.ts

// In users table definition
// ...
  otp_hash: v.optional(v.string()),
  otp_expires_at: v.optional(v.number()),
  otp_attempts: v.optional(v.number()),
  otp_last_attempt_at: v.optional(v.number()),
// ...

// New table
export default defineSchema({
  // ... other tables
  waitlist_users: defineTable({
    phone_number: v.string(),
    region_code: v.string(),
  }).index("by_phone_number", ["phone_number"]),
});
```

### C. Project Structure

```text
/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx                 <-- CREATE: Handles auth flow navigation
│   │   ├── index.tsx                   <-- CREATE: The AuthScreen
│   │   ├── otp.tsx                     <-- CREATE: The OTPScreen
│   │   └── waitlist.tsx                <-- CREATE: The InternationalWaitlistScreen
│   └── _layout.tsx                     <-- TOUCH: Add logic to direct authenticated/unauthenticated users
├── convex/
│   ├── auth.ts                         <-- CREATE: All auth mutations
│   ├── schema.ts                       <-- TOUCH: Add tables and fields from 2.B
│   └── tests/
│       └── auth.test.ts                <-- CREATE: Backend tests
└── lib/
    └── utils.ts                        <-- TOUCH: Potentially add phone validation helpers
```

### D. Implementation Tasks

- [x] **Task 1**: Create the folder and file structure outlined in 2.C.
- [x] **Task 2**: Update `convex/schema.ts` with the new fields and `waitlist_users` table.
- [x] **Task 3**: Create `convex/tests/auth.test.ts` with test skeletons for all test cases in 2.A.
- [x] **Task 4**: Implement the `requestOtp`, `verifyOtp`, and `joinWaitlist` mutations in `convex/auth.ts`, along with a private `_sendSms` action, until all backend tests pass.
- [x] **Task 5**: Build the `AuthScreen` (`app/(auth)/index.tsx`) with the `react-native-phone-number-input` component.
- [x] **Task 6**: Build the `OTPScreen` (`app/(auth)/otp.tsx`) and the `InternationalWaitlistScreen` (`app/(auth)/waitlist.tsx`).
- [x] **Task 7**: Implement state management and connect the frontend screens to the Convex mutations.
- [x] **Task 8**: Update the root `_layout.tsx` to protect routes and manage the authentication state.

### E. Pseudocode for Complex Logic

```typescript
// convex/auth.ts -> requestOtp mutation

// 1. Get phone number from args
const { phoneNumber } = args;

// 2. Normalize and Validate
// PATTERN: Use a robust library for this.
import { parsePhoneNumber } from "libphonenumber-js";
const parsed = parsePhoneNumber(phoneNumber);
if (!parsed || !parsed.isValid()) {
  throw new ConvexError("Invalid phone number format.");
}
if (parsed.country !== "US") {
  // Return a specific code for the client to handle redirection
  return { status: "unsupported_region" };
}
const normalizedNumber = parsed.number; // E.164 format

// 3. Handle Rate Limiting (Example)
const existingUser = await ctx.db
  .query("users")
  .withIndex("by_phone_number", (q) => q.eq("phone_number", normalizedNumber))
  .first();
if (
  existingUser &&
  hasBeenRequestedRecently(existingUser.otp_last_attempt_at)
) {
  throw new ConvexError("Too many requests. Please try again later.");
}

// 4. Generate and Hash OTP
const otp = generateSecureCode(6); // e.g., '123456'
const otp_hash = await bcrypt.hash(otp);
const otp_expires_at = Date.now() + 10 * 60 * 1000; // 10 minutes

// 5. Upsert user and OTP data
// Find user by phone number, or create if they don't exist.
// Patch the user document with otp_hash, otp_expires_at, etc.

// 6. Call private action to send SMS
await ctx.scheduler.runAfter(0, internal.twilio.sendSms, {
  to: normalizedNumber,
  body: `Your code is ${otp}`,
});

return { status: "success" };
```

---

## 3. Validation Loop

_The developer AI **MUST** run these commands after every meaningful change._

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npx eslint . --fix
npx prettier . --write

# Expected: No errors.
```

### Level 2: Unit Tests

```bash
# Run and iterate until passing:
npx convex run tests/auth.test.ts

# If failing: Read error, understand root cause, fix code, re-run.
```

---

## 4. Post-Implementation Review Checklist

- [ ] All tasks in section 2.D are marked `[x]`.
- [ ] All validation loop commands pass.
- [ ] New code is consistent with existing project patterns.
- [ ] The feature is correctly integrated with other parts of the application.
- [ ] Any necessary updates to the main `prd.md` or `architecture.md` have been identified.

---

## 5. Developer Notes

_{This section is to be filled out by the developer AI during implementation.}_
