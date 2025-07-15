import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
    // Check if a location with the same Google Place ID or coordinates already exists.
    const existingLocation = await ctx.db
      .query("locations")
      .withIndex("by_position", (q) =>
        q.eq("latitude", args.latitude).eq("longitude", args.longitude)
      )
      .first();

    if (existingLocation) {
      return existingLocation._id;
    }

    // If no existing location is found, create a new one.
    const locationId = await ctx.db.insert("locations", {
      name: args.name,
      address: args.address,
      latitude: args.latitude,
      longitude: args.longitude,
      google_place_id: args.google_place_id,
    });

    return locationId;
  },
});
