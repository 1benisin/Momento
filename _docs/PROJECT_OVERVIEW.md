# Project Overview

Momento is a social app designed to help people connect through curated, invite-only events. The goal is to move beyond traditional dating apps and foster genuine connections, both platonic and romantic, in small group settings.

The core of Momento is the "event" — a thoughtfully planned gathering hosted by a fellow user or a local organization. Participants are invited based on a deep, multi-dimensional understanding of their interests, passions, and personalities. Our goal is to move past superficial profile browsing and create the ideal conditions for genuine human connection to emerge, whether that's a new friendship or something more.

While designed to feel like more than just a dating app, Momento is built to help people connect in a low-pressure group setting, fostering both platonic and romantic relationships organically.

The app encourages living in the moment, assuring users that connection and communication with other attendees can happen through the app after the event, freeing them to be present and engaged during the experience itself.

## Monetization Model

Momento's primary revenue stream is a flat **$5 Confirmation Fee** charged to a participant when they accept an event invitation. This model is designed with two key principles in mind:

1.  **Commitment, Not Profit**: The fee's primary purpose is to act as a commitment device. It significantly reduces no-shows and ensures that when a user accepts an invitation, they are genuinely invested in attending. This creates a higher quality and more reliable experience for both participants and hosts.
2.  **Clarity and Transparency**: We are very clear with users that this fee is for securing their spot in a curated event. We do **not** process payments for any other event-related costs (e.g., tickets, food, class fees). Any such costs are handled directly between the participant and the host/venue, and are clearly labeled as an "Estimated Event Cost" on the event details screen.

## Technology Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router
- **Styling:** NativeWind
- **Backend:** Supabase
- **Payments:** Stripe (using `@stripe/stripe-react-native` on the client and `stripe-node` on the server)
- **Verification:** Stripe Identity
- **Transactional Email:** Postmark

---

## Future Ideas

_This section is a parking lot for concepts that are being considered for future versions of Momento but are explicitly out of scope for the initial launch._

- **Host Payment Processing**: In the future, we may offer hosts the ability to collect and process payments for their event costs (e.g., ticket prices) directly through the app. This would likely involve Momento taking a small processing fee. We are deferring this to avoid the significant financial, tax, and reporting complexities it introduces at this early stage.
