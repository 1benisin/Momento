import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const AccountStatuses = {
  ACTIVE: "active",
  PAUSED: "paused",
} as const;

export type AccountStatus =
  (typeof AccountStatuses)[keyof typeof AccountStatuses];

export const accountStatusValidator = v.union(
  v.literal(AccountStatuses.ACTIVE),
  v.literal(AccountStatuses.PAUSED)
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
    accountStatus: accountStatusValidator,
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

  locations: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    google_place_id: v.optional(v.string()),
  }).index("by_position", ["latitude", "longitude"]),

  events: defineTable({
    hostId: v.id("users"),
    title: v.string(),
    description: v.string(),
    event_vector: v.optional(v.array(v.float64())),
    status: v.string(), // 'draft', 'published', 'completed', 'cancelled'
    min_attendees: v.number(),
    max_attendees: v.number(),
    age_min: v.optional(v.number()),
    age_max: v.optional(v.number()),
    arrival_signpost: v.optional(v.string()),
    confirmation_fee: v.number(),
    estimated_event_cost: v.any(), // JSON object
    itinerary: v.array(
      v.object({
        location_id: v.id("locations"),
        order: v.number(),
        title: v.string(),
        description: v.string(),
        start_time: v.number(),
        end_time: v.number(),
      })
    ),
    collaborators: v.optional(
      v.array(
        v.object({
          userId: v.optional(v.id("users")),
          role: v.string(),
          first_name: v.string(),
        })
      )
    ),
    // event_summary object omitted for brevity
  }).index("by_hostId_and_status", ["hostId", "status"]),

  // Other tables from your original schema can go here
  // e.g. messages: defineTable({ ... })

  // The waitlist_users table is now removed.
});
