# App Features

This document outlines the core features of the Momento application.

## 1. User Profiles

User profiles will contain three categories of information:

- **Public Information**: Profile images, first name, etc.
- **Private Information**: Phone number, email, etc., visible only to the user.
- **Internal Information**: Data used by the app for ranking and matching purposes, not visible to the user. This includes:
  - A record of profiles the user has liked.
  - An "absentee rating" (for tracking no-shows or lateness).
  - An internal "attractiveness rating" to assist in matching users with others in a similar range.
- **Future Experiment**: Requiring at least one profile picture to be taken through the in-app camera to ensure it is recent and unedited.

## 2. Interest Building Flow

This is a critical onboarding process to understand users' passions and interests.

- The flow will walk users through theoretical event scenarios to gauge their interest.
- The goal is to build a multidimensional map of interests to create user clusters for better matching.
- It will include deeper questions about life goals, values, and political views.
- **Future Experiment**: An AI-driven voice conversation to conduct a user interview, with key information extracted from the transcript.
- **Future Experiment**: Allowing a user's selected friends or family to have a conversation with the AI to provide an outside perspective on the user.

## 3. Browsing Profiles

- Users will be able to browse a selection of other user profiles.
- They can "like" profiles, which provides data for the matching algorithm and helps determine the user's "type."

## 4. The Invitation

The invitation is a core part of the weekly user experience.

- Ideally, users receive one event invitation per week and have 24 hours to respond.
- Invitations will be sent via text message, featuring an image and a link to the app.
- **Future Ideal**: The host can choose from several AI-generated invitation images. The chosen image could be a looping GIF with subtle animations (e.g., leaves moving in a breeze, a sparkling line art design).
- The in-app invitation page will provide full details:
  - Event description, time, and location.
  - Estimated costs (e.g., average menu prices, ticket fees).
  - Minimum and maximum number of participants (min. 4).
  - Ratings for the host and/or venue.
- The app will curate invitees based on who is the best match for the event and other participants.
- A balanced male-to-female ratio will be a goal.
- Participants will not see who else is attending until after they arrive (or possibly after they accept).
- Participants will be able to message the host before the event for logistical questions.

## 5. Hosting

- Users and businesses can both create and host events.
- Hosts will have a dedicated Host Profile with ratings from past events.
- **Host Tools**:
  - Access to information and best practices for creating highly-rated events.
  - Insights from feedback on previous successful events.
- **Future Experiment**: AI tools to help with event creation, including:
  - AI-generated event names and descriptions.
  - AI-generated invitation images.
  - AI-powered idea generation and augmentation, suggesting ways to make an event more memorable based on feedback from similar events.

## 6. Post-Event Interaction

- The day after the event, participants will be prompted to provide feedback on the event and the host.
- They will also report if any participants were late or did not show up.
- After submitting feedback, participants will unlock the ability to message other attendees one-on-one.
- **Future Experiment**:
  - Allowing message posting on the event page itself (e.g., for a thank-you note from the host).
  - A feature for attendees to post pictures they took at the event.

The design will subtly encourage users to wait until after the event to exchange contact information, reinforcing that they can connect through the app.

## 7. Monetization & Payments

- **Model**: Participants will be charged a $5 fee upon accepting an event invitation. This fee confirms their spot and helps reduce no-shows.
- **Payment Flow**: Users can add a credit card to their private profile information at any time. If a user does not have a payment method on file when they accept their first invitation, they will be prompted to add one before their acceptance is confirmed.
- **Integration**: This requires integration with a third-party payment processor (e.g., Stripe) to securely handle credit card storage and transactions.
- **User-Facing Features**:
  - A dedicated "Payment Methods" screen where users can add or remove credit cards.
  - A "Transaction History" screen where users can see a list of their past payments.
  - Clear in-app prompts and confirmations for all charges.
  - Email receipts for successful payments.
- **Backend Requirements**:
  - Server-side logic to create and manage Stripe Customer objects.
  - Secure endpoints to handle payment intent creation and confirmation.
  - Webhooks to listen for payment status updates from Stripe (e.g., `charge.succeeded`).
