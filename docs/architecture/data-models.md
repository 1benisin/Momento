# Data Models

This section defines the core data models for the Momento application, designed for the Convex backend. The models prioritize a seamless, end-to-end TypeScript experience and leverage Convex's real-time capabilities. Data is structured in a document-oriented model, embedding data where it makes sense to optimize for read performance and using references for many-to-many relationships.

## `users`

**Purpose:** The `users` collection is the aggregate root for all user-related data. It combines private account information, public-facing profiles for both "social" and "host" roles, system settings, and internal metrics into a single document. This model is optimized to fetch all necessary user data in a single read and uses the presence of the `socialProfile` or `hostProfile` embedded objects to determine a user's role.

**Key Attributes:**

- `clerkId`: `string` - The user's unique ID from Clerk, linking the Convex user to the master authentication record. (Indexed)
- `accountStatus`: `string` - The lifecycle status of the account itself (e.g., `'active'`, `'paused'`).
- `onboardingState`: `string` - Tracks the user's progress through initial setup flows (e.g., `'needs_role_selection'`, `'completed'`).
- `active_role`: `string` - For users with both social and host profiles, this stores their currently active UI context ('social' or 'host').
- `socialProfile`: `object` - An embedded object containing the user's public-facing participant profile.
- `hostProfile`: `object` - An embedded object containing the user's public-facing host profile.
- `payment_customer_id`: `string` - The user's Stripe Customer ID for processing payments.
- `interestVectors`: `array` - An array of vector embeddings representing the user's calculated interests.
- `notificationSettings`: `object` - An embedded object for managing all user-facing notification preferences.

**TypeScript Interface:**

```typescript
interface User {
  _id: Id<"users">;
  clerkId: string;
  phone_number?: string;
  email?: string;
  last_name?: string;
  birth_date: number;
  is_verified: boolean;
  accountStatus: "active" | "paused";
  onboardingState:
    | "needs_role_selection"
    | "needs_social_profile"
    | "needs_host_profile"
    | "completed";
  active_role: "social" | "host";
  last_active_at: number;
  user_number: number;
  payment_customer_id?: string;
  min_lead_time_days?: number;
  availability_preferences?: object; // Simplified for brevity
  distance_preference?: number;
  price_sensitivity?: number;
  person_attraction_vector?: number[];
  socialProfile?: object; // See socialProfile interface
  hostProfile?: object; // See hostProfile interface
  internalMetrics?: object;
  interestVectors?: object[];
  socialLinks?: object[];
  notificationSettings: object;
  contextualNudges?: object;
}
```

**Relationships:**

- A **User** can be a **Host** of many **Events**. (`events.hostId` -> `users._id`)
- A **User** can have many **Invitations**. (`invitations.userId` -> `users._id`)
- A **User** can have many **Connections** (Memory Book entries). (`connections.userIds` includes `users._id`)

## `events`

**Purpose:** The `events` collection is the central entity for any gathering organized on the platform. It acts as the aggregate root for an event's core details (like title, status, and fees), its multi-stop itinerary, and any collaborators. The `event_vector` is a key component used for matching the event's "vibe" with user interests.

**Key Attributes:**

- `hostId`: `Id<"users">` - A reference to the user who created and owns the event.
- `title`: `string` - The public title of the event.
- `description`: `string` - A detailed description of the event activities.
- `status`: `string` - The current lifecycle status of the event (e.g., `'draft'`, `'published'`, `'completed'`, `'cancelled'`).
- `event_vector`: `array` - A vector embedding used by the matching algorithm to represent the event's conceptual "vibe".
- `itinerary`: `array` - An embedded array of objects, where each object represents a stop in the event, complete with location, time, and description.
- `confirmation_fee`: `number` - The fee (in cents) a participant must pay to confirm their attendance.

**TypeScript Interface:**

```typescript
interface Event {
  _id: Id<"events">;
  hostId: Id<"users">;
  title: string;
  description: string;
  event_vector: number[];
  status:
    | "draft"
    | "published"
    | "completed"
    | "cancelled"
    | "cancelled_by_host";
  min_attendees: number;
  max_attendees: number;
  age_min?: number;
  age_max?: number;
  arrival_signpost?: string;
  confirmation_fee: number;
  estimated_event_cost?: any; // JSON object for cost details
  itinerary: ItineraryStop[];
  collaborators?: Collaborator[];
  event_summary?: EventSummary;
}

interface ItineraryStop {
  location_id: Id<"locations">;
  order: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
}
```

**Relationships:**

- An **Event** belongs to one **Host** (`User`). (`events.hostId` -> `users._id`)
- An **Event** has one or more **Itinerary Stops**, each linked to a **Location**. (`itinerary.location_id` -> `locations._id`)
- An **Event** can have many **Invitations** sent out to users. (`invitations.eventId` -> `events._id`)
- An **Event** can have many **Attendees**. (`attendance.eventId` -> `events._id`)

## `locations`

**Purpose:** Stores structured data for all physical locations used in event itineraries. This collection is optimized for efficient geospatial queries, enabling the system to quickly find events within a user's specified travel radius.

**Key Attributes:**

- `name`: `string` - The public name of the location.
- `latitude`: `number` - The latitude coordinate, required for geospatial indexing.
- `longitude`: `number` - The longitude coordinate, required for geospatial indexing.
- `google_place_id`: `string` - The unique identifier from the Google Places API, used to fetch rich details about commercial venues.

## `invitations`

**Purpose:** Tracks the relationship between a user and an event to which they have been invited. It records the status of the invitation (e.g., `pending`, `accepted`, `declined`), which is crucial for managing event rosters and sending appropriate reminders.

**Key Attributes:**

- `userId`: `Id<"users">` - A reference to the invited user.
- `eventId`: `Id<"events">` - A reference to the event.
- `status`: `string` - The current state of the invitation.
- `payment_intent_id`: `string` - The Stripe Payment Intent ID created when the user accepts the invitation and pays the confirmation fee.

## `connections`

**Purpose:** Represents the "Memory Book" feature, creating a persistent link between two users who have met at an event. This collection is the foundation of the post-event social graph, allowing users to reconnect, provide private feedback, and signal their interest in seeing each other at future events.

**Key Attributes:**

- `userIds`: `array` - An array containing the two `Id<"users">` who are connected.
- `eventId`: `Id<"events">` - A reference to the event where the connection was made.
- `status`: `string` - The current state of the connection (e.g., `active`, `blocked`).
