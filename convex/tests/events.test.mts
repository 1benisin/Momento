import { test } from "vitest";
import { setup, teardown } from "./test-utils";

test.beforeEach(async (t) => {
  await setup(t);
});

test.afterEach(async (t) => {
  await teardown(t);
});

test("createOrUpdateDraft correctly creates a new draft", async (t) => {
  // TODO: Implement test
  // 1. Authenticate as a user.
  // 2. Call the createOrUpdateDraft mutation with new event data.
  // 3. Assert that a new event document is created in the database with status 'draft'.
});

test("createOrUpdateDraft correctly updates an existing draft", async (t) => {
  // TODO: Implement test
  // 1. Create an initial draft.
  // 2. Call the createOrUpdateDraft mutation with the ID of the existing draft and updated data.
  // 3. Assert that the event document is updated correctly.
});

test("publishEvent fails for unverified hosts", async (t) => {
  // TODO: Implement test
  // 1. Create a draft with an unverified host user.
  // 2. Attempt to call the publishEvent mutation.
  // 3. Assert that the mutation throws an error.
});

test("publishEvent succeeds for verified hosts", async (t) => {
  // TODO: Implement test
  // 1. Create a draft with a verified host user.
  // 2. Call the publishEvent mutation.
  // 3. Assert that the event's status is updated to 'published'.
});

test("getOrCreateLocation returns existing location", async (t) => {
  // TODO: Implement test
  // 1. Insert a location document directly into the database.
  // 2. Call the getOrCreateLocation mutation with the same location data.
  // 3. Assert that the returned ID matches the existing location's ID and no new document is created.
});

test("getOrCreateLocation creates a new location", async (t) => {
  // TODO: Implement test
  // 1. Call the getOrCreateLocation mutation with new location data.
  // 2. Assert that a new location document is created and its ID is returned.
});
