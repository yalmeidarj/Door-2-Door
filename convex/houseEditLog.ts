import { v } from "convex/values";
import { query } from "./_generated/server";
/* eslint-disable no-restricted-imports */
import { mutation as rawMutation, internalMutation as rawInternalMutation } from "./_generated/server";
/* eslint-enable no-restricted-imports */
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";

import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { format } from "date-fns";


const triggers = new Triggers<DataModel>();
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB)
);

// triggers.register("houseEditLog", async (ctx, change) => {
//   if (change.newDoc) {
//     console.log("houseEditLog trigger activated");
//     const userId = change.newDoc.agentId;
//     const shiftLogger = await ctx.db
//       .query("shiftLogger")
//       .withIndex("by_user_isFinished_creationTime", (q) =>
//         q.eq("userID", userId as Id<"users">).eq("isFinished", false)
//       )
//       .order("desc")
//       .first();

//     if (shiftLogger) {
//       console.log("Found shiftLogger: ", shiftLogger);
//       const isFirstHouse =
//         (shiftLogger.updatedHouses ?? 0) +
//           (shiftLogger.updatedHousesFinal ?? 0) +
//           (shiftLogger.updatedHousesFinalNo ?? 0) ===
//         0;
//       console.log("isFirstHouse", isFirstHouse);
//       if (!isFirstHouse) {
//         const lastEdit = await ctx.db
//           .query("houseEditLog")
//           .withIndex("agentId", (q) => q.eq("agentId", userId))
//           .order("desc")
//           .first();

//         if (lastEdit) {
//           console.log("Found lastEdit: ", lastEdit);
//           const userInfo = await ctx.db.get(userId as Id<"users">);
//           if (userInfo) {
//             const statusFull = change.newDoc.statusAttempt || "";
//             const statusParts = statusFull.split("| |");
//             const actualStatus =
//               statusParts.length > 1
//                 ? statusParts[statusParts.length - 1].trim()
//                 : statusFull.trim();

//             let inactivityTime = 0;
//             if (
//               actualStatus === "Consent Final Yes" ||
//               actualStatus === "Consent Final No"
//             ) {
//               inactivityTime = userInfo.shiftMaxInactiveTimeFinal || 0;
//             } else {
//               inactivityTime = userInfo.shiftMaxInactiveTime || 0;
//             }

//             if (inactivityTime) {
//               // Convert inactivityTime from minutes to milliseconds
//               const inactivityTimeMs = inactivityTime * 60 * 1000;

//               const currentTime = Date.now();
//               const timeDifference = shiftLogger.lastActivity
//                 ? currentTime - shiftLogger.lastActivity
//                 : change.newDoc._creationTime - lastEdit._creationTime;

//               console.log("timeDifference (ms): ", timeDifference);
//               console.log("inactivityTime (ms): ", inactivityTimeMs);

//               if (timeDifference > inactivityTimeMs) {
//                 // Using minimal patches to avoid size issues
//                 await ctx.db.patch(shiftLogger._id, {
//                   isFinished: true,
//                   lastActivity: currentTime,
//                   finishedDate: currentTime,
//                 });

//                 await ctx.db.patch(userId as Id<"users">, {
//                   inactivityBlocked: true,
//                 });
//               } else {
//                 // Use a minimal patch to avoid size issues
//                 await ctx.db.patch(shiftLogger._id, {
//                   lastActivity: currentTime,
//                 });
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// });

triggers.register("houseEditLog", async (ctx, change) => {
  if (change.newDoc) {
    const userId = change.newDoc.agentId;
    const shiftLogger = await ctx.db
      .query("shiftLogger")
      .withIndex("by_user_isFinished_creationTime", (q) =>
        q.eq("userID", userId as Id<"users">).eq("isFinished", false)
      )
      .order("desc")
      .first();

    if (shiftLogger) {
      const isFirstHouse =
        (shiftLogger.updatedHouses ?? 0) +
          (shiftLogger.updatedHousesFinal ?? 0) +
          (shiftLogger.updatedHousesFinalNo ?? 0) ===
        0;
      console.log("isFirstHouse", isFirstHouse);
      if (!isFirstHouse) {
        const lastEdit = await ctx.db
          .query("houseEditLog")
          .withIndex("agentId", (q) => q.eq("agentId", userId))
          .order("desc")
          .first();

        if (lastEdit) {
          console.log("Found lastEdit: ", lastEdit);
          const userInfo = await ctx.db.get(userId as Id<"users">);
          if (userInfo) {
            const statusFull = change.newDoc.statusAttempt || "";
            const statusParts = statusFull.split("| |");
            const actualStatus =
              statusParts.length > 1
                ? statusParts[statusParts.length - 1].trim()
                : statusFull.trim();
            
            let inactivityTime = 0;
            if (actualStatus === "Consent Final Yes" || actualStatus === "Consent Final No") {
              inactivityTime = userInfo.shiftMaxInactiveTimeFinal || 0;
            } else {
              inactivityTime = userInfo.shiftMaxInactiveTime || 0;
            }

            if (inactivityTime) {
              // Convert inactivityTime from minutes to milliseconds
              const inactivityTimeMs = inactivityTime * 60 * 1000;
              
              const currentTime = Date.now();
              
              // Get the activity tracker for this shift
              const activityTracker = await ctx.db
                .query("activityTracker")
                .withIndex("by_shiftLogger", (q) => q.eq("shiftLoggerId", shiftLogger._id))
                .first();
              
              let timeDifference;
              if (activityTracker) {
                // Use the activity from the tracker
                timeDifference = currentTime - activityTracker.lastActivity;
              } else {
                // Fall back to calculating from edit logs
                timeDifference = change.newDoc._creationTime - lastEdit._creationTime;
              }
              
              console.log("timeDifference (ms): ", timeDifference);
              console.log("inactivityTime (ms): ", inactivityTimeMs);


              if (activityTracker) {
                await ctx.db.patch(activityTracker._id, {
                  lastActivity: currentTime,
                });
              } else {
                await ctx.db.insert("activityTracker", {
                  shiftLoggerId: shiftLogger._id,
                  userId: userId as Id<"users">,
                  lastActivity: currentTime,
                  isBlocked: false,
                });
              }
              try {
                if (timeDifference > inactivityTimeMs) {
                  // Mark the shift as finished
                  await ctx.db.patch(shiftLogger._id, {
                    isFinished: true,
                    finishedDate: Date.now(),
                  });

                  // Mark the user as blocked
                  await ctx.db.patch(userId as Id<"users">, {
                    inactivityBlocked: true,
                  });
                }
              } catch (error) {
                  console.error("Error updating activity:", error);
                }


                try{
                  
                  // Update the activity tracker or create it if it doesn't exist
                  if (activityTracker) {
                    await ctx.db.patch(activityTracker._id, {
                      lastActivity: currentTime,
                      isBlocked: true,
                    });
                  } else  {
                    await ctx.db.insert("activityTracker", {
                      shiftLoggerId: shiftLogger._id,
                      userId: userId as Id<"users">,
                      lastActivity: currentTime,
                      isBlocked: true,
                    });
                  }
                } catch (error) {
                  console.error("Error trying to update activity:", error);
              }

              try {                
              // Just update the activity time
                  if (activityTracker) {
                    await ctx.db.patch(activityTracker._id, {
                      lastActivity: currentTime,
                    });
                  } else {
                    await ctx.db.insert("activityTracker", {
                      shiftLoggerId: shiftLogger._id,
                      userId: userId as Id<"users">,
                      lastActivity: currentTime,
                      isBlocked: false,
                    });
                  }
                } catch (error) {
                console.error("Error trying to update activity:", error);
              }
            }
          }
        }
      }
    }
  }
});


export const getEditsByHouseId = query({
  args: { houseId: v.id("house") },
  handler: async (ctx, { houseId }) => {
    return await ctx.db
      .query("houseEditLog")
      .withIndex("houseId", (q) => q.eq("houseId", houseId))
      .order("desc")
      // .filter((q) => q.eq(q.field("houseId"), houseId))
      .collect();
  },
});

export const updateActiveShiftByShiftId = internalMutation({
  args: {
    shiftId: v.id("shiftLogger"),
    updatedHouses: v.optional(v.number()),
    updatedHousesFinal: v.optional(v.number()),
    updatedHousesFinalNo: v.optional(v.number()),
  },
  handler: async (ctx, { shiftId, ...args }) => {
    return await ctx.db.patch(shiftId, {...args});
  }
});

const houseArgs = {
  houseId: v.string(),
  siteId: v.optional(v.string()),
  agentId: v.string(),
  lastName: v.optional(v.string()),
  name: v.optional(v.string()),
  type: v.optional(v.string()),
  statusAttempt: v.optional(v.string()),
  email: v.optional(v.string()),
  notes: v.optional(v.string()),
  phone: v.optional(v.string()),
  shiftId: v.optional(v.string()),
  isConcilatedInSalesForce: v.optional(v.boolean()),
};

export const createNewEditByHouseId = mutation({
  args: houseArgs,
  handler: async (ctx, args) => {
    const id = args.houseId as Id<"house">;

    // 1. Retrieve the old house data
    const house = await ctx.db
      .query("house")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();

    if (!house) {
      return null;
    }

    // Helper to create the "old | | new" string if changed
    function changedField(
      oldVal: string | undefined,
      newVal: string | undefined
    ): string | undefined {
      if (newVal === undefined) {
        return undefined;
      }
      if (oldVal === newVal) {
        return undefined;
      }
      const oldString = oldVal ?? "";
      const newString = newVal ?? "";
      return `${oldString} | | ${newString}`;
    }

    // 2. Create log entry with only changed fields
    const logEntry: Record<string, string | undefined> = {
      houseId: args.houseId,
      agentId: args.agentId as Id<"users">,
      shiftId: args.shiftId,
    };

    const fieldsToCheck = [
      "name",
      "lastName",
      "type",
      "statusAttempt",
      "email",
      "notes",
      "phone",
    ] as const;

    for (const field of fieldsToCheck) {
      if (args[field] !== undefined) {
        // Only check fields that were sent
        const oldVal = house[field] as string | undefined;
        const newVal = args[field];
        const result = changedField(oldVal, newVal);
        if (result !== undefined) {
          logEntry[field] = result;
        }
      }
    }

    const { shiftId, ...restLogEntry } = logEntry;

    // If no changes beyond houseId & agentId & shiftId, skip
    const changesCount = Object.keys(logEntry).filter(
      (k) => k !== "houseId" && k !== "agentId" && k !== "shiftId"
    ).length;

    // if (changesCount === 0) {
    //   return null;
    // }

    try {
      // 3. Insert the log entry into houseEditLog
      await ctx.db.insert("houseEditLog", restLogEntry);

      // 4. Update the house
      const { houseId, agentId, shiftId, ...restArgs } = args;

      // Build update fields, appending notes if present
      const updateFields = Object.entries(restArgs).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            if (key === "notes") {
              // Append new notes to existing notes
              const oldNotes = house.notes || "";
              // short date format for separator
              // const currentDate = format(Date.now(),  "p");
              const currentDate = "||";
              // const separator = oldNotes ? "\n" : { currentDate };
              const separator = "||";
              acc[key] = oldNotes + separator + value;
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {} as Record<string, any>
      );

      // Force isConcilatedInSalesForce false on update
      updateFields.isConcilatedInSalesForce = false;

      // Actually patch/replace in internal mutation
      await ctx.runMutation(internal.houseEditLog.updateProperty, {
        ...updateFields,
        houseID: houseId as Id<"house">,
      });

      return true;
    } catch (error) {
      console.error("Error creating log entry:", error);
      return false;
    }
  },
});

export const getAllHouseVisitsBySiteId = query({
  args: { siteId: v.id("site") }, 
  handler: async (ctx, args) => {
    // First get all houses in the site
    const houses = await ctx.db
      .query("house")
      .withIndex("siteID", (q) => q.eq("siteID", args.siteId))
      .filter((q) =>
        q.and(
          q.neq(q.field("statusAttempt"), "Consent Final Yes"),
          q.neq(q.field("statusAttempt"), "Consent Final No"),
          q.neq(q.field("statusAttempt"), "Drop Type Unverified")
        )
      )
      .collect();

    const houseIds = houses.map((house) => house._id);

    // Get all visit logs for these houses
    const allVisitLogs = [];
    for (const houseId of houseIds) {
      const logs = await ctx.db
        .query("houseEditLog")
        .withIndex("houseId", (q) => q.eq("houseId", houseId))
        .collect();

      allVisitLogs.push(...logs);
    }

    return allVisitLogs;
  },
});

export const updateProperty = internalMutation({
  args: {
    houseID: v.id("house"),
    streetID: v.optional(v.string()),
    siteID: v.optional(v.string()),
    streetNumber: v.optional(v.string()),
    streetName: v.optional(v.string()),
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
  },
  handler: async (ctx, { houseID, ...updateFields }) => {
    // Filter out any fields that are undefined
    const validUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(([, value]) => value !== undefined)
    );

    // Update the house document with the provided fields
    return await ctx.db.patch(houseID, validUpdates);
    
  },
});

