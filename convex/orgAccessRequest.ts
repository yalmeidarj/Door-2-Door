import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createNewOrgAccessRequest = mutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("organization"),
    userName: v.optional(v.string()),
    email: v.optional(v.string()),
  },
    handler: async (ctx, args) => {
      const { userId, orgId, userName, email } = args;
    console.log(await ctx.db.get(userId));
    const accessRequest = await ctx.db.insert("orgAccessRequest", {
      userID: userId,
      orgID: orgId,
      userName: userName,
      email: email,
      status: "pending",
    });
    return accessRequest;
  },
});

export const getRequestByUserId = query({
  args: { id: v.id("users"), orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const { id, orgId } = args;
    const accessRequest = await ctx.db
      .query("orgAccessRequest")
      .filter((q) => q.eq(q.field("userID"), id))
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .first();
    return accessRequest;
  },
});
export const getRequestByOrgId = query({
  args: { orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const { orgId } = args;
    const accessRequest = await ctx.db
      .query("orgAccessRequest")
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .first();
    return accessRequest;
  },
});
export const getAllRequestsByOrgId = query({
  args: { orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const { orgId } = args;
    const accessRequest = await ctx.db
      .query("orgAccessRequest")
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .collect();
    return accessRequest;
  },
});
export const getAllPendingRequestsByOrgId = query({
  args: { orgId: v.id("organization") },
  handler: async (ctx, args) => {
    const { orgId } = args;
    const accessRequest = await ctx.db
      .query("orgAccessRequest")
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
    return accessRequest;
  },
});

export const updateOrgAccessRequestById = mutation({
  args: {
    id: v.id("orgAccessRequest"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;
    const accessRequest = await ctx.db
      .query("orgAccessRequest")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    if (!accessRequest) {
      return null;
    }
    return await ctx.db.patch(accessRequest._id, { status });
  },
});

export const deleteOrgAccessRequestById = mutation({
  args: {
    // userId: v.id("users"),
    id: v.id("orgAccessRequest"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const accessRequest = await ctx.db
        .query("orgAccessRequest")
        .filter((q) => q.eq(q.field("_id"), id))
      .first();
      console.log(accessRequest);
    if (!accessRequest) {
    return null;
    }
    return await ctx.db.delete(accessRequest._id);
  },
});  
      
// export const deleteOrgAccessRequestById = mutation({
      

        