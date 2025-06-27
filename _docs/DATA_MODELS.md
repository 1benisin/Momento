# Data Models & Schemas

This document outlines the core data models for the Momento application. These schemas will serve as the foundation for our database structure, likely implemented in Supabase.

The design prioritizes clarity and scalability, separating concerns like user authentication, public profiles, and role-specific data.

---

## Core Entities

- **Users**: Handles authentication and private user data.
- **User Internal Metrics**: Stores internal-only scores and metrics for a user.
- **Social Profiles**: Public-facing information for event participants.
- **Host Profiles**: Public-facing information for users who host events.
- **Events**: The central entity for all gatherings.
- **Invitations**: Tracks which users are invited to which events and their response.
- **Attendance**: Tracks which participants attended an event.
- **Ratings**: Stores feedback given to hosts and events.
- **Interests**: A global catalog of possible user interests.
- **Profile Interests**: A join table linking profiles to their selected interests.
- **Event Posts**: A public message board for a specific event.
- **Conversations & Messages**: Powers private, post-event, 1-on-1 messaging.

---

## 1. Users & Profiles

We will separate private user data from public profile data. This enhances security and flexibility. For the MVP, we will distinguish between a standard `Social Profile` and a `Host Profile`.

### `users` Table

Stores private data directly linked to the Supabase Auth user. This information is never public.

| Column                | Type         | Description                                                    |
| --------------------- | ------------ | -------------------------------------------------------------- |
| `id`                  | `uuid`       | Primary Key. Foreign key to `auth.users.id`.                   |
| `email`               | `text`       | User's private email address.                                  |
| `phone_number`        | `text`       | User's private phone number.                                   |
| `last_name`           | `text`       | User's private last name.                                      |
| `birth_date`          | `date`       | User's date of birth, for age calculation.                     |
| `is_verified`         | `boolean`    | Defaults to `false`. True if user completed ID verification.   |
| `status`              | `text`       | e.g., 'active', 'suspended', 'verification_pending', 'banned'. |
| `payment_customer_id` | `text`       | Stripe (or other payment provider) customer ID.                |
| `created_at`          | `timestampz` |                                                                |

### `user_internal_metrics` Table

This table stores internal, system-generated data and metrics about a user. This data is never exposed to the user and is used exclusively for algorithms related to matching and event curation. In the future, this may also include qualitative data like AI interview transcripts.

| Column                           | Type         | Description                                                                                  |
| -------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `user_id`                        | `uuid`       | Primary Key. Foreign key to `users.id`. (One-to-One)                                         |
| `absentee_rating`                | `float`      | Tracks no-shows or lateness. A lower score is worse. Calculated from the `attendance` table. |
| `internal_attractiveness_rating` | `float`      | Internal score for matching. Not visible to user.                                            |
| `updated_at`                     | `timestampz` | Records the last time the metrics were updated.                                              |

### `social_profiles` Table

The default public profile for every user. This is what other participants see when browsing.

| Column                       | Type         | Description                                                               |
| ---------------------------- | ------------ | ------------------------------------------------------------------------- |
| `id`                         | `uuid`       | Primary Key.                                                              |
| `user_id`                    | `uuid`       | Foreign Key, linking to the `users` table. (One-to-One)                   |
| `first_name`                 | `text`       | User's public first name.                                                 |
| `preferred_name`             | `text`       | The name the user prefers to be called.                                   |
| `current_photo_id`           | `uuid`       | Foreign key to `profile_photos.id`, pointing to their main profile photo. |
| `current_face_card_photo_id` | `uuid`       | Foreign key to `profile_photos.id`, pointing to their stylized Face Card. |
| `bio`                        | `text`       | A short public biography.                                                 |
| `gender`                     | `text`       | User's self-identified gender.                                            |
| `occupation`                 | `text`       | User's occupation.                                                        |
| `location`                   | `text`       | General location (e.g., "Brooklyn, NY").                                  |
| `liked_profiles`             | `uuid[]`     | An array of `social_profile` IDs that this user has liked.                |
| `created_at`                 | `timestampz` |                                                                           |

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

A separate profile that a user can have if they choose to become a host.

| Column           | Type         | Description                                                      |
| ---------------- | ------------ | ---------------------------------------------------------------- |
| `id`             | `uuid`       | Primary Key.                                                     |
| `user_id`        | `uuid`       | Foreign Key, linking to the `users` table. (One-to-One)          |
| `host_name`      | `text`       | Public name of the host (can be different from their user name). |
| `host_bio`       | `text`       | A biography specific to their hosting activities.                |
| `average_rating` | `float`      | Calculated average from all event/host ratings.                  |
| `created_at`     | `timestampz` |                                                                  |

---

## 2. Interests

To facilitate user matching, we'll use a structured interest system.

### `interests` Table

A global, unique list of all possible interests.

| Column | Type     | Description                                                        |
| ------ | -------- | ------------------------------------------------------------------ |
| `id`   | `serial` | Primary Key.                                                       |
| `name` | `text`   | The name of the interest (e.g., "Hiking", "Vintage Film"). Unique. |

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

This table stores structured data for any physical location, whether it's a commercial business fetched from Google Maps or a custom-pinned spot in a park.

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

| Column             | Type         | Description                                                                        |
| ------------------ | ------------ | ---------------------------------------------------------------------------------- |
| `id`               | `uuid`       | Primary Key.                                                                       |
| `host_id`          | `uuid`       | Foreign key to `host_profiles.id`.                                                 |
| `title`            | `text`       | The name of the event.                                                             |
| `description`      | `text`       | Detailed description of the event.                                                 |
| `host_is_attendee` | `boolean`    | Defaults to `false`. If true, the host is also a participant.                      |
| `min_participants` | `integer`    | Minimum number of attendees required.                                              |
| `max_participants` | `integer`    | Maximum number of attendees allowed.                                               |
| `minimum_age`      | `integer`    | Optional minimum age requirement for attendees.                                    |
| `arrival_signpost` | `text`       | A real-world visual cue for attendees (e.g., "Look for the green picnic blanket"). |
| `estimated_cost`   | `text`       | A text description of potential costs (e.g., "$20-30 for dinner").                 |
| `status`           | `text`       | e.g., 'planned', 'confirmed', 'completed', 'cancelled'.                            |
| `created_at`       | `timestampz` |                                                                                    |

### `invitations` Table

Tracks the status of each invitation sent for an event. When an event is created with `host_is_attendee` set to `true`, application logic should automatically create a corresponding record here for the host's social profile with a `status` of `'confirmed'`.

| Column       | Type         | Description                                                                                                       |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `id`         | `uuid`       | Primary Key.                                                                                                      |
| `event_id`   | `uuid`       | Foreign key to `events.id`.                                                                                       |
| `profile_id` | `uuid`       | Foreign key to `social_profiles.id` (the invitee).                                                                |
| `status`     | `text`       | e.g., 'sent', 'confirmed', 'declined', 'expired', 'payment_failed'. 'confirmed' means the user accepted and paid. |
| `created_at` | `timestampz` |                                                                                                                   |
| `updated_at` | `timestampz` |                                                                                                                   |

### `attendance` Table

Tracks who actually attended an event, as reported post-event.

| Column                   | Type         | Description                                                                  |
| ------------------------ | ------------ | ---------------------------------------------------------------------------- |
| `id`                     | `uuid`       | Primary Key.                                                                 |
| `event_id`               | `uuid`       | Foreign key to `events.id`.                                                  |
| `profile_id`             | `uuid`       | Foreign key to `social_profiles.id` of the attendee.                         |
| `status`                 | `text`       | e.g., 'attended', 'no_show', 'late', 'disputed'. Reported by attendees/host. |
| `check_in_latitude`      | `float`      | Optional. The latitude recorded at the moment of check-in.                   |
| `check_in_longitude`     | `float`      | Optional. The longitude recorded at the moment of check-in.                  |
| `reported_by_profile_id` | `uuid`       | Foreign key to `social_profiles.id` of who is reporting.                     |
| `created_at`             | `timestampz` |                                                                              |

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

### `event_posts` Table

The public message feed for an event. Anonymized roles ("Host", "Attendee", "Invitee") will be handled by the application logic.

| Column       | Type         | Description                                        |
| ------------ | ------------ | -------------------------------------------------- |
| `id`         | `uuid`       | Primary Key.                                       |
| `event_id`   | `uuid`       | Foreign key to `events.id`.                        |
| `profile_id` | `uuid`       | Foreign key to `social_profiles.id` of the poster. |
| `content`    | `text`       | The message content.                               |
| `created_at` | `timestampz` |                                                    |

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

---

## 8. Common Queries & Data Relationships

This section clarifies how to retrieve common sets of related data using the schemas defined above. This approach avoids data duplication by querying for relationships rather than storing lists on individual records.

### How to find events a user has attended:

- **Query** the `attendance` table.
- **Filter** by the user's `social_profiles.id` in the `profile_id` column and where `status` is `'attended'`.
- This will return a list of all `event_id`s the user has successfully attended.

### How to find events a user has hosted:

- **Query** the `events` table.
- **Filter** by the user's `host_profiles.id` in the `host_id` column.
- This will return a list of all events created by that host.

### How to calculate a host's average rating:

- **Query** the `ratings` table.
- **Filter** by the `rated_host_id` to get all ratings for a specific host.
- **Aggregate** the `host_rating_value` column (e.g., calculate the average). This result can then be updated on the `host_profiles.average_rating` field.

### How to find the average rating of events a user has attended:

- **Query** the `attendance` table to find all `event_id`s for a given `profile_id` where `status` is `'attended'`.
- **Query** the `ratings` table using those `event_id`s.
- **Aggregate** the `event_rating_value` column from the results to calculate the average.

### How to get a user's interests:

- **Query** the `profile_interests` join table.
- **Filter** by the user's `social_profiles.id` to get all corresponding `interest_id`s.
- **Join** with the `interests` table to retrieve the names of each interest.

### How to find mutual "Connect Again" matches:

- **Join** the `connections` table with itself.
- **Match** where `c1.user_profile_id = c2.connected_profile_id` and `c1.connected_profile_id = c2.user_profile_id`.
- **Filter** for records where `c1.wants_to_connect_again = true` and `c2.wants_to_connect_again = true`.
- This will produce pairs of users who have mutually expressed interest in connecting again.

---

## 9. Safety & Moderation

To support user safety and community health, the following tables will be used to manage blocks and formal reports.

### `blocked_users` Table

This table stores a record of which users have blocked others, creating a hard stop for all interactions.

| Column               | Type         | Description                                                          |
| -------------------- | ------------ | -------------------------------------------------------------------- |
| `blocker_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (the user initiating the block). |
| `blocked_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (the user being blocked).        |
| `created_at`         | `timestampz` |                                                                      |

_Note: The primary key for this table would be a composite of (`blocker_profile_id`, `blocked_profile_id`)._

### `reports` Table

This table logs formal reports submitted by users for review by the Momento team.

| Column                | Type         | Description                                                      |
| --------------------- | ------------ | ---------------------------------------------------------------- |
| `id`                  | `uuid`       | Primary Key.                                                     |
| `reporter_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (who filed the report).      |
| `reported_profile_id` | `uuid`       | Foreign key to `social_profiles.id` (who is being reported).     |
| `category`            | `text`       | The category of violation (e.g., 'harassment', 'spam').          |
| `comments`            | `text`       | The detailed comments provided by the reporter.                  |
| `status`              | `text`       | The internal status of the report (e.g., 'pending', 'resolved'). |
| `created_at`          | `timestampz` |                                                                  |
