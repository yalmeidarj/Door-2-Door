import { defineSchema, defineTable } from "convex/server";
import { Validator, v } from "convex/values";

// The users, accounts, sessions and verificationTokens tables are modeled
// from https://authjs.dev/getting-started/adapters#models

export const userSchema = {
  email: v.string(),
  userId: v.optional(v.string()),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
  role: v.optional(
    v.union(v.literal("dev"), v.literal("admin"), v.literal("user"))
  ),
  organizationId: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn"),
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema)
    .index("email", ["email"])
    .index("userId", ["userId"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"]
  ),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
};



export default defineSchema({
  ...authTables,
  // your other tables
  // or pass `strictTableNameTypes: false`
  // in the second argument argument to `defineSchema`
  organization: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    logo: v.optional(v.string()),
    users: v.optional(v.array(v.string())),
    admins: v.optional(v.array(v.string())),
    sites: v.optional(v.array(v.string())),
  })
    .index("admins", ["admins"])
    .index("name", ["name"])
    .index("sites", ["sites"])
    .index("users", ["users"]),
  orgAccessRequest: defineTable({
    userID: v.string(),
    orgID: v.string(),
    userName: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.string(),
  })
    .index("users", ["userID"])
    .index("userName", ["userName"])
    .index("email", ["email"])
    .index("orgs", ["orgID"]),

  site: defineTable({
    orgID: v.string(), // Organization ID the site belongs to
    name: v.string(),
    isActive: v.boolean(), // Status of the site (e.g., "Active", "Inactive")
    priorityStatus: v.optional(v.number()), // Status of the site (e.g., "Active", "Inactive")
    neighborhood: v.optional(v.string()),
    maxInactiveDuration: v.optional(v.number()),
  })
    .index("orgID", ["orgID"])
    .index("name", ["name"]),

  street: defineTable({
    siteID: v.string(), // Site ID the street belongs to
    name: v.string(),
    lastVisited: v.optional(v.number()),
    lastVisitedBy: v.optional(v.string()),
  })
    .index("siteID", ["siteID"])
    .index("name", ["name"]),

  house: defineTable({
    streetID: v.string(), // Street ID the house belongs to
    siteID: v.string(), // Location ID the house belongs to
    streetNumber: v.string(), // Street number
    // TODO [LOW]:MAKE NOT AN OPTIONAL VALUE
    streetName: v.optional(v.string()), // Street number
    lastName: v.optional(v.string()),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    lastUpdated: v.optional(v.number()),
    isConcilatedInSalesForce: v.optional(v.boolean()),
    lastUpdatedBy: v.optional(v.string()),
    statusAttempt: v.optional(v.string()),
    consent: v.optional(v.string()),
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
    latitude: v.optional(v.string()),
    longitude: v.optional(v.string()),
  })
    .index("streetID", ["streetID"])
    .index("by_streetID_and_streetNumber", ["streetID", "streetNumber"])
    .index("streetNumber", ["streetNumber"])
    .index("siteID", ["siteID"]),

  // shiftLoggerID: v.string(), // ShiftLogger ID for the shift that made the edit
  // shiftLoggerId: v.optional(v.string()),
  houseEditLog: defineTable({
    houseId: v.optional(v.string()),
    agentId: v.optional(v.string()),
    name: v.optional(v.string()),
    lastName: v.optional(v.string()),
    type: v.optional(v.string()),
    statusAttempt: v.optional(v.string()),
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
  })
    .index("houseId", ["houseId"])
    .index("agentId", ["agentId"]),
  shiftLogger: defineTable({
    userID: v.string(), // User ID of the agent
    siteID: v.string(), // Site ID where the shift took place
    orgID: v.optional(v.string()), // Organization ID where the shift took place
    startingDate: v.number(),
    finishedDate: v.optional(v.number()),
    isFinished: v.boolean(),
    updatedHouses: v.optional(v.number()),
    updatedHousesFinal: v.optional(v.number()),
    updatedHousesFinalNo: v.optional(v.number()),
    pace: v.optional(v.number()),
    userMaxInactiveDuration: v.optional(v.number()),
    // paceFinal: v.optional(v.number()),
  })
    .index("userID", ["userID"])
    .index("orgID", ["orgID"])
    .index("startingDate", ["startingDate"])
    .index("siteID", ["siteID"]),
  shiftBreaks: defineTable({
    shiftId: v.id("shiftLogger"),
    siteID: v.string(),
    startTime: v.number(), // _creationTime
    endTime: v.optional(v.number()),
    motive: v.optional(v.string()),
    status: v.string(), // 'active', 'completed', 'exceeded'
  }).index("shiftId", ["shiftId"]),
});