import {v} from 'convex/values'
import {mutation, query, internalQuery} from './_generated/server'
import {api} from './_generated/api'
import {Doc, Id} from './_generated/dataModel'

export const createOrUpdateDraft = mutation({
  args: {
    // Omitting id for creation, passing it for update
    id: v.optional(v.id('events')),
    title: v.string(),
    description: v.string(),
    min_attendees: v.number(),
    max_attendees: v.number(),
    age_min: v.optional(v.number()),
    age_max: v.optional(v.number()),
    arrival_signpost: v.optional(v.string()),
    estimated_event_cost: v.array(
      v.object({
        amount: v.number(),
        description: v.string(),
      }),
    ),
    itinerary: v.array(
      v.object({
        order: v.number(),
        title: v.string(),
        start_time: v.number(),
        end_time: v.optional(v.number()),
        location: v.object({
          name: v.string(),
          address: v.optional(v.string()),
          latitude: v.number(),
          longitude: v.number(),
          google_place_id: v.optional(v.string()),
        }),
        description: v.string(),
      }),
    ),
  },
  handler: async (ctx, args): Promise<Id<'events'>> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called createOrUpdateDraft without authentication.')
    }

    if (args.min_attendees < 4) {
      throw new Error('min_attendees must be at least 4.')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error('User not found.')
    }

    // Process itinerary items to get or create location objects
    const processedItinerary = await Promise.all(
      args.itinerary.map(async item => {
        const locationId = await ctx.runMutation(
          api.locations.getOrCreateLocation,
          item.location,
        )
        // Return the object structured for the database schema
        return {
          order: item.order,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          description: item.description,
          location_id: locationId,
        }
      }),
    )

    const eventData = {
      hostId: user._id,
      title: args.title,
      description: args.description,
      min_attendees: args.min_attendees,
      max_attendees: args.max_attendees,
      age_min: args.age_min,
      age_max: args.age_max,
      arrival_signpost: args.arrival_signpost,
      estimated_event_cost: args.estimated_event_cost,
      status: 'draft',
      itinerary: processedItinerary as unknown as Doc<'events'>['itinerary'],
    }

    if (args.id) {
      // Update existing draft
      await ctx.db.patch(args.id, eventData)
      return args.id
    } else {
      // Create new draft
      const eventId: Id<'events'> = await ctx.db.insert('events', eventData)
      return eventId
    }
  },
})

export const publishEvent = mutation({
  args: {id: v.id('events')},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called publishEvent without authentication.')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error('User not found.')
    }

    // TODO: Add host verification check here from user.is_verified
    // if (!user.hostProfile?.is_verified) {
    //   throw new Error("Host is not verified and cannot publish events.");
    // }

    const event = await ctx.db.get(args.id)
    if (!event) {
      throw new Error('Event not found')
    }

    if (event.hostId !== user._id) {
      throw new Error('User is not the host of this event.')
    }

    await ctx.db.patch(args.id, {status: 'published'})

    // TODO: Schedule action to generate event_vector
    // await ctx.scheduler.runAfter(0, api.actions.generateEventVector, { eventId: args.id });
  },
})

export const getMyEvents = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called getMyEvents without authentication.')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', q =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error('User not found.')
    }

    const events = await ctx.db
      .query('events')
      .withIndex('by_hostId_and_status', q => q.eq('hostId', user._id))
      .collect()

    return events
  },
})

export const get = internalQuery({
  args: {id: v.id('events')},
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getEvent = query({
  args: {id: v.id('events')},
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})
