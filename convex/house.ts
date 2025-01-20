import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";


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
    .filter((q) => q.eq(q.field("siteID"), siteId));

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

// Get all houses for a site
// export const getHousesBySiteId = query({
//   args: { siteId: v.string() },
//   handler: async (ctx, { siteId }) => {
//     return await ctx.db
//       .query("house")
//       .filter((q) => q.eq(q.field("siteID"), siteId))
//       .collect();
//   },
// });

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
      .filter((q) =>
        q.or(q.eq(q.field("orgID"), orgId), q.eq(q.field("orgID"), orgId)))
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