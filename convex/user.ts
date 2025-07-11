import { v } from "convex/values";
import {
  internalMutation,
  query,
  internalQuery,
  QueryCtx,
  mutation,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { UserStatuses } from "./schema";

// Retrieves the database record for the currently authenticated user.
// The name `me` is a common convention for API endpoints that return data
// for the currently authenticated user.
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

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    phone_number: v.optional(v.string()),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      phone_number: args.phone_number,
      email: args.email,
      first_name: args.firstName,
      last_name: args.lastName,
      tokenIdentifier: args.tokenIdentifier,
      status: UserStatuses.PENDING_ONBOARDING,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, { clerkId: args.clerkId });

    if (user === null) {
      throw new Error("User not found, cannot update");
    }

    await ctx.db.patch(user._id, {
      email: args.email,
      phone_number: args.phone_number,
      first_name: args.firstName,
      last_name: args.lastName,
    });
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, { clerkId: args.clerkId });

    if (user === null) {
      console.warn("User not found, cannot delete");
      return;
    }

    await ctx.db.delete(user._id);
  },
});

export const pauseAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called pauseAccount without authentication present");
    }

    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });
    if (user === null) {
      throw new Error("User not found, cannot pause account");
    }

    await ctx.db.patch(user._id, {
      status: UserStatuses.PAUSED,
    });
  },
});

export const unpauseAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called unpauseAccount without authentication present");
    }

    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });
    if (user === null) {
      throw new Error("User not found, cannot unpause account");
    }

    await ctx.db.patch(user._id, {
      status: UserStatuses.ACTIVE,
    });
  },
});

export const addProfilePhoto = mutation({
  args: {
    storageId: v.string(),
    isAuthentic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called addProfilePhoto without authentication present");
    }

    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });
    if (user === null) {
      throw new Error("User not found, cannot add profile photo");
    }

    if (!user.socialProfile) {
      throw new Error("User has no social profile, cannot add photo");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (url === null) {
      throw new Error("Could not get file URL for storageId");
    }

    const now = Date.now();
    let authentic_expires_at: number | undefined = undefined;
    if (args.isAuthentic) {
      // 12 months in milliseconds (approximate)
      const twelveMonths = 12 * 30 * 24 * 60 * 60 * 1000;
      authentic_expires_at = now + twelveMonths;
    }

    const newPhoto = {
      storageId: args.storageId,
      url: url,
      is_authentic: args.isAuthentic,
      created_at: now,
      authentic_expires_at: authentic_expires_at,
    };

    await ctx.db.patch(user._id, {
      status: UserStatuses.ACTIVE,
      socialProfile: {
        ...user.socialProfile,
        photos: [...user.socialProfile.photos, newPhoto],
        current_photo_url: url,
      },
    });
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        "Called completeOnboarding without authentication present"
      );
    }

    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });

    if (user === null) {
      throw new Error("User not found, cannot complete onboarding");
    }

    await ctx.db.patch(user._id, {
      status: UserStatuses.ACTIVE,
    });
  },
});
