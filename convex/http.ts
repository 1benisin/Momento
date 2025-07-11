import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id: clerkId, ...attributes } = event.data;
      const primaryEmailAddress =
        attributes.email_addresses.find(
          (email) => email.id === attributes.primary_email_address_id
        )?.email_address ?? null;
      const primaryPhoneNumber =
        attributes.phone_numbers.find(
          (phone) => phone.id === attributes.primary_phone_number_id
        )?.phone_number ?? null;

      // Construct tokenIdentifier from issuer URL and clerkId
      const clerkIssuerUrl = process.env.CLERK_ISSUER_URL;
      if (!clerkIssuerUrl) {
        throw new Error("CLERK_ISSUER_URL environment variable not set!");
      }
      const tokenIdentifier = `${clerkIssuerUrl}|${clerkId}`;

      const existingUser = await ctx.runQuery(internal.user.getUser, {
        clerkId: clerkId,
      });

      if (existingUser) {
        console.log(`Updating user: ${clerkId}`);
        await ctx.runMutation(internal.user.updateUser, {
          clerkId,
          email: primaryEmailAddress ?? undefined,
          phone_number: primaryPhoneNumber ?? undefined,
          firstName: attributes.first_name ?? undefined,
          lastName: attributes.last_name ?? undefined,
        });
      } else {
        console.log(`Creating new user: ${clerkId}`);
        await ctx.runMutation(internal.user.createUser, {
          clerkId,
          email: primaryEmailAddress ?? undefined,
          phone_number: primaryPhoneNumber ?? undefined,
          firstName: attributes.first_name ?? undefined,
          lastName: attributes.last_name ?? undefined,
          tokenIdentifier,
        });
      }
      break;
    }
    case "user.deleted": {
      const { id: clerkId, deleted } = event.data;
      if (deleted) {
        console.log(`Deleting user: ${clerkId}`);
        await ctx.runMutation(internal.user.deleteUser, { clerkId: clerkId! });
      }
      break;
    }
    default: {
      console.log("Ignored Clerk webhook event:", event.type);
    }
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return;
  }
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return;
  }
}

export default http;
