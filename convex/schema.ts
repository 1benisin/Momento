import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const UserStatuses = {
  PENDING_ONBOARDING: "pending_onboarding",
  ACTIVE: "active",
  PAUSED: "paused",
} as const;

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const userStatusValidator = v.union(
  v.literal(UserStatuses.PENDING_ONBOARDING),
  v.literal(UserStatuses.ACTIVE),
  v.literal(UserStatuses.PAUSED)
);

export const UserRoles = {
  SOCIAL: "social",
  HOST: "host",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const userRoleValidator = v.union(
  v.literal(UserRoles.SOCIAL),
  v.literal(UserRoles.HOST)
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    phone_number: v.optional(v.string()),
    email: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    status: userStatusValidator,
    active_role: v.optional(userRoleValidator), // 'social' or 'host'

    hostProfile: v.optional(
      v.object({
        host_type: v.string(), // 'user' or 'community'
        host_name: v.string(),
        host_bio: v.string(),
        location_id: v.optional(v.id("locations")),
        address: v.optional(v.string()),
        website_url: v.optional(v.string()),
        average_rating: v.optional(v.number()),
        photos: v.optional(v.array(v.object({}))), // Define photo object later
        reliabilityLog: v.optional(v.array(v.object({}))), // Define log object later
        push_account_and_safety: v.optional(v.boolean()),
        email_account_and_safety: v.optional(v.boolean()),
      })
    ),

    socialProfile: v.optional(
      v.object({
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
