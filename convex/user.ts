import { v } from "convex/values";
import {
  internalMutation,
  query,
  internalQuery,
  QueryCtx,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });
    if (!user) {
      return null;
    }
    return user;
  },
});

export const getUser = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: getUserByClerkId,
});

async function getUserByClerkId(
  ctx: QueryCtx,
  { clerkId }: { clerkId: string }
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

// Note: You might want to use a more descriptive function name
// like `ensureUser` or `syncUserFromClerk`.
export const store = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called store an user without authentication present");
    }

    // Check if we've already stored this user
    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });

    if (user !== null) {
      // If we've seen this user before, just return their ID
      return user._id;
    }

    // If it's a new user, create a new document
    // and include their phone number from the Clerk token.
    const userId = await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject,
      phone_number: identity.phoneNumber!,
    });

    return userId;
  },
});

export const create = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    phone_number: v.optional(v.string()),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

export const update = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    phone_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, { clerkId: args.clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      phone_number: args.phone_number,
    });
  },
});
