"use node";

import { v } from "convex/values";
import { Webhook } from "svix";
import { internalAction } from "./_generated/server";
import type { WebhookEvent } from "@clerk/backend";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args): Promise<WebhookEvent> => {
    if (!webhookSecret) {
      throw new Error(
        "CLERK_WEBHOOK_SECRET is not set in environment variables"
      );
    }
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(args.payload, args.headers);
    return payload as WebhookEvent;
  },
});
