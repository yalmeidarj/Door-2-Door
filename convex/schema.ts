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
  inactivityBlocked: v.optional(v.boolean()),
  role: v.optional(
    v.union(v.literal("dev"), v.literal("admin"), v.literal("user"))
  ),
  organizationId: v.optional(v.string()),
  shiftMaxInactiveTime: v.optional(v.number()),
  shiftMaxInactiveTimeFinal: v.optional(v.number()),
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
    orgID: v.id("organization"),
    name: v.string(),
    isActive: v.boolean(), // Status of the site (e.g., "Active", "Inactive")
    priorityStatus: v.optional(v.number()), // Status of the site (e.g., "Active", "Inactive")
    neighborhood: v.optional(v.string()),
    shiftMaxInactiveTime: v.optional(v.number()),
    payStatus: v.optional(v.boolean()),
  })
    .index("orgID", ["orgID"])
    .index("orgId_name_isActive", ["orgID", "name", "isActive"])
    .index("name", ["name"]),

  street: defineTable({
    siteID: v.id("site"),
    name: v.string(),
    lastVisited: v.optional(v.number()),
    lastVisitedBy: v.optional(v.string()),
  })
    .index("siteID", ["siteID"])
    .index("siteID_name", ["siteID", "name"])
    .index("name", ["name"]),

  house: defineTable({
    streetID: v.id("street"), // Street ID the house belongs to
    siteID: v.id("site"), // Location ID the house belongs to
    streetNumber: v.string(), // Street number
    // TODO [LOW]:MAKE NOT AN OPTIONAL VALUE
    streetName: v.optional(v.string()), // Street number
    lastName: v.optional(v.string()),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    lastUpdated: v.optional(v.number()),
    isConcilatedInSalesForce: v.optional(v.boolean()),
    salesForceConflict: v.optional(v.boolean()),
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
    .index("siteID_statusAttempt", ["siteID", "statusAttempt"])
    .index("streetNumber", ["streetNumber"])
    .index("siteID", ["siteID"]),

  // shiftLoggerID: v.string(), // ShiftLogger ID for the shift that made the edit
  // shiftLoggerId: v.optional(v.string()),
  houseEditLog: defineTable({
    houseId: v.optional(v.id("house")),
    agentId: v.optional(v.id("users")),
    siteId: v.optional(v.id("site")),
    name: v.optional(v.string()),
    lastName: v.optional(v.string()),
    type: v.optional(v.string()),
    statusAttempt: v.optional(v.string()),
    email: v.optional(v.string()),
    salesForceConflict: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
  })
    .index("houseId", ["houseId"])
    .index("siteId", ["siteId"])
    .index("agentId", ["agentId"]),
  shiftLogger: defineTable({
    userID: v.id("users"), // User ID of the agent
    siteID: v.id("site"), // Site ID where the shift took place
    orgID: v.optional(v.string()), // Organization ID where the shift took place
    startingDate: v.number(),
    finishedDate: v.optional(v.number()),
    isFinished: v.boolean(),
    onBreak: v.optional(v.boolean()),
    updatedHouses: v.optional(v.number()),
    updatedHousesFinal: v.optional(v.number()),
    updatedHousesFinalNo: v.optional(v.number()),
    pace: v.optional(v.number()),
    maxInactiveTime: v.optional(v.number()),
    lastActivity: v.optional(v.number()),
    // paceFinal: v.optional(v.number()),
  })
    .index("by_user_isFinished_creationTime", ["userID", "isFinished"])
    .index("userID", ["userID"])
    .index("siteID_isFinished", ["siteID", "isFinished"])
    .index("orgID_isFinished", ["orgID", "isFinished"])
    .index("orgID", ["orgID"])
    .index("startingDate", ["startingDate"])
    .index("siteID", ["siteID"]),
  shiftBreaks: defineTable({
    shiftId: v.id("shiftLogger"),
    siteID: v.id("site"),
    description: v.optional(v.string()),
    endTime: v.optional(v.number()),
    motive: v.union(
      v.literal("inactivity"),
      v.literal("transit"),
      v.literal("general")
    ),
    status: v.string(), // 'active', 'completed', 'exceeded'
  }).index("shiftId", ["shiftId"]),
});