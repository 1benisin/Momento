# Notification Strategy & Implementation Plan

This document outlines the complete plan for user notifications, covering four key areas:

- **[Services & Architecture](#1-services--architecture)**: Details the technology stack (Expo for Push, Twilio for SMS) and the Supabase Edge Function architecture that will power the system.
- **[Database Schema Additions](#2-database-schema-additions)**: Defines the new `push_notification_tokens` and `user_notification_settings` tables required to store device tokens and user preferences.
- **[Notification Triggers & Content](#3-notification-triggers--content)**: A comprehensive list of every notification in the app, categorized by type (Event, Social, Account) with suggested message content.
- **[Advanced Scenarios & Best Practices](#4-advanced-scenarios--best-practices)**: Discusses implementation details for more complex features like chat message bundling, deep linking, and in-app notifications.

---

## 1. Services & Architecture

We will use a combination of services to handle different types of notifications, all orchestrated by our Supabase backend.

- **Push Notifications (In-App & System):** **Expo Push Notifications**

  - **Why:** As we are using Expo, this is the most tightly integrated and straightforward solution. It provides a single API for both iOS and Android and can be triggered directly from our backend.
  - **Implementation:** We will use `expo-notifications` on the client-side to request permissions and receive notifications. Push tokens for each device will be stored in our database.

- **SMS Notifications:** **Twilio**
  - **Why:** Twilio is a reliable, industry-standard service for programmable SMS. Your `ROADMAP.md` already identified this as a potential service.
  - **Implementation:** We will use the Twilio SDK within a Supabase Edge Function to send SMS messages. This keeps our API keys and logic secure on the server side.

### Backend Architecture: Supabase

The core logic for sending notifications will reside in **Supabase Edge Functions**. This is ideal for several reasons:

1.  **Security:** API keys for Expo and Twilio are kept off the client app.
2.  **Triggers:** Functions can be invoked in various ways:
    - **Database Webhooks:** A change in a table (e.g., a new row in `invitations`) can automatically trigger a function to send a notification.
    - **Cron Jobs:** We can schedule functions to run at specific intervals for reminders (e.g., "Your event starts in 1 hour").
    - **Directly from the Client:** The app can call an Edge Function for complex, on-demand notifications (like calculating travel time).

---

## 2. Database Schema Additions

To support notifications and user preferences, we need two new tables. These should be added to our primary data model.

### `push_notification_tokens` Table

Stores the unique push tokens for each user's device(s).

| Column        | Type         | Description                                                      |
| ------------- | ------------ | ---------------------------------------------------------------- |
| `id`          | `uuid`       | Primary Key.                                                     |
| `user_id`     | `uuid`       | Foreign key to `users.id`.                                       |
| `token`       | `text`       | The push token from Expo. Must be unique.                        |
| `device_info` | `text`       | Optional, human-readable info about the device (e.g., "iPhone"). |
| `created_at`  | `timestampz` |                                                                  |

### `user_notification_settings` Table

Stores each user's preferences for receiving different types of notifications. Our backend logic **must** query this table before sending any notification to respect user choice.

| Column                    | Type         | Description                                                                 |
| ------------------------- | ------------ | --------------------------------------------------------------------------- |
| `user_id`                 | `uuid`       | Primary Key. Foreign key to `users.id`.                                     |
| `sms_invitations`         | `boolean`    | Defaults to `true`. User agrees to receive new invitations via SMS.         |
| `sms_reminders`           | `boolean`    | Defaults to `true`. User agrees to receive event start reminders via SMS.   |
| `push_event_invitations`  | `boolean`    | Defaults to `true`. Push notifications for new & expiring invitations.      |
| `push_event_updates`      | `boolean`    | Defaults to `true`. Push notifications for event changes and confirmations. |
| `push_event_reminders`    | `boolean`    | Defaults to `true`. Push notifications for upcoming events.                 |
| `push_direct_messages`    | `boolean`    | Defaults to `true`. Push notifications for new DMs.                         |
| `push_social`             | `boolean`    | Defaults to `true`. Push notifications for kudos, matches, etc.             |
| `push_account_and_safety` | `boolean`    | Defaults to `true`. Push notifications for payments, reports, etc.          |
| `updated_at`              | `timestampz` |                                                                             |

---

## 3. Notification Triggers & Content

Here is a brainstormed list of potential notifications, their triggers, and suggested content.

### Event-Related Notifications

| Event Trigger                                       | Type | Audience               | Message Content                                                                                    |
| --------------------------------------------------- | ---- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| **New Invitation**                                  | Push | Invited User           | "You have a new event invitation! ✨ Tap to see what's in store."                                  |
|                                                     | SMS  | Invited User (Opt-in)  | "You're invited! A new Momento event is waiting for you. Tap to view: [link]"                      |
| **Invitation Expires Soon** (e.g., 1hr left)        | Push | Invited User           | "Your invitation to '[Event Title]' expires in 1 hour. Don't miss out!"                            |
| **Event Confirmed**                                 | Push | Attendee               | "You're confirmed for '[Event Title]'! Get ready for a great time."                                |
| **Event Reminder (24hr)**                           | Push | Confirmed Attendees    | "Get ready! '[Event Title]' is tomorrow at [Time]."                                                |
| **Event Reminder (1hr)**                            | Push | Confirmed Attendees    | "It's almost time for '[Event Title]'! It starts in 1 hour."                                       |
|                                                     | SMS  | Confirmed Attendees    | "Reminder: '[Event Title]' starts in 1 hour at [Location Name]. See you there!"                    |
| **15m after start, if not checked-in**              | Push | Un-checked-in Attendee | "'[Event Title]' has started! If you've arrived, don't forget to check in to find your group."     |
| **Event Details Updated** (Time, Location, etc.)    | Push | Confirmed Attendees    | "Update for '[Event Title]': The [start time] has changed. Tap to see the new details."            |
|                                                     | SMS  | Confirmed Attendees    | "Update for Momento event '[Event Title]': The details have changed. View them here: [link]"       |
| **Event Cancelled**                                 | Push | Confirmed Attendees    | "Unfortunately, '[Event Title]' has been cancelled. We've processed your refund."                  |
|                                                     | SMS  | Confirmed Attendees    | "Momento event cancelled: '[Event Title]' has been cancelled. Your refund has been processed."     |
| **Host Check-in Reminder** (15m after start)        | Push | Event Host             | "Looks like a few guests haven't checked in to '[Event Title]'. You can see who on the dashboard." |
| **New Post in Event Feed**                          | Push | Host & Attendees       | `'[User Name]' posted in '[Event Title]': "[Post Preview...]"`                                     |
| **Host Has Arrived**                                | Push | Checked-in Attendees   | "Your host, [Host Name], has arrived at '[Event Title]'!"                                          |
| **Post-Event Feedback Reminder** (e.g., 12hr after) | Push | Attended Users         | "How was '[Event Title]'? Share your feedback to unlock messaging and see who you met."            |

### Social & Messaging Notifications

| Event Trigger                    | Type | Audience           | Message Content                                                                             |
| -------------------------------- | ---- | ------------------ | ------------------------------------------------------------------------------------------- |
| **New Direct Message**           | Push | Message Recipient  | "[Sender Name]: [Message Preview...]" (See best practices note below)                       |
| **New Kudo Received**            | Push | Kudo Recipient     | "You received a new kudo! ✨ Someone at your last event said you have a 'Welcoming Vibe'."  |
| **Mutual "Connect Again" Match** | Push | Both Users         | "You have a new mutual connection! You and [Other User's Name] both want to connect again." |
| **New Photos Added**             | Push | Attendees (Opt-in) | "New photos were added to '[Event Title]'! Tap to see what you missed." (Bundled)           |
| **Photo Reported**               | Push | Event Host         | "A photo in your event '[Event Title]' was reported. Please review it."                     |
| **Photo Removed by Host**        | Push | Photo Uploader     | "Your photo from '[Event Title]' was removed by the host."                                  |

### Account & Safety Notifications

| Event Trigger                          | Type | Audience | Message Content                                                                                   |
| -------------------------------------- | ---- | -------- | ------------------------------------------------------------------------------------------------- |
| **Payment Succeeded**                  | Push | User     | "Your payment for '[Event Title]' was successful. You're all set!"                                |
| **Payment Failed**                     | Push | User     | "Your payment for '[Event Title]' failed. Please update your payment method to secure your spot." |
| **Report Status Update**               | Push | Reporter | "Update on your report: We have reviewed your report and taken appropriate action."               |
| **"Authentic" Photo Badge Expiration** | Push | User     | "Your 'Authentic' photo badge is expiring soon. Take a new photo to keep your profile trusted."   |

---

## 4. Advanced Scenarios & Best Practices

- **Chat Message Bundling:** To avoid overwhelming users, we should not send a push notification for every single chat message. A better approach is to "bundle" them.

  - **Strategy:** When a message is received, the backend function should wait for a short period (e.g., 1-2 minutes). If no other messages arrive for that user in that window, it sends a single notification ("You have new messages from [Sender Name]"). If more messages arrive, the timer resets.

- **Deep Linking:** All notifications should use deep links. Tapping a notification for an event invitation should take the user directly to that invitation screen in the app, not just the home screen. Expo's Linking library combined with Expo Router handles this well.

- **In-App Notifications:** For notifications while the user is actively using the app (e.g., a new message arrives), we should not use a push notification. Instead, we can use an in-app solution like a temporary banner or toast message at the top of the screen. This can be managed with a global state listener that subscribes to real-time events from Supabase.
