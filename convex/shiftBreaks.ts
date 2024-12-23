// convex/mutations/shiftBreaks.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const startBreak = mutation({
  args: {
    shiftId: v.id("shiftLogger"),
    motive: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get shiftId as string
    const shiftId: Id<"shiftLogger"> = args.shiftId;

    
    const activeBreak = await ctx.db
      .query("shiftBreaks")
      .filter((q) => q.eq(q.field("shiftId"), args.shiftId))
      .first();

    if (activeBreak) {
      throw new Error("A break is already in progress");
    }

    // Check break rules for the shift's site
    const shift = await ctx.db.get(args.shiftId);
    if (!shift) {
      throw new Error("Shift not found");
    }

    const site = await ctx.db.get(shift.siteID  as Id<"shiftLogger">);
    if (!site) {
      throw new Error("Site not found");
    }

    // // Count breaks for this shift
    // const breakCount = await ctx.db
    //   .query("shiftBreaks")
    //   .filter((q) => q.eq(q.field("shiftId"), args.shiftId))
    //   .collect();

    // if (breakCount.length >= site.breakRules.maxBreakCount) {
    //   throw new Error("Maximum break count exceeded");
    // }

    // Create new break
    const timeNow =  Date.now();
    return await ctx.db.insert("shiftBreaks", {
        shiftId: args.shiftId,
        siteID: shift.siteID,
        startTime: timeNow,
        motive: args.motive,
      status: "active",
    });
    },
});
  
  
  

export const endBreak = mutation({
  args: {
    breakId: v.id("shiftBreaks"),
  },
  handler: async (ctx, args) => {
    const currentBreak = await ctx.db.get(args.breakId);
    if (!currentBreak) {
      throw new Error("Break not found");
    }

    // Get the associated shift and site
    const shift = await ctx.db.get(currentBreak.shiftId);
    // const site = await ctx.db.get(shift.siteID);

    // check if status of shfitBreak is "blocked"
    if (currentBreak.status === "blocked") {
        throw new Error("Break is blocked");
    }

    // Determine break status
    const status = "finshed";
    // Update break
    return await ctx.db.patch(args.breakId, {
      endTime: Date.now(),
      status: status,
    });
  },
});

// // Query to get active breaks for a shift
// export const getActiveBreaks = query({
//   args: {
//     shiftId: v.id("shiftLoggers"),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("shiftBreaks")
//       .filter((q) =>
//         q.and(
//           q.eq(q.field("shiftId"), args.shiftId),
//           q.eq(q.field("status"), "active")
//         )
//       )
//       .collect();
//   },
// });

// // Query to get break history for a shift
// export const getShiftBreakHistory = query({
//   args: {
//     shiftId: v.id("shiftLoggers"),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("shiftBreaks")
//       .filter((q) => q.eq(q.field("shiftId"), args.shiftId))
//       .order("desc")
//       .collect();
//   },
// });
