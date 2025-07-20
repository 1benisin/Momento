# Data Models

This section defines the core data models for the Momento application, designed for the Convex backend. The models prioritize a seamless, end-to-end TypeScript experience and leverage Convex's real-time capabilities. Data is structured in a document-oriented model, embedding data where it makes sense to optimize for read performance and using references for many-to-many relationships.

## User Deletion Strategy & Data Retention

### Overview

Momento implements a **soft delete strategy** for user accounts to balance user privacy rights with platform integrity and user experience. This approach ensures that when users delete their accounts, we maintain referential integrity while removing personal data.

### Core Principles

1. **Privacy First**: Remove all personal and sensitive data immediately
2. **Platform Integrity**: Maintain referential integrity for events, connections, and social features
3. **User Experience**: Preserve context for other users (e.g., "User has deactivated their account")
4. **Legal Compliance**: Meet GDPR "right to be forgotten" requirements while maintaining platform functionality
5. **Analytics Continuity**: Enable continued platform analytics without personal identifiers

### Account Status Lifecycle

```typescript
export const AccountStatuses = {
  ACTIVE: "active", // Normal account state
  PAUSED: "paused", // Temporary suspension
  DELETED: "deleted", // Soft deleted - data anonymized
} as const;
```

### User Record Transformation After Deletion

When a user deletes their account, the user record undergoes the following transformation:

#### Fields Retained (for platform integrity)

- `_id`: Preserved for referential integrity
- `clerkId`: Nullified (Clerk record is hard deleted)
- `accountStatus`: Set to `"deleted"`
- `deletedAt`: Timestamp of deletion
- `displayName`: Preserved for UI continuity (e.g., "Deleted User" or original name)
- `profileImage`: Preserved or set to default deleted avatar

#### Fields Anonymized/Removed

- `email`: Set to `null`
- `phone_number`: Set to `null`
- `first_name`: Set to `null`
- `last_name`: Set to `null`
- `socialProfile`: Anonymized (photos removed, bio cleared)
- `hostProfile`: Anonymized (personal info removed, ratings preserved)
- `payment_customer_id`: Set to `null`
- `notificationSettings`: Set to `null`

#### Related Data Cleanup

- **Event Participation**: Keep event IDs but remove personal context
- **Connections**: Maintain connection records but anonymize user references
- **Messages**: Anonymize or remove personal content
- **Payment Methods**: Hard delete from Stripe
- **Notifications**: Clear all pending notifications

### Implementation Details

#### Schema Updates Required

```typescript
// convex/schema.ts
export const AccountStatuses = {
  ACTIVE: "active",
  PAUSED: "paused",
  DELETED: "deleted", // New status
} as const;

export const accountStatusValidator = v.union(
  v.literal(AccountStatuses.ACTIVE),
  v.literal(AccountStatuses.PAUSED),
  v.literal(AccountStatuses.DELETED) // Add to validator
);

// Add deletion tracking fields to users table
users: defineTable({
  // ... existing fields ...
  accountStatus: accountStatusValidator,
  deletedAt: v.optional(v.number()), // Timestamp when account was deleted
  // ... rest of fields ...
});
```

#### Deletion Process Flow

```typescript
// convex/user.ts
export const softDeleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, { clerkId: args.clerkId });
    if (!user) return;

    // 1. Anonymize user record
    await ctx.db.patch(user._id, {
      accountStatus: AccountStatuses.DELETED,
      deletedAt: Date.now(),
      email: null,
      phone_number: null,
      first_name: null,
      last_name: null,
      payment_customer_id: null,
      notificationSettings: null,
      // Preserve display name and photo for UI continuity
      displayName: user.first_name
        ? `${user.first_name} (Deleted)`
        : "Deleted User",
    });

    // 2. Anonymize social profile
    if (user.socialProfile) {
      await ctx.db.patch(user._id, {
        socialProfile: {
          bio: null,
          photos: [], // Remove all photos
          current_photo_url: null,
        },
      });
    }

    // 3. Anonymize host profile
    if (user.hostProfile) {
      await ctx.db.patch(user._id, {
        hostProfile: {
          ...user.hostProfile,
          host_name: "Deleted Host",
          host_bio: null,
          photos: [], // Remove all photos
        },
      });
    }

    // 4. Clean up related data
    await ctx.runMutation(internal.cleanup.deleteUserData, {
      userId: user._id,
    });
  },
});
```

#### Related Data Cleanup

```typescript
// convex/cleanup.ts
export const deleteUserData = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Remove payment methods from Stripe
    await ctx.runAction(internal.stripe.deleteCustomer, {
      userId: args.userId,
    });

    // Clear notifications
    await ctx.runMutation(internal.notifications.clearUserNotifications, {
      userId: args.userId,
    });

    // Anonymize event participation (keep event IDs but remove personal context)
    await ctx.runMutation(internal.events.anonymizeUserParticipation, {
      userId: args.userId,
    });

    // Anonymize connections (maintain connection records)
    await ctx.runMutation(internal.connections.anonymizeUserConnections, {
      userId: args.userId,
    });
  },
});
```

### UI/UX Implications

#### Memory Book Display

```typescript
// When displaying connections with deleted users
const getDisplayName = (user: User) => {
  if (user.accountStatus === AccountStatuses.DELETED) {
    return user.displayName || "User has deactivated their account";
  }
  return user.first_name || "Unknown User";
};
```

#### Event History

- Past events show "Deleted User" instead of broken references
- Event statistics remain accurate
- Host ratings are preserved but anonymized

#### Search & Discovery

- Deleted users are excluded from all discovery features
- Search results filter out deleted accounts
- Matching algorithm ignores deleted users

### Legal & Compliance Considerations

#### GDPR Compliance

- **Right to be Forgotten**: Personal data is immediately removed
- **Data Minimization**: Only essential platform data is retained
- **Transparency**: Clear documentation of what data is retained and why

#### Data Retention Policy

- **Personal Data**: Removed immediately upon deletion
- **Platform Data**: Retained indefinitely for platform integrity
- **Analytics Data**: Anonymized and retained for platform improvement

#### Audit Trail

- Deletion timestamp is recorded for compliance
- Reason for retention is documented
- Process is automated and auditable

### Alternative Approaches Considered

#### Hard Delete with Ghost Records

```typescript
// Alternative: Create minimal ghost records
{
  _id: "ghost_user_123",
  originalUserId: "user_123",
  type: "deleted_user",
  displayName: "Deleted User",
  profileImage: "default_deleted_avatar.png"
}
```

**Pros**: Complete data removal, simpler implementation
**Cons**: More complex referential integrity, potential for orphaned records

#### Complete Hard Delete

**Pros**: Maximum privacy, simplest compliance
**Cons**: Breaks platform integrity, poor user experience, complex data cleanup

### Monitoring & Analytics

#### Deletion Metrics

- Track deletion rates and reasons
- Monitor user feedback about deletion process
- Analyze impact on platform engagement

#### Data Integrity Checks

- Regular audits of deleted user records
- Verification that personal data is properly removed
- Validation of referential integrity

---

## `users`

**Purpose:** The `users` collection is the aggregate root for all user-related data. It combines private account information, public-facing profiles for both "social" and "host" roles, system settings, and internal metrics into a single document. This model is optimized to fetch all necessary user data in a single read and uses the presence of the `socialProfile` or `hostProfile` embedded objects to determine a user's role.

**Key Attributes:**

- `clerkId`: `string` - The user's unique ID from Clerk, linking the Convex user to the master authentication record. (Indexed)
- `accountStatus`: `string` - The lifecycle status of the account itself (e.g., `'active'`, `'paused'`, `'deleted'`).
- `deletedAt`: `number` - Timestamp when account was deleted (only present for deleted accounts)
- `onboardingState`: `string` - Tracks the user's progress through initial setup flows (e.g., `'needs_role_selection'`, `'completed'`).
- `active_role`: `string` - For users with both social and host profiles, this stores their currently active UI context ('social' or 'host').
- `socialProfile`: `object` - An embedded object containing the user's public-facing participant profile.
- `hostProfile`: `object` - An embedded object containing the user's public-facing host profile.
- `payment_customer_id`: `string` - The user's Stripe Customer ID for processing payments.
- `interestVectors`: `array` - An array of vector embeddings representing the user's calculated interests.
- `notificationSettings`: `object` - An embedded object for managing all user-facing notification preferences.

**TypeScript Interface:**

```typescript
interface User {
  _id: Id<"users">;
  clerkId: string;
  phone_number?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  birth_date: number;
  is_verified: boolean;
  accountStatus: "active" | "paused" | "deleted";
  deletedAt?: number; // Only present for deleted accounts
  onboardingState:
    | "needs_role_selection"
    | "needs_social_profile"
    | "needs_host_profile"
    | "completed";
  active_role: "social" | "host";
  last_active_at: number;
  user_number: number;
  payment_customer_id?: string;
  min_lead_time_days?: number;
  availability_preferences?: object; // Simplified for brevity
  distance_preference?: number;
  price_sensitivity?: number;
  person_attraction_vector?: number[];
  socialProfile?: object; // See socialProfile interface
  hostProfile?: object; // See hostProfile interface
  internalMetrics?: object;
  interestVectors?: object[];
  socialLinks?: object[];
  notificationSettings: object;
  contextualNudges?: object;
}
```

**Relationships:**

- A **User** can be a **Host** of many **Events**. (`events.hostId` -> `users._id`)
- A **User** can have many **Invitations**. (`invitations.userId` -> `users._id`)
- A **User** can have many **Connections** (Memory Book entries). (`connections.userIds` includes `users._id`)

## `events`

**Purpose:** The `events` collection is the central entity for any gathering organized on the platform. It acts as the aggregate root for an event's core details (like title, status, and fees), its multi-stop itinerary, and any collaborators. The `event_vector` is a key component used for matching the event's "vibe" with user interests.

**Key Attributes:**

- `hostId`: `Id<"users">` - A reference to the user who created and owns the event.
- `title`: `string` - The public title of the event.
- `description`: `string` - A detailed description of the event activities.
- `status`: `string` - The current lifecycle status of the event (e.g., `'draft'`, `'published'`, `'completed'`, `'cancelled'`).
- `event_vector`: `array` - A vector embedding used by the matching algorithm to represent the event's conceptual "vibe".
- `itinerary`: `array` - An embedded array of objects, where each object represents a stop in the event, complete with location, time, and description.
- `confirmation_fee`: `number` - The fee (in cents) a participant must pay to confirm their attendance.

**TypeScript Interface:**

```typescript
interface Event {
  _id: Id<"events">;
  hostId: Id<"users">;
  title: string;
  description: string;
  event_vector: number[];
  status:
    | "draft"
    | "published"
    | "completed"
    | "cancelled"
    | "cancelled_by_host";
  min_attendees: number;
  max_attendees: number;
  age_min?: number;
  age_max?: number;
  arrival_signpost?: string;
  confirmation_fee: number;
  estimated_event_cost?: any; // JSON object for cost details
  itinerary: ItineraryStop[];
  collaborators?: Collaborator[];
  event_summary?: EventSummary;
}

interface ItineraryStop {
  location_id: Id<"locations">;
  order: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
}
```

**Relationships:**

- An **Event** belongs to one **Host** (`User`). (`events.hostId` -> `users._id`)
- An **Event** has one or more **Itinerary Stops**, each linked to a **Location**. (`itinerary.location_id` -> `locations._id`)
- An **Event** can have many **Invitations** sent out to users. (`invitations.eventId` -> `events._id`)
- An **Event** can have many **Attendees**. (`attendance.eventId` -> `events._id`)

## `locations`

**Purpose:** Stores structured data for all physical locations used in event itineraries. This collection is optimized for efficient geospatial queries, enabling the system to quickly find events within a user's specified travel radius.

**Key Attributes:**

- `name`: `string` - The public name of the location.
- `latitude`: `number` - The latitude coordinate, required for geospatial indexing.
- `longitude`: `number` - The longitude coordinate, required for geospatial indexing.
- `google_place_id`: `string` - The unique identifier from the Google Places API, used to fetch rich details about commercial venues.

## `invitations`

**Purpose:** Tracks the relationship between a user and an event to which they have been invited. It records the status of the invitation (e.g., `pending`, `accepted`, `declined`), which is crucial for managing event rosters and sending appropriate reminders.

**Key Attributes:**

- `userId`: `Id<"users">` - A reference to the invited user.
- `eventId`: `Id<"events">` - A reference to the event.
- `status`: `string` - The current state of the invitation.
- `payment_intent_id`: `string` - The Stripe Payment Intent ID created when the user accepts the invitation and pays the confirmation fee.

## `connections`

**Purpose:** Represents the "Memory Book" feature, creating a persistent link between two users who have met at an event. This collection is the foundation of the post-event social graph, allowing users to reconnect, provide private feedback, and signal their interest in seeing each other at future events.

**Key Attributes:**

- `userIds`: `array` - An array containing the two `Id<"users">` who are connected.
- `eventId`: `Id<"events">` - A reference to the event where the connection was made.
- `status`: `string` - The current state of the connection (e.g., `active`, `blocked`).
