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
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject,
      phone_number: identity.phoneNumber!,
      status: UserStatuses.PENDING_ONBOARDING,
    });

    return userId;
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    phone_number: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      phone_number: args.phone_number,
      tokenIdentifier: args.tokenIdentifier,
      status: UserStatuses.PENDING_ONBOARDING,
    });
  },
});

export const createSocialProfile = mutation({
  args: {
    firstName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        "Called createSocialProfile without authentication present"
      );
    }

    const user = await getUserByClerkId(ctx, { clerkId: identity.subject });

    if (user === null) {
      throw new Error("User not found, cannot create social profile");
    }

    await ctx.db.patch(user._id, {
      socialProfile: {
        first_name: args.firstName,
        bio: args.bio,
        photos: [], // Initialize with empty photos array
      },
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
