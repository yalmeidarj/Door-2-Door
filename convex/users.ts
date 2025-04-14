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
    shiftMaxInactiveTimeFinal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      id,
      name,
      organizationId,
      role,
      shiftMaxInactiveTime,
      shiftMaxInactiveTimeFinal,
    } = args;

    
    // Patch only the fields that should actually update the document.
    const updatedFields: Record<string, unknown> = {};

    if (name !== undefined) updatedFields.name = name;
    if (organizationId !== undefined)
      updatedFields.organizationId = organizationId;
    if (role !== undefined) updatedFields.role = role;
    if (shiftMaxInactiveTime !== undefined)
      updatedFields.shiftMaxInactiveTime = shiftMaxInactiveTime;
    if (shiftMaxInactiveTimeFinal !== undefined)
      updatedFields.shiftMaxInactiveTimeFinal = shiftMaxInactiveTimeFinal;

    await ctx.db.patch(id, updatedFields);

    // Fetch the updated user
    const updatedUser = await ctx.db.get(id);
    return updatedUser;
  },
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