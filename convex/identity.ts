/**
 * Stripe Identity verification functions
 * Handles identity verification for host onboarding
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  createVerificationSession,
  getVerificationSession,
} from "./lib/stripe";
import { devLog } from "../utils/devLog";

/**
 * Create a verification session for host identity verification
 */
export const createHostVerificationSession = mutation({
  args: {
    returnUrl: v.string(),
    type: v.union(v.literal("document"), v.literal("id_number")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.hostProfile) {
      throw new Error("User must have a host profile to verify identity");
    }

    devLog("[createHostVerificationSession] Creating verification session", {
      userId: user._id,
      type: args.type,
      returnUrl: args.returnUrl,
    });

    try {
      const session = await createVerificationSession({
        returnUrl: args.returnUrl,
        type: args.type,
        metadata: {
          userId: user._id,
          clerkId: user.clerkId,
          hostType: user.hostProfile.host_type,
        },
      });

      devLog("[createHostVerificationSession] Session created", {
        sessionId: session.id,
        status: session.status,
      });

      return {
        sessionId: session.id,
        clientSecret: session.clientSecret,
        status: session.status,
        url: session.url,
      };
    } catch (error) {
      devLog("[createHostVerificationSession] Error", error);
      throw new Error(`Verification session creation failed: ${error}`);
    }
  },
});

/**
 * Get verification session details
 */
export const getVerificationSessionDetails = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    try {
      const session = await getVerificationSession(args.sessionId);

      devLog("[getVerificationSessionDetails] Session retrieved", {
        sessionId: session.id,
        status: session.status,
      });

      return {
        id: session.id,
        status: session.status,
        verifiedOutputs: session.verifiedOutputs,
        lastError: session.lastError,
      };
    } catch (error) {
      devLog("[getVerificationSessionDetails] Error", error);
      throw new Error(`Verification session retrieval failed: ${error}`);
    }
  },
});

/**
 * Update user verification status after successful verification
 */
export const updateUserVerificationStatus = mutation({
  args: {
    sessionId: v.string(),
    isVerified: v.boolean(),
    verificationData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || !user.hostProfile) {
      throw new Error("User or user host profile not found");
    }

    devLog("[updateUserVerificationStatus] Updating verification status", {
      userId: user._id,
      sessionId: args.sessionId,
      isVerified: args.isVerified,
    });

    try {
      // Update user with verification status
      const hostProfile = { ...user.hostProfile };
      await ctx.db.patch(user._id, {
        hostProfile: {
          ...hostProfile,
          is_verified: args.isVerified,
          verification_session_id: args.sessionId,
          verification_data: args.verificationData,
          verification_completed_at: args.isVerified ? Date.now() : undefined,
        },
      });

      devLog("[updateUserVerificationStatus] User updated successfully", {
        userId: user._id,
        isVerified: args.isVerified,
      });

      return {
        success: true,
        isVerified: args.isVerified,
      };
    } catch (error) {
      devLog("[updateUserVerificationStatus] Error", error);
      throw new Error(`Verification status update failed: ${error}`);
    }
  },
});

/**
 * Check if user is verified for hosting
 */
export const isUserVerifiedForHosting = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const isVerified = user.hostProfile?.is_verified || false;

    devLog("[isUserVerifiedForHosting] Checking verification status", {
      userId: user._id,
      isVerified,
    });

    return {
      isVerified,
      hasHostProfile: !!user.hostProfile,
      verificationData: user.hostProfile?.verification_data,
    };
  },
});
