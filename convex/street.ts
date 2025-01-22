import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getStreetsBySiteId = query({
  args: { siteID: v.string() }, // Use v.string() for userId
  handler: async (ctx, { siteID }) => {
    return await ctx.db
      .query("street")
      .withIndex("siteID", (q) => q.eq("siteID", siteID as Id<"site">))
      .collect();
  },
});

export const getStreetsByStreetId = query({
  args: { streetID: v.string() }, // Use v.string() for userId
  handler: async (ctx, { streetID }) => {
    return await ctx.db
      .query("street")
      .filter((q) => q.eq(q.field("_id"), streetID))
      .first();
  },
});

export const createNewStreet = mutation({
  args: { siteId: v.string(), name: v.string() },
  handler: async (ctx, { siteId, name }) => {
    return await ctx.db.insert("street", {
      siteID: siteId as Id<"site">,
      name: name,
    });
  },
});