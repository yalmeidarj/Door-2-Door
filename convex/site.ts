import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getActiveSitesByUserId = query({
  args: { orgID: v.string() }, 
  handler: async (ctx, { orgID }) => {
    return await ctx.db
      .query("site")
      .filter((q) => q.eq(q.field("orgID"), orgID))
      .filter((q) => q.eq(q.field("isActive"), true)) // Filter by isActive
      .collect();
  },
});

export const switchSiteStatus = mutation({
  args: { siteID: v.string() },
  handler: async (ctx, { siteID }) => {
    const site =  await ctx.db
      .query("site")
      .filter((q) => q.eq(q.field("_id"), siteID))
      .first();

    if (!site) {
      return;
    }
    const updatedSite = await ctx.db.patch(site._id, {
      isActive: !site.isActive,
    });

    return updatedSite;
  },
});

export const getActiveSitesByOrgName = query({
  args: { orgName: v.string() }, 
  handler: async (ctx, { orgName }) => {
    const org = await ctx.db
      .query("organization")
      .withIndex("name", (q) => q.eq("name", orgName))
      .first();
    if (!org) {
      return [];
    }
    return await getActiveSitesByOrgId(ctx, { orgID: org._id });
  },
})
export const getAllSitesByOrgName = query({
  args: { orgName: v.string() }, 
  handler: async (ctx, { orgName }) => {
    const org = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("name"), orgName))
      .first();
    if (!org) {
      return
    }
    const sites = await ctx.db.query("site")
      .withIndex("orgID", (q) => q.eq("orgID", org._id))
      .collect();

    // const sites = awaitorg.map((o) =>
    //   getActiveSitesByOrgId(ctx, { orgID: o._id })
    // );
    return sites;
  },
})
export const changeSitePayStatus = mutation({
  args: {
    siteID: v.string(),
    orgID: v.string(),
    payStatus: v.optional(v.boolean()),
  },
  handler: async (ctx, { siteID, payStatus, orgID }) => {
    const site =  await ctx.db
      .query("site")
      .withIndex("orgID", (q) => q.eq("orgID", orgID as Id<"organization">))
      .filter((q) => q.eq(q.field("_id"), siteID))
      .first();

    if (!site) {
      return;
    }

    const updatedSite = await ctx.db.patch(site._id, {
      payStatus: payStatus,
    });

    return updatedSite;
  },
});
export const getActiveSitesByOrgId = query({
  args: { orgID: v.string() }, 
  handler: async (ctx, { orgID }) => {
    return await ctx.db
      .query("site")
      .withIndex("orgID", (q) => q.eq("orgID", orgID as Id<"organization">))
      .filter((q) => q.eq(q.field("isActive"), true)) // Filter by isActive
      .collect();
  },
});
export const getAllSitesByOrgId = query({
  args: { orgID: v.string() }, 
  handler: async (ctx, { orgID }) => {
    return await ctx.db
      .query("site")
      .withIndex("orgID", (q) => q.eq("orgID", orgID as Id<"organization">))
      .collect();
  },
});
export const getSiteById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("site")
      .filter((q) => q.eq(q.field("_id"), id))
      // .withIndex("_id", (q) => q.eq("_id", id as Id<"site">))
      .first();
  },
});
export const getSiteByStreetId = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const street = await ctx.db
      .query("street")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    if (!street) {
      return null;
    }
    return await ctx.db
      .query("site")
      .filter((q) => q.eq(q.field("_id"), street.siteID))
      .first();
  },
});
export const getActiveSiteById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("site")
      .filter((q) => q.eq(q.field("_id"), id))
      .filter((q) => q.eq(q.field("isActive"), true)) // Filter by isActive
      .collect();
  },
});

export const createNewSite = mutation({
  args: { orgID: v.string(), name: v.string() },
  handler: async (ctx, { orgID, name  }) => {
    return await ctx.db.insert("site", {
      orgID: orgID as Id<"organization">,
      name: name,
      isActive: true,
    });
  },
})