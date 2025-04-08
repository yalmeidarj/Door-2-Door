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

// Create site with polygon data and link addresses
export const createSiteWithPolygon = mutation({
  args: { 
    orgID: v.id("organization"),
    name: v.string(),
    polygon: v.array(v.array(v.number())), // Array of [lat, lng] points
    representative: v.string(),
    isActive: v.boolean(),
    addressIds: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    // 1. Create the site with polygon data
    const siteId = await ctx.db.insert("site", {
      orgID: args.orgID,
      name: args.name,
      isActive: args.isActive,
      polygon: args.polygon,
      representative: args.representative,
    });
    
    // 2. If we have addresses to include, create a street for this site
    if (args.addressIds && args.addressIds.length > 0) {
      const streetId = await ctx.db.insert("street", {
        siteID: siteId,
        name: `${args.name} Street`,
      });
      
      // 3. For each address, get details and create a house record
      for (const addressId of args.addressIds) {
        // Find the address by original ID
        const address = await ctx.db
          .query("address")
          .filter(q => q.eq(q.field("id"), addressId))
          .first();
        
        if (address) {
          // Create a house record for this address
          await ctx.db.insert("house", {
            streetID: streetId,
            siteID: siteId,
            streetNumber: address.number || "",
            streetName: address.street,
            // Optional: Add more details from address
            latitude: address.coordinates[1].toString(),
            longitude: address.coordinates[0].toString(),
          });
        }
      }
    }
    
    return { siteId };
  },
});

// Get sites with polygon data
export const getSitesWithPolygons = query({
  args: { orgID: v.id("organization") },
  handler: async (ctx, { orgID }) => {
    return await ctx.db
      .query("site")
      .withIndex("orgID", (q) => q.eq("orgID", orgID))
      .filter(q => q.neq(q.field("polygon"), undefined))
      .collect();
  },
});

// Get a single site with its polygon and addresses
export const getSiteWithAddresses = query({
  args: { siteId: v.id("site") },
  handler: async (ctx, { siteId }) => {
    // Get the site
    const site = await ctx.db.get(siteId);
    if (!site) return null;
    
    // Get the streets for this site
    const streets = await ctx.db
      .query("street")
      .withIndex("siteID", (q) => q.eq("siteID", siteId))
      .collect();
    
    // Get houses for each street
    const houses = [];
    for (const street of streets) {
      const streetHouses = await ctx.db
        .query("house")
        .withIndex("streetID", (q) => q.eq("streetID", street._id))
        .collect();
      
      houses.push(...streetHouses);
    }
    
    // Return site with related data
    return {
      ...site,
      streets,
      houses,
    };
  },
});

// Delete a site and all related data
export const deleteSite = mutation({
  args: { siteId: v.id("site") },
  handler: async (ctx, { siteId }) => {
    // Get streets for this site
    const streets = await ctx.db
      .query("street")
      .withIndex("siteID", (q) => q.eq("siteID", siteId))
      .collect();
    
    // Delete houses for each street
    for (const street of streets) {
      const houses = await ctx.db
        .query("house")
        .withIndex("streetID", (q) => q.eq("streetID", street._id))
        .collect();
      
      // Delete each house
      for (const house of houses) {
        await ctx.db.delete(house._id);
      }
      
      // Delete the street
      await ctx.db.delete(street._id);
    }
    
    // Delete the site
    await ctx.db.delete(siteId);
    
    return { success: true };
  },
});