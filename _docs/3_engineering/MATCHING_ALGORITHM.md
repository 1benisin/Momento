# Matching Algorithm & AI Strategy

This document details the technical strategy for matching users with events, centered on the use of vector embeddings.

- **[The Core Concept: Vector Embeddings](#1-the-core-concept-vector-embeddings)**: Explains the foundational technology used to convert text into mathematical representations for concept-based matching.
- **[The Social Graph Matching Algorithm](#2-the-social-graph-matching-algorithm)**: Outlines the algorithm used to find groups with a high potential for social and romantic chemistry.
- **[Evolving User Preferences](#3-evolving-user-preferences)**: Describes the mechanisms, like the Discovery Feed and post-event ratings, that allow a user's interest profile to change and adapt over time.
- **[Future Concepts & Enhancements](#4-future-concepts--enhancements-phase-3--beyond)**: A look ahead at more advanced concepts like multi-vector profiles, a "Chemistry Multiplier," and AI conversational interviews.

---

This document details the technical strategy for Momento's event and user matching system. The goal is to move beyond simple keyword matching and create a system that understands the nuanced "vibe" of both users and events.

The core of this strategy is the use of **vector embeddings**.

---

## 1. The Core Concept: Vector Embeddings

Vector embeddings allow us to convert complex, unstructured data (like text) into a mathematical representation (a "vector" of numbers). Text with similar semantic meaning will have vectors that are mathematically close to each other in a high-dimensional space.

- **How it Works:** We use a pre-trained text-embedding model (e.g., from OpenAI, Cohere, or a self-hosted model like Sentence-BERT). We feed it a string of text (like an event description), and it outputs a vector (e.g., `[0.04, -0.78, 0.23, ..._]`). This vector is the text's "semantic DNA."

- **Why it's Powerful:** This allows us to perform "concept-based" searches. Instead of looking for keywords, we can find events that are conceptually similar to a user's interests, even if they don't share any of the same words. The system understands that "a quiet evening learning to paint pottery" and "a calm night of calligraphy and cocktails" are conceptually similar.

---

## 2. The Social Graph Matching Algorithm

To move beyond simple interest matching and create groups with a high potential for social and romantic chemistry, we model each potential group of attendees as a "social graph." In this graph, every person is a node. Our goal is to find the group that represents the most vibrant and interconnected graph, ensuring no one is left in a social "dead-end."

The algorithm operates using a **"Concentric Circles"** strategy. Instead of evaluating all possible users at once, it performs iterative passes, starting with the most ideal candidates and slowly expanding the criteria until a high-quality group is formed. This ensures we always prioritize the best possible social experience.

### Pillar 1: The Potential Connection Score (The Graph's Edges)

The foundation of the graph is the strength of its connections. We calculate a `PotentialConnectionScore(A, B)` for every possible one-way pairing. This score, from 0 to 1, represents the likelihood of User A being interested in User B.

1.  **Categorical Compatibility (The Prerequisite)**

    - Does User B's `gender` appear in User A's `interested_in` array?
    - If `NO`, the `PotentialConnectionScore` is **0**. If `YES`, we proceed.

2.  **Profile Vector Similarity (The Nuance)**
    - We calculate the cosine similarity between **User B's** `social_profile` vector and **User A's** `person_attraction_vector` (built from their "Discover Your Type" swipes). This score represents how closely User B aligns with User A's demonstrated "type."

### Pillar 2: The Group Curation Engine (Iterative Group Building)

This engine runs in passes, expanding its search radius until a valid, high-chemistry group is found.

**Pass 1: The "Perfect" Pool**
The process begins with the most restrictive constraints to find the absolute best matches.

- **Step 1: Candidate Pool Generation (Strict)**
  The algorithm first creates a candidate pool by applying a strict set of **Hard Filters**. A user is only considered if they:

  - Have **not** been blocked by, or blocked, any other user in the potential pool.
  - Do **not** have a "Don't connect again" preference with any other user in the pool.
  - Strictly meet the event's age, distance, and price preferences without any buffer.
  - Have an extremely high vector similarity score between their interests and the event's theme.

- **Step 2: Group Assembly & Scoring**
  Within this elite pool, the system attempts to build a valid social graph.
  - It pre-computes the `PotentialConnectionScore` matrix for all candidates in the pool.
  - It assembles and **validates** potential groups, ensuring every person has at least one potential incoming and one outgoing connection. Any group failing this check is discarded.
  - It calculates a `GroupChemistryScore` for each valid group by summing all internal connection scores.

**If a valid group with a high enough score is found, the process stops and invitations are sent.** If not, the engine proceeds to the next pass.

**Pass 2+ (Expanded Pools)**
The algorithm systematically expands the circles. It will:

- Slightly lower the required event-interest similarity score.
- Add a small buffer to the distance and price preferences.
- This creates a larger, but still high-quality, candidate pool. The Group Assembly & Scoring process (Step 2) is run again.

This iterative process repeats, ensuring the system only "settles" for a good group if a perfect one cannot be formed.

### Pillar 3: Dynamic Reason Generation (The "Why")

Once the ideal group is selected, the system does a "reverse lookup" to explain the match to each user. It constructs a human-readable `match_reason` by analyzing the strongest signals that led to their inclusion. The hierarchy, from most compelling to most practical, is:

1.  **Strong Social Signals (The "Inside Track"):** This is the highest tier, based on a user's direct feedback on people.

    - **Trigger:** The group includes a user they've flagged with **"Connect Again,"** or the event is hosted by someone they've previously given a **5-star rating.**
    - **Example:** _"Someone you wanted to connect with again will be at this event!"_

2.  **High Chemistry Potential (The "People Connection"):** The core reason when the user is a key part of the social graph's chemistry.

    - **Trigger:** The user's combined incoming and outgoing `PotentialConnectionScore`s are particularly high within the chosen group.
    - **Example:** _"We think you'll really connect with the people at this event."_

3.  **Event & Interest Match (The "Vibe Check"):** For when the event itself is an ideal match for their tastes.

    - **Trigger:** High vector similarity between the event and the user's `positive_interest_vector` or explicit `interests`.
    - **Example:** _"This seems right up your alley! It's similar to the '[Liked Event Card Title]' experience you were interested in."_

4.  **Logistical Perfection (The "Perfect Fit"):** This is most powerful when an event perfectly matches a user's restrictive preferences.

    - **Trigger:** The event aligns perfectly with the user's set **distance, price, and timing/availability** preferences.
    - **Example:** _"An event that fits your schedule and budget, right in your neighborhood!"_

5.  **Exploration & Variety (The "Wild Card"):** Directly responds to a user's request to try something new.
    - **Trigger:** The user recently chose "I'm looking to try new things" when declining an event, and this event is intentionally outside their core interest cluster.
    - **Example:** _"You mentioned you wanted to try new things—we thought this might be a fun surprise!"_

This transforms a complex calculation into a transparent, personalized, and compelling invitation.

---

## 3. Evolving User Preferences

A user's interests are not static. To prevent an "invite rut" where a user is only shown one type of event, the system must incorporate new signals to evolve their profile over time.

### Primary Evolution Mechanisms

1.  **The "Discover your Interests" Feed:**

    - The primary tool for post-onboarding interest refinement. Users can browse a feed of real, highly-rated past events and indicate their interest.
    - An affirmative swipe on a past event is a strong, explicit signal that adds the event's vector to the user's `positive_interest_vector`.

2.  **The "Discover your Type" Feed:**

    - This is the primary tool for understanding a user's "type" and is the engine that builds their `person_attraction_vector`. Users browse a feed of profiles filtered by their `interested_in` preferences.
    - An affirmative swipe ("I'd like to create a memory with them") is a powerful signal. It updates the user's `person_attraction_vector`, making our understanding of their type more and more accurate over time.

3.  **Post-Event Ratings:**

    - When a user rates an event highly (e.g., 4-5 stars), the system can slightly "nudge" their `positive_interest_vector` closer to that event's vector. This reinforces preferences with real-world, positive experiences.

4.  **Explicit Decline Reasons:**
    - When a user declines an invitation, their stated reason provides a crucial signal.
    - **"This event isn't for me"**: Strongly updates the `negative_interest_vector`.
    - **"I'm looking to try new things"**: Temporarily increases an "exploration" parameter for the user's next few invites, encouraging the algorithm to suggest events outside their core cluster.
    - **"Too short notice"**: Does not affect the interest vector, but provides a signal to incrementally increase the user's `min_lead_time_days` preference in the `users` table.
    - **"Too far away" / "Too expensive"**: Does not affect the interest vector. Instead, this provides a strong signal to trigger the "Contextual Nudge" UI flow, prompting the user to set their `distancePreference` or `priceSensitivity` if they haven't already.

### Secondary Evolution Mechanisms (Future)

- A user's vectors should evolve over time. When a user attends an event and rates it highly, their corresponding persona vector can be "nudged" slightly closer to that event's vector, reinforcing their preferences with real-world behavior.
- **Vector Time Decay:** The influence of past actions on a user's profile should fade over time, giving more weight to recent signals.

### Lead-Time & Availability Scoring

To respect user preferences without creating rigid filters, we introduce a "penalty" system that adjusts the final `MatchScore` based on event timing. This ensures users might still see a "perfect but last-minute" event, but are less likely to be bothered by invites that don't fit their schedule.

**`FinalScore = MatchScore - LeadTimePenalty - AvailabilityPenalty`**

- **`LeadTimePenalty`**: A score reduction applied if `event.lead_time < user.min_lead_time_days`. The penalty is proportional to how far inside the user's preferred window the event is.
- **`AvailabilityPenalty`**: A score reduction applied if the event falls on a day/time the user has marked as "yellow" or "red" in their `availability_preferences`. The penalty is higher for red days than yellow days.

---

### Phase 2: Multiple "Interest Persona" Vectors

This is the evolution of the system, designed to capture the multi-faceted nature of a user's personality (e.g., someone who loves both skydiving and quiet wine tasting).

1.  **Automatic Persona Clustering:**

    - During onboarding, instead of averaging all liked card vectors, the backend will run a simple clustering algorithm (like K-Means) on them.
    - If the algorithm identifies distinct groups (e.g., high-energy vs. low-energy events), it will create a separate averaged vector for each cluster.

2.  **Multiple Personas:**
    - A user's profile will now store **multiple `positive_persona_vectors`**.
    - `persona_vector_1`: Represents their "adventurous" side.
    - `persona_vector_2`: Represents their "creative/cozy" side.

#### Matching Logic (Phase 2)

When a new event is created, its `EventVector` is compared against **all** of the user's persona vectors.

**`MatchScore = Max(Similarity(Event, Persona1), Similarity(Event, Persona2), ...)`**

We take the _highest_ score. This ensures that if an event is a perfect match for even one of a user's personas, they are considered a strong candidate for an invitation. The negative vector logic would still apply to filter out undesirable events.

#### Profile Visualization: The Interest Constellation

To make a user's multifaceted nature visible to others, these generated personas will be visualized on their public profile through a feature called the **"Interest Constellation."**

- Each named persona (e.g., "Adventurous Side") becomes a "star" in the user's personal constellation.
- This provides an at-a-glance, aesthetic representation of their character, moving beyond a simple list of interests to show the actual clusters of passion that define them.
- For more detail, see the `InterestConstellation` component in `_docs/2_design/SCREENS_AND_COMPONENTS.md`.

---

## 4. Future Concepts & Enhancements (Phase 3 & Beyond)

To avoid over-complicating the initial implementation, more advanced algorithmic concepts will be preserved here for future exploration and experimentation.

- **Multi-Vector Profiles:** Expanding beyond a single interest vector to include separate vectors for `person_attraction`, `host_preference`, and `connection_quality`, derived from signals like profile swiping, host ratings, and post-event messaging behavior.
- **The Chemistry Multiplier:** A sophisticated scoring component that attempts to predict group chemistry by analyzing the compatibility of all potential attendees' vectors with each other, not just with the event itself.
- **AI Conversational Interviews:** The ultimate goal is to use an AI-driven voice interview during onboarding. The transcript of this interview can be summarized and converted into a highly accurate and nuanced set of interest vectors, providing the strongest signal for their profile.
