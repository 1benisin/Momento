import { convexTest } from "convex-test";
import { api } from "../_generated/api";
import {
  mockStripe,
  setupStripeMocks,
  mockPaymentIntent,
  mockCustomer,
} from "../lib/stripe.test";
import { Id } from "../_generated/dataModel";
import schema from "../schema";

// Mock the stripe library
jest.mock("../lib/stripe", () => require("../lib/stripe.test"));

describe("Payments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupStripeMocks();
  });

  describe("createEventConfirmationPayment", () => {
    test("should create a payment intent for a new customer", async () => {
      const t = convexTest(schema as any);
      const result = await t.mutation(
        api.payments.createEventConfirmationPayment,
        {
          eventId: "evt_12345" as Id<"events">,
          amount: 500,
          currency: "usd",
        },
      );

      expect(mockStripe.customers.create).toHaveBeenCalledTimes(1);
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledTimes(1);
      expect(result.clientSecret).toBe(mockPaymentIntent.client_secret);
      expect(result.paymentIntentId).toBe(mockPaymentIntent.id);
    });

    test("should create a payment intent for an existing customer", async () => {
      const t = convexTest(schema as any);
      // Setup user with existing customer id
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          tokenIdentifier: "token_identifier_1",
          clerkId: "clerk_123",
          accountStatus: "active",
          hostProfile: {
            host_type: "user",
            host_name: "Test Host",
            host_bio: "Bio",
            stripe_customer_id: "cus_existing",
          },
        });
      });

      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
        name: "Test User",
      });

      const result = await asUser.mutation(
        api.payments.createEventConfirmationPayment,
        {
          eventId: "evt_12345" as Id<"events">,
          amount: 500,
          currency: "usd",
        },
      );

      expect(mockStripe.customers.create).not.toHaveBeenCalled();
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 500,
        currency: "usd",
        customerId: "cus_existing",
        metadata: expect.any(Object),
      });
      expect(result.clientSecret).toBe(mockPaymentIntent.client_secret);
    });
  });

  describe("getPaymentIntentDetails", () => {
    test("should return payment intent details", async () => {
      const t = convexTest(schema as any);
      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
        name: "Test User",
      });

      const result = await asUser.query(api.payments.getPaymentIntentDetails, {
        paymentIntentId: "pi_12345",
      });

      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith(
        "pi_12345",
      );
      expect(result.id).toBe(mockPaymentIntent.id);
      expect(result.amount).toBe(mockPaymentIntent.amount);
      expect(result.status).toBe(mockPaymentIntent.status);
    });
  });

  describe("createStripeCustomer", () => {
    test("should create a new stripe customer", async () => {
      const t = convexTest(schema as any);
      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
        name: "Test User",
      });

      const result = await asUser.mutation(api.payments.createStripeCustomer, {
        email: "new@example.com",
        name: "New User",
      });

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: "new@example.com",
        name: "New User",
        metadata: expect.any(Object),
      });
      expect(result.customerId).toBe(mockCustomer.id);
    });
  });
});
