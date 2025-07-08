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

    try {
      const result: WebhookEvent = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created": {
          const user = await ctx.runQuery(internal.user.getUser, {
            clerkId: result.data.id,
          });

          if (user) {
            console.log(`User ${result.data.id} already exists`);
            break;
          }

          await ctx.runMutation(internal.user.create, {
            clerkId: result.data.id,
            name: `${result.data.first_name ?? ""} ${
              result.data.last_name ?? ""
            }`,
            phone_number: result.data.phone_numbers[0]?.phone_number,
            tokenIdentifier: `${process.env.CLERK_ISSUER_URL}|${result.data.id}`,
          });
          break;
        }
        case "user.updated":
          await ctx.runMutation(internal.user.update, {
            clerkId: result.data.id,
            name: `${result.data.first_name ?? ""} ${
              result.data.last_name ?? ""
            }`,
            phone_number: result.data.phone_numbers[0]?.phone_number,
          });
          break;
        // You can add other webhook events here, like user.updated
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
