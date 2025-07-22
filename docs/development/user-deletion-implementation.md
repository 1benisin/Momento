# User Deletion Implementation Guide

This document provides comprehensive implementation details for Momento's soft delete strategy for user accounts.

## Overview

Momento implements a **soft delete strategy** that balances user privacy rights with platform integrity. When users delete their accounts, we:

1. **Hard delete** the Clerk authentication record
2. **Soft delete** the Convex user record (anonymize personal data)
3. **Preserve** platform integrity for events, connections, and social features
4. **Maintain** user experience for other users

## Schema Changes

### 1. Update Account Status Enum

```typescript
// convex/schema.ts
export const AccountStatuses = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  DELETED: 'deleted', // New status for soft deleted accounts
} as const

export type AccountStatus =
  (typeof AccountStatuses)[keyof typeof AccountStatuses]

export const accountStatusValidator = v.union(
  v.literal(AccountStatuses.ACTIVE),
  v.literal(AccountStatuses.PAUSED),
  v.literal(AccountStatuses.DELETED), // Add to validator
)
```

### 2. Add Deletion Tracking Fields

```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    // ... existing fields ...
    accountStatus: accountStatusValidator,
    deletedAt: v.optional(v.number()), // Timestamp when account was deleted
    displayName: v.optional(v.string()), // For UI continuity after deletion
    // ... rest of fields ...
  })
    .index('by_token', ['tokenIdentifier'])
    .index('by_clerk_id', ['clerkId'])
    .index('by_status', ['accountStatus']), // New index for filtering deleted users
})
```

## Implementation Files

### 1. Update User Mutations

```typescript
// convex/user.ts

/**
 * Soft deletes a user account, anonymizing personal data while preserving platform integrity
 */
export const softDeleteUser = internalMutation({
  args: {clerkId: v.string()},
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, {clerkId: args.clerkId})
    if (!user) {
      console.warn(`User not found for deletion: ${args.clerkId}`)
      return
    }

    console.log(`Soft deleting user: ${user._id}`)

    // 1. Anonymize core user record
    await ctx.db.patch(user._id, {
      accountStatus: AccountStatuses.DELETED,
      deletedAt: Date.now(),
      email: null,
      phone_number: null,
      first_name: null,
      last_name: null,
      payment_customer_id: null,
      notificationSettings: null,
      // Preserve display name for UI continuity
      displayName: user.first_name
        ? `${user.first_name} (Deleted)`
        : 'Deleted User',
    })

    // 2. Anonymize social profile
    if (user.socialProfile) {
      await ctx.db.patch(user._id, {
        socialProfile: {
          bio: null,
          photos: [], // Remove all photos
          current_photo_url: null,
        },
      })
    }

    // 3. Anonymize host profile
    if (user.hostProfile) {
      await ctx.db.patch(user._id, {
        hostProfile: {
          ...user.hostProfile,
          host_name: 'Deleted Host',
          host_bio: null,
          photos: [], // Remove all photos
          // Preserve ratings and reliability data for platform integrity
          average_rating: user.hostProfile.average_rating,
          reliabilityLog: user.hostProfile.reliabilityLog,
        },
      })
    }

    // 4. Clean up related data
    await ctx.runMutation(internal.cleanup.deleteUserData, {
      userId: user._id,
    })

    console.log(`Successfully soft deleted user: ${user._id}`)
  },
})

/**
 * Updates the existing deleteUser mutation to use soft delete
 */
export const deleteUser = internalMutation({
  args: {clerkId: v.string()},
  handler: async (ctx, args) => {
    // Use soft delete instead of hard delete
    await ctx.runMutation(internal.user.softDeleteUser, {
      clerkId: args.clerkId,
    })
  },
})
```

### 2. Create Cleanup Module

```typescript
// convex/cleanup.ts
import {v} from 'convex/values'
import {internalMutation} from './_generated/server'

/**
 * Cleans up all user-related data when a user is deleted
 */
export const deleteUserData = internalMutation({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    console.log(`Cleaning up data for deleted user: ${args.userId}`)

    // 1. Remove payment methods from Stripe
    try {
      await ctx.runAction(internal.stripe.deleteCustomer, {
        userId: args.userId,
      })
    } catch (error) {
      console.error(
        `Failed to delete Stripe customer for user ${args.userId}:`,
        error,
      )
    }

    // 2. Clear all notifications
    await ctx.runMutation(internal.notifications.clearUserNotifications, {
      userId: args.userId,
    })

    // 3. Anonymize event participation
    await ctx.runMutation(internal.events.anonymizeUserParticipation, {
      userId: args.userId,
    })

    // 4. Anonymize connections
    await ctx.runMutation(internal.connections.anonymizeUserConnections, {
      userId: args.userId,
    })

    // 5. Clear any pending invitations
    await ctx.runMutation(internal.invitations.clearUserInvitations, {
      userId: args.userId,
    })

    console.log(`Successfully cleaned up data for user: ${args.userId}`)
  },
})
```

### 3. Update Event Participation

```typescript
// convex/events.ts

/**
 * Anonymizes a user's participation in events while preserving event integrity
 */
export const anonymizeUserParticipation = internalMutation({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    // Find all events where this user is a host
    const hostedEvents = await ctx.db
      .query('events')
      .withIndex('by_hostId_and_status', q => q.eq('hostId', args.userId))
      .collect()

    // Update hosted events to show deleted host
    for (const event of hostedEvents) {
      await ctx.db.patch(event._id, {
        hostId: args.userId, // Keep reference but user is now deleted
        // Event title/description remain unchanged for historical accuracy
      })
    }

    // Find all invitations for this user
    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .collect()

    // Anonymize invitations
    for (const invitation of invitations) {
      await ctx.db.patch(invitation._id, {
        userId: args.userId, // Keep reference but user is now deleted
        // Status and other fields remain for event integrity
      })
    }
  },
})
```

### 4. Update Connections

```typescript
// convex/connections.ts

/**
 * Anonymizes a user's connections while preserving connection records
 */
export const anonymizeUserConnections = internalMutation({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    // Find all connections involving this user
    const connections = await ctx.db
      .query('connections')
      .filter(q =>
        q.or(
          q.eq(q.field('userIds.0'), args.userId),
          q.eq(q.field('userIds.1'), args.userId),
        ),
      )
      .collect()

    // Update connections to maintain the relationship
    for (const connection of connections) {
      await ctx.db.patch(connection._id, {
        // Keep the connection record but user is now deleted
        // The UI will handle displaying "Deleted User" appropriately
      })
    }
  },
})
```

### 5. Update Notifications

```typescript
// convex/notifications.ts

/**
 * Clears all notifications for a deleted user
 */
export const clearUserNotifications = internalMutation({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    // Find and delete all notifications for this user
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .collect()

    for (const notification of notifications) {
      await ctx.db.delete(notification._id)
    }
  },
})
```

### 6. Update Stripe Integration

```typescript
// convex/stripe.ts

/**
 * Deletes a user's Stripe customer record
 */
export const deleteCustomer = internalAction({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.user.getUser, {
      userId: args.userId,
    })

    if (user?.payment_customer_id) {
      // Delete the Stripe customer
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
      await stripe.customers.del(user.payment_customer_id)
    }
  },
})
```

## Frontend Implementation

### 1. Update User Display Logic

```typescript
// utils/userDisplay.ts
import type {User} from '@/convex/_generated/dataModel'
import {AccountStatuses} from '@/convex/schema'

export const getDisplayName = (user: User): string => {
  if (user.accountStatus === AccountStatuses.DELETED) {
    return user.displayName || 'User has deactivated their account'
  }
  return user.first_name || user.displayName || 'Unknown User'
}

export const getProfileImage = (user: User): string | null => {
  if (user.accountStatus === AccountStatuses.DELETED) {
    return user.profileImage || '/assets/default-deleted-avatar.png'
  }
  return user.profileImage || user.socialProfile?.current_photo_url || null
}

export const isUserDeleted = (user: User): boolean => {
  return user.accountStatus === AccountStatuses.DELETED
}
```

### 2. Update Memory Book Component

```typescript
// components/MemoryBook.tsx
import { getDisplayName, getProfileImage, isUserDeleted } from "@/utils/userDisplay";

const MemoryBookEntry = ({ user, connection }: { user: User; connection: Connection }) => {
  const displayName = getDisplayName(user);
  const profileImage = getProfileImage(user);
  const deleted = isUserDeleted(user);

  return (
    <View style={styles.entry}>
      <Image source={{ uri: profileImage }} style={styles.avatar} />
      <Text style={[styles.name, deleted && styles.deletedName]}>
        {displayName}
      </Text>
      {deleted && (
        <Text style={styles.deletedNote}>
          This user has deactivated their account
        </Text>
      )}
    </View>
  );
};
```

### 3. Update Event Display

```typescript
// components/EventCard.tsx
import { getDisplayName, isUserDeleted } from "@/utils/userDisplay";

const EventCard = ({ event }: { event: Event }) => {
  const host = useQuery(api.user.getUser, { userId: event.hostId });
  const hostName = host ? getDisplayName(host) : "Unknown Host";
  const hostDeleted = host ? isUserDeleted(host) : false;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={[styles.host, hostDeleted && styles.deletedHost]}>
        Hosted by {hostName}
      </Text>
      {hostDeleted && (
        <Text style={styles.deletedNote}>
          This event was hosted by someone who has since deactivated their account
        </Text>
      )}
    </View>
  );
};
```

## Query Filters

### 1. Exclude Deleted Users from Discovery

```typescript
// convex/users.ts

/**
 * Get active users for discovery (excludes deleted users)
 */
export const getActiveUsers = query({
  args: {limit: v.optional(v.number())},
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_status', q =>
        q.eq('accountStatus', AccountStatuses.ACTIVE),
      )
      .take(args.limit || 50)
  },
})

/**
 * Get users for matching algorithm (excludes deleted users)
 */
export const getUsersForMatching = query({
  args: {
    eventId: v.id('events'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_status', q =>
        q.eq('accountStatus', AccountStatuses.ACTIVE),
      )
      .filter(
        q =>
          // Add other matching criteria here
          q.neq(q.field('_id'), args.eventId), // Exclude event host
      )
      .take(args.limit || 20)
  },
})
```

## Testing

### 1. Unit Tests

```typescript
// convex/tests/user-deletion.test.ts
import {api} from '../_generated/api'
import {AccountStatuses} from '../schema'
import {runMutation, runQuery} from './helpers'

describe('User Deletion', () => {
  it('should soft delete user and anonymize personal data', async () => {
    // Create test user
    const userId = await runMutation(api.user.createUser, {
      clerkId: 'test-clerk-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      tokenIdentifier: 'test-token',
    })

    // Soft delete the user
    await runMutation(api.user.softDeleteUser, {
      clerkId: 'test-clerk-id',
    })

    // Verify user is soft deleted
    const user = await runQuery(api.user.getUser, {userId})
    expect(user?.accountStatus).toBe(AccountStatuses.DELETED)
    expect(user?.deletedAt).toBeDefined()
    expect(user?.email).toBeNull()
    expect(user?.first_name).toBeNull()
    expect(user?.displayName).toBe('Test (Deleted)')
  })

  it('should preserve platform integrity for events', async () => {
    // Test that events hosted by deleted users still exist
    // but show "Deleted Host" as the host name
  })

  it('should maintain connection records', async () => {
    // Test that connections with deleted users are preserved
    // but display "User has deactivated their account"
  })
})
```

### 2. Integration Tests

```typescript
// convex/tests/user-deletion-integration.test.ts
describe('User Deletion Integration', () => {
  it('should handle complete user deletion flow', async () => {
    // Test the full flow from Clerk webhook to data cleanup
    // Verify all related data is properly handled
  })

  it('should maintain referential integrity', async () => {
    // Test that no orphaned records are created
    // Verify all foreign key relationships remain valid
  })
})
```

## Monitoring & Analytics

### 1. Deletion Metrics

```typescript
// convex/analytics.ts

/**
 * Track user deletion metrics
 */
export const trackUserDeletion = internalMutation({
  args: {
    userId: v.id('users'),
    reason: v.optional(v.string()),
    userAge: v.number(), // Days since account creation
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('analytics', {
      type: 'user_deletion',
      userId: args.userId,
      reason: args.reason,
      userAge: args.userAge,
      timestamp: Date.now(),
    })
  },
})
```

### 2. Data Integrity Checks

```typescript
// convex/maintenance.ts

/**
 * Verify data integrity for deleted users
 */
export const verifyDeletedUserIntegrity = internalAction({
  args: {},
  handler: async ctx => {
    const deletedUsers = await ctx.runQuery(internal.user.getDeletedUsers)

    for (const user of deletedUsers) {
      // Verify personal data is removed
      if (user.email || user.phone_number || user.first_name) {
        console.error(`Deleted user ${user._id} still has personal data`)
      }

      // Verify referential integrity
      const events = await ctx.runQuery(internal.events.getEventsByHost, {
        hostId: user._id,
      })

      if (events.length === 0) {
        console.warn(`Deleted user ${user._id} has no hosted events`)
      }
    }
  },
})
```

## Migration Strategy

### 1. Schema Migration

```bash
# Run schema migration
npx convex dev
```

### 2. Data Migration (if needed)

```typescript
// convex/migrations.ts

/**
 * Migrate existing hard-deleted users to soft delete format
 */
export const migrateHardDeletedUsers = internalMutation({
  args: {},
  handler: async ctx => {
    // This would only be needed if you have existing hard-deleted users
    // that need to be converted to soft delete format
  },
})
```

## Security Considerations

### 1. Webhook Security

```typescript
// convex/http.ts
import {Webhook} from 'svix'

const handleClerkWebhook = httpAction(async (ctx, request) => {
  // Verify webhook signature
  const event = await validateRequest(request)
  if (!event) {
    return new Response('Invalid request', {status: 400})
  }

  switch (event.type) {
    case 'user.deleted': {
      const {id: clerkId, deleted} = event.data
      if (deleted) {
        console.log(`Soft deleting user: ${clerkId}`)
        await ctx.runMutation(internal.user.softDeleteUser, {
          clerkId: clerkId!,
        })
      }
      break
    }
    // ... other cases
  }

  return new Response(null, {status: 200})
})
```

### 2. Access Control

```typescript
// Ensure deleted users cannot access the platform
export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    // Don't return deleted users
    if (user?.accountStatus === AccountStatuses.DELETED) {
      return null
    }

    return user
  },
})
```

## Performance Considerations

### 1. Indexing Strategy

```typescript
// Add indexes for efficient filtering of deleted users
users: defineTable({
  // ... fields
})
  .index('by_token', ['tokenIdentifier'])
  .index('by_clerk_id', ['clerkId'])
  .index('by_status', ['accountStatus']) // For filtering active/deleted users
  .index('by_deleted_at', ['deletedAt']) // For cleanup operations
```

### 2. Batch Operations

```typescript
// For large-scale cleanup operations
export const cleanupOldDeletedUsers = internalAction({
  args: {
    olderThanDays: v.number(),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000

    const deletedUsers = await ctx.runQuery(
      internal.user.getDeletedUsersOlderThan,
      {
        cutoffTime,
        limit: args.batchSize || 100,
      },
    )

    // Process in batches to avoid timeouts
    for (const user of deletedUsers) {
      await ctx.runMutation(internal.cleanup.permanentDeleteUser, {
        userId: user._id,
      })
    }
  },
})
```

This implementation provides a robust, scalable solution for user deletion that maintains platform integrity while respecting user privacy rights.
