# Notification Strategy & Implementation Plan

This document outlines the complete plan for user notifications, covering four key areas:

- **[Services & Architecture](#1-services--architecture)**: Details the technology stack (Expo for Push, Twilio for SMS) and the Supabase Edge Function architecture that will power the system.
- **[Database Schema Additions](#2-database-schema-additions)**: Defines the new `push_notification_tokens` and `user_notification_settings` tables required to store device tokens and user preferences.
- **[Notification Triggers & Content](#3-notification-triggers--content)**: A comprehensive list of every notification in the app, categorized by type (Event, Social, Account) with suggested message content.
- **[Advanced Scenarios & Best Practices](#4-advanced-scenarios--best-practices)**: Discusses implementation details for more complex features like chat message bundling, deep linking, and in-app notifications.
- **[User-Facing Settings UI](#5-user-facing-settings-ui)**: Details the organized, context-grouped layout for the notification toggles as we designed.

---

## 1. Services & Architecture

We will use a combination of services to handle different types of notifications, all orchestrated by our Supabase backend.

- **Push Notifications (In-App & System):** **Expo Push Notifications**
  - **Why:** As we are using Expo, this is the most tightly integrated and straightforward solution. It provides a single API for both iOS and Android and can be triggered directly from our backend.
  - **Implementation:** We will use `expo-notifications` on the client-side to request permissions and receive notifications. Push tokens for each device will be stored in our database.

- **SMS Notifications:** **Twilio**
  - **Why:** Twilio is a reliable, industry-standard service for programmable SMS. Your `ROADMAP.md` already identified this as a potential service.
  - **Implementation:** We will use the Twilio SDK within a Supabase Edge Function to send SMS messages. This keeps our API keys and logic secure on the server side.

- **Transactional Email:** **Postmark** & **Stripe**
  - **Why:** We use a two-pronged approach for email. **Postmark** is a best-in-class service for developer-driven transactional emails (e.g., security alerts), ensuring maximum deliverability. For payment receipts, we will leverage **Stripe's** automated, compliant, and trusted email receipt system to save development time.
  - **Implementation:** Custom app-related emails will be sent via the Postmark API from a Supabase Edge Function. Payment receipts will be configured in the Stripe dashboard and sent automatically by Stripe.

### Backend Architecture: Convex

The core logic for sending notifications will reside in **Convex Functions**. This is ideal for several reasons:

1.  **Security:** API keys for Expo, Twilio, and Postmark are kept off the client app.
2.  **Triggers:** Functions can be invoked in various ways:
    - **Database Triggers:** A change in a table (e.g., a new row in `invitations`) can automatically trigger a function to send a notification.
    - **Cron Jobs (Scheduled Functions):** We can schedule functions to run at specific intervals for reminders (e.g., "Your event starts in 1 hour").
    - **Directly from the Client:** The app can call an Edge Function for complex, on-demand notifications (like calculating travel time).

---

## 2. Database Schema Additions

To support notifications and user preferences, our Convex data model has been updated.

### `push_notification_tokens` Table

This collection is defined in `_docs/DATA_MODELS.md`. It stores the unique push tokens for each user's device(s).

### Notification Settings (Embedded in `users` document)

The `user_notification_settings` table has been eliminated in the new Convex schema. This data is now stored as an **embedded object** directly within each `users` document. Our backend logic **must** query this object before sending any notification to respect user choice. This approach is more efficient as it reduces the number of database reads required to get a user's full profile and preferences.

---

## 3. Notification Triggers & Content

Here is a brainstormed list of potential notifications, their triggers, and suggested content.

### Event-Related Notifications

| Event Trigger                                       | Type | Audience               | Message Content                                                                                                                                                                          |
| --------------------------------------------------- | ---- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New Invitation**                                  | Push | Invited User           | "You have a new event invitation! ✨ Tap to see what's in store."                                                                                                                        |
|                                                     | SMS  | Invited User (Opt-in)  | "You're invited! A new Momento event is waiting for you. Tap to view: [link]"                                                                                                            |
| **Dynamic & Personalized Invitations**              | Push | Invited User           | _These are intelligent variations of the "New Invitation" notification, using user preferences to create a more compelling message. The backend will select the most relevant template._ |
| _(Variant: Perfect Match)_                          |      |                        | "We found a perfect match for you! '[Event Title]' is happening nearby and is right in your budget. Want in?"                                                                            |
| _(Variant: Distance-focused)_                       |      |                        | "An event just for you, right in your neighborhood! '[Event Title]' is only [X] miles away."                                                                                             |
| _(Variant: Price-focused)_                          |      |                        | "A great event that won't break the bank! '[Event Title]' is happening this week and fits your budget. Tap to see."                                                                      |
| **Invitation Expires Soon** (e.g., 1hr left)        | Push | Invited User           | "Your invitation to '[Event Title]' expires in 1 hour. Don't miss out!"                                                                                                                  |
| **Event Confirmed (Participant)**                   | Push | Attendee               | "You're confirmed for '[Event Title]'! Get ready for a great time."                                                                                                                      |
| **Event Confirmed (Host)**                          | Push | Event Host             | "Your event '[Event Title]' is now confirmed! We're sending out the invitations."                                                                                                        |
| **Event is Full**                                   | Push | Event Host             | "Your event '[Event Title]' is now full! Get ready to host a great experience."                                                                                                          |
| **Event Reminder (24hr)**                           | Push | Confirmed Attendees    | "Get ready! '[Event Title]' is tomorrow at [Time]."                                                                                                                                      |
| **Event Reminder (1hr)**                            | Push | Confirmed Attendees    | "It's almost time for '[Event Title]'! It starts in 1 hour."                                                                                                                             |
|                                                     | SMS  | Confirmed Attendees    | "Reminder: '[Event Title]' starts in 1 hour at [Location Name]. See you there!"                                                                                                          |
| **Save the Date (User Preference)**                 | Push | Confirmed Attendee     | "Heads up! '[Event Title]' is in [X] days. Make sure to clear your schedule."                                                                                                            |
| **15m after start, if not checked-in**              | Push | Un-checked-in Attendee | "'[Event Title]' has started! If you've arrived, don't forget to check in to find your group."                                                                                           |
| **Event Details Updated** (Time, Location, etc.)    | Push | Confirmed Attendees    | "Update for '[Event Title]': The details have changed. Please review and confirm your spot."                                                                                             |
|                                                     | SMS  | Confirmed Attendees    | "Update for Momento event '[Event Title]': The details have changed. View them here and confirm your spot: [link]"                                                                       |
| **Event Cancelled**                                 | Push | Confirmed Attendees    | "Unfortunately, '[Event Title]' has been cancelled. We've processed your refund."                                                                                                        |
|                                                     | SMS  | Confirmed Attendees    | "Momento event cancelled: '[Event Title]' has been cancelled. Your refund has been processed."                                                                                           |
| **Host Check-in Reminder** (15m after start)        | Push | Event Host             | "Looks like a few guests haven't checked in to '[Event Title]'. You can see who on the dashboard."                                                                                       |
| **New Post in Event Feed**                          | Push | Host & Attendees       | `'[User Name]' posted in '[Event Title]': "[Post Preview...]"`                                                                                                                           |
| **Host Has Arrived**                                | Push | Checked-in Attendees   | "Your host, [Host Name], has arrived at '[Event Title]'!"                                                                                                                                |
| **Post-Event Feedback Reminder** (e.g., 12hr after) | Push | Attended Users         | "How was '[Event Title]'? Share your feedback to unlock messaging and see who you met."                                                                                                  |

### Social & Messaging Notifications

| Event Trigger                    | Type | Audience           | Message Content                                                                                 |
| -------------------------------- | ---- | ------------------ | ----------------------------------------------------------------------------------------------- |
| **New Direct Message**           | Push | Message Recipient  | "[Sender Name]: [Message Preview...]" (See best practices note below)                           |
| **New Kudo Received**            | Push | Kudo Recipient     | "You received a new kudo! ✨ Someone at your last event said you have a 'Welcoming Vibe'."      |
| **Mutual "Connect Again" Match** | Push | Both Users         | "You have a new mutual connection! You and [Other User's Name] both want to connect again."     |
| **Duo Invitation Received**      | Push | Invited User       | "[User Name] wants to form a Dynamic Duo for your next event!"                                  |
| **Duo Pact Accepted**            | Push | Initiating User    | "[User Name] accepted your Duo invitation! We'll look for a great event for you both."          |
| **Duo Pact Expired**             | Push | Both Users         | "Your Dynamic Duo pact with [User Name] has expired. Form a new one to find an event together!" |
| **New Photos Added**             | Push | Attendees (Opt-in) | "New photos were added to '[Event Title]'! Tap to see what you missed." (Bundled)               |
| **Photo Reported**               | Push | Event Host         | "A photo in your event '[Event Title]' was reported. Please review it."                         |
| **Photo Removed by Host**        | Push | Photo Uploader     | "Your photo from '[Event Title]' was removed by the host."                                      |

### Account & Safety Notifications

| Event Trigger                          | Type  | Audience       | Message Content                                                                                                                                                                                                                                            |
| -------------------------------------- | ----- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Support Ticket Created**             | Email | User           | "We've received your request (#[Ticket Number]). Our team will review it and get back to you at the email address you provided. You can reply to this email with any additional details."                                                                  |
| **Payment Succeeded**                  | Email | User           | _This email is sent automatically by **Stripe**._                                                                                                                                                                                                          |
| **Payment Succeeded**                  | Push  | User           | "Your payment for '[Event Title]' was successful. You're all set!"                                                                                                                                                                                         |
| **Payment Failed**                     | Push  | User           | "Your payment for '[Event Title]' failed. Please update your payment method to secure your spot."                                                                                                                                                          |
| **Report Status Update**               | Email | Reporter       | "Update on your report: We have reviewed the details and have taken appropriate action based on our community guidelines."                                                                                                                                 |
| **Report Status Update**               | Push  | Reporter       | "Update on your report: We have reviewed your report and taken appropriate action."                                                                                                                                                                        |
| **Account Security Alert**             | Email | User           | "A sign-in attempt was made on a new device. If this was not you, please secure your account immediately."                                                                                                                                                 |
| **"Authentic" Photo Badge Expiration** | Push  | User           | "Your 'Authentic' photo badge is expiring soon. Take a new photo to keep your profile trusted."                                                                                                                                                            |
| **Account Recycling Initiated**        | Email | Original Owner | "A sign-in attempt was made on your Momento account with a new device, and the user claims to be new. If this was not you, your account's phone number will be unlinked in 24 hours for security. Please contact support if you believe this is an error." |
| **Account Recycling Complete**         | SMS   | New User       | "Welcome to Momento! You can now complete your sign-up."                                                                                                                                                                                                   |
| **Device Verification Requested**      | Email | User           | "A sign-in attempt was made from a new device. Click this link to verify and continue: [link]"                                                                                                                                                             |
| **Resend OTP**                         | SMS   | User           | "Your new Momento verification code is [Code]. This code will expire in 10 minutes."                                                                                                                                                                       |

---

## 4. Advanced Scenarios & Best Practices

- **Chat Message Bundling:** To avoid overwhelming users, we should not send a push notification for every single chat message. A better approach is to "bundle" them.
  - **Strategy:** When a message is received, the backend function should wait for a short period (e.g., 1-2 minutes). If no other messages arrive for that user in that window, it sends a single notification ("You have new messages from [Sender Name]"). If more messages arrive, the timer resets.

- **Deep Linking:** All notifications should use deep links. Tapping a notification for an event invitation should take the user directly to that invitation screen in the app, not just the home screen. Expo's Linking library combined with Expo Router handles this well.

- **In-App Notifications:** For notifications while the user is actively using the app (e.g., a new message arrives), we should not use a push notification. Instead, we can use an in-app solution like a temporary banner or toast message at the top of the screen. This can be managed with a global state listener that subscribes to real-time events from Supabase.

---

## 5. User-Facing Settings UI

To give users clear and granular control, the `NotificationSettingsScreen` (located under the `SettingsScreen` -> `Account Tab`) will present the toggles in logical groups. This keeps all notification settings in one predictable place while still separating them by context.

For a user who is both a participant and a host, the screen would be organized as follows:

#### **Push Notifications**

- `[Toggle]` **Social & Connections**
  - _New Kudos, Mutual Connections, new photos in event galleries, etc._
- `[Toggle]` **Direct Messages**
  - _Messages from other participants._
- `[Toggle]` **Event Invitations & Reminders**
  - _New invites, event updates, and reminders to provide feedback._

#### **Host Notifications**

_*This entire section is only visible to users with a Host profile.*_

- `[Toggle]` **Attendee Messages & Event Posts**
  - _Messages from your event attendees and posts in your event feeds._
- `[Toggle]` **Event & Attendee Updates**
  - _Event confirmed, event is full, check-in reports, etc._
- `[Toggle]` **Content Moderation**
  - _Reports on photos in your event galleries._

#### **SMS Notifications**

- `[Toggle]` **Event Invitations**
- `[Toggle]` **Event Reminders & Critical Updates**
  - _For event start times, cancellations, or major detail changes._

#### **Email Notifications**

- `[Toggle]` **Account & Safety**
  - _Critical alerts about your account security._
- `[Info]` **Payment Receipts**
  - _A note explaining that payment receipts are sent automatically by our payment processor, Stripe, and cannot be disabled._
