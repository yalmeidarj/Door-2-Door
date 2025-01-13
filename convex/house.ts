import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";


export const getHousesByStreetIdAndStatus = query({
  args: {
    streetId: v.string(),
    status: v.string(),
  }, // Use v.string() for userId
  handler: async (ctx, { streetId, status }) => {
    const houses = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) => q.eq(q.field("statusAttempt"), status))
      .collect();
    
    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) => {
      return a.streetNumber.localeCompare(b.streetNumber);
    });
    return sortedHouses;
  },
})

export const getHousesNotInSalesForceBySiteId = query({
  args: {
    siteId: v.string(),
  }, // Use v.string() for userId
  handler: async (ctx, { siteId }) => {
    const houses = await ctx.db
      .query("house")
      .withIndex("siteID", (q) => q.eq("siteID", siteId))
      // .filter((q) => q.eq(q.field("isConcilatedInSalesForce"), false))
      .filter((q) => q.or(
        q.eq(q.field("isConcilatedInSalesForce"), null),
        q.eq(q.field("isConcilatedInSalesForce"), false) 
      ))
      .collect();
    
    return houses;
  },
});
export const getHousesConsentFinalByStreetId = query({
  args: {
    streetId: v.string(),
  }, // Use v.string() for userId
  handler: async (ctx, { streetId}) => {
    const houses = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) => q.or(
        q.eq(q.field("statusAttempt"), "Consent Final Yes"),
        q.eq(q.field("statusAttempt"), "Consent Final No")
      ))
      .collect();
    
    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) => {
      return a.streetNumber.localeCompare(b.streetNumber);
    });
    return sortedHouses;
  },
});
//------------ Stats by Street ID ------------//
export const getStatsHousesByStreetId = query({
  args: {
    streetId: v.string(),
    
  }, // Use v.string() for userId
  handler: async (ctx, { streetId }) => {
    const houses = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
    // .take(take || 20);
    .collect();

    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) => {
      return a.streetNumber.localeCompare(b.streetNumber);
    });
    return sortedHouses;
  },
});
export const getActiveHousesByStreetId = query({
  args: {
    streetId: v.string(),
    
  }, // Use v.string() for userId
  handler: async (ctx, { streetId }) => {
    const houses = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) =>
        q.and(
          q.neq(q.field("statusAttempt"), "Consent Final Yes"),
          q.neq(q.field("statusAttempt"), "Engineer Visit Required"),
          // q.neq(q.field("statusAttempt"), "Site Visit Required"),
          q.neq(q.field("statusAttempt"), "Home Does Not Exist"),
          q.neq(q.field("statusAttempt"), "Consent Final No")
        )
      )
      // .take(take || 20);
      .collect();

    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) => {
      return a.streetNumber.localeCompare(b.streetNumber);
    });
    return sortedHouses;
  },
});

export const getHousesByStreetIdPaginated = query({ 
  args: {
    paginationOpts: paginationOptsValidator,
    streetId: v.string(),
    after: v.optional(v.string()),
    first: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const housesPaginationResult = await ctx.db
      .query("house")
      .withIndex("by_streetID_and_streetNumber", (q) =>
        q.eq("streetID", args.streetId)
      )
      .order("asc")
      .paginate(args.paginationOpts);

    // Debug: Log the streetNumber values
    console.log(
      "Unsorted streetNumbers:",
      housesPaginationResult.page.map((house) => house.streetNumber)
    );

    // Sort the houses by numeric streetNumber
    const sortedHouses = housesPaginationResult.page.sort((a, b) => {
      const streetNumberA =
        parseFloat(a.streetNumber.replace(/[^0-9.]/g, "")) || 0; // Remove non-numeric chars and parse
      const streetNumberB =
        parseFloat(b.streetNumber.replace(/[^0-9.]/g, "")) || 0;

      return streetNumberA - streetNumberB; // Ascending order
    });

    // Debug: Log the sorted result
    console.log(
      "Sorted streetNumbers:",
      sortedHouses.map((house) => house.streetNumber)
    );

    // Return the sorted items along with the pagination info
    return {
      ...housesPaginationResult,
      page: sortedHouses,
    };
  },
});


export const getHousesConsentYesByStreetId = query({
  args: { streetId: v.string() },

  handler: async (ctx, { streetId }) => {
    const houses = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Consent Final Yes"))
      .collect();
    
    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) => {
      return a.streetNumber.localeCompare(b.streetNumber);
    });
    return sortedHouses;
  },
});

export const getHousesConsentNoByStreetId = query({
  args: { streetId: v.string() },
  handler: async (ctx, { streetId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Consent Final No"))
      .collect();
  },
});
export const getHousesVisitRequestByStreetId = query({
  args: { streetId: v.string() },
  handler: async (ctx, { streetId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Site Visit Required"))
      .collect();
  },
});

export const getVisitedHousesByStatusAttemptByStreetId = query({
  args: { streetId: v.string() },
  handler: async (ctx, { streetId }) => {
    const statusAttempts = [
      "Door Knock Attempt 1",
      "Door Knock Attempt 2",
      "Door Knock Attempt 3",
      "Door Knock Attempt 4",
      "Door Knock Attempt 5",
      "Door Knock Attempt 6",
      "Site Visit Required",
      "Drop Type Unverified",
      "Home Does Not Exist",
    ];

    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) =>
        q.or(
          ...statusAttempts.map((status) =>
            q.eq(q.field("statusAttempt"), status)
          )
        )
      )
      .collect();
  },
});

export const getVisitedHousesByStatusByStreetId = query({
  args: { streetId: v.string() },
  handler: async (ctx, { streetId }) => {
    const statusAttempts = [
      "Door Knock Attempt 1",
      "Door Knock Attempt 2",
      "Door Knock Attempt 3",
      "Door Knock Attempt 4",
      "Door Knock Attempt 5",
      "Door Knock Attempt 6",
      "Site Visit Required",
      "Drop Type Unverified",
      "Consent Final Yes",
      "Consent Final No",
      "Home Does Not Exist",
    ];

    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("streetID"), streetId))
      .filter((q) =>
        q.or(
          ...statusAttempts.map((status) =>
            q.eq(q.field("statusAttempt"), status)
          )
        )
      )
      .collect();
  },
});
//------------ ------------//

//------------ Stats by Site ID ------------//
export const getHousesBySiteId = query({
  args: { siteId: v.string() }, // Use v.string() for userId
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .collect();
  },
});

export const getHousesConsentYesBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Consent Final Yes"))
      .collect();
  },
});

export const getHousesConsentNoBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Consent Final No"))
      .collect();
  },
});
export const getHousesVisitRequestBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .filter((q) => q.eq(q.field("statusAttempt"), "Site Visit Required"))
      .collect();
  },
});

export const getVisitedHousesByStatusAttempt = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    const statusAttempts = [
      "Door Knock Attempt 1",
      "Door Knock Attempt 2",
      "Door Knock Attempt 3",
      "Door Knock Attempt 4",
      "Door Knock Attempt 5",
      "Door Knock Attempt 6",
      "Site Visit Required",
      "Drop Type Unverified",
      "Home Does Not Exist"

    ];

    return await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .filter((q) =>
        q.or(
          ...statusAttempts.map((status) =>
            q.eq(q.field("statusAttempt"), status)
          )
        )
      )
      .collect();
  },
});
//------------ ------------//

const houseArgs = {
  streetID: v.string(),
  siteID: v.string(),
  streetNumber: v.string(),
  streetName: v.string(),
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
};

export const createNewHouse = mutation({
  args: houseArgs,
  handler: async (
    ctx,
    { streetID, siteID, streetNumber, streetName, ...rest }
  ) => {
    return await ctx.db.insert("house", {
      streetID: streetID,
      siteID: siteID,
      streetName: streetName,
      streetNumber: streetNumber,
      ...rest,
    });
  },
});

export const conciliateHouse = mutation({
  args: {
    houseID: v.id("house"),

  },
  handler: async (ctx, { houseID }) => {
    try {
      
      const house = await ctx.db.patch(houseID, {
        isConcilatedInSalesForce: true,
      });
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
})

export const updateProperty = mutation({
  args: {
    houseID: v.id("house"),
    ...houseArgs,
  },
  handler: async (
    ctx,
    { houseID, ...houseArgs }
  ) => {
    return await ctx.db.patch(houseID, { ...houseArgs });
  },
});


export const changeStatus = mutation({
  args: {
    houseID: v.id("house"),
    agentID: v.string(),
    statusAttempt: v.string(),
  },
  handler: async (ctx, { houseID, statusAttempt }) => {
    return await ctx.db.patch(houseID, {
      statusAttempt: statusAttempt
    })
  },
});

export const editHouseCoordinate = mutation({
  args: {
    id: v.id("house"),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, { id, lat, lng }) => {
    const latitude = lat.toString();
    const longitude = lng.toString();
    return await ctx.db.patch(id, {
      latitude: latitude,
      longitude: longitude,
    });
  },
});