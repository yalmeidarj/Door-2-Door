import { Infer, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { DataModel } from "./_generated/dataModel";


export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return ctx.db
    .query("users")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first();
}

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .first();
  },
})

export const switchUserBlockStatus = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the user document
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // 2. Toggle the inactivityBlocked status
    const newStatus = !user.inactivityBlocked;

    // 3. Update the user document
    await ctx.db.patch(args.userId, {
      inactivityBlocked: newStatus,
    });

    // Optional: Return the updated user data
    return { ...user, inactivityBlocked: newStatus };
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("dev"), v.literal("admin"), v.literal("user"))
    ),
    shiftMaxInactiveTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, name,organizationId, role, shiftMaxInactiveTime } = args;

    // Before patching, we confirm the user exists.
    const existingUser = await ctx.db.get(id);
    console.log(existingUser);

    // Patch only the fields that should actually update the document.
    const updatedFields: Record<string, unknown> = {};

    if (name !== undefined) updatedFields.name = name;
    if (organizationId !== undefined) updatedFields.organizationId = organizationId;
    if (role !== undefined) updatedFields.role = role;
    if (shiftMaxInactiveTime !== undefined) updatedFields.shiftMaxInactiveTime = shiftMaxInactiveTime;

    await ctx.db.patch(id, updatedFields);

    // Fetch the updated user
    const updatedUser = await ctx.db.get(id);
    return updatedUser;
  },
});

const triggers = new Triggers<DataModel>();

triggers.register("houseEditLog", async (ctx, change) => {
  if (change.newDoc) {
    // Check if status is not 'consent final'
    if (
      change.newDoc.statusAttempt !== "Consent Final Yes" &&
      change.newDoc.statusAttempt !== "Consent Final No"
    ) {
      const userId = change.newDoc.agentId;

      // Fetch the *active* shiftLogger document related to the current user
      const shiftLogger = await ctx.db
        .query("shiftLogger")
        .withIndex("by_user_isFinished_creationTime", (q) =>
          q.eq("userID", userId as Id<"users">).eq("isFinished", false)
        )
        .order("desc")
        .first();

      if (shiftLogger) {
        // Check if it's the first house of the shift
        const isFirstHouse =
          (shiftLogger.updatedHouses || 0) +
            (shiftLogger.updatedHousesFinal || 0) +
            (shiftLogger.updatedHousesFinalNo || 0) >
          0;
        if (isFirstHouse) {
          // Get the last house edit log for the agent
          const lastEdit = await ctx.db
            .query("houseEditLog")
            .withIndex("agentId", (q) => q.eq("agentId", userId))
            .order("desc")
            .first();

          if (lastEdit) {
            const shiftMaxInactiveTime = (await ctx.db.get(userId as Id<"users">))
              ?.shiftMaxInactiveTime;

            if (shiftMaxInactiveTime) {
              const timeDifference = Date.now() - lastEdit._creationTime;

              // Compare time difference with shiftMaxInactiveTime and log if needed
              if (timeDifference > shiftMaxInactiveTime) {
                console.log(
                  "User Inactive Time Exceeded",
                  timeDifference,
                  shiftMaxInactiveTime
                );
              }
            }
          }
        }
      }
    }
  }
});

export const removeUserFromOrg = mutation({
  args: {
    userId: v.id("users"),
    // orgId: v.id("organization"),
  },
  handler: async (ctx, args) => {
    const { userId  } = args;
    await ctx.db.patch(userId, { organizationId: undefined });
    return await ctx.db.get(userId);
  },
})

export const getOrgByUserId = query({
  args: { id: v.id("users") },

  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("organization")
      // .withIndex("users", (q) => q.eq("users", [id]))
      .filter((q) => q.eq(q.field("users"), [id]))
      .first();
  },
});

export const getAllUsersNoOrg = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), null))
      .collect();
  },
});

export const getAllUsersInOrg = query({
  args: { id: v.id("organization") },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), id))
      .collect();
  },
});
export const getAllUsersInOrgByName = query({
  args: { orgName: v.string() },
  handler: async (ctx, { orgName }) => {
    const organization = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("name"), orgName))
      .first();
    const id = organization?._id;
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), id))
      .collect();
  },
});
export const getOrgByName = query({
  args: { orgName: v.string() },
  handler: async (ctx, { orgName }) => {
    return await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("name"), orgName))
      .collect();
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
    organizationId: v.string(),
   },
  handler: async (ctx, { email, organizationId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
  },
});