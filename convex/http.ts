import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    console.log("convex/http.ts: Received Clerk webhook");

    try {
      const result: WebhookEvent = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      console.log(
        `convex/http.ts: Webhook validated. Event type: ${result.type}`
      );

      switch (result.type) {
        case "user.created": {
          console.log("convex/http.ts: Handling 'user.created' event");
          const eventData = result.data;

          const user = await ctx.runQuery(internal.user.getUser, {
            clerkId: eventData.id,
          });

          if (user) {
            console.log(
              `convex/http.ts: User ${eventData.id} already exists, skipping creation.`
            );
            break;
          }

          const phoneNumber = eventData.phone_numbers[0]?.phone_number;
          if (!phoneNumber) {
            throw new Error(
              `User ${eventData.id} created without a phone number.`
            );
          }

          const clerkIssuerUrl = process.env.CLERK_ISSUER_URL;
          if (!clerkIssuerUrl) {
            throw new Error("CLERK_ISSUER_URL environment variable not set!");
          }

          const tokenIdentifier = `${clerkIssuerUrl}|${eventData.id}`;

          console.log(
            `convex/http.ts: About to create user for Clerk ID: ${eventData.id}`
          );
          await ctx.runMutation(internal.user.createUser, {
            clerkId: eventData.id,
            phone_number: phoneNumber,
            tokenIdentifier: tokenIdentifier,
          });
          console.log(
            `convex/http.ts: Successfully called createUser for Clerk ID: ${eventData.id}`
          );
          break;
        }
        default: {
          console.log(
            `convex/http.ts: Received unhandled webhook event: ${result.type}`
          );
        }
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error("convex/http.ts: Webhook Error Caught:", err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
