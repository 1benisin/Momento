# Matching Algorithm Documentation

This document details the logic, parameters, user preference weighting, event matching criteria, and optimization strategies for the Momento platform's core matching algorithm.

## Table of Contents

- [Overview](#overview)
- [Matching Philosophy](#matching-philosophy)
- [Algorithm Logic](#algorithm-logic)
- [User Profile Vectorization](#user-profile-vectorization)
- [Event Matching Criteria](#event-matching-criteria)
- [Preference Weighting](#preference-weighting)
- [Hybrid & Special Cases](#hybrid--special-cases)
- [Performance Optimization](#performance-optimization)
- [A/B Testing & Continuous Improvement](#ab-testing--continuous-improvement)

---

## Overview

The matching algorithm is the heart of the Momento platform, responsible for assembling small, compatible groups for curated events. It balances user preferences, event requirements, diversity, and platform goals to maximize the quality of connections and event experiences.

---

## Matching Philosophy

- **Genuine Connection**: Prioritize meaningful, organic connections over superficial matches
- **Diversity & Inclusion**: Ensure diverse group composition and avoid echo chambers
- **Commitment**: Favor users with high reliability and positive engagement history
- **Transparency**: Allow users to understand and influence their matching outcomes

---

## Algorithm Logic

### High-Level Flow

1. **User Pooling**: Identify eligible users for upcoming events
2. **Profile Vectorization**: Convert user profiles into multi-dimensional vectors
3. **Event Filtering**: Filter events based on user preferences and eligibility
4. **Scoring**: Calculate compatibility scores between users and events
5. **Group Assembly**: Assemble groups to maximize overall compatibility and diversity
6. **Finalization**: Lock in matches and send invitations

### Pseudocode

```python
def match_users_to_events(users, events):
    for event in events:
        eligible_users = filter_users(users, event)
        user_vectors = vectorize_profiles(eligible_users)
        event_vector = vectorize_event(event)
        scores = compute_compatibility(user_vectors, event_vector)
        group = assemble_group(scores, event.min_attendees, event.max_attendees)
        send_invitations(group, event)
```

---

## User Profile Vectorization

### Profile Features

- **Demographics**: Age, gender, location
- **Interests**: Weighted interest tags and categories
- **Personality**: Derived from onboarding flows and event feedback
- **Behavioral Data**: Attendance history, reliability, kudos received
- **Preferences**: Desired event types, group size, time availability

### Vector Construction

- Each user is represented as a vector of normalized features
- Interests and preferences are weighted based on explicit and implicit signals
- Behavioral modifiers adjust scores for reliability and engagement

---

## Event Matching Criteria

### Event Features

- **Type**: Social, learning, adventure, etc.
- **Location**: Proximity to user
- **Time**: User availability window
- **Group Size**: Minimum and maximum attendees
- **Host Type**: User host or community host
- **Special Requirements**: Verification, payment, etc.

### Filtering Logic

- Users must meet all hard requirements (e.g., verified, paid, available)
- Soft preferences (e.g., interest overlap) influence scoring
- Diversity constraints ensure balanced group composition

---

## Preference Weighting

### Explicit Preferences

- User-selected interests and event types
- Preferred group size and event timing
- Opt-in/opt-out for certain event categories

### Implicit Preferences

- Past attendance and feedback
- Engagement with event invitations
- Social graph analysis (friend/duo requests)

### Weighting Formula

- Each feature is assigned a weight based on importance
- Weights are adjusted over time based on user feedback and outcomes
- Final score is a weighted sum of all features

---

## Hybrid & Special Cases

### Hybrid Users

- Users who are both hosts and participants
- Algorithm considers both roles and prioritizes based on active mode

### Dynamic Duos

- Friends who want to attend together
- Algorithm ensures duo placement in the same group when possible

### Waitlist & Overflow

- Users not matched in the first round are waitlisted
- Overflow groups created if enough users remain

---

## Performance Optimization

### Scalability

- Batch processing for large user pools
- Caching of user vectors and event features
- Parallelization of scoring and group assembly

### Real-Time Adjustments

- Re-run matching as new users or events are added
- Dynamic adjustment for last-minute cancellations

---

## A/B Testing & Continuous Improvement

### Experimentation

- Test different weighting schemes and group assembly strategies
- Measure outcomes: event attendance, user satisfaction, retention

### Feedback Loops

- Collect user feedback after events
- Use feedback to refine matching logic and weights

### Monitoring

- Track key metrics: match rate, group diversity, no-show rate
- Alert on anomalies or drops in match quality

---

**Last Updated:** 2024-12-19

This matching algorithm documentation is reviewed and updated regularly to reflect improvements and new features.
