import {  v } from "convex/values";
import { query } from "./_generated/server";


export const getOrganizationsByUserId = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("users"), [id]))
      .first();
  },
});

export const getAllOrganizations = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("organization")
      .collect();
  },
})

export const getOrgByName = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("name"), name))
      .first();
  },
})
export const getOrgById = query({
  args: { id: v.id("organization") },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
  },
})
    