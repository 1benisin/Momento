import {v} from 'convex/values'
import {mutation} from './_generated/server'

/**
 * Gets the ID of a location if it exists, otherwise creates a new location document.
 * This ensures that the same location is not duplicated in the database.
 *
 * @param {string} name - The name of the location.
 * @param {string} [address] - The address of the location.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @param {string} [google_place_id] - The Google Place ID of the location.
 * @returns {Promise<Id<"locations">>} The ID of the existing or newly created location.
 */
export const getOrCreateLocation = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    google_place_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Prioritize lookup by Google Place ID for accuracy
    if (args.google_place_id) {
      const existingByGoogleId = await ctx.db
        .query('locations')
        .withIndex('by_google_place_id', q =>
          q.eq('google_place_id', args.google_place_id),
        )
        .first()
      if (existingByGoogleId) {
        return existingByGoogleId._id
      }
    }

    // 2. Fallback to lookup by coordinates for pinned locations or missing Google IDs
    const existingByCoords = await ctx.db
      .query('locations')
      .withIndex('by_position', q =>
        q.eq('latitude', args.latitude).eq('longitude', args.longitude),
      )
      .first()

    if (existingByCoords) {
      // If found by coords, and we have a google_place_id, patch it in for future lookups
      if (args.google_place_id && !existingByCoords.google_place_id) {
        await ctx.db.patch(existingByCoords._id, {
          google_place_id: args.google_place_id,
        })
      }
      return existingByCoords._id
    }

    // 3. If no existing location is found by either method, create a new one.
    const locationId = await ctx.db.insert('locations', {
      name: args.name,
      address: args.address,
      latitude: args.latitude,
      longitude: args.longitude,
      google_place_id: args.google_place_id,
    })

    return locationId
  },
})
