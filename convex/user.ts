import {v} from 'convex/values'
import {
  internalMutation,
  query,
  internalQuery,
  QueryCtx,
  mutation,
} from './_generated/server'
import {Doc} from './_generated/dataModel'
import {AccountStatuses, UserRoles, userRoleValidator, UserRole} from './schema'
import {devLog} from '../utils/devLog'

/**
 * Retrieves the database record for the currently authenticated user.
 * The name `me` is a common convention for API endpoints that return data
 * for the currently authenticated user.
 */
export const me = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }
    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (!user) {
      return null
    }
    return user
  },
})

/**
 * Ensures a user record exists for the currently authenticated user.
 *
 * This mutation is idempotent, meaning it can be called multiple times without
 * creating duplicate users. It's designed to be called from the client-side
 * immediately after authentication to guarantee that a user record exists in
 * the database before the application proceeds.
 *
 * 1. It retrieves the user's identity from the authentication context (Clerk).
 * 2. It checks if a user with that `tokenIdentifier` already exists.
 * 3. If the user exists, it does nothing.
 * 4. If the user does not exist, it creates a new user record with default
 *    values, preparing them for the onboarding flow.
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called storeUser without authentication present')
    }

    // Check if we've already stored this user.
    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (user !== null) {
      // If we've seen this user before, we don't need to do anything.
      // We can just return the user's ID.
      return user._id
    }

    // If it's a new user, create a new record.
    const newUser = await ctx.db.insert('users', {
      clerkId: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      first_name: identity.givenName,
      last_name: identity.familyName,
      accountStatus: AccountStatuses.ACTIVE,
    })

    return newUser
  },
})

/**
 * Retrieves a user by their Clerk ID.
 * This is an internal query, designed to be called from other backend functions.
 */
export const getUser = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: getUserByClerkId,
})

/**
 * Helper function to retrieve a user document by their Clerk ID.
 * @param ctx - The query context.
 * @param { clerkId } - The Clerk ID of the user to fetch.
 * @returns A promise that resolves to the user document or null if not found.
 */
async function getUserByClerkId(
  ctx: QueryCtx,
  {clerkId}: {clerkId: string},
): Promise<Doc<'users'> | null> {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerkId', clerkId))
    .unique()
}

/**
 * Creates a new user record in the database.
 * This is an internal mutation that should only be called by a trusted source,
 * like the Clerk webhook that fires upon user creation.
 */
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
    await ctx.db.insert('users', {
      clerkId: args.clerkId,
      phone_number: args.phone_number,
      email: args.email,
      first_name: args.firstName,
      last_name: args.lastName,
      tokenIdentifier: args.tokenIdentifier,
      accountStatus: AccountStatuses.ACTIVE,
    })
  },
})

/**
 * Updates an existing user's profile information.
 * This is an internal mutation designed to be called from the Clerk webhook
 * when a user updates their data in their Clerk-hosted profile.
 */
export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, {clerkId: args.clerkId})

    if (user === null) {
      throw new Error('User not found, cannot update')
    }

    await ctx.db.patch(user._id, {
      email: args.email,
      phone_number: args.phone_number,
      first_name: args.firstName,
      last_name: args.lastName,
    })
  },
})

export const updateVerificationStatus = internalMutation({
  args: {
    userId: v.id('users'),
    isVerified: v.boolean(),
    sessionId: v.string(),
    verificationData: v.optional(v.any()),
    verificationStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user || !user.hostProfile) {
      throw new Error('User or host profile not found')
    }

    const hostProfile = {...user.hostProfile}

    await ctx.db.patch(user._id, {
      hostProfile: {
        ...hostProfile,
        is_verified: args.isVerified,
        verification_session_id: args.sessionId,
        verification_data: args.verificationData,
        verification_status: args.verificationStatus,
        verification_completed_at: args.isVerified ? Date.now() : undefined,
      },
    })

    devLog('User verification status updated', {
      userId: args.userId,
      isVerified: args.isVerified,
      status: args.verificationStatus,
    })
  },
})

/**
 * Deletes a user from the database.
 * This is an internal mutation that should only be called by the Clerk webhook
 * that fires when a user is deleted from the Clerk service.
 */
export const deleteUser = internalMutation({
  args: {clerkId: v.string()},
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, {clerkId: args.clerkId})

    if (user === null) {
      console.warn('User not found, cannot delete')
      return
    }

    await ctx.db.delete(user._id)
  },
})

/**
 * Sets a user's account status to 'paused' (hibernation mode).
 * A paused user is socially invisible but can still access their data.
 */
export const pauseAccount = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called pauseAccount without authentication present')
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot pause account')
    }

    await ctx.db.patch(user._id, {
      accountStatus: AccountStatuses.PAUSED,
    })
  },
})

/**
 * Reactivates a paused user's account, setting their status to 'active'.
 */
export const unpauseAccount = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called unpauseAccount without authentication present')
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot unpause account')
    }

    await ctx.db.patch(user._id, {
      accountStatus: AccountStatuses.ACTIVE,
    })
  },
})

/**
 * Adds a new photo to a user's social profile.
 * It also calculates the expiration date for the 'Authentic' badge if applicable.
 */
export const addProfilePhoto = mutation({
  args: {
    storageId: v.id('_storage'),
    isAuthentic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called addProfilePhoto without authentication present')
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot add profile photo')
    }

    if (!user.socialProfile) {
      throw new Error('User has no social profile, cannot add photo')
    }

    const url = await ctx.storage.getUrl(args.storageId)
    if (url === null) {
      throw new Error('Could not get file URL for storageId')
    }

    const now = Date.now()
    let authentic_expires_at: number | undefined = undefined
    if (args.isAuthentic) {
      // 12 months in milliseconds (approximate)
      const twelveMonths = 12 * 30 * 24 * 60 * 60 * 1000
      authentic_expires_at = now + twelveMonths
    }

    const newPhoto = {
      storageId: args.storageId,
      url: url,
      is_authentic: args.isAuthentic,
      created_at: now,
      authentic_expires_at: authentic_expires_at,
    }

    await ctx.db.patch(user._id, {
      socialProfile: {
        ...user.socialProfile,
        photos: [...user.socialProfile.photos, newPhoto],
        current_photo_url: url,
      },
    })
  },
})

/**
 * Creates and populates the `hostProfile` object for a user, completing
 * the host onboarding flow for them.
 */
export const createHostProfile = mutation({
  args: {
    hostProfile: v.object({
      host_name: v.string(),
      host_bio: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called createHostProfile without authentication present')
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot create host profile')
    }

    // If the user is a pure social user, set their active role to host.
    // Otherwise, we can assume it was set by the ModeSwitcher.
    let active_role: UserRole | undefined = undefined
    if (!user.hostProfile) {
      active_role = UserRoles.HOST
    }

    await ctx.db.patch(user._id, {
      active_role,
      hostProfile: {
        ...args.hostProfile,
        // TODO: Allow for 'community' host_type creation
        host_type: 'user',
      },
    })
  },
})

/**
 * Creates and populates the `socialProfile` object for a user, including their
 * initial profile photo. This completes their social onboarding.
 */
export const createSocialProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    initialPhoto: v.optional(
      v.object({
        storageId: v.id('_storage'),
        isAuthentic: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error(
        'Called createSocialProfile without authentication present',
      )
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot create social profile')
    }

    let photoData:
      | {
          photos: NonNullable<Doc<'users'>['socialProfile']>['photos']
          current_photo_url: string
        }
      | undefined = undefined

    if (args.initialPhoto) {
      const url = await ctx.storage.getUrl(args.initialPhoto.storageId)
      if (url === null) {
        throw new Error('Could not get file URL for storageId')
      }
      const now = Date.now()
      let authentic_expires_at: number | undefined = undefined
      if (args.initialPhoto.isAuthentic) {
        const twelveMonths = 12 * 30 * 24 * 60 * 60 * 1000
        authentic_expires_at = now + twelveMonths
      }
      const newPhoto = {
        storageId: args.initialPhoto.storageId,
        url: url,
        is_authentic: args.initialPhoto.isAuthentic,
        created_at: now,
        authentic_expires_at: authentic_expires_at,
      }
      photoData = {
        photos: [newPhoto],
        current_photo_url: url,
      }
    }

    await ctx.db.patch(user._id, {
      active_role: UserRoles.SOCIAL,
      socialProfile: {
        bio: args.bio,
        photos: photoData?.photos ?? [],
        current_photo_url: photoData?.current_photo_url,
      },
    })
  },
})

/**
 * Sets the active role for a hybrid user (one who is both a host and participant).
 * This controls which UI/UX is presented to the user.
 */
export const setActiveRole = mutation({
  args: {
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called setActiveRole without authentication present')
    }

    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})
    if (user === null) {
      throw new Error('User not found, cannot set active role')
    }

    await ctx.db.patch(user._id, {
      active_role: args.role,
    })
  },
})

export const logSignOut = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      // Not an error, just means we can't log the sign out
      devLog('logSignOut called without user identity.')
      return
    }
    const user = await getUserByClerkId(ctx, {clerkId: identity.subject})

    devLog('User signed out for security tracking', {
      userId: user?._id,
      clerkId: identity.subject,
      timestamp: new Date().toISOString(),
    })
  },
})
