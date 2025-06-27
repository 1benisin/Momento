Momento Product Roadmap
This document outlines the planned development journey for Momento. It serves as a strategic guide to prioritize features and organize our work into logical phases.

This is a living document. Priorities may shift based on user feedback and development learnings. The phases represent a general order of implementation, not strict deadlines.

## Guiding Principles

Our roadmap is guided by these core principles:

- **Foster Genuine Connection:** Every feature should make it easier for people to have meaningful interactions.
- **Prioritize Quality over Quantity:** Focus on creating magical, high-quality curated events, not just a high volume of them.
- **Embrace the Magic:** The design and user experience should feel special, intentional, and a little bit magical.
- **Build the Core Loop First:** We must first perfect the cycle of hosting, inviting, attending, and connecting before adding complexity.

_Note on UI/UX: While the long-term vision is a unique "magical" aesthetic, the MVP will prioritize a clean, standard, and functional UI to accelerate development. The magical elements will be layered in future phases._

## Phase 1: Foundation (The Core MVP Loop)

This phase focuses on building the absolute essential features required for the app to function and deliver its core value proposition. This is the Minimum Viable Product.

**[Epic #001] User Authentication & Basic Profiles:**

- Sign up/Login with Supabase Auth.
- Basic user profiles: name, profile image, public bio.
- Storage for private info (email, phone, credit card).
- Optional ID verification flow for users to get a "Verified" badge.

**[Epic #002] User Host Profiles (V1):**

- Ability for a basic user to upgrade to a "User Host" profile.
- **Mandatory ID verification** required before a host profile can be created.
- Displays ratings from past events they've hosted.

**[Epic #003] Business Host Profiles (V1):**

- Separate profile type for businesses/service providers.
- **Mandatory ID verification** for the primary business contact.
- Basic info: name, location, pictures, description.

**[Epic #004] Basic Interest Building Flow:**

- Onboarding flow for new users.
- Users can select interests from a predefined list and add their own as free-form tags.
- This data will be the initial foundation for the matching algorithm.

**[Epic #005] Payment Integration (V1):**

- Integration with Stripe for payment processing.
- Implement the `payments` table in the database.
- Create a "Payment Methods" screen in the app for users to manage their cards.
- Integrate the payment flow into the event invitation acceptance process.
- Logic to charge a participant $5 upon accepting an event invitation.
- Set up backend webhooks to securely listen for transaction status updates from Stripe.

**[Epic #006] Simple Event Hosting Flow:**

- A user or business host can create a new event.
- Fields: Title, Description, Date/Time, Location, Min/Max participants, optional Minimum Age.
- Add a checkbox for the host to join as an attendee, counting them toward the participant total.

**[Epic #007] Core Invitation Flow (App-Curated):**

- Internal logic to curate and send event invitations to a list of users based on the basic interest data.
- In-app notification and invitation screen.
- Users can accept or decline.

**[Epic #008] Post-Event Feedback & Connection:**

- A simple post-event feedback form (rate the event/host).
- Unlock 1-on-1 messaging between event attendees after feedback is submitted.
- Track attendance (showed up / no-show).

**[Epic #009] Calendar Integration:**

- On the invitation confirmation screen, add an "Add to Calendar" button.
- Implement logic to generate and download a standard `.ics` calendar file.
- Requires schema change to add `end_time` to `event_itinerary_stops`.

## Phase 2: Growth (Enriching the Experience)

With the core loop in place, this phase is about making the experience richer, more intelligent, and more engaging.

**[Epic #XXX] Advanced Interest & Passion Building Flow:**

- Onboarding questionnaire to capture user interests and preferences in greater detail.
- Walkthrough of theoretical events to build a richer user profile.
- Store this data for more nuanced matching.

**[Epic #XXX] Internal User Ratings (V1):**

- Formalize the "absentee rating" based on no-show data collected in Phase 1.
- Use this rating as a factor in the event curation algorithm.

**[Epic #XXX] Profile Browse & Liking:**

- A simple feed to browse other user profiles.
- Ability to "like" profiles to feed the matching algorithm.

**[Epic #XXX] User Safety Tools (Blocking & Reporting):**

- Build the multi-tiered system for user safety: "Don't Connect Again," "Block," and "Report."
- Implement the "Block" functionality, which prevents all interaction and visibility between two users.
- Create the guided, educational reporting flow that automatically blocks the reported user.
- Develop the necessary database tables (`blocked_users`, `reports`) and backend logic for logging and aggregation.
- Establish an internal review process for handling formal reports.
- **Build the triggered verification system:** A report against a user triggers a mandatory verification check.
- **Develop the user "coaching" module:** A mandatory educational walkthrough for users who receive a serious report.

**[Epic #XXX] Community Health & Contribution:**

- **Implement the "Peer-to-Peer Kudos" system:** After an event, allow users to give anonymous, private, positive acknowledgements (e.g., "Great Listener") to other attendees.
- **Develop the "Contribution Score":** Create the internal `contribution_score` metric in the `user_internal_metrics` table.
- **Backend Logic:** Build the system to calculate the score based on kudos received, attendance records, and other positive engagement signals. Track counts for each kudo type to calculate metrics like a kudos-per-event ratio.
- **Algorithm Integration:** Factor the Contribution Score into the event curation algorithm to reward positive community members.

**[Epic #XXX] The Memory Book & Enhanced Connections:**

- Build the dedicated "Memory Book" screen for users to see a log of people they've met.
- Implement features for adding private notes, favoriting, and signaling a desire to "Connect Again."
- The "Connect Again" signal will be used by the event curation algorithm.
- Display a mutual "Connect Again" status to users.
- **User Story:** As a new user, I am prompted to take an in-app photo at my first event so others can recognize me and to create my first Face Card.
- **Task:** Integrate native camera APIs for an in-app photo-taking experience.
- **Task:** Implement the `profile_photos` table and logic for the "Authentic" badge, including the 12-month expiry.
- **Task:** Update the `connections` table schema to store immutable Face Card snapshots (`connected_profile_snapshot_face_card_url`, etc.).
- **Task:** Develop the progressive "Face Card" system, from initial photo to stylized version.
- **Task:** Build the system for unlockable customizations (frames, badges) for Face Cards based on user achievements.
- **Spike:** Research and integrate a third-party AI image generation service (e.g., DALL-E 3 API, Stable Diffusion API) for the stylization feature.

**[Epic #XXX] Advanced Host Tools & Ratings:**

- Display host ratings on their profiles.
- Display business/venue ratings.
- Provide hosts with a dashboard of ideas and tips.

**[Epic #XXX] Photo Sharing:**

- Allow participants to upload photos to a shared, private event gallery after the event.

**[Epic #XXX] SMS Invitations:**

- Integration with a text message service (e.g., Twilio) to send event invitation links via SMS.

## Phase 3: Scale & Intelligence (Future Vision)

This phase focuses on leveraging AI, automation, and content to scale the platform and create a truly unique, "magical" experience.

**[Epic #XXX] AI-Generated Invitation Imagery:**

- Implement a tool for hosts to generate unique invitation images based on the event details.
- Future goal: Animate elements of the images into looping GIFs.

**[Epic #XXX] AI-Assisted Event Curation:**

- Evolve the algorithm to automate curating invite lists based on advanced profile data, interests, and internal ratings (including absentee rating).
- Ensure a balanced male-to-female ratio where appropriate.

**[Epic #XXX] AI-Driven Onboarding & Coaching:**

- Experiment with an AI-driven voice interview for interest-building.
- Pre-event AI "hype-man" to build confidence and provide conversation starters.

**[Epic #XXX] Content & Marketing Integration:**

- Build in-app features that encourage social sharing (e.g., "Share to Instagram" from the event photo gallery).
- Create a section in the app for curated articles and videos on connection, confidence, etc.

**[Epic #XXX] Advanced Internal User Metrics:**

- Implement and refine other internal-only metrics like the attractiveness rating for improved matching.
- Experiment with in-app camera requirement for profile pictures to ensure recency.
