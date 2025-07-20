/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as events from "../events.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as identity from "../identity.js";
import type * as lib_config from "../lib/config.js";
import type * as lib_stripe from "../lib/stripe.js";
import type * as locations from "../locations.js";
import type * as payments from "../payments.js";
import type * as user from "../user.js";
import type * as webhooks_clerk from "../webhooks/clerk.js";
import type * as webhooks_stripe from "../webhooks/stripe.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  events: typeof events;
  files: typeof files;
  http: typeof http;
  identity: typeof identity;
  "lib/config": typeof lib_config;
  "lib/stripe": typeof lib_stripe;
  locations: typeof locations;
  payments: typeof payments;
  user: typeof user;
  "webhooks/clerk": typeof webhooks_clerk;
  "webhooks/stripe": typeof webhooks_stripe;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
