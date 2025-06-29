# Matching Algorithm & AI Strategy

This document details the technical strategy for matching users with events, centered on the use of vector embeddings.

- **[The Core Concept: Vector Embeddings](#1-the-core-concept-vector-embeddings)**: Explains the foundational technology used to convert text into mathematical representations for concept-based matching.
- **[Implementation: The Phased Approach](#2-implementation-the-phased-approach)**: Outlines the MVP implementation using single positive and negative interest vectors for each user.
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

## 2. Implementation: The Phased Approach

We will implement this system in phases to manage complexity and build upon our learnings.

### Phase 1: Single Positive & Negative Vectors (MVP)

For the initial launch, each user will have two primary vectors that define their interest profile.

1.  **The `positive_interest_vector`**:

    - **Source:** Generated during the "Possibility Card" onboarding flow. It is the **average** of the vectors of all the event cards the user swiped right on ("I'm Interested").
    - **Purpose:** Represents the core of what the user is looking for in an experience.

2.  **The `negative_interest_vector`**:
    - **Source:** It is the **average** of the vectors of all event cards the user swiped left on ("Not for Me").
    - **Purpose:** Represents a "repulsion force." It defines the concepts and vibes the user actively dislikes.

#### Matching Logic (Phase 1)

When a new event is created, we generate an `EventVector` for its description. To calculate a user's match score for that event, we use a formula that combines attraction and repulsion:

**`MatchScore = CosineSimilarity(EventVector, User.PositiveVector) - CosineSimilarity(EventVector, User.NegativeVector)`**

- `CosineSimilarity` is a standard metric that measures the similarity between two vectors. A score of `1` means they are identical, `-1` means they are opposite, and `0` means they are unrelated.
- This formula rewards events similar to a user's likes and penalizes events similar to their dislikes.

#### The "Holistic" User Profile

The user's vectors are not static and aren't just from the onboarding flow. They will be a weighted average of multiple text sources to create a richer profile:

`PositiveVector = (60% * OnboardingSwipes) + (30% * StatedInterests) + (10% * ProfileBio)`

This ensures we capture a more complete picture of the user.

---

## 3. Evolving User Preferences

A user's interests are not static. To prevent an "invite rut" where a user is only shown one type of event, the system must incorporate new signals to evolve their profile over time.

### Primary Evolution Mechanisms

1.  **The Discovery Feed:**

    - The primary tool for post-onboarding interest refinement. Users can browse a feed of real, highly-rated past events and "like" the ones that appeal to them.
    - A "like" on a past event in the Discovery Feed is a strong, explicit signal that adds the event's vector to the user's `positive_interest_vector`.

2.  **Post-Event Ratings:**

    - When a user rates an event highly (e.g., 4-5 stars), the system can slightly "nudge" their `positive_interest_vector` closer to that event's vector. This reinforces preferences with real-world, positive experiences.

3.  **Explicit Decline Reasons:**
    - When a user declines an invitation, their stated reason provides a crucial signal.
    - **"This event isn't for me"**: Strongly updates the `negative_interest_vector`.
    - **"I'm looking to try new things"**: Temporarily increases an "exploration" parameter for the user's next few invites, encouraging the algorithm to suggest events outside their core cluster.

### Secondary Evolution Mechanisms (Future)

- A user's vectors should evolve over time. When a user attends an event and rates it highly, their corresponding persona vector can be "nudged" slightly closer to that event's vector, reinforcing their preferences with real-world behavior.
- **Vector Time Decay:** The influence of past actions on a user's profile should fade over time, giving more weight to recent signals.

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

---

## 4. Future Concepts & Enhancements (Phase 3 & Beyond)

To avoid over-complicating the initial implementation, more advanced algorithmic concepts will be preserved here for future exploration and experimentation.

- **Multi-Vector Profiles:** Expanding beyond a single interest vector to include separate vectors for `person_attraction`, `host_preference`, and `connection_quality`, derived from signals like profile swiping, host ratings, and post-event messaging behavior.
- **The Chemistry Multiplier:** A sophisticated scoring component that attempts to predict group chemistry by analyzing the compatibility of all potential attendees' vectors with each other, not just with the event itself.
- **AI Conversational Interviews:** The ultimate goal is to use an AI-driven voice interview during onboarding. The transcript of this interview can be summarized and converted into a highly accurate and nuanced set of interest vectors, providing the strongest signal for their profile.
