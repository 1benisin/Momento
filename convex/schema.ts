import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const UserStatuses = {
  PENDING_ONBOARDING: "pending_onboarding",
  ACTIVE: "active",
} as const;

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const userStatusValidator = v.union(
  v.literal(UserStatuses.PENDING_ONBOARDING),
  v.literal(UserStatuses.ACTIVE)
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    phone_number: v.string(),
    status: userStatusValidator,

    socialProfile: v.optional(
      v.object({
        first_name: v.string(),
        bio: v.optional(v.string()),
        photos: v.array(
          v.object({
            storageId: v.string(),
            url: v.string(),
            is_authentic: v.boolean(),
            created_at: v.number(),
            authentic_expires_at: v.optional(v.number()),
          })
        ),
        current_photo_url: v.optional(v.string()),
      })
    ),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"]),

  // Other tables from your original schema can go here
  // e.g. messages: defineTable({ ... })

  // The waitlist_users table is now removed.
});
