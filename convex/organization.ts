import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";


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
    

// Get all addresses for an organization
export const getAddressesByOrgId = query({
  args: { orgId: v.id("organization") },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("address")
      .withIndex("orgID", (q) => q.eq("orgID", orgId))
      .collect();
  },
});

// Get addresses within a bounding box (for performance when loading map)
export const getAddressesInBounds = query({
  args: { 
    orgId: v.id("organization"),
    west: v.number(),
    south: v.number(),
    east: v.number(),
    north: v.number()
  },
  handler: async (ctx, { orgId, west, south, east, north }) => {
    const addresses = await ctx.db
      .query("address")
      .withIndex("orgID", (q) => q.eq("orgID", orgId))
      .collect();
    
    // Filter addresses in the bounding box
    return addresses.filter(addr => {
      const lon = addr.coordinates[0];
      const lat = addr.coordinates[1];
      return lon >= west && lon <= east && lat >= south && lat <= north;
    });
  },
});

// Import address data from GeoJSON
export const importAddressData = mutation({
  args: {
    orgId: v.id("organization"),
    addresses: v.array(
      v.object({
        hash: v.string(),
        number: v.string(),
        street: v.string(),
        unit: v.optional(v.string()),
        city: v.string(),
        district: v.optional(v.string()),
        region: v.optional(v.string()),
        postcode: v.string(),
        id: v.string(),
        coordinates: v.array(v.number()), // [longitude, latitude]
      })
    )
  },
  handler: async (ctx, { orgId, addresses }) => {
    // Insert each address
    const insertedIds = [];
    
    for (const address of addresses) {
      const id = await ctx.db.insert("address", {
        ...address,
        orgID: orgId
      });
      insertedIds.push(id);
    }
    
    return { count: insertedIds.length, ids: insertedIds };
  },
});

// Get a single address by id
export const getAddressById = query({
  args: { id: v.id("address") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Search addresses
export const searchAddresses = query({
  args: { 
    orgId: v.id("organization"),
    searchTerm: v.string() 
  },
  handler: async (ctx, { orgId, searchTerm }) => {
    const addresses = await ctx.db
      .query("address")
      .withIndex("orgID", (q) => q.eq("orgID", orgId))
      .collect();
    
    // Simple search implementation
    const searchTermLower = searchTerm.toLowerCase();
    return addresses.filter(addr => 
      addr.street.toLowerCase().includes(searchTermLower) ||
      addr.city.toLowerCase().includes(searchTermLower) ||
      addr.number.toLowerCase().includes(searchTermLower) ||
      addr.postcode.toLowerCase().includes(searchTermLower)
    );
  },
});

