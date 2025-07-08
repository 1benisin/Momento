import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    phone_number: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"]),

  // Other tables from your original schema can go here
  // e.g. messages: defineTable({ ... })

  // The waitlist_users table is now removed.
});
