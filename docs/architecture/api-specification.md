# API Specification

Momento's API is built using Convex, which provides a type-safe, tRPC-like experience for communication between the React Native client and the backend. Instead of traditional REST or GraphQL endpoints, the client directly invokes serverless functions defined in the `convex/` directory.

## API Style: Convex Functions

The API is composed of three types of functions:

1.  **Queries:** Read-only functions for fetching data from the database. These are real-time by default; the client will automatically receive updates when the data changes.
    - **Example:** `convex/events.ts:getNearbyEvents`
2.  **Mutations:** Functions that modify data in the database. They are atomic and ensure data consistency.
    - **Example:** `convex/events.ts:createEvent`
3.  **Actions:** Functions for executing side effects, such as calling external APIs (e.g., Stripe for payments, Postmark for emails) or performing long-running tasks. They can read and write data by calling queries and mutations.
    - **Example:** `convex/users.ts:acceptInvitationAndPay` (hypothetical action that would call Stripe and then a mutation)

## Authentication

All Convex functions are authenticated by default. The client-side Convex provider is configured with the user's Clerk session token. This token is automatically sent with every API call and verified on the backend, making the `ctx.auth` object available within each function to identify the calling user. Publicly accessible functions must be explicitly marked using `export const myPublicFunction = query({ handler: ... })`.

## Example Function Definition (`convex/events.ts`)

This is an illustrative example of how an event creation function would be defined.

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
  // Define input validation for the function's arguments
  args: {
    title: v.string(),
    description: v.string(),
    // ... other event properties
  },
  handler: async (ctx, args) => {
    // Get the identity of the calling user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create an event.");
    }
    const hostId = identity.subject; // This is the user's clerkId

    // Insert the new event into the database
    const eventId = await ctx.db.insert("events", {
      hostId: hostId,
      title: args.title,
      description: args.description,
      status: "draft",
      // ... other properties
    });

    return eventId;
  },
});
```
