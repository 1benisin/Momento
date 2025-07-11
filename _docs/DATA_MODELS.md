# Convex Data Models & Schemas

This document outlines the core data models for the Momento application, redesigned for the Convex backend.

The design prioritizes a seamless, end-to-end TypeScript experience and leverages Convex's real-time capabilities. It adapts the original relational schema into a document-oriented model, embedding data where it makes sense to optimize for read performance, and using references for many-to-many relationships.

The schema will be defined in `convex/schema.ts` using Convex's `defineSchema` and `defineTable` helpers.

---

## Core Entities

- **[Users](#users-collection)**: The aggregate root for all user-related data, including social and host profiles.
- **[Interests](#interests-collection)**: A global catalog of possible user interests with their vector embeddings.
- **[Locations](#locations-collection)**: Stores structured data for physical locations, indexed for geospatial queries.
- **[Events](#events-collection)**: The central entity for all gatherings, with an embedded itinerary.
- **[Invitations](#invitations-collection)**: Tracks which users are invited to which events and their response.
- **[Attendance](#attendance-collection)**: Tracks which participants attended an event.
- **[Ratings](#ratings-collection)**: Stores feedback given to hosts and events.
- **[Attendee Kudos](#attendee_kudos-collection)**: Stores private, positive affirmations between attendees.
- **[Event Posts](#event_posts-collection)**: A public message board for a specific event.
- **[Conversations](#conversations-collection)**: Powers private, post-event, 1-on-1 messaging.
- **[Connections](#connections-collection)**: Stores the relationship between two users who met at an event (the "Memory Book").
- **[Social Connections](#social_connections-collection)**: A permissions layer for sharing social links.
- **[Event Photos](#event_photos-collection)**: A shared photo gallery for an event.
- **[Duos](#duos-collection)**: Manages "Dynamic Duo" pacts between two users.
- **[Blocked Users](#blocked_users-collection)**: Manages user-to-user blocking.
- **[Reports](#reports-collection)**: Logs formal reports submitted by users for moderation.
- **[Support Tickets](#support_tickets-collection)**: Logs support requests submitted by users.
- **[Push Notification Tokens](#push_notification_tokens-collection)**: Stores device tokens for push notifications.

---

## 1. Users & Profiles

In a document model, we combine private user data, public profiles, metrics, and settings into a single, rich `users` document. This is more efficient as it often allows us to fetch all necessary user data in a single read operation. The user's "role" is determined by the presence of the `socialProfile` or `hostProfile` embedded objects.

### `users` Collection

Serves as the aggregate root for a user, combining private data (phone, email), public profiles (`socialProfile`, `hostProfile`), system settings, and internal metrics into a single document. This model optimizes for fetching all user-related information in a single read and determines a user's role (`Participant`, `Host`, or `Hybrid`) based on the presence of embedded profile objects.

**Note on Data Synchronization**: While this table stores a comprehensive view of the user, the "source of truth" for user-editable account information (like name, email, phone numbers) and security settings (password, MFA) is **Clerk**. Users modify this data through our custom-built account management screen, which uses Clerk's hooks (e.g., `useUser`) to send updates to Clerk's backend. Changes are then synchronized to this `users` collection via webhooks to power Momento's internal application logic (e.g., matching, notifications). This architecture allows us to leverage Clerk's robust backend for account management while maintaining a fully custom native UI.

| Field Name                 | Type                                                                                                                                              | Description                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `_id`                      | `Id<"users">`                                                                                                                                     | Convex system field. Primary Key.                                                                                        |
| `clerkId`                  | `v.string()`                                                                                                                                      | The user's unique ID from Clerk. This links the Convex user to the Clerk user. Indexed.                                  |
| `phone_number`             | `v.optional(v.string())`                                                                                                                          | User's private phone number. Indexed. Can be null for archived accounts.                                                 |
| `email`                    | `v.optional(v.string())`                                                                                                                          | Optional private email for recovery or receipts.                                                                         |
| `last_name`                | `v.optional(v.string())`                                                                                                                          | User's private last name.                                                                                                |
| `birth_date`               | `v.number()`                                                                                                                                      | User's date of birth (as a timestamp) for age calculation.                                                               |
| `is_verified`              | `v.boolean()`                                                                                                                                     | Defaults to `false`. True if user completed ID verification.                                                             |
| `status`                   | `v.string()`                                                                                                                                      | e.g., 'active', 'paused', 'suspended', 'verification_pending', 'banned', 'archived_for_recycling', 'pending_onboarding'. |
| `active_role`              | `v.string()`                                                                                                                                      | For Hybrid Users, stores the last active role ('social' or 'host'). Defaults to 'social'.                                |
| `last_active_at`           | `v.number()`                                                                                                                                      | Timestamp of the last user activity.                                                                                     |
| `user_number`              | `v.number()`                                                                                                                                      | A unique, sequential number for early adopters. Managed via a counter or mutation logic.                                 |
| `payment_customer_id`      | `v.optional(v.string())`                                                                                                                          | Stripe customer ID.                                                                                                      |
| `min_lead_time_days`       | `v.optional(v.number())`                                                                                                                          | User's preferred minimum notice for event invites.                                                                       |
| `availability_preferences` | `v.optional(v.object({ mon: v.string(), tue: v.string(), wed: v.string(), thu: v.string(), fri: v.string(), sat: v.string(), sun: v.string() }))` | Stores day/week availability. Each day can be 'any', 'evening', 'daytime', or 'unavailable'.                             |
| `distance_preference`      | `v.optional(v.number())`                                                                                                                          | User's max travel distance in miles.                                                                                     |
| `price_sensitivity`        | `v.optional(v.number())`                                                                                                                          | User's max price comfort level (1-4).                                                                                    |
| `person_attraction_vector` | `v.optional(v.array(v.float64()))`                                                                                                                | Vector representing the user's "type" in others, built from "Discover Your Type" swipes.                                 |
| `socialProfile`            | `v.optional(v.object({ ... }))`                                                                                                                   | Embedded object containing the user's public-facing participant profile. See details below.                              |
| `hostProfile`              | `v.optional(v.object({ ... }))`                                                                                                                   | Embedded object containing the user's public-facing host profile. See details below.                                     |
| `internalMetrics`          | `v.optional(v.object({ ... }))`                                                                                                                   | Embedded object for system-generated scores and metrics. See details below.                                              |
| `interestVectors`          | `v.optional(v.array(v.object({ ... })))`                                                                                                          | Embedded array of interest vector objects. See details below.                                                            |
| `socialLinks`              | `v.optional(v.array(v.object({ ... })))`                                                                                                          | Embedded array of the user's social media links. See details below.                                                      |
| `notificationSettings`     | `v.object({ ... })`                                                                                                                               | Embedded object for managing notification preferences. See details below.                                                |
| `contextualNudges`         | `v.optional(v.object({ shown_distance_preference_nudge: v.boolean(), shown_price_sensitivity_nudge: v.boolean() }))`                              | Tracks whether a user has been shown specific contextual nudges to avoid repetition.                                     |

#### Embedded `socialProfile` Object

| Field Name                          | Type                                                                       | Description                                                                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `first_name`                        | `v.string()`                                                               | User's public first name.                                                                                                                             |
| `preferred_name`                    | `v.optional(v.string())`                                                   | The name the user prefers to be called.                                                                                                               |
| `bio`                               | `v.optional(v.string())`                                                   | A short public biography.                                                                                                                             |
| `vibe_summary`                      | `v.optional(v.string())`                                                   | AI-generated narrative summary of the user's profile.                                                                                                 |
| `gender`                            | `v.string()`                                                               | User's self-identified gender.                                                                                                                        |
| `pronouns`                          | `v.optional(v.string())`                                                   | User's pronouns.                                                                                                                                      |
| `interested_in`                     | `v.array(v.string())`                                                      | Genders the user is interested in connecting with.                                                                                                    |
| `occupation`                        | `v.optional(v.string())`                                                   | User's occupation.                                                                                                                                    |
| `location`                          | `v.optional(v.string())`                                                   | General location (e.g., "Brooklyn, NY").                                                                                                              |
| `social_profile_vector`             | `v.optional(v.array(v.float64()))`                                         | Vector embedding of this user's social profile, representing their "vibe" to others.                                                                  |
| `interests`                         | `v.optional(v.array(v.id("interests")))`                                   | An array of interest IDs, replacing the `profile_interests` join table.                                                                               |
| `liked_profiles`                    | `v.optional(v.array(v.id("users")))`                                       | An array of user IDs that this user has liked.                                                                                                        |
| `photos`                            | `v.array(v.object({ ... }))`                                               | An embedded array of profile photo objects.                                                                                                           |
| `current_photo_url`                 | `v.string()`                                                               | Denormalized URL of the main profile photo for quick access.                                                                                          |
| `current_face_card_photo_url`       | `v.string()`                                                               | Denormalized URL of the stylized Face Card.                                                                                                           |
| `face_card_source_photo_url`        | `v.optional(v.string())`                                                   | The URL of the photo from the `photos` array that is currently being used as the base for the Face Card. Defaults to the first authentic photo taken. |
| `unlocked_face_card_customizations` | `v.optional(v.array(v.object({ id: v.string(), notified: v.boolean() })))` | An array of objects tracking unlocked customizations and their notification status (e.g., `{id: "style:vintage", notified: false}`).                  |
| `email_account_and_safety`          | `v.boolean()`                                                              | For critical account alerts (e.g., phone number changes).                                                                                             |

#### Embedded `hostProfile` Object

| Field Name                 | Type                                                                                                                           | Description                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `host_type`                | `v.string()`                                                                                                                   | 'user' or 'community'.                                                                                   |
| `host_name`                | `v.string()`                                                                                                                   | Public name of the host.                                                                                 |
| `host_bio`                 | `v.string()`                                                                                                                   | Biography specific to hosting activities.                                                                |
| `location_id`              | `v.optional(v.id("locations"))`                                                                                                | The primary, physical location of a `community` host.                                                    |
| `address`                  | `v.optional(v.string())`                                                                                                       | The physical street address for a `community` host. Required for verification.                           |
| `website_url`              | `v.optional(v.string())`                                                                                                       | The official website for a `community` host, used for verification.                                      |
| `average_rating`           | `v.optional(v.number())`                                                                                                       | Calculated average from all event/host ratings.                                                          |
| `photos`                   | `v.optional(v.array(v.object({ ... })))`                                                                                       | An embedded array of host brand/venue photos.                                                            |
| `reliabilityLog`           | `v.optional(v.array(v.object({ eventId: v.id("events"), actionType: v.string(), timestamp: v.number(), metadata: v.any() })))` | An array of log entries that tracks host reliability signals for internal review and automated flagging. |
| `push_account_and_safety`  | `v.boolean()`                                                                                                                  | Push notifications for payments, reports, etc.                                                           |
| `email_account_and_safety` | `v.boolean()`                                                                                                                  | For critical account alerts (e.g., phone number changes).                                                |

#### Embedded `internalMetrics` Object

| Field Name                       | Type                     | Description                                           |
| -------------------------------- | ------------------------ | ----------------------------------------------------- |
| `absentee_rating`                | `v.optional(v.number())` | Internal score tracking reliability.                  |
| `contribution_score`             | `v.optional(v.number())` | Internal score rewarding positive social behavior.    |
| `internal_attractiveness_rating` | `v.optional(v.number())` | Internal score for matching.                          |
| `aggregated_kudos`               | `v.optional(v.any())`    | Summary of kudos received. `v.any()` for JSON object. |

#### Embedded `socialProfile.photos` Array of Objects

| Field Name             | Type                     | Description                                                                  |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `url`                  | `v.string()`             | URL of the photo.                                                            |
| `is_authentic`         | `v.boolean()`            | True if the photo was taken through the in-app camera.                       |
| `authentic_expires_at` | `v.optional(v.number())` | Timestamp for when the "Authentic" badge expires (12 months after creation). |
| `created_at`           | `v.number()`             | Timestamp of when the photo was uploaded.                                    |

#### Embedded `interestVectors` Array of Objects

| Field Name     | Type                     | Description                                 |
| -------------- | ------------------------ | ------------------------------------------- |
| `vector`       | `v.array(v.float64())`   | The interest vector embedding.              |
| `vector_type`  | `v.string()`             | 'positive_v1', 'negative_v1', 'persona_v1'. |
| `persona_name` | `v.optional(v.string())` | User-facing name for a persona cluster.     |

#### Embedded `socialLinks` Array of Objects

| Field Name                  | Type          | Description                                          |
| --------------------------- | ------------- | ---------------------------------------------------- |
| `platform`                  | `v.string()`  | 'instagram', 'twitter', etc.                         |
| `url`                       | `v.string()`  | The full URL to the user's profile.                  |
| `is_public_on_host_profile` | `v.boolean()` | If true, this link is public on their `hostProfile`. |

#### Embedded `notificationSettings` Object

A direct mapping of the `user_notification_settings` table fields, with defaults.

| Field Name                 | Type          | Description                                               |
| -------------------------- | ------------- | --------------------------------------------------------- |
| `sms_invitations`          | `v.boolean()` | User agrees to receive new invitations via SMS.           |
| `sms_reminders`            | `v.boolean()` | User agrees to receive event start reminders via SMS.     |
| `push_event_invitations`   | `v.boolean()` | Push notifications for new & expiring invitations.        |
| `push_event_updates`       | `v.boolean()` | Push notifications for event changes and confirmations.   |
| `push_event_reminders`     | `v.boolean()` | Push notifications for upcoming events.                   |
| `push_direct_messages`     | `v.boolean()` | Push notifications for new DMs.                           |
| `push_social`              | `v.boolean()` | Push notifications for kudos, matches, etc.               |
| `push_account_and_safety`  | `v.boolean()` | Push notifications for payments, reports, etc.            |
| `email_account_and_safety` | `v.boolean()` | For critical account alerts (e.g., phone number changes). |

---

### `waitlist_users` Collection (DEPRECATED)

This collection is no longer needed. International user management and region-locking will be handled by Clerk's configuration.

---

## 2. Interests

We use a global collection for all possible interests and reference them from the user's profile.

### `interests` Collection

A global catalog of all possible interests (e.g., 'Hiking', 'Indie Films') available within the Momento ecosystem. Each interest has a pre-computed vector embedding, which is fundamental to the concept-based matching algorithm for both users and events.

| Field Name | Type                   | Description                                        |
| ---------- | ---------------------- | -------------------------------------------------- |
| `_id`      | `Id<"interests">`      | Primary Key.                                       |
| `name`     | `v.string()`           | The name of the interest (e.g., "Hiking"). Unique. |
| `vector`   | `v.array(v.float64())` | The vector embedding of the interest's name.       |

The `profile_interests` join table is now eliminated, replaced by an array of `Id<"interests">` on the `socialProfile` object within the `users` document.

---

## 3. Itinerary, Locations & Collaborators

The `events` document becomes the aggregate root, embedding its itinerary and collaborators. `locations` remains separate to be used with the Geospatial component.

### `locations` Collection

Stores structured data for all physical locations used in event itineraries. It is designed to be indexed for efficient geospatial queries (e.g., finding events within a user's travel radius) and can represent both commercial venues (with a `google_place_id`) and custom-pinned locations.

| Field Name        | Type                     | Description                       |
| ----------------- | ------------------------ | --------------------------------- |
| `_id`             | `Id<"locations">`        | Primary Key.                      |
| `name`            | `v.string()`             | The name of the location.         |
| `address`         | `v.optional(v.string())` | The full street address.          |
| `latitude`        | `v.number()`             | Required for geospatial indexing. |
| `longitude`       | `v.number()`             | Required for geospatial indexing. |
| `google_place_id` | `v.optional(v.string())` | Google Places ID.                 |

### `events` Collection

The central entity representing a single gathering organized by a host. It serves as the aggregate root for an event's core details, its multi-stop `itinerary`, and any `collaborators`. The embedded `event_vector` is crucial for matching the event's 'vibe' with user interests.

| Field Name             | Type                                                                                                                                                            | Description                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `_id`                  | `Id<"events">`                                                                                                                                                  | Primary Key.                                                                                                      |
| `hostId`               | `v.id("users")`                                                                                                                                                 | Reference to the host user.                                                                                       |
| `title`                | `v.string()`                                                                                                                                                    | Title of the event.                                                                                               |
| `description`          | `v.string()`                                                                                                                                                    | Detailed description of the event.                                                                                |
| `event_vector`         | `v.array(v.float64())`                                                                                                                                          | Vector embedding for matching.                                                                                    |
| `status`               | `v.string()`                                                                                                                                                    | 'draft', 'published', 'completed', 'cancelled', 'cancelled_by_host'.                                              |
| `min_attendees`        | `v.number()`                                                                                                                                                    |                                                                                                                   |
| `max_attendees`        | `v.number()`                                                                                                                                                    |                                                                                                                   |
| `age_min`              | `v.optional(v.number())`                                                                                                                                        |                                                                                                                   |
| `age_max`              | `v.optional(v.number())`                                                                                                                                        |                                                                                                                   |
| `arrival_signpost`     | `v.optional(v.string())`                                                                                                                                        | Real-world cue for finding the group.                                                                             |
| `confirmation_fee`     | `v.number()`                                                                                                                                                    | Fee in cents to confirm attendance.                                                                               |
| `estimated_event_cost` | `v.any()`                                                                                                                                                       | JSON object for expected cost.                                                                                    |
| `itinerary`            | `v.array(v.object({ ... }))`                                                                                                                                    | Embedded array of itinerary stops. See details below.                                                             |
| `collaborators`        | `v.optional(v.array(v.object({ ... })))`                                                                                                                        | Embedded array of event collaborators. See details below.                                                         |
| `event_summary`        | `v.optional(v.object({ final_headcount: v.number(), host_rating_avg: v.number(), event_rating_avg: v.number(), feedback_summary_ai: v.optional(v.string()) }))` | An embedded object populated after an event is completed, containing aggregated metrics for the host's dashboard. |

#### Embedded `itinerary` Array of Objects

| Field Name    | Type                | Description                             |
| ------------- | ------------------- | --------------------------------------- |
| `location_id` | `v.id("locations")` | Reference to the location document.     |
| `order`       | `v.number()`        | Sequence of this stop in the itinerary. |
| `title`       | `v.string()`        | Title for this stop.                    |
| `description` | `v.string()`        | Details about this part of the event.   |
| `start_time`  | `v.number()`        | Timestamp for this stop.                |
| `end_time`    | `v.number()`        | Timestamp for this stop.                |

#### Embedded `collaborators` Array of Objects

| Field Name     | Type                        | Description                                               |
| -------------- | --------------------------- | --------------------------------------------------------- |
| `userId`       | `v.optional(v.id("users"))` | Optional reference if the collaborator is a Momento user. |
| `role`         | `v.string()`                | 'Co-host', 'Instructor', etc.                             |
| `first_name`   | `v.string()`                | Required if `userId` is null.                             |
| `last_name`    | `v.optional(v.string())`    |                                                           |
| `phone_number` | `v.optional(v.string())`    |                                                           |

---

## 4. Events, Invitations & Attendance

`invitations` and `attendance` remain as separate collections because they represent a many-to-many relationship between users and events.

### `invitations` Collection

Represents the many-to-many relationship between users and events, tracking the lifecycle of an invitation from `sent` to `confirmed` or `declined`. It stores the system-generated `match_reason` to provide transparency to the user on why they were invited.

| Field Name       | Type                       | Description                                                                                          |
| ---------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `_id`            | `Id<"invitations">`        | Primary Key.                                                                                         |
| `eventId`        | `v.id("events")`           | Reference to the event.                                                                              |
| `userId`         | `v.id("users")`            | Reference to the invited user.                                                                       |
| `status`         | `v.string()`               | 'sent', 'confirmed', 'declined', 'cancelled_early', 'cancelled_late', 'pending_reconfirmation', etc. |
| `decline_reason` | `v.optional(v.string())`   |                                                                                                      |
| `match_reason`   | `v.optional(v.string())`   | System-generated explanation for the match.                                                          |
| `duoId`          | `v.optional(v.id("duos"))` | Reference if part of a Duo invitation.                                                               |

### `attendance` Collection

A record of a user's participation in an event. This collection is critical for community health, as it logs attendance statuses like `attended`, `no_show`, or `cancelled_late`, which directly inform a user's internal `absentee_rating`. An early cancellation by a participant or a cancellation by the host should result in the deletion of the corresponding attendance record to free up the spot.

| Field Name            | Type                     | Description                                                |
| --------------------- | ------------------------ | ---------------------------------------------------------- |
| `_id`                 | `Id<"attendance">`       | Primary Key.                                               |
| `eventId`             | `v.id("events")`         | Reference to the event.                                    |
| `userId`              | `v.id("users")`          | Reference to the attendee.                                 |
| `status`              | `v.string()`             | 'confirmed', 'attended', 'cancelled_late', 'no_show', etc. |
| `is_showcased`        | `v.boolean()`            | If true, featured in user's "Event DNA".                   |
| `check_in_latitude`   | `v.optional(v.number())` |                                                            |
| `check_in_longitude`  | `v.optional(v.number())` |                                                            |
| `reported_by_user_id` | `v.id("users")`          | Who reported the attendance status.                        |

---

## 5. Feedback & Messaging

These collections model interactions and are best kept separate.

### `ratings` Collection

Captures feedback from attendees after an event. Each document contains a user's rating for both the event experience and the host's performance. This data is aggregated to calculate a host's `average_rating`.

| Field Name           | Type                     | Description              |
| -------------------- | ------------------------ | ------------------------ |
| `_id`                | `Id<"ratings">`          | Primary Key.             |
| `eventId`            | `v.id("events")`         |                          |
| `raterId`            | `v.id("users")`          |                          |
| `ratedHostId`        | `v.id("users")`          |                          |
| `host_rating_value`  | `v.number()`             | 1-5 score for the host.  |
| `event_rating_value` | `v.number()`             | 1-5 score for the event. |
| `comment`            | `v.optional(v.string())` |                          |

### `attendee_kudos` Collection

Stores private, positive affirmations ('kudos') given between attendees after an event. This is a core mechanism for rewarding positive social behavior, as the data is used to calculate a user's internal `contribution_score` and populate their public 'Kudos Showcase'.

| Field Name   | Type                   | Description                              |
| ------------ | ---------------------- | ---------------------------------------- |
| `_id`        | `Id<"attendee_kudos">` | Primary Key.                             |
| `eventId`    | `v.id("events")`       |                                          |
| `giverId`    | `v.id("users")`        |                                          |
| `receiverId` | `v.id("users")`        |                                          |
| `kudo`       | `v.string()`           | 'great_listener', 'welcoming_vibe', etc. |

### `event_posts` Collection

Functions as a public message board for a specific event, visible to the host and all confirmed attendees. It allows for group communication before, during, and after the event.

| Field Name | Type                | Description          |
| ---------- | ------------------- | -------------------- |
| `_id`      | `Id<"event_posts">` | Primary Key.         |
| `eventId`  | `v.id("events")`    |                      |
| `userId`   | `v.id("users")`     | The poster.          |
| `content`  | `v.string()`        | The message content. |

### Direct Messaging Collections

This standard three-collection model powers private, one-on-one messaging between users. Conversations are typically unlocked after two users have attended the same event.

#### `conversations` Collection

Represents a single, private chat thread between two or more users. It acts as the container for all messages within that chat.

| Field Name | Type                  | Description  |
| ---------- | --------------------- | ------------ |
| `_id`      | `Id<"conversations">` | Primary Key. |

#### `conversation_participants` Collection

A join table that links users to conversations, effectively managing who is a member of which private chat thread.

| Field Name       | Type                    | Description |
| ---------------- | ----------------------- | ----------- |
| `conversationId` | `v.id("conversations")` |             |
| `userId`         | `v.id("users")`         |             |

#### `messages` Collection

Stores a single message sent within a conversation, linking it to the sender and the conversation thread.

| Field Name       | Type                    | Description          |
| ---------------- | ----------------------- | -------------------- |
| `_id`            | `Id<"messages">`        | Primary Key.         |
| `conversationId` | `v.id("conversations")` |                      |
| `senderId`       | `v.id("users")`         |                      |
| `content`        | `v.string()`            | The message content. |

---

## 6. Connections & Memories

### `connections` Collection (The Memory Book)

The digital representation of a 'memory' in a user's private 'Memory Book'. Each document is a user's personal record of another person they met at an event, containing snapshots of the person's profile at the time and private notes. It also stores signals (`wants_to_connect_again`) that influence future matching.

| Field Name                       | Type                     | Description                                  |
| -------------------------------- | ------------------------ | -------------------------------------------- |
| `_id`                            | `Id<"connections">`      | Primary Key.                                 |
| `ownerId`                        | `v.id("users")`          | The owner of this connection record.         |
| `connectedUserId`                | `v.id("users")`          | The person they met.                         |
| `eventId`                        | `v.id("events")`         | The event where they first met.              |
| `snapshot_name`                  | `v.string()`             | Snapshot of the connected user's first name. |
| `snapshot_face_card_url`         | `v.string()`             | Snapshot of the user's Face Card URL.        |
| `was_photo_authentic`            | `v.boolean()`            | Snapshot of "Authentic" status at the time.  |
| `is_favorite`                    | `v.boolean()`            | Private bookmark for the owner.              |
| `wants_to_connect_again`         | `v.boolean()`            | Private signal for the backend.              |
| `does_not_want_to_connect_again` | `v.boolean()`            | Private "soft block" signal.                 |
| `private_notes`                  | `v.optional(v.string())` | Owner's private notes.                       |

### `social_connections` Collection

Acts as a permissions layer for the 'Social Connect' feature. A record in this collection signifies that one user has explicitly chosen to share a specific social media link with another user they met at an event.

| Field Name   | Type                       | Description                                          |
| ------------ | -------------------------- | ---------------------------------------------------- |
| `_id`        | `Id<"social_connections">` | Primary Key.                                         |
| `sharerId`   | `v.id("users")`            | The user initiating the share.                       |
| `receiverId` | `v.id("users")`            | The user receiving the share.                        |
| `platform`   | `v.string()`               | The platform of the link shared (e.g., 'instagram'). |
| `shared_url` | `v.string()`               | A snapshot of the URL at the time of sharing.        |

### `event_photos` Collection

Represents a photo in a shared, collaborative gallery for a specific event. This collection is visible only to attendees and the host, who has moderation privileges over the content.

| Field Name   | Type                 | Description                                    |
| ------------ | -------------------- | ---------------------------------------------- |
| `_id`        | `Id<"event_photos">` | Primary Key.                                   |
| `eventId`    | `v.id("events")`     |                                                |
| `uploaderId` | `v.id("users")`      |                                                |
| `image_url`  | `v.string()`         |                                                |
| `status`     | `v.string()`         | 'visible', 'hidden_by_host', 'pending_review'. |

---

## 7. Dynamic Duos & Paired Invites

We can simplify the original two-table structure into a single `duos` collection.

### `duos` Collection

Manages the state of a 'Dynamic Duo' pact between two users who have agreed to be invited to their next event as a pair. This collection tracks the lifecycle of the pact from `pending` to `active` or `completed`.

| Field Name     | Type                         | Description                                              |
| -------------- | ---------------------------- | -------------------------------------------------------- |
| `_id`          | `Id<"duos">`                 | Primary Key.                                             |
| `status`       | `v.string()`                 | 'pending', 'active', 'completed', 'expired', 'declined'. |
| `expires_at`   | `v.number()`                 | Timestamp for pact expiration.                           |
| `participants` | `v.array(v.object({ ... }))` | Embedded array of the two participants.                  |

#### Embedded `participants` Array of Objects

| Field Name | Type            | Description                   |
| ---------- | --------------- | ----------------------------- |
| `userId`   | `v.id("users")` |                               |
| `role`     | `v.string()`    | 'initiator' or 'participant'. |

---

## 8. App Support & Moderation

These are all standalone entities and translate directly to separate collections.

### `support_tickets` Collection

Logs direct support requests submitted by a user to the Momento team via the app's help center. This is distinct from user-to-user reports and is used for handling technical issues, payment questions, etc.

| Field Name              | Type                         | Description                 |
| ----------------------- | ---------------------------- | --------------------------- |
| `_id`                   | `Id<"support_tickets">`      | Primary Key.                |
| `ticket_number`         | `v.number()`                 | Sequential, user-facing ID. |
| `submitterId`           | `v.id("users")`              |                             |
| `reply_to_email`        | `v.string()`                 |                             |
| `category`              | `v.string()`                 |                             |
| `body`                  | `v.string()`                 |                             |
| `status`                | `v.string()`                 | 'new', 'open', 'resolved'.  |
| `associated_event_id`   | `v.optional(v.id("events"))` |                             |
| `associated_payment_id` | `v.optional(v.string())`     | Stripe payment ID.          |
| `metadata`              | `v.any()`                    | Diagnostic info.            |

### `blocked_users` Collection

A simple but critical collection that stores a record of one user blocking another. A record here creates a 'hard block', preventing all interaction and future matching between the two users. The relationship is defined by `blockerId` -> `blockedId`.

| Field Name  | Type            | Description |
| ----------- | --------------- | ----------- |
| `blockerId` | `v.id("users")` |             |
| `blockedId` | `v.id("users")` |             |

### `reports` Collection

Logs formal reports submitted by one user against another for violations of community standards. These reports are reviewed by the moderation team and can lead to consequences like account suspension or banning.

| Field Name            | Type                               | Description                                           |
| --------------------- | ---------------------------------- | ----------------------------------------------------- |
| `_id`                 | `Id<"reports">`                    | Primary Key.                                          |
| `reporterId`          | `v.id("users")`                    | The user filing the report.                           |
| `reportedId`          | `v.id("users")`                    | The user being reported.                              |
| `eventId`             | `v.optional(v.id("events"))`       | The event where the incident occurred, if applicable. |
| `associated_photo_id` | `v.optional(v.id("event_photos"))` | The photo being reported, if applicable.              |
| `reason`              | `v.string()`                       | The category of the report (e.g., 'Harassment').      |
| `comments`            | `v.string()`                       | A detailed description of the incident.               |
| `status`              | `v.string()`                       | 'new', 'under_review', 'resolved'.                    |

---

## 9. Payments

This collection tracks the `$5 Confirmation Fee` for events, which is the core of the monetization model.

### `
