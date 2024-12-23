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
import type * as authAdapter from "../authAdapter.js";
import type * as house from "../house.js";
import type * as houseEditLog from "../houseEditLog.js";
import type * as orgAccessRequest from "../orgAccessRequest.js";
import type * as organization from "../organization.js";
import type * as shiftBreaks from "../shiftBreaks.js";
import type * as shiftLogger from "../shiftLogger.js";
import type * as site from "../site.js";
import type * as street from "../street.js";
import type * as users from "../users.js";
import type * as util from "../util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  authAdapter: typeof authAdapter;
  house: typeof house;
  houseEditLog: typeof houseEditLog;
  orgAccessRequest: typeof orgAccessRequest;
  organization: typeof organization;
  shiftBreaks: typeof shiftBreaks;
  shiftLogger: typeof shiftLogger;
  site: typeof site;
  street: typeof street;
  users: typeof users;
  util: typeof util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
