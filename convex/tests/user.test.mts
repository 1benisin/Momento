import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { internal } from "../_generated/api";
import schema from "../schema";
import { ConvexError } from "convex/values";

const identity = {
  subject: "test_clerk_id_123",
  issuer: "https://clerk.dev",
  name: "Test User",
  phoneNumber: "+1234567890",
  phoneNumberVerified: true,
};

test("user.store: should create a new user if one doesn't exist", async () => {
  // `testHarness` is "The Unauthenticated Admin" for our test.
  // It can directly access the database and run functions as a system user.
  const testHarness = convexTest(schema);
  // `asUser` is a new test harness that acts as "The Logged-in User".
  const asUser = testHarness.withIdentity(identity);

  // 1. Run the mutation with a new user identity
  const userId = await asUser.mutation(internal.user.store);

  // 2. Verify a new user was created with the correct details
  const newUser = await testHarness.run(
    async (ctx) => await ctx.db.get(userId)
  );
  expect(newUser).not.toBeNull();
  expect(newUser?.clerkId).toEqual(identity.subject);
  expect(newUser?.phone_number).toEqual(identity.phoneNumber);
});

test("user.store: should return existing user ID if user already exists", async () => {
  // `testHarness` is "The Unauthenticated Admin" for our test.
  const testHarness = convexTest(schema);
  // `asUser` is a new test harness that acts as "The Logged-in User".
  const asUser = testHarness.withIdentity(identity);

  // 1. Run the mutation once to create the user
  const firstCallUserId = await asUser.mutation(internal.user.store);

  // 2. Run it a second time with the same identity
  const secondCallUserId = await asUser.mutation(internal.user.store);

  // 3. Verify the IDs are the same
  expect(firstCallUserId).toEqual(secondCallUserId);

  // 4. Verify only one user document exists in the database
  const users = await testHarness.run(
    async (ctx) => await ctx.db.query("users").collect()
  );
  expect(users.length).toEqual(1);
});

test("user.store: should throw an error if called without authentication", async () => {
  // `testHarness` is "The Unauthenticated Admin" for our test.
  const testHarness = convexTest(schema);

  // Try to run the mutation without providing an identity
  await expect(testHarness.mutation(internal.user.store)).rejects.toThrow(
    "Called store an user without authentication present"
  );
});
