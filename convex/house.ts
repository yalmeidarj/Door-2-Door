import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

import { filter } from "convex-helpers/server/filter";

export const getHousesByStreetIdAndStatus = query({
  args: {
    streetId: v.string(),
    status: v.string(),
  }, // Use v.string() for userId
  handler: async (ctx, { streetId, status }) => {
    const houses = await ctx.db
      .query("house")
      // .filter((q) => q.eq(q.field("streetID"), streetId))
      // .filter((q) => q.eq(q.field("statusAttempt"), status))
      // .collect();
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
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
      .withIndex("siteID", (q) => q.eq("siteID", siteId as Id<"site">))
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
      .filter((q) => q.or(
        q.eq(q.field("statusAttempt"), "Consent Final Yes"),
        q.eq(q.field("statusAttempt"), "Consent Final No"),
        q.eq(q.field("statusAttempt"), "Consent Final")
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
    // .take(take || 20);
      .collect();

    // Sort the houses by street number
    const sortedHouses = houses.sort((a, b) =>
      a.streetNumber.localeCompare(b.streetNumber, undefined, { numeric: true })
    );

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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
      .filter((q) =>
        q.and(
          q.neq(q.field("statusAttempt"), "Consent Final Yes"),
          q.neq(q.field("statusAttempt"), "Engineer Visit Required"),
          q.neq(q.field("statusAttempt"), "Consent Final"),
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
        q.eq("streetID", args.streetId as Id<"street">)
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
      .filter((q) => q.eq(q.field("statusAttempt"), "Consent Final No"))
      .collect();
  },
});
export const getHousesVisitRequestByStreetId = query({
  args: { streetId: v.string() },
  handler: async (ctx, { streetId }) => {
    return await ctx.db
      .query("house")
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
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
      .withIndex("streetID", (q) => q.eq("streetID", streetId as Id<"street">))
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
      .withIndex("siteID", (q) => q.eq("siteID", siteId as Id<"site">))
      .collect();
  },
});

export const getHousesConsentYesBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .withIndex("siteID_statusAttempt", (q) =>
        q
          .eq("siteID", siteId as Id<"site">)
          .eq("statusAttempt", "Consent Final Yes")
      )
      .collect();
  },
});
export const getHousesNonExistBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .withIndex("siteID_statusAttempt", (q) =>
        q
          .eq("siteID", siteId as Id<"site">)
          .eq("statusAttempt", "Home Does Not Exist")
      )
      .collect();
  },
});

export const getHousesConsentNoBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .withIndex("siteID_statusAttempt", (q) =>
        q
          .eq("siteID", siteId as Id<"site">)
          .eq("statusAttempt", "Consent Final No")
      )
      .collect();
  },
});

export const getHousesVisitRequestBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("house")
      .withIndex("siteID_statusAttempt", (q) =>
        q
          .eq("siteID", siteId as Id<"site">)
          .eq("statusAttempt", "Site Visit Required")
      )
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
      "Home Does Not Exist",
    ];

    return await ctx.db
      .query("house")
      .withIndex("siteID", (q) => q.eq("siteID", siteId as Id<"site">))
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

//------------ Stats by org ID ------------//

const HOUSE_STATUS = {
  CONSENT_FINAL_YES: "Consent Final Yes",
  CONSENT_FINAL_NO: "Consent Final No",
  SITE_VISIT_REQUIRED: "Site Visit Required",  
  Door_Knock_Attempt_1:"Door Knock Attempt 1",
  Door_Knock_Attempt_2:"Door Knock Attempt 2",
  Door_Knock_Attempt_3:"Door Knock Attempt 3",
  Door_Knock_Attempt_4:"Door Knock Attempt 4",
  Door_Knock_Attempt_5:"Door Knock Attempt 5",
  Door_Knock_Attempt_6:"Door Knock Attempt 6",
  Site_Visit_Required:"Site Visit Required",
  Drop_Type_Unverified:"Drop Type Unverified",
  Home_Does_Not_Exist:"Home Does Not Exist",
  
} as const;

// Helper function to get houses by site ID and status
export async function getHousesByStatus(
  ctx: QueryCtx,
  siteId: string,
  status: string | string[]
) {
  const query = ctx.db
    .query("house")
    .withIndex("siteID", (q) => q.eq("siteID", siteId as Id<"site">));

  if (Array.isArray(status)) {
    return await query
      .filter((q) =>
        q.or(...status.map((s) => q.eq(q.field("statusAttempt"), s)))
      )
      .collect();
  }

  return await query
    .filter((q) => q.eq(q.field("statusAttempt"), status))
    .collect();
}


//TODO[HIGH]: Use this function for SiteCard.tsx for better performance
// Get house statistics for a site
export const getHouseStatsBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    // Use Promise.all to run queries concurrently
    const VISITED_STATUSES = [
      HOUSE_STATUS.Door_Knock_Attempt_1,
      HOUSE_STATUS.Door_Knock_Attempt_2,
      HOUSE_STATUS.Door_Knock_Attempt_3,
      HOUSE_STATUS.Door_Knock_Attempt_4,
      HOUSE_STATUS.Door_Knock_Attempt_5,
      HOUSE_STATUS.Door_Knock_Attempt_6,
      HOUSE_STATUS.Site_Visit_Required,
      HOUSE_STATUS.Drop_Type_Unverified,
      HOUSE_STATUS.Home_Does_Not_Exist
    ]
    const [finalYes, finalNo, visitRequest, visited] = await Promise.all([
      getHousesByStatus(ctx, siteId, HOUSE_STATUS.CONSENT_FINAL_YES),
      getHousesByStatus(ctx, siteId, HOUSE_STATUS.CONSENT_FINAL_NO),
      getHousesByStatus(ctx, siteId, HOUSE_STATUS.SITE_VISIT_REQUIRED),
      getHousesByStatus(ctx, siteId, VISITED_STATUSES),
    ]);

    return {
      totalHouses:
        finalYes.length + finalNo.length + visitRequest.length ,
      consentYes: finalYes.length,
      consentNo: finalNo.length,
      visitRequired: visitRequest.length,
      visited: visited.length,
    };
  },
});

// Get aggregated statistics for an organization
export const getHouseStatsByOrgId = query({
  args: {
    orgId: v.string(),
    orgName: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    // Get all sites for the organization
    const sites = await ctx.db
      .query("site")
      .withIndex("orgID", (q) => q.eq("orgID", orgId as Id<"organization">))
      .collect();

    // Get statistics for each site concurrently
    const siteStats = await Promise.all(
      sites.map(async (site) => {
        const stats = await getHouseStatsBySiteId(ctx, { siteId: site._id });
        return {
          siteId: site._id,
          siteName: site.name,
          ...stats,
        };
      })
    );

    // Calculate organization-wide totals
    const orgTotals = siteStats.reduce(
      (acc, site) => ({
        totalHouses: sites.length,
        consentYes: acc.consentYes + site.consentYes,
        consentNo: acc.consentNo + site.consentNo,
        visitRequired: acc.visitRequired + site.visitRequired,
        visited: acc.visited + site.visited,
      }),
      {
        totalHouses: 0,
        consentYes: 0,
        consentNo: 0,
        visitRequired: 0,
        visited: 0,
      }
    );

    return {
      orgTotals,
      siteStats,
    };
  },
});

// export const getHouseStatsByOrgId = query({
//   args: { orgId: v.string() }, // Use v.string() for userId
//   handler: async (ctx, { orgId }) => {
//     const orgSites = await ctx.db
//       .query("site")
//       .filter((q) => q.eq(q.field("orgID"), orgId))
//       .collect();
//     const siteIds = orgSites.map((site) => site._id);
//     // get all houses by siteIds, using getHousesBySiteId
//     const houses = siteIds.map(async (siteId) => {
//       const finalYes = await getHousesConsentYesBySiteId(ctx, { siteId });
//       const finalNo = await getHousesConsentNoBySiteId(ctx, { siteId });
//       const visitRequest = await getHousesVisitRequestBySiteId(ctx, { siteId });
//       const visited = await getVisitedHousesByStatusAttempt(ctx, { siteId });
//       return { siteId, finalYes, finalNo, visitRequest, visited };
//     })
//     return houses;
//   },
// });

//------------ ------------//

const houseArgs = {
  streetID: v.id("street"),
  siteID: v.id("site"),
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
      streetID: streetID as Id<"street">,
      siteID: siteID as Id<"site">,
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


export const updateSiteMutation = mutation({
  args: {
    orgId: v.string(),
    streetName: v.string(),
    streetNumber: v.string(),
    siteName: v.string(),
    agentId: v.string(),
    statusAttempt: v.string(),
    consent: v.optional(v.string()),
  },
  handler: async (ctx, { orgId, siteName, streetName, streetNumber, agentId, statusAttempt, consent }) => {
    // 1. Get the siteID based on the orgID
    const site = await ctx.db
      .query("site")
      .withIndex("orgId_name_isActive", (q) =>
        q.eq("orgID", orgId as Id<"organization">).eq("name", siteName).eq("isActive", true)
      )
      .first();

    if (!site) {
      throw new Error(`Site not found for orgId: ${orgId}`);
    }

    // 2. Get the streetID based on the siteID
    const street = await ctx.db
      .query("street")
      .withIndex("siteID_name", (q) =>
        q
          .eq("siteID", site._id as Id<"site">)
          .eq("name", streetName)
      )
      .first();

    if (!street) {
      throw new Error(`Street not found for siteId: ${site._id}`);
    }

    // 3. Query for the specific house using the streetID and streetNumber
    const house = await ctx.db
      .query("house")
      .withIndex("by_streetID_and_streetNumber", (q) =>
        q
          .eq("streetID", street._id as Id<"street">)
          .eq("streetNumber", streetNumber)
      )
      .first();

    if (!house) {
      throw new Error(
        `House not found with streetNumber: ${streetNumber} at site ${site._id}`
      );
    }

    // 4. Update the house document
    await ctx.db.patch(house._id, {
      statusAttempt: statusAttempt + ' ' + consent,
      consent: consent,
    });

        // 5. Create a new houseEditLog record
    await ctx.db.insert("houseEditLog", {
      houseId: house._id as Id<"house">,
      agentId: agentId as Id<"users">,
      statusAttempt: statusAttempt + " " + consent,
      // consent: consent,
    });

    return house;
    
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