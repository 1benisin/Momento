# Data Models & Schemas

This document outlines the core data models for the Momento application. These schemas will serve as the foundation for our database structure, likely implemented in Supabase.

The design prioritizes clarity and scalability, separating concerns like user authentication, public profiles, and role-specific data.

---

## Core Entities

This document is organized into the following data models. Each model represents a table in our database.

- **[Users](#users-table)**: Handles authentication and private user data.
- **[Waitlist Users](#waitlist_users-table)**: Captures users from outside the initial launch area.
- **[User Internal Metrics](#user_internal_metrics-table)**: Stores internal-only scores and metrics for a user.
- **[User Interest Vectors](#user_interest_vectors-table)**: Stores vector embeddings of user interests for matching.
- **[Social Profiles](#social_profiles-table)**: Public-facing information for event participants.
- **[Profile Photos](#profile_photos-table)**: A user's collection of profile photos.
- **[Host Profiles](#host_profiles-table)**: Public-facing information for users who host events.
- **[Interests](#interests-table)**: A global catalog of possible user interests.
- **[Profile Interests](#profile_interests-table)**: A join table linking profiles to their selected interests.
- **[Locations](#locations-table)**: Stores structured data for physical locations of events.
- **[Event Itinerary Stops](#event_itinerary_stops-table)**: Defines the journey of a multi-stop event.
- **[Event Collaborators](#event_collaborators-table)**: Links an event to co-hosts or instructors.
- **[Events](#events-table)**: The central entity for all gatherings.
- **[Invitations](#invitations-table)**: Tracks which users are invited to which events and their response.
- **[Attendance](#attendance-table)**: Tracks which participants attended an event.
- **[Ratings](#ratings-table)**: Stores feedback given to hosts and events.
- **[Attendee Kudos](#attendee_kudos-table)**: Stores private, positive affirmations between attendees.
- **[Event Posts](#event_posts-table)**: A public message board for a specific event.
- **[Conversations & Messages](#post-event-direct-messaging)**: Powers private, post-event, 1-on-1 messaging.
- **[Connections](#connections-table)**: Stores the relationship between two users who met at an event.
- **[User Social Links](#user_social_links-table)**: Stores a user's social media links.
- **[Social Connections](#social_connections-table)**: A permissions layer for sharing social links.
- **[Event Photos](#event_photos-table)**: A shared photo gallery for an event.
- **[Payments](#payments-table)**: Tracks payment transactions for events.
- **[Blocked Users](#blocked_users-table)**: Manages user-to-user blocking.
- **[Reports](#reports-table)**: Logs formal reports submitted by users for moderation.
- **[Support Tickets](#support_tickets-table)**: Logs support requests submitted by users to the Momento team.
- **[Push Notification Tokens](#push_notification_tokens-table)**: Stores device tokens for push notifications.
- **[User Notification Settings](#user_notification_settings-table)**: Manages user's notification preferences.

---

## 1. Users & Profiles

We will separate private user data from public profile data. This enhances security and flexibility. For the MVP, we will distinguish between a standard `Social Profile` and a `Host Profile`.

### `users` Table

Stores private data directly linked to the Supabase Auth user. This information is never public.

A `user` record can be associated with a `social_profiles` record, a `host_profiles` record, or both. This combination defines the user's roles and capabilities within the app.

- **Social-Only User**: Has one `users` record and one `social_profiles` record.
- **Host-Only User (Community Host)**: Has one `users` record and one `host_profiles` record.
- **Hybrid User (User Host)**: Has one `users` record linked to both a `social_profiles` and a `host_profiles` record.

| Column                     | Type         | Description                                                                                                                                                                                                                    |
| -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                       | `uuid`       | Primary Key. Foreign key to `auth.users.id`.                                                                                                                                                                                   |
| `phone_number`             | `text`       | User's private phone number. Used for authentication. For MVP, this must be a US-based number. Unique.                                                                                                                         |
| `email`                    | `text`       | Optional. User's private email, used for account recovery or payment receipts.                                                                                                                                                 |
| `last_name`                | `text`       | User's private last name.                                                                                                                                                                                                      |
| `birth_date`               | `date`       | User's date of birth, for age calculation.                                                                                                                                                                                     |
| `is_verified`              | `boolean`    | Defaults to `false`. True if user completed ID verification.                                                                                                                                                                   |
| `status`                   | `text`       | e.g., 'active', 'suspended', 'verification_pending', 'banned'.                                                                                                                                                                 |
| `active_role`              | `text`       | For Hybrid Users, stores the last active role ('participant' or 'host'). Defaults to 'participant'.                                                                                                                            |
| `user_number`              | `bigserial`  | A unique, sequential number assigned to the user upon creation to identify early adopters.                                                                                                                                     |
| `payment_customer_id`      | `text`       | Stripe (or other payment provider) customer ID.                                                                                                                                                                                |
| `min_lead_time_days`       | `integer`    | User's preferred minimum notice for event invites, in days. Defaults to 3.                                                                                                                                                     |
| `availability_preferences` | `jsonb`      | Stores day/week availability. e.g., `{ "mon": { "day": "green", "night": "yellow" } }`                                                                                                                                         |
| `distance_preference`      | `integer`    | User's max travel distance in miles. Defaults to 25. A hard filter in the matching algorithm.                                                                                                                                  |
| `price_sensitivity`        | `integer`    | User's max price comfort level (e.g., 1-4). A hard filter in the matching algorithm. If unset, the system defaults to showing all events (equivalent to the max level) to avoid unintentionally hiding options from new users. |
| `created_at`               | `timestampz` |                                                                                                                                                                                                                                |

### `waitlist_users` Table

This table captures users from outside the initial US-only launch area who wish to be notified when Momento is available in their country.

| Column         | Type         | Description                                                   |
| -------------- | ------------ | ------------------------------------------------------------- |
| `id`           | `uuid`       | Primary Key.                                                  |
| `phone_number` | `text`       | The user's full phone number, including country code. Unique. |
| `created_at`   | `timestampz` | Records when the user was added to the waitlist.              |

### `user_internal_metrics` Table

This table stores internal, system-generated data and metrics about a user. This data is never exposed to the user and is used exclusively for algorithms related to matching and event curation. In the future, this may also include qualitative data like AI interview transcripts.

| Column                           | Type         | Description                                                                                                                                                                          |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `user_id`                        | `uuid`       | Primary Key. Foreign key to `users.id`. (One-to-One)                                                                                                                                 |
| `absentee_rating`                | `float`      | An internal score tracking reliability. A lower score is worse. Calculated from the `attendance` table based on statuses like `cancelled_late`, `no_show`, and `check_in_abandoned`. |
| `contribution_score`             | `float`      | An internal score rewarding positive social behavior (e.g., receiving kudos, good attendance).                                                                                       |
| `internal_attractiveness_rating` | `float`      | Internal score for matching. Not visible to user.                                                                                                                                    |
| `updated_at`                     | `timestampz` | Records the last time the metrics were updated.                                                                                                                                      |

### `user_interest_vectors` Table

This table stores the vector embeddings that represent a user's interests. This data is the foundation of the matching algorithm and is never exposed to the user. For a detailed explanation of the strategy, see `_docs/MATCHING_ALGORITHM.md`.

| Column        | Type         | Description                                                                                               |
| ------------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `id`          | `uuid`       | Primary Key.                                                                                              |
| `user_id`     | `uuid`       | Foreign key to `users.id`.                                                                                |
| `vector`      | `vector`     | The interest vector embedding. The size will depend on the embedding model used (e.g., 1536 for OpenAI).  |
| `vector_type` | `text`       | The type of vector, e.g., 'positive_v1', 'negative_v1'. This allows for versioning and multiple personas. |
| `updated_at`  | `timestampz` | Records the last time this vector was updated.                                                            |

### `social_profiles` Table

The default public profile for every user who participates in events. The existence of this record, linked to a `users` record, designates a user as a `Participant`.

| Column                       | Type         | Description                                                                                                                                                                                                                 |
| ---------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                         | `uuid`       | Primary Key.                                                                                                                                                                                                                |
| `user_id`                    | `uuid`       | Foreign Key, linking to the `users` table. (One-to-One)                                                                                                                                                                     |
| `first_name`                 | `text`       | User's public first name.                                                                                                                                                                                                   |
| `preferred_name`             | `text`       | The name the user prefers to be called.                                                                                                                                                                                     |
| `current_photo_id`           | `uuid`       | Foreign key to `profile_photos.id`, pointing to their main profile photo.                                                                                                                                                   |
| `current_face_card_photo_id` | `uuid`       | Foreign key to `profile_photos.id`, pointing to their stylized Face Card.                                                                                                                                                   |
| `bio`                        | `text`       | A short public biography.                                                                                                                                                                                                   |
| `gender`                     | `text`       | **Required**. User's self-identified gender. A single selection from a predefined list: 'Woman', 'Man', 'Non-binary', 'Transgender Woman', 'Transgender Man', 'Genderqueer', 'Genderfluid', 'Agender'.                      |
| `pronouns`                   | `text`       | **Optional**. User's pronouns (e.g., 'she/her', 'they/them'). If provided, this is displayed on their profile.                                                                                                              |
| `interested_in`              | `text[]`     | **Required**. An array of genders the user is interested in connecting with. Multi-select from the same list as the `gender` field. Powers the "Discover Your Type" feed and is a core component of the matching algorithm. |
| `occupation`                 | `text`       | User's occupation.                                                                                                                                                                                                          |
| `location`                   | `text`       | General location (e.g., "Brooklyn, NY").                                                                                                                                                                                    |
| `liked_profiles`             | `uuid[]`     | An array of `social_profile` IDs that this user has liked.                                                                                                                                                                  |
| `created_at`                 | `timestampz` |                                                                                                                                                                                                                             |

### `profile_photos` Table

A user's collection of profile photos, including ones taken in-app for authenticity. This serves as their personal "camera roll."

| Column            | Type         | Description                                                                           |
| ----------------- | ------------ | ------------------------------------------------------------------------------------- |
| `id`              | `uuid`       | Primary Key.                                                                          |
| `profile_id`      | `uuid`       | Foreign key to `social_profiles.id`.                                                  |
| `image_url`       | `text`       | URL of the photo.                                                                     |
| `is_in_app_photo` | `boolean`    | Defaults to `false`. True if the photo was taken through the in-app camera interface. |
| `created_at`      | `timestampz` | The upload time. Used to expire the "Authentic" status after 12 months.               |

### `host_profiles` Table

A separate profile that a user can have if they choose to become a host. The existence of this record, linked to a `users` record, designates a user as a `Host`.

| Column           | Type         | Description                                                                                                                       |
| ---------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `uuid`       | Primary Key.                                                                                                                      |
| `user_id`        | `uuid`       | Foreign Key, linking to the `users` table. (One-to-One)                                                                           |
| `host_type`      | `text`       | The type of host, e.g., 'user' or 'community'.                                                                                    |
| `host_name`      | `text`       | Public name of the host (can be different from their user name).                                                                  |
| `host_bio`       | `text`       | A biography specific to their hosting activities.                                                                                 |
| `location_id`    | `uuid`       | **Nullable**. Foreign key to `locations.id`. The primary, physical location of a `community` host. This is null for `user` hosts. |
| `average_rating` | `float`      | Calculated average from all event/host ratings.                                                                                   |
| `created_at`     | `timestampz` |                                                                                                                                   |

This profile will also feature an "Event History" section, displaying a list of their successfully completed past events along with the average rating each event received from attendees. This provides social proof of their hosting quality. Publicly visible social media links, managed in the `user_social_links` table, can also be displayed here.

### `host_photos` Table

This table stores brand and marketing photos for a `host_profile`, such as logos or pictures of a venue. This is distinct from a user's personal `profile_photos`.

| Column       | Type         | Description                                              |
| ------------ | ------------ | -------------------------------------------------------- |
| `id`         | `uuid`       | Primary Key.                                             |
| `host_id`    | `uuid`       | Foreign key to `host_profiles.id`.                       |
| `image_url`  | `text`       | URL of the photo.                                        |
| `photo_type` | `text`       | The type of photo, e.g., 'logo', 'venue', 'promotional'. |
| `caption`    | `text`       | Optional caption for the photo.                          |
| `created_at` | `timestampz` |                                                          |

---

## 2. Interests

To facilitate user matching, we'll use a structured interest system.

### `interests` Table

A global, unique list of all possible interests.

| Column   | Type     | Description                                                        |
| -------- | -------- | ------------------------------------------------------------------ |
| `id`     | `serial` | Primary Key.                                                       |
| `name`   | `text`   | The name of the interest (e.g., "Hiking", "Vintage Film"). Unique. |
| `vector` | `vector` | The vector embedding of the interest's name, used for matching.    |

### `profile_interests` Table

A join table connecting user profiles to their interests.

| Column        | Type      | Description                          |
| ------------- | --------- | ------------------------------------ |
| `profile_id`  | `uuid`    | Foreign key to `social_profiles.id`. |
| `interest_id` | `integer` | Foreign key to `interests.id`.       |

---

## 3. Itinerary, Locations & Collaborators

To support dynamic, multi-stop events and give hosts powerful tools to describe their plans, we introduce the concepts of Itineraries, Locations, and Collaborators. This structure replaces the simple `location` and `facilitator_info` fields on the `events` table, providing a much more flexible and scalable foundation.

### `locations` Table

This table stores structured data for any physical location, whether it's a commercial venue or business fetched from Google Maps or a custom-pinned spot in a park.

| Column            | Type    | Description                                                              |
| ----------------- | ------- | ------------------------------------------------------------------------ |
| `id`              | `uuid`  | Primary Key.                                                             |
| `name`            | `text`  | The name of the location (e.g., "The Winslow" or "The big oak tree").    |
| `address`         | `text`  | The full street address, if available.                                   |
| `latitude`        | `float` | The precise latitude. Required.                                          |
| `longitude`       | `float` | The precise longitude. Required.                                         |
| `google_place_id` | `text`  | Optional. The unique identifier from Google Places for easy API lookups. |

### `event_itinerary_stops` Table

This is a join table that defines the journey of an event. Each event has one or more stops, ordered sequentially.

| Column        | Type         | Description                                                      |
| ------------- | ------------ | ---------------------------------------------------------------- |
| `id`          | `uuid`       | Primary Key.                                                     |
| `event_id`    | `uuid`       | Foreign key to `events.id`.                                      |
| `location_id` | `uuid`       | Foreign key to `locations.id`.                                   |
| `order`       | `integer`    | The sequence of this stop in the event's itinerary (1, 2, 3...). |
| `title`       | `text`       | A descriptive title for this stop (e.g., "Meet for coffee").     |
| `description` | `text`       | More details about this part of the event.                       |
| `start_time`  | `timestampz` | The scheduled time for this specific stop.                       |
| `end_time`    | `timestampz` | The scheduled end time for this specific stop.                   |

### `event_collaborators` Table

This table links an event to the people who are helping make it happen, replacing the old `facilitator_info` field. This allows for direct linking to Momento profiles if the collaborator is a user.

| Column         | Type         | Description                                                               |
| -------------- | ------------ | ------------------------------------------------------------------------- |
| `id`           | `uuid`       | Primary Key                                                               |
| `event_id`     | `uuid`       | Foreign key to `events.id`                                                |
| `user_id`      | `uuid`       | Optional foreign key to `users.id` if the collaborator is a Momento user. |
| `role`         | `text`       | The collaborator's role (e.g., 'Co-host', 'Instructor', 'Guide').         |
| `first_name`   | `text`       | Required if `user_id` is null. The collaborator's first name.             |
| `last_name`    | `text`       | Optional. The collaborator's last name.                                   |
| `phone_number` | `text`       | Optional. The collaborator's phone number.                                |
| `created_at`   | `timestampz` |                                                                           |

---

## 4. Events, Invitations & Attendance

### `events` Table

Defines a specific event created by a host. The event's location, timing, and facilitators are now handled by the `event_itinerary_stops` and `event_collaborators` tables, respectively.

| Column                 | Type         | Description                                                                                                                             |
| ---------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | `uuid`       | Primary Key.                                                                                                                            |
| `host_id`              | `uuid`       | Foreign key to `host_profiles.id`.                                                                                                      |
| `title`                | `text`       | Title of the event.                                                                                                                     |
| `description`          | `text`       | A detailed, rich-text description of the event.                                                                                         |
| `event_vector`         | `vector`     | The vector embedding of the event's description, used for matching.                                                                     |
| `status`               | `text`       | e.g., 'draft', 'published', 'completed', 'cancelled'.                                                                                   |
| `min_attendees`        | `integer`    | Minimum number of attendees for the event to happen.                                                                                    |
| `max_attendees`        | `integer`    | Maximum number of attendees for the event.                                                                                              |
| `age_min`              | `integer`    | Minimum age requirement for attendees.                                                                                                  |
| `age_max`              | `integer`    | Maximum age requirement for attendees.                                                                                                  |
| `arrival_signpost`     | `text`       | A clear, real-world cue for attendees to find the group (e.g., "Look for the red balloon").                                             |
| `confirmation_fee`     | `integer`    | The non-refundable fee in cents paid to Momento to confirm attendance (e.g., 500 for $5.00).                                            |
| `estimated_event_cost` | `jsonb`      | An object representing the expected cost paid at the event. e.g., `{ "range": "$$", "details": "for food" }`. Not processed by Momento. |
| `created_at`           | `timestampz` |                                                                                                                                         |

### `invitations` Table

Tracks which users are invited to which events and their status.

| Column           | Type         | Description                                                                                                                    |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`             | `uuid`       | Primary Key.                                                                                                                   |
| `event_id`       | `uuid`       | Foreign key to `events.id`.                                                                                                    |
| `profile_id`     | `uuid`       | Foreign key to `social_profiles.id` (the invitee).                                                                             |
| `status`         | `text`       | e.g., 'sent', 'confirmed', 'declined', 'expired', 'payment_failed', 'cancelled'. 'confirmed' means the user accepted and paid. |
| `decline_reason` | `text`       | Optional. Stores the reason a user declined, e.g., 'busy', 'not_interested', 'wants_variety'.                                  |
| `match_reason`   | `text`       | Optional. A system-generated, human-readable string explaining why the user was matched to this event.                         |
| `created_at`     | `timestampz` |                                                                                                                                |
| `updated_at`     | `timestampz` |                                                                                                                                |

### `attendance` Table

Tracks who actually attended an event, as reported post-event.

| Column                   | Type         | Description                                                                                      |
| ------------------------ | ------------ | ------------------------------------------------------------------------------------------------ |
| `id`                     | `uuid`       | Primary Key.                                                                                     |
| `event_id`               | `uuid`       | Foreign key to `events.id`.                                                                      |
| `profile_id`             | `uuid`       | Foreign key to `social_profiles.id` of the attendee.                                             |
| `status`                 | `text`       | e.g., 'attended', 'cancelled_late', 'no_show', 'check_in_abandoned'. Reported by attendees/host. |
| `check_in_latitude`      | `float`      | Optional. The latitude recorded at the moment of check-in.                                       |
| `check_in_longitude`     | `float`      | Optional. The longitude recorded at the moment of check-in.                                      |
| `reported_by_profile_id` | `uuid`       | Foreign key to `social_profiles.id` of who is reporting.                                         |
| `created_at`             | `timestampz` |                                                                                                  |

---

## 5. Feedback & Messaging

For MVP, we will have two distinct communication systems: a public "Event Post" feed and private 1-on-1 messaging unlocked after an event.

### `ratings` Table

Stores feedback provided by participants after an event.

| Column               | Type         | Description                                                     |
| -------------------- | ------------ | --------------------------------------------------------------- |
| `id`                 | `uuid`       | Primary Key.                                                    |
| `event_id`           | `uuid`       | Foreign key to `events.id`.                                     |
| `rater_profile_id`   | `uuid`       | Foreign key to `social_profiles.id` (who is giving the rating). |
| `rated_host_id`      | `uuid`       | Foreign key to `host_profiles.id` (who is being rated).         |
| `host_rating_value`  | `integer`    | e.g., a score from 1 to 5 for the host.                         |
| `event_rating_value` | `integer`    | e.g., a score from 1 to 5 for the event.                        |
| `comment`            | `text`       | Optional public comment.                                        |
| `created_at`         | `timestampz` |                                                                 |

### `attendee_kudos` Table

This table stores positive, private affirmations given from one attendee to another after an event. This data is used to calculate the `contribution_score`.

| Column                | Type         | Description                                                         |
| --------------------- | ------------ | ------------------------------------------------------------------- |
| `id`                  | `uuid`       | Primary Key.                                                        |
| `event_id`            | `uuid`       | Foreign key to `events.id`.                                         |
| `giver_profile_id`    | `uuid`       | Foreign key to `social_profiles.id` (the user giving the kudo).     |
| `receiver_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (the user receiving the kudo).  |
| `kudo`                | `text`       | The specific kudo given (e.g., 'great_listener', 'welcoming_vibe'). |
| `created_at`          | `timestampz` |                                                                     |

### `event_posts` Table

The public message feed for an event. The application logic will determine what name and avatar to show based on whether the posting user is the host or a participant.

| Column       | Type         | Description                              |
| ------------ | ------------ | ---------------------------------------- |
| `id`         | `uuid`       | Primary Key.                             |
| `event_id`   | `uuid`       | Foreign key to `events.id`.              |
| `user_id`    | `uuid`       | Foreign key to `users.id` of the poster. |
| `content`    | `text`       | The message content.                     |
| `created_at` | `timestampz` |                                          |

### Post-Event Direct Messaging

A standard schema for private 1-on-1 conversations between event attendees.

#### `conversations`

| Column       | Type         | Description  |
| ------------ | ------------ | ------------ |
| `id`         | `uuid`       | Primary Key. |
| `created_at` | `timestampz` |              |

#### `conversation_participants`

| Column            | Type   | Description                          |
| ----------------- | ------ | ------------------------------------ |
| `conversation_id` | `uuid` | Foreign key to `conversations.id`.   |
| `profile_id`      | `uuid` | Foreign key to `social_profiles.id`. |

#### `messages`

| Column              | Type         | Description                          |
| ------------------- | ------------ | ------------------------------------ |
| `id`                | `uuid`       | Primary Key.                         |
| `conversation_id`   | `uuid`       | Foreign key to `conversations.id`.   |
| `sender_profile_id` | `uuid`       | Foreign key to `social_profiles.id`. |
| `content`           | `text`       | The message content.                 |
| `created_at`        | `timestampz` |                                      |

---

## 6. Connections & Memories

To support the "Memory Book" feature, this table stores the relationship between two users who have met at an event, along with private, user-specific metadata.

### `connections` Table

| Column                                     | Type         | Description                                                                                                 |
| ------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------- |
| `id`                                       | `uuid`       | Primary Key.                                                                                                |
| `user_profile_id`                          | `uuid`       | Foreign key to `social_profiles.id` (the owner of this connection record).                                  |
| `connected_profile_id`                     | `uuid`       | Foreign key to `social_profiles.id` (the person they met).                                                  |
| `event_id`                                 | `uuid`       | Foreign key to `events.id` (the event where they first met).                                                |
| `connected_profile_snapshot_name`          | `text`       | Snapshot of the connected user's first name at the time of the event.                                       |
| `connected_profile_snapshot_face_card_url` | `text`       | Snapshot of the URL for the connected user's stylized Face Card at the time of the event.                   |
| `was_photo_authentic`                      | `boolean`    | Snapshot of whether the connected user had an "Authentic" photo badge at the time of the event.             |
| `is_favorite`                              | `boolean`    | Defaults to `false`. True if the user has favorited this connection for their own organization.             |
| `wants_to_connect_again`                   | `boolean`    | Defaults to `false`. True if the user wants to attend another event with them. A signal for the backend.    |
| `does_not_want_to_connect_again`           | `boolean`    | Defaults to `false`. A private signal that the user does not want to attend another event with this person. |
| `private_notes`                            | `text`       | User's private notes about this connection, visible only to them.                                           |
| `created_at`                               | `timestampz` |                                                                                                             |

### `user_social_links` Table

Stores the social media links a user has associated with their account. This information is private by default and only shared explicitly via the "Social Connect" feature, unless a host chooses to make a link public on their Host Profile.

| Column                      | Type         | Description                                                                                                                                                |
| --------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                        | `uuid`       | Primary Key.                                                                                                                                               |
| `user_id`                   | `uuid`       | Foreign key to `users.id`.                                                                                                                                 |
| `platform`                  | `text`       | The social media platform (e.g., 'instagram', 'twitter', 'linkedin').                                                                                      |
| `url`                       | `text`       | The full URL to the user's profile.                                                                                                                        |
| `is_public_on_host_profile` | `boolean`    | Defaults to `false`. If `true`, this link will be publicly visible on the user's `host_profile`. Can only be set to `true` if the user has a host profile. |
| `created_at`                | `timestampz` |                                                                                                                                                            |

### `social_connections` Table

This join table acts as a permissions layer, tracking which user has shared which social link with whom. This is a silent action that does not trigger a notification.

| Column                | Type         | Description                                                             |
| --------------------- | ------------ | ----------------------------------------------------------------------- |
| `id`                  | `uuid`       | Primary Key.                                                            |
| `sharer_profile_id`   | `uuid`       | Foreign key to `social_profiles.id` (the user initiating the share).    |
| `receiver_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (the user receiving the share).     |
| `social_link_id`      | `uuid`       | Foreign key to `user_social_links.id` (the specific link being shared). |
| `created_at`          | `timestampz` |                                                                         |

_Note: To ensure a link is only shared once between two people, the primary key could be a composite of (`sharer_profile_id`, `receiver_profile_id`, `social_link_id`)._

### `event_photos` Table

This table stores photos uploaded by attendees to a shared event gallery.

| Column             | Type         | Description                                                          |
| ------------------ | ------------ | -------------------------------------------------------------------- |
| `id`               | `uuid`       | Primary Key.                                                         |
| `event_id`         | `uuid`       | Foreign key to `events.id`. Links the photo to a specific event.     |
| `uploader_user_id` | `uuid`       | Foreign key to `users.id`. Tracks who uploaded the photo.            |
| `image_url`        | `text`       | URL of the photo (likely in a Supabase Storage bucket).              |
| `status`           | `text`       | For moderation, e.g., 'visible', 'hidden_by_host', 'pending_review'. |
| `created_at`       | `timestampz` |                                                                      |

---

## 7. Monetization

To handle payments for event invitations, we'll need a table to track individual transactions. The `users` table already includes a `payment_customer_id` to link a user with their Stripe Customer object.

### `payments` Table

This table will store a record for each payment attempt made by a user.

| Column             | Type         | Description                                                                           |
| ------------------ | ------------ | ------------------------------------------------------------------------------------- |
| `id`               | `uuid`       | Primary Key.                                                                          |
| `user_id`          | `uuid`       | Foreign key to `users.id` (the payer).                                                |
| `event_id`         | `uuid`       | Foreign key to `events.id` (the event being paid for).                                |
| `amount_in_cents`  | `integer`    | The charge amount in the smallest currency unit (e.g., 500 for $5.00).                |
| `currency`         | `text`       | The currency of the charge (e.g., "usd").                                             |
| `status`           | `text`       | The status of the payment from the provider (e.g., 'succeeded', 'pending', 'failed'). |
| `stripe_charge_id` | `text`       | The unique charge identifier from Stripe for reconciliation. Unique.                  |
| `created_at`       | `timestampz` |                                                                                       |

### `blocked_users` Table

This table stores a record of which users have blocked others, creating a hard stop for all interactions.

| Column            | Type         | Description                                                |
| ----------------- | ------------ | ---------------------------------------------------------- |
| `blocker_user_id` | `uuid`       | Foreign key to `users.id` (the user initiating the block). |
| `blocked_user_id` | `uuid`       | Foreign key to `users.id` (the user being blocked).        |
| `created_at`      | `timestampz` |                                                            |

_Note: The primary key for this table would be a composite of (`blocker_user_id`, `blocked_user_id`)._

### `reports` Table

This table logs formal reports submitted by users for review by the Momento team.

| Column             | Type         | Description                                                           |
| ------------------ | ------------ | --------------------------------------------------------------------- |
| `id`               | `uuid`       | Primary Key.                                                          |
| `reporter_user_id` | `uuid`       | Foreign key to `users.id` (who filed the report).                     |
| `reported_user_id` | `uuid`       | Foreign key to `users.id` (who is being reported).                    |
| `category`         | `text`       | The category of violation (e.g., 'harassment', 'spam').               |
| `comments`         | `text`       | The detailed comments provided by the reporter.                       |
| `status`           | `text`       | The internal status of the report (e.g., 'pending', 'resolved').      |
| `event_id`         | `uuid`       | **Nullable**. Foreign key to `events.id` where the incident occurred. |
| `created_at`       | `timestampz` |                                                                       |

---

## 8. App Support & Moderation

This section defines the data models for user safety, moderation, and direct user-to-app support channels.

### `support_tickets` Table

This table logs direct support requests from a user to the Momento team. It is separate from the user-to-user `reports` system.

| Column                  | Type         | Description                                                                                                                |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | `uuid`       | Primary Key.                                                                                                               |
| `ticket_number`         | `bigserial`  | A unique, sequential, user-facing ID for reference (#1001, #1002).                                                         |
| `submitter_user_id`     | `uuid`       | Foreign Key to `users.id`. The backend can check if this user also has a `host_profiles` record to determine their role.   |
| `reply_to_email`        | `text`       | The email address to which support replies will be sent. Captured at the time of ticket submission.                        |
| `category`              | `text`       | The main category selected by the user (e.g., 'technical_issue', 'payment_question', 'hosting_question', 'account_issue'). |
| `body`                  | `text`       | The main message content from the user.                                                                                    |
| `status`                | `text`       | Internal status (e.g., 'new', 'open', 'resolved', 'closed').                                                               |
| `associated_event_id`   | `uuid`       | **Nullable**. Foreign key to `events.id`. For issues related to a specific event.                                          |
| `associated_payment_id` | `uuid`       | **Nullable**. Foreign key to `payments.id`. For issues related to a specific transaction.                                  |
| `metadata`              | `jsonb`      | Flexible field for auto-attached, non-user-facing diagnostic info (e.g., `{ "app_version": "1.2.3", "os": "iOS 17.1" }`).  |
| `created_at`            | `timestampz` |                                                                                                                            |
| `updated_at`            | `timestampz` |                                                                                                                            |

---

## 10. Notifications

To handle push and SMS notifications and respect user preferences, the following tables are required.

### `push_notification_tokens` Table

This table stores the unique push tokens for each of a user's devices, allowing the backend to send notifications via a service like Expo Push Notifications.

| Column | Type   | Description |
| ------ | ------ | ----------- |
| `id`   | `uuid` |
