# Architecture & Diagrams

This document contains architectural diagrams to visualize component structures and data flows within the Momento application.

## 1. System Context Diagram

This diagram provides a high-level "map of the world" for the Momento ecosystem. It shows the key users who interact with our system and the primary external services that the Momento platform relies on to function. It is the best starting point for understanding the system's boundaries and its place in the broader digital environment.

```mermaid
graph LR
    subgraph "Users"
        direction TB
        participant["Participant"]
        host["Host"]
    end

    subgraph "Momento Platform"
        direction TB
        momento_system["Momento App & Backend"]
    end

    subgraph "External Services"
        direction TB
        stripe("Stripe<br/>Payments & ID")
        twilio("Twilio<br/>SMS")
        expo("Expo Push<br/>Notifications")
        google_maps("Google Maps<br/>Locations")
        ai_service("AI Service<br/>Embeddings")
        postmark("Postmark<br/>Transactional Email")
        app_stores("App Stores<br/>Distribution")
    end

    participant -- Uses --> momento_system
    host -- Uses --> momento_system

    momento_system -- API Call --> stripe
    momento_system -- API Call --> twilio
    momento_system -- API Call --> expo
    momento_system -- API Call --> google_maps
    momento_system -- API Call --> ai_service
    momento_system -- API Call --> postmark
    momento_system -- Deploys to --> app_stores
```

## 2. Container Diagram

This diagram provides a more detailed "blueprint" of the Momento platform. It breaks down the high-level system into its major logical containers, showing how they interact with each other and which components are responsible for communicating with external services. This view is essential for developers to understand the technical structure of the application.

```mermaid
graph TD
    subgraph "User's Device"
        mobile_app["React Native / Expo App"]
    end

    subgraph "Momento Backend (Convex)"
        auth["Convex Auth"]
        db["Convex Database"]
        storage["Convex File Storage"]
        functions["Convex Functions<br/>(Mutations & Queries)"]
    end

    subgraph "External Services"
        stripe("Stripe")
        twilio("Twilio")
        expo_push("Expo Push API")
        ai_service("AI Service")
        google_maps("Google Maps API")
        postmark("Postmark")
    end

    mobile_app -- "Signs In" --> auth
    mobile_app -- "Reads/Writes Data via<br/>Mutations & Queries" --> functions
    mobile_app -- "Uploads/Downloads Images" --> storage
    mobile_app -- "Renders Maps" --> google_maps

    db -- "Triggers Scheduled Functions" --> functions

    functions -- "Processes Payments &<br/>Sends Receipts" --> stripe
    functions -- "Sends SMS" --> twilio
    functions -- "Sends Push Notifications" --> expo_push
    functions -- "Generates Embeddings" --> ai_service
    functions -- "Sends App Emails" --> postmark
```

## 3. UI Architecture: Role-Based Navigation & Mode Switching

To provide a focused and intuitive experience for all user types, Momento's UI will be **role-based**. A user's account can have different roles (`Participant`, `Host`), and the app's interface, particularly the main tab bar navigation, will adapt to the role they are currently acting in.

This architecture solves the challenge of a user who is both a participant and a host, preventing cognitive overload by ensuring they only see the tools relevant to their current goal.

There are three primary user types:

1.  **Social-Only User (`Participant`)**: A user who attends events. Their UI is focused on discovery and connection.
2.  **Host-Only User (`Community Host`)**: A business or organization whose goal is to create and manage events. Their UI is a streamlined professional dashboard. They do not have social features like a Memory Book.
3.  **Hybrid User (`User Host`)**: An individual who both hosts and participates in events. This user has access to both UI paradigms.

### The "Mode Switcher"

The lynchpin of this design is the **"Mode Switcher,"** a clear control within the `Profile` tab that allows a Hybrid User to toggle between "Social Mode" and "Host Mode."

- **Social Mode**: The UI is identical to the Social-Only user's experience.
- **Host Mode**: The UI transforms into the professional dashboard identical to the Host-Only user's experience.

This approach ensures that single-role users have a simple, dedicated experience, while hybrid users have the power to switch contexts without clutter.

## 4. Backend & Database Architecture

### Geospatial Indexing for Efficient Location Queries

A core feature of Momento's matching algorithm is filtering events based on a user's `distance_preference`. As the number of users and events grows, performing a naive distance calculation for every event for every user will become a significant performance bottleneck.

To solve this, we will leverage a purpose-built geospatial library within the Convex ecosystem.

1.  **Use a Geospatial Library**: We will integrate a community library like `@convex-dev/geospatial` into our project. This provides the necessary tools for indexing and querying location data directly within Convex.

2.  **Store Location Data**: In the `locations` table, we will store coordinates as simple `latitude` and `longitude` number fields, as defined in `_docs/DATA_MODELS.md`.

3.  **Index Locations**: The geospatial library will manage the indexing of these locations. We will create a query that's exposed by the library, which takes our `locations` table data and organizes it into an efficient data structure (like an R-tree or Geohash-based index) for fast spatial lookups.

4.  **Efficient Queries**: With the index in place, we can use the library's functions to perform highly efficient searches. A query to find nearby events would be handled by a Convex query function that might look something like this:

    ```typescript
    // convex/events.ts (Illustrative Example)
    import { query } from "./_generated/server";
    import { बनाएंGeospatialQuery } from "@convex-dev/geospatial";

    export const getNearbyEvents = query({
      args: {
        latitude: v.number(),
        longitude: v.number(),
        searchRadiusMiles: v.number(),
      },
      handler: async (ctx, args) => {
        // 1. Initialize the geospatial query helper with our locations
        const locations = await ctx.db.query("locations").collect();
        const geoQuery = बनाएंGeospatialQuery(
          locations,
          "latitude",
          "longitude"
        );

        // 2. Find locations within the user's radius
        const nearbyLocationIds = geoQuery
          .query({
            center: { latitude: args.latitude, longitude: args.longitude },
            radiusInMiles: args.searchRadiusMiles,
          })
          .map((loc) => loc._id);

        // 3. Find all events that have an itinerary stop at one of those locations
        const allEvents = await ctx.db.query("events").collect();
        const nearbyEvents = allEvents.filter((event) =>
          event.itinerary.some((stop) =>
            nearbyLocationIds.includes(stop.location_id)
          )
        );

        return nearbyEvents;
      },
    });
    ```

This architectural decision is critical for ensuring the matching process remains fast and scalable as the platform grows. It allows the backend to quickly eliminate the vast majority of events that are outside a user's radius, rather than calculating the distance for each one.

All vector embeddings will be stored as `float64` arrays, and timestamps will be stored as simple `v.number()` fields, as defined in `_docs/DATA_MODELS.md`.
