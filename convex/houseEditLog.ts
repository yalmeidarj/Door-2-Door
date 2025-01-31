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

triggers.register("houseEditLog", async (ctx, change) => {
  
  if (change.newDoc) {
    // Check if status is not 'consent final'
    console.log("houseEditLog trigger activated");
    if (
      change.newDoc.statusAttempt !== "Consent Final Yes" &&
      change.newDoc.statusAttempt !== "Consent Final No"
    ) {
      const userId = change.newDoc.agentId;
      // Fetch the *active* shiftLogger document related to the current user
      const shiftLogger = await ctx.db
        .query("shiftLogger")
        .withIndex("by_user_isFinished_creationTime", (q) =>
          q.eq("userID", userId as Id<"users">).eq("isFinished", false)
        )
        .order("desc")
        .first();

      if (shiftLogger) {
        console.log("Found shiftLogger: ", shiftLogger);
        // Check if it's the first house of the shift
        const isFirstHouse =(
          (shiftLogger.updatedHouses ?? 0) +
            (shiftLogger.updatedHousesFinal ?? 0) +
            (shiftLogger.updatedHousesFinalNo ?? 0)) === 0;
            console.log("isFirstHouse", isFirstHouse);
        if (!isFirstHouse) {
          // Get the last house edit log for the agent
          const lastEdit = await ctx.db
            .query("houseEditLog")
            .withIndex("agentId", (q) => q.eq("agentId", userId))
            .order("desc")
            .first();

          if (lastEdit) {
            console.log("Found lastEdit: ", lastEdit);
            const userInfo = (
              await ctx.db.get(userId as Id<"users">)
            ) ;

            if (userInfo?.shiftMaxInactiveTime) {
              const timeDifference =
                shiftLogger.lastActivity ??
                change.newDoc._creationTime - lastEdit._creationTime;
              console.log("timeDifference: ", timeDifference);
              console.log(
                "shiftMaxInactiveTime: ",
                userInfo.shiftMaxInactiveTime
              );

              // Compare time difference with shiftMaxInactiveTime and log if needed
              if (timeDifference > userInfo.shiftMaxInactiveTime) {
                // console.log(
                //   "User Inactive Time Exceeded",
                //   timeDifference,
                //   shiftMaxInactiveTime
                // );
                // Finish the shift
                await ctx.db.patch(shiftLogger._id, {
                  isFinished: true,
                  lastActivity: Date.now(),
                  finishedDate: Date.now()
                });
                 
                // Block user
                await ctx.db.patch(userId as Id<"users">, {
                  inactivityBlocked: true
                });
              } else {
                // update user's lastActivity
                await ctx.db.patch(shiftLogger._id, {
                  lastActivity: Date.now(),
                });
              }
            }
          }
        }
      }
      // console.log("\nShift not found");
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

    if (changesCount === 0) {
      return null;
    }

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

