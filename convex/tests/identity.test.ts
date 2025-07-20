import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "../_generated/api";
import {
  mockStripe,
  setupStripeMocks,
  mockVerificationSession,
} from "../lib/stripe.test";
import { Id } from "../_generated/dataModel";
import schema from "../schema";

// Mock the stripe library
jest.mock("../lib/stripe", () => require("../lib/stripe.test"));

describe("Identity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupStripeMocks();
  });

  describe("createHostVerificationSession", () => {
    test("should create a verification session", async () => {
      const t = convexTest(schema as any);
      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          tokenIdentifier: "token_identifier_1",
          clerkId: "clerk_123",
          accountStatus: "active",
          hostProfile: {
            host_type: "user",
            host_name: "Test Host",
            host_bio: "Bio",
          },
        });
      });

      const result = await asUser.mutation(
        api.identity.createHostVerificationSession,
        {
          returnUrl: "https://example.com/return",
          type: "document",
        }
      );

      expect(
        mockStripe.identity.verificationSessions.create
      ).toHaveBeenCalledTimes(1);
      expect(result.sessionId).toBe(mockVerificationSession.id);
      expect(result.clientSecret).toBe(mockVerificationSession.client_secret);
      expect(result.status).toBe(mockVerificationSession.status);
    });
  });

  describe("getVerificationSessionDetails", () => {
    test("should return verification session details", async () => {
      const t = convexTest(schema as any);
      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
      });
      const result = await asUser.query(
        api.identity.getVerificationSessionDetails,
        {
          sessionId: "vs_12345",
        }
      );

      expect(
        mockStripe.identity.verificationSessions.retrieve
      ).toHaveBeenCalledWith("vs_12345");
      expect(result.id).toBe(mockVerificationSession.id);
      expect(result.status).toBe(mockVerificationSession.status);
    });
  });

  describe("updateUserVerificationStatus", () => {
    test("should update user verification status", async () => {
      const t = convexTest(schema as any);
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          tokenIdentifier: "token_identifier_1",
          clerkId: "clerk_123",
          accountStatus: "active",
          hostProfile: {
            host_type: "user",
            host_name: "Test Host",
            host_bio: "Bio",
          },
        });
      });

      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
      });

      const result = await asUser.mutation(
        api.identity.updateUserVerificationStatus,
        {
          sessionId: "vs_12345",
          isVerified: true,
          verificationData: { some: "data" },
        }
      );

      expect(result.success).toBe(true);
      expect(result.isVerified).toBe(true);

      const user = await asUser.query(api.user.me);
      expect(user?.hostProfile?.is_verified).toBe(true);
      expect(user?.hostProfile?.verification_session_id).toBe("vs_12345");
    });
  });

  describe("isUserVerifiedForHosting", () => {
    test("should return true if user is verified", async () => {
      const t = convexTest(schema as any);
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          tokenIdentifier: "token_identifier_1",
          clerkId: "clerk_123",
          accountStatus: "active",
          hostProfile: {
            host_type: "user",
            host_name: "Test Host",
            host_bio: "Bio",
            is_verified: true,
          },
        });
      });

      const asUser = t.withIdentity({
        tokenIdentifier: "token_identifier_1",
      });

      const result = await asUser.query(
        api.identity.isUserVerifiedForHosting,
        {}
      );
      expect(result.isVerified).toBe(true);
    });
  });
});
