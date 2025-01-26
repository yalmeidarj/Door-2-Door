import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { start } from "repl";
import { get } from "http";
import { Id } from "./_generated/dataModel";


export const getShiftsByAgentId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("userID"), userId as Id<"users">))
      .collect();
  },
});

export const createShift = mutation({
  args: {
    agentId: v.id("users"),
    siteID: v.id("site"),
    orgID: v.id("organization"),
  },
  handler: async (ctx, { agentId, siteID, orgID }) => {
    return await ctx.db.insert("shiftLogger", {
      userID: agentId,
      siteID: siteID,
      orgID: orgID,
      startingDate: Date.now(),
      isFinished: false,
    });
  },
});

export const finishShift = mutation({
  args: {
        shiftId: v.id("shiftLogger"),
      
  },
  handler: async (ctx, { shiftId }) => {
    return await ctx.db.patch(shiftId, { isFinished: true });
  },
});

export const deleteShift = mutation({
  args: {
    shiftId: v.id("shiftLogger"),
  },
  handler: async (ctx, { shiftId }) => {
    return await ctx.db.delete(shiftId);
  },
});



export const getActiveShiftByAgentId = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("userID"), agentId))
      .filter((q) => q.eq(q.field("isFinished"), false))
      .first();
  },
});

export const getFinishedShiftBreakByAgentId = query({
  args: {
    agentId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, { agentId, startDate, endDate }) => {
    //get the timestamp for the start and end date
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    const shifts = await ctx.db
      .query("shiftLogger")
      .withIndex("by_user_isFinished_creationTime", (q) =>
        q
          .eq("userID", agentId as Id<"users">)
          .eq("isFinished", true)
          .gte("_creationTime", startTime)
          .lte("_creationTime", endTime)
      )

      .collect();

    if (!shifts.length) {
      return { message: "No finished shifts found for this agent." };
    }
    const shiftIds = shifts.map((s) => s._id);

    const allShiftBreaks = await ctx.db
      .query("shiftBreaks")
      .filter((q) =>
        q.or(...shiftIds.map((shiftId) => q.eq(q.field("shiftId"), shiftId)))
      )
      .collect();

    const shiftsWithBreaks = shifts.map((shift) => {
      const shiftBreaks = allShiftBreaks.filter((b) => b.shiftId === shift._id);
      return {
        ...shift,
        shiftBreaks,
      };
    });

    return shiftsWithBreaks;
  },
});


export const getActiveShiftsByOrgId = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .filter((q) => q.eq(q.field("isFinished"), false))
      .collect();
  },
});
export const getFinishedShiftsByOrgId = query({
  args: {
    orgId: v.string(),
    agentId: v.optional(v.string()),
   },
  handler: async (ctx, { orgId, agentId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("orgID"), orgId))
      .filter((q) => q.eq(q.field("userID"), agentId))
      .filter((q) => q.eq(q.field("isFinished"), true))
      .collect();
  },
});

export const getFinishedShiftsByAgentId = query({
  args: {
    agentId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },

  handler: async (ctx, { agentId, startDate, endDate }) => {
    let queryBuilder = await ctx.db
      .query("shiftLogger")
      .withIndex("userID", (q) => q.eq("userID", agentId as Id<"users">))
      .filter((q) => q.eq(q.field("isFinished"), true))
      .filter((q) =>
        q
          .gte(q.field("_creationTime"), new Date(startDate).getTime())
        )
        .filter((q) =>
          q.lte(q.field("_creationTime"), new Date(endDate).getTime())
        )
      .collect();

    return   queryBuilder;
  },
});



export const calculateTotalHoursPerLocationBySiteId = query({
  args: {siteId: v.id("site")},
  handler: async (ctx, { siteId }) => {
    const shifts = await ctx.db
      .query("shiftLogger")
      .withIndex("siteID_isFinished", (q) =>
        q.eq("siteID", siteId as Id<"site">)
        .eq("isFinished", true)
      )
      .collect();

    let totalHours = 0;
    for (const shift of shifts) {
      // check if the shift is finished
      if (shift.finishedDate) {
        const duration = shift.finishedDate - shift.startingDate;
        totalHours += duration / (1000 * 60 * 60);
      }
    }

    return totalHours;
  }
})
export const getShiftsBySiteId = query({
  args: { siteId: v.id("site") },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .collect();
  },
});

export const getActiveShiftsBySiteId = query({
  args: { siteId: v.id("site") },
  handler: async (ctx, { siteId }) => {
    return await ctx.db
      .query("shiftLogger")
      .filter((q) => q.eq(q.field("siteID"), siteId))
      .filter((q) => q.eq(q.field("isFinished"), false))
      .collect();
  },
});

export const updateShiftById = mutation({
  args: {
    id: v.id("shiftLogger"),
    siteID: v.optional(v.id("site")),
    startingDate: v.optional(v.number()),
    finishedDate: v.optional(v.number()),
    isFinished: v.optional(v.boolean()),
    updatedHouses: v.optional(v.number()),
    updatedHousesFinal: v.optional(v.number()),
    updatedHousesFinalNo: v.optional(v.number()),
    pace: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...rest }) => {
    return await ctx.db.patch(id, rest);
  }
});
export const updateShift = mutation({
  args: {
    shiftId: v.id("shiftLogger"),
    // agentId: v.id("users"),
    siteID: v.optional(v.id("site")),
    startingDate: v.optional(v.number()),
    finishedDate: v.optional(v.number()),
    isFinished: v.optional(v.boolean()),
    updatedHouses: v.optional(v.number()),
    updatedHousesFinal: v.optional(v.number()),
    updatedHousesFinalNo: v.optional(v.number()),
    pace: v.optional(v.number()),
  },
  handler: async (ctx, { shiftId, siteID, startingDate, ...rest }) => {
    const timestamp = Date.now();
    return await ctx.db.patch(shiftId, {
      siteID: siteID as Id<"site">,
      startingDate: timestamp,
      ...rest,
    });
  },
});
export const clockOut = mutation({
  args: {
    id: v.id("shiftLogger"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const { id } = args;
    console.log(await ctx.db.get(id));
    return await ctx.db.patch(id,  {
      finishedDate: timestamp,
      isFinished: true,
    });
  },
});


export const incrementShiftCounter = mutation({
  args: {
    id: v.id("shiftLogger"),
    field: v.string(),
  },
  handler: async (ctx, { id, field }) => {
    const shift = await getShiftById(ctx, { id });

    if (!shift) {
      return false;
    }

    let currentValue = 0;
    if (field === "updatedHouses") {
      currentValue = shift.updatedHouses || 0;
      return await ctx.db.patch(id, {
        updatedHouses: currentValue + 1,
      });
    } else if (field === "updatedHousesFinal") {
      currentValue = shift.updatedHousesFinal || 0;
      return await ctx.db.patch(id, {
        updatedHousesFinal: currentValue + 1,
      });
    } else if (field === "updatedHousesFinalNo") {
      currentValue = shift.updatedHousesFinalNo || 0;
      return await ctx.db.patch(id, {
        updatedHousesFinalNo: currentValue + 1,
      });
    }
    // const currentValue = shift[field] || 0;
  },
});

export const incrementUpdatedHouses = mutation({
  args: {
    id: v.id("shiftLogger"),
  },
  handler: async (ctx, { id }) => {
    const shift = await getShiftById(ctx, { id: id });
    if (!shift) {
      return false;
    }
    const currentValue = shift.updatedHouses || 0;
    return await ctx.db.patch(id, {
      updatedHouses: currentValue + 1,
    });
  },
});

export const incrementUpdatedHousesFinal = mutation({
  args: {
    id: v.id("shiftLogger"),
  },
  handler: async (ctx, { id }) => {
    const shift = await getShiftById(ctx, { id: id });
    if (!shift) {
      return false;
    }
    const currentValue = shift?.updatedHousesFinal || 0;
    return await ctx.db.patch(id, {
      updatedHousesFinal: currentValue + 1,
    });
  },
});

export const incrementUpdatedHousesFinalNo = mutation({
  args: {
    id: v.id("shiftLogger"),
  },
  handler: async (ctx, { id }) => {
    const shift = await getShiftById(ctx, { id: id });
    if (!shift) {
      return false;
    }    
    const currentValue = shift?.updatedHousesFinalNo || 0;
    return await ctx.db.patch(id, {
      updatedHousesFinalNo: currentValue + 1,
    });
  },
});

export const getShiftById = query({
  args: { id: v.id("shiftLogger") },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("shiftLogger")
      .withIndex("by_id", (q) => q.eq("_id", id))
      .first();
  },
});

