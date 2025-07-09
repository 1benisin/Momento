import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent, UserJSON } from "@clerk/backend";
import { Webhook } from "svix";

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

      const event = result;
      if (event.type !== "user.created" && event.type !== "user.updated") {
        return new Response(null, { status: 200 });
      }

      const eventData = event.data;
      const clerkId = eventData.id;

      const primaryPhoneNumber = eventData.phone_numbers[0]?.phone_number;
      const primaryEmailAddress = eventData.email_addresses[0]?.email_address;

      console.log(`convex/http.ts: Handling '${event.type}' for ${clerkId}`);

      const user = await ctx.runQuery(internal.user.getUser, {
        clerkId,
      });

      if (user) {
        console.log(`User ${clerkId} already exists. Updating details.`);
        if (primaryEmailAddress) {
          await ctx.runMutation(internal.user.updateUserEmail, {
            clerkId,
            email: primaryEmailAddress,
          });
        }
        return new Response(null, { status: 200 });
      }

      if (!primaryPhoneNumber && !primaryEmailAddress) {
        // This can happen if the user signs up with a social provider that doesn't share email/phone
        console.warn(
          `User ${clerkId} created without a phone number or email.`
        );
        return new Response(null, { status: 200 });
      }

      const clerkIssuerUrl = process.env.CLERK_ISSUER_URL;
      if (!clerkIssuerUrl) {
        throw new Error("CLERK_ISSUER_URL environment variable not set!");
      }
      const tokenIdentifier = `${clerkIssuerUrl}|${clerkId}`;

      console.log(
        `convex/http.ts: About to create user for Clerk ID: ${clerkId}`
      );
      await ctx.runMutation(internal.user.createUser, {
        clerkId: clerkId,
        phone_number: primaryPhoneNumber,
        email: primaryEmailAddress,
        tokenIdentifier: tokenIdentifier,
      });
      console.log(
        `convex/http.ts: Successfully called createUser for Clerk ID: ${clerkId}`
      );

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
