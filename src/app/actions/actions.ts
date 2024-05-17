"use server";

import { db } from "@/server/db";
import { get } from "http";
import { revalidatePath } from "next/cache";

export const updateProperty = async (formData: FormData) => {
  const updatedData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => {
      // Exclude 'id', agentName, and agentId
      if (key === "id" || key === "agentName" || key === "agentId") {
        return false;
      }
      // Check if the value is a string and not empty after trimming
      return typeof value === "string" ? value.trim() !== "" : true;
    }),
  );

  const id = Number(formData.get("id"));
  if (!id) throw new Error("No id found in form data");


  // if phone number is provided, clean it up by removing all non-numeric characters
  if (updatedData.phone) {
    const newPhone = updatedData.phone as string;
    const cleanedPhone = newPhone.replace(/\D/g, "");
    updatedData.phone = cleanedPhone;
  }
  const agentId = formData.get("agentId") as string;
  const agentName = formData.get("agentName") as string;
  const status = formData.get("statusAttempt") as string
  let consent = " ";
  if (status === "Consent Final Yes" || status === "Consent Final No") {
    consent = status.split(" ")[2];
  } else {
    consent = formData.get("consent") as string;
  }

  try {
    const updatedHouse = await db.house.update({
      where: { id: id },
      data: {
        ...updatedData,
        isConcilatedInSalesForce: false,
        consent: consent, 
        lastUpdated: new Date(),
        lastUpdatedBy: agentName,
      },
    });

    // Fetch the streetId from the updated House
    const streetId = updatedHouse.streetId;

    // Update Street
    const updatedStreet = await db.street.update({
      where: { id: streetId },
      data: {
        lastVisited: new Date(),
        lastVisitedby: agentName,
      },
    });

    revalidatePath(`/`);

    console.log(updatedHouse);
    return { status: "success", message: "Property updated" };
    // return updatedHouse;
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error updating property" };
  }
};

type UpdatePropertyFormData = {
  id: number;
  lastName: string;
  name: string;
  internalNotes: string;
  externalNotes: string;
  email: string;
  phone: string;
  type: string;
  statusAttempt: string;
  consent: string;
  lastUpdatedBy: string;
  // shiftLoggerId: string; // Added field for ShiftLogger id
};


type shiftData = {
  id: number;
  agentId: string;
  locationId: number;
  startingDate: Date;
  finishedDate: Date;
  isFinished: boolean;
  updatedHouses: number;
  updatedHousesFinal: number;
  pace: number;
  paceFinal: number;
};


export const ClockOut = async (formData: FormData) => {
  const shiftId = formData.get("id") as string;


  const data = formData as object;
  try {
    const shift = await db.shiftLogger.update({
      where: {id: shiftId
      },
      data: {
        isFinished: true,
        finishedDate: new Date(),
      },
    });

    await db.user.update({
      where: { id: shift.agentId },
      data: { isClockedIn: false },
    });

    revalidatePath(`/`);
    return { success: "Successfully Clocked out", shift: shift };
  } catch (error) {
    console.error(error);
    return { error: "Error clocking out" };
  }
};

type ClockInFormData = {
  id: string;
  agentId: string;
  locationId: number;
};

export const ClockIn = async (formData: FormData) => {
  const data: ClockInFormData = {
    id: formData.get("id") as string,
    agentId: formData.get("agentId") as string,
    locationId: parseInt(formData.get("locationId") as string),
  };

  if (!data.agentId || isNaN(data.locationId)) {
    throw new Error("Invalid form data");
  }

  try {
    const newShift = await db.shiftLogger.create({
      data: {
        User: {
          connect: { id: data.agentId },
        },
        Location: {
          connect: { id: data.locationId },
        },
      },
    });

    await db.user.update({
      where: { id: data.agentId },
      data: { isClockedIn: true,  currentShiftId: newShift.id },
    });

    revalidatePath(`/`);
    
    return { status: "success", message: "Successfully clocked in" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error clocking in" };
  }
};



export const getShifts = async () => {
  try {
    const shifts = await db.shiftLogger.findMany();
    return shifts;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};

export const getShift = async (id: string) => {
  try {
    const shift = await db.shiftLogger.findUnique({
      where: {id: id}
    });
    return shift;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shift" };
  }
};

export const getShiftsByAgentId = async (
  agentId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const shifts = await db.shiftLogger.findMany({
      where: {
        agentId: agentId,
        startingDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        Location: {
          select: {
            name: true,
          },
        },
        id: true,
        agentId: true,
        locationId: true,
        startingDate: true,
        finishedDate: true,
        isFinished: true,
        updatedHouses: true,
        updatedHousesFinal: true,
        pace: true,
        paceFinal: true,
      },
      orderBy: {
        startingDate: "desc",
      },
    });

    const activeShifts = shifts.filter((shift) => !shift.isFinished);
    const finishedShifts = shifts.filter((shift) => shift.isFinished);

    const totalTimePerLocation: { [key: string]: number } = {};

    const finishedShiftsWithDuration = finishedShifts.map((shift) => {
      if (!shift.finishedDate) {
        return shift;
      }
      const duration =
        shift.finishedDate.getTime() - shift.startingDate.getTime();
      const locationName = shift.Location.name;
      if (duration > 0) {
        totalTimePerLocation[locationName] =
          (totalTimePerLocation[locationName] || 0) + duration;
      }
      const formattedDuration = `${Math.floor(duration / 3600000)}h ${
        Math.floor((duration % 3600000) / 60000)
      }m`;
      return { ...shift, formattedDuration };
    });

    const totalHoursWorked = Object.values(totalTimePerLocation).reduce(
      (acc, curr) => acc + curr,
      0
    );

    // Convert totalTimePerLocation from milliseconds to a more readable format
    const totalTimePerLocationFormatted = Object.keys(
      totalTimePerLocation
    ).reduce((acc, locationName) => {
      const duration = totalTimePerLocation[locationName];
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      acc[locationName] = `${hours}h ${minutes}m`;
      return acc;
    }, {} as { [key: string]: string });

    const totalHours = Math.floor(totalHoursWorked / 3600000);
    const totalMinutes = Math.floor((totalHoursWorked % 3600000) / 60000);
    
    const data = {
      activeShifts,
      finishedShifts: finishedShiftsWithDuration,
      totalHoursWorked: `${totalHours}h ${totalMinutes}m`,
      totalTimePerLocation: totalTimePerLocationFormatted,
    };

    console.log(`\nTotal time worked: ${totalHours}h${totalMinutes}m\n`);
    console.log(`\nTotal time per location:`, totalTimePerLocationFormatted);
    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};

// // Convert totalHoursWorked to hours and minutes
// const hours = Math.floor(totalHoursWorked / 3600000); // Convert milliseconds to hours and floor it
// const minutes = Math.floor((totalHoursWorked % 3600000) / 60000); // Convert remainder to minutes
// console.log(`\nTotal time worked: ${hours}h${minutes}m\n`);



export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: id },
      select: {
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return { error: "Error getting user" };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return { error: "Error getting users" };
  }
}


export const getShiftsByLocationId = async (locationId: number) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: {locationId: locationId}
    });
    return shifts;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};

// get shift by locationId and not finished
export const getShiftByLocationId = async (locationId: number) => {
  try {
    const shift = await db.shiftLogger.findFirst({
      where: {locationId: locationId, isFinished: false}
    });
    return shift;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shift" };
  }
};

export const isAgentClockedIn = async (agentId: string) => {
  try {
    const shift = await db.shiftLogger.findFirst({
      where: {agentId: agentId, isFinished: false}
    });
    if (shift) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return { error: "Error getting shift" };
  }
}

export const getAllClockedInAgents = async () => {
  try {
    const agents = await db.user.findMany({
      where: {
        isClockedIn: true,
      },
      select: {
        id: true,
        name: true,
        ShiftLogger: {
          where: {
            isFinished: false, 
          },
          select: {
            id: true,
            startingDate: true,
            finishedDate: true,
            updatedHouses: true,
            updatedHousesFinal: true,
            Location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const data = agents.map((agent) => {
      // ...existing code for totalHouses...
      const totalHouses = agent.ShiftLogger.reduce((acc, shift) => {
        return acc + (shift.updatedHouses ?? 0);
      }, 0);

      const shiftLength:number = agent.ShiftLogger.reduce((acc, shift) => {
        const start = shift.startingDate?.getTime();
        // const end should be current time
        const end = new Date().getTime();
        if (start && end && end > start) {
          return acc + (end - start);
        }
        return acc;
      }, 0);

      const totalShiftLength = agent.ShiftLogger.reduce((acc, shift) => {
        const start = shift.startingDate?.getTime();
        // Assuming end should be current time
        const end = new Date().getTime();
        if (start && end && end > start) {
          return acc + (end - start); // accumulate total shift length in milliseconds
        }
        return acc;
      }, 0);

      // Now format the totalShiftLength outside the reduce function
      const hours = Math.floor(totalShiftLength / 3600000); // Convert milliseconds to hours and floor it
      const minutes = Math.floor((totalShiftLength % 3600000) / 60000); // Convert remainder to minutes
      const formattedShiftLength = `${hours}h ${minutes}m`;

      const pace = totalHouses / (shiftLength / 3600000); // Convert milliseconds to hours
      return {
        ...agent,
        pace: pace,
        shiftLength: shiftLength,
        formatedShiftLength: formattedShiftLength,
      };
    });

    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting agents" };
  }
}

export const getAllAgents = async () => {
  try {
    const agents = await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return agents;
  } catch (error) {
    console.error(error);
    return { error: "Error getting agents" };
  }
}

// get shift by agentId and not finished
export const getActiveShiftByAgentId = async (agentId: string) => {
  try {
    const shift = await db.shiftLogger.findFirst({
      where: { agentId: agentId, isFinished: false },
      select: {
        id: true,
        agentId: true,
        locationId: true,
        startingDate: true,
        finishedDate: true,
        isFinished: true,
        updatedHouses: true,
        updatedHousesFinal: true,
        pace: true,
        paceFinal: true,
      },
    });
    return { status: "success", message: "Property updated", shift: shift };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error updating property" };
  }
};

export const updateActiveShiftByShiftId = async (shiftId: string, statusAttempt: string) => {

  if (statusAttempt === "Consent Final Yes" || statusAttempt === "Consent Final No") {
    try {
      const updatedShift = await db.shiftLogger.update({
        where: { id: shiftId },
        data: { updatedHousesFinal: { increment: 1 } },
      });

      revalidatePath(`/`);
      return { status: "success", message: "Shift updated", shift: updatedShift };
    } catch (error) {
      console.error(error);
      return { status: "error", message: "Error updating shift" }; // Ensure a return statement here
    }
  } else {
    try {
      const updatedShift = await db.shiftLogger.update({
        where: { id: shiftId },
        data: { updatedHouses: { increment: 1 } },
      });

      revalidatePath(`/`);
      return { status: "success", message: "Shift updated", shift: updatedShift };
    } catch (error) {
      console.error(error);
      return { status: "error", message: "Error updating shift" }; // Ensure a return statement here
    }
  }
};

// get all shifts by agentId and finished
export const getShiftsByAgentIdFinished = async (agentId: string) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: { agentId: agentId, isFinished: true },
      orderBy: {
        startingDate: "desc"
      }
    });
    return shifts;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};

// get all active locations
export const getActiveLocations = async () => {
  try {
    const locations = await db.location.findMany({
      where: { isDeleted: false },
            select: {
        name: true,
        id: true,
      }
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};

// get all inactive locations
export const getInactiveLocations = async () => {
  try {
    const locations = await db.location.findMany({
      where: {isDeleted: true}
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};  

type HouseCount = {
  locationId: number;
  totalHouses: number;
};

export const getAllLocationsDropDown = async () => {
  try {
    const locations = await db.location.findMany({
      select: {
        name: true,
        id: true,
      },
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
}

export const getLocations = async (skip: number, take: number) => {
  try {
    const locationsWithStats = await db.location.findMany({
      where: { isDeleted: false },
      skip: skip,
      take: take,
      include: {
        _count: {
          select: {
            House: {
              where: {
                statusAttempt: {
                  in: [
                    "Door Knock Attempt 1",
                    "Door Knock Attempt 2",
                    "Door Knock Attempt 3",
                    "Door Knock Attempt 4",
                    "Door Knock Attempt 5",
                    "Door Knock Attempt 6",
                    "Consent Final Yes",
                    "Consent Final No",
                  ],
                },
              },
            },
          },
        },
        ShiftLogger: {
          where: {
            isFinished: false,
          },
          include: {
            User: true,
          },
        },
      },
    });

    const totalHousesPerLocation: HouseCount[] = await db.$queryRaw`
      SELECT "locationId", COUNT(DISTINCT id) as "totalHouses" FROM "House" GROUP BY "locationId"
    `;

    // count the number of houses to be visited, by statusAttempt, excluding: Non Existent, Consent Final, Consent Final Yes, Consent Final No, Site Visit Required, Drop type unverified,
    const totalHousesToBeVisitedPerLocation: HouseCount[] = await db.$queryRaw`
      SELECT "locationId",
      COUNT(DISTINCT id) as "totalHouses" 
      FROM "House" 
      WHERE "statusAttempt" 
      IN ('Home Does Not Exist', 
      'Consent Final', 
      'Consent Final Yes', 
      'Consent Final No', 
      'Site Visit Required', 
      'Drop Type Unverified', 
      ' Drop Type Unverified ', 
      'Engineer Visit Required',
      'Door Knock Attempt 1',
      'Door Knock Attempt 2',
      'Door Knock Attempt 3',
      'Door Knock Attempt 4',
      'Door Knock Attempt 5',
      'Door Knock Attempt 6'      
      )
      GROUP BY "locationId"
    `;

    const totalHousesWithConsentYesPerLocation: HouseCount[] =
      await db.$queryRaw`
      SELECT "locationId",
      COUNT(DISTINCT id) as "totalHouses"
      FROM "House" 
      WHERE "statusAttempt" = 'Consent Final Yes' 
      OR "consent" = 'Yes'
      GROUP BY "locationId"
    `;

    const totalHousesWithConsentNoPerLocation: HouseCount[] =
      await db.$queryRaw`
      SELECT "locationId",
       COUNT(DISTINCT id) as "totalHouses"
        FROM "House" 
        WHERE "statusAttempt" = 'Consent Final No' 
        OR "consent" = 'No' 
        GROUP BY "locationId"
    `;

    const totalHousesWithToBeVisitedPerLocation: HouseCount[] =
      await db.$queryRaw`
      SELECT "locationId",
      COUNT(DISTINCT id) as "totalHouses"
      FROM "House" 
      WHERE "statusAttempt" = 'Site Visit Required'
      GROUP BY "locationId"
    `;

    const total = await db.location.count();
    const metadata = {
      totalRecords: total,
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    };

    const data = locationsWithStats.map((location) => {
      const totalHouses =
        totalHousesPerLocation.find(
          (house: HouseCount) => house.locationId === location.id
        )?.totalHouses || 0;

      const leftToVisit = totalHousesToBeVisitedPerLocation.find(
        (house: HouseCount) => house.locationId === location.id
      )?.totalHouses;

      const totalHousesWithConsentYes =
        totalHousesWithConsentYesPerLocation.find(
          (house: HouseCount) => house.locationId === location.id
        )?.totalHouses || 0;

      const totalHousesWithConsentNo =
        totalHousesWithConsentNoPerLocation.find(
          (house: HouseCount) => house.locationId === location.id
        )?.totalHouses || 0;

      const totalHousesWithToBeVisited =
        totalHousesWithToBeVisitedPerLocation.find(
          (house: HouseCount) => house.locationId === location.id
        )?.totalHouses || 0;

      return {
        ...location,
        totalHousesVisited: location._count.House,
        totalHouses: totalHouses,
        // leftToVisit: Number(leftToVisit),
        leftToVisit: Number(Number(totalHouses) - Number(leftToVisit)),
        totalHousesWithConsentYes: Number(totalHousesWithConsentYes),
        totalHousesWithConsentNo: Number(totalHousesWithConsentNo),
        totalHousesWithToBeVisited: Number(totalHousesWithToBeVisited),
      };
    });

    return {
      data: data,
      metadata: metadata,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};


// Soft delete a location
export const softDeleteLocation = async (locationId: string) => {
  await db.location.update({
  where: { id: Number(locationId) },
  data: { isDeleted: true }
  });
  revalidatePath(`/`);
  return { status: "success", message: "Location deleted" };
}

export const hardDeleteLocation = async (locationId: string) => {
  try {
      // to delete location, delete all houses, streets, and shiftLoggers associated with location
  await db.shiftLogger.deleteMany({
    where: { locationId: Number(locationId) }
  });
  await db.house.deleteMany({
    where: { locationId: Number(locationId) }
  });
  await db.street.deleteMany({
    where: { locationId: Number(locationId) }
  });
  await db.location.delete({
    where: { id: Number(locationId) }
  });
    revalidatePath(`/`);
    return { status: "success", message: "Location deleted" };
  }
  catch (error) {
    console.error(error);
    return { status: "error", message: "Error deleting location" };
  }

}

// Define an interface for the query result
interface TotalHousesResult {
  totalHouses: bigint; // or number, depending on the actual type returned
}

// type HouseCount = {
//   streetId: number;
//   totalHouses: number;
// };

export const getLocationsStats = async (locationId: number) => {
  try {
    // Location name
    const location = await db.location.findUnique({
      where: {
        id: locationId,
        // isDeleted: false,
      },

      select: {
        name: true,
        isDeleted: true,
      },
    });

    // Total number of houses in the location
    const totalHouses = await db.house.count({
      where: { locationId: locationId },
    });

    const totalHousesWithConsentYesResult = await db.$queryRaw<
      TotalHousesResult[]
    >`
      SELECT COUNT(DISTINCT id) as "totalHouses"
      FROM "House"       
      WHERE "locationId" = ${locationId}
      AND "statusAttempt" = 'Consent Final Yes'
    `;

    const totalHousesWithConsentYes = Number(
      totalHousesWithConsentYesResult[0]?.totalHouses || 0
    );
    console.log("Houses with Consent Yes:", totalHousesWithConsentYes);

    const totalHousesWithConsentNoResult = await db.$queryRaw<
      TotalHousesResult[]
    >` 
      SELECT COUNT(DISTINCT id) as "totalHouses"
      FROM "House"
      WHERE "locationId" = ${locationId}
      AND "statusAttempt" = 'Consent Final No'
    `;

    const totalHousesWithConsentNo = Number(
      totalHousesWithConsentNoResult[0]?.totalHouses || 0
    );

    // const totalHousesWithConsentNo = Number(ConsentNo)
    // total houses visited, by statusAttempt (Door Knock Attempt 1, Door Knock Attempt 2, Door Knock Attempt 3)
    const totalHousesVisited = await db.house.count({
      where: {
        locationId: locationId,
        statusAttempt: {
          in: [
            "Consent Final",
            "Consent Final Yes",
            "Consent Final No",
            "Site Visit Required",
            "Drop Type Unverified",
            "Engineer Visit Required",
            "Door Knock Attempt 1",
            "Door Knock Attempt 2",
            "Door Knock Attempt 3",
            "Door Knock Attempt 4",
            "Door Knock Attempt 5",
            "Door Knock Attempt 6",
          ],
        },
      },
    });

    const totalHousesVisitRequired = await db.house.count({
      where: {
        locationId: locationId,
        statusAttempt: {
          in: ["Site Visit Required"],
        },
      },
    });

    // Total number of houses non existent
    const totalHousesNonExistent = await db.house.count({
      where: { locationId: locationId, statusAttempt: "Non Existent" },
    });

    const toBeVisited: HouseCount[] = await db.$queryRaw`
      SELECT COUNT(DISTINCT id) as "totalHouses"
      FROM "House"
      WHERE "locationId" = ${locationId}
      AND "statusAttempt" NOT IN (
        'Consent Final Yes',
        'Consent Final No',
        'Site Visit Required',
        'House Does Not Exist'
      )
      GROUP BY "locationId"
    `;

    // const leftToVisit =
    //   toBeVisited.find((house: unknown) => house.streetId === house.id)
    //     ?.totalHouses || 0;


    // Total number of houses with consent
    const totalHousesWithConsent =
      Number(totalHousesWithConsentYes) + Number(totalHousesWithConsentNo);

    // Percentage of houses with consent Yes
    const percentageHousesWithConsentYes = Math.ceil(
      (Number(totalHousesWithConsentYes) / totalHouses) * 100
    );

    // Percentage of houses with consent No
    const percentageHousesWithConsentNo = Math.ceil(
      (Number(totalHousesWithConsentNo) / totalHouses) * 100
    );

    // Percentage of houses visited
    const percentageHousesVisited = Math.ceil(
      (totalHousesVisited / totalHouses) * 100
    );

    const name = location?.name ?? "";
    const isDeleted =  false;

    // const toBeVisited = totalHouses - totalHousesVisited;

    const data = {
      isDeleted: isDeleted,
      name: name,
      totalHouses: Number(totalHouses),
      totalHousesWithConsent: Number(totalHousesWithConsent),
      totalHousesWithConsentYes: Number(totalHousesWithConsentYes),
      totalHousesWithConsentNo: Number(totalHousesWithConsentNo),
      totalHousesVisited: Number(totalHousesVisited),
      totalHousesNonExistent: Number(totalHousesNonExistent),
      percentageHousesWithConsentYes: Number(percentageHousesWithConsentYes),
      percentageHousesWithConsentNo: Number(percentageHousesWithConsentNo),
      percentageHousesVisited: Number(percentageHousesVisited),
      totalHousesVisitRequired: Number(totalHousesVisitRequired),
      toBeVisited: Number(toBeVisited),

    };

    console.log(data);
    console.log(totalHousesWithConsentYes);
    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};

export const getAllLocationIds = async (isActive: boolean) => {
  try {
    const locations = await db.location.findMany({
      where: { isDeleted: isActive },
      select: {
        name: true,
        id: true,
      },
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};

export const AllLocations = async () => {
  try {
    const locations = await db.location.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};


export const getAllHouses = async (skip: number, take: number) => {
  try {
    const houses = await db.house.findMany({
      skip: skip,
      take: take,
      include: {
        Location: true,
        Street: true,
      },
      orderBy: {
        streetNumber: "asc",
      },
    });

    const total = await db.house.count();
    const metadata = {
      totalRecords: total,
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    };

    return {
      data: houses,
      metadata: metadata,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error getting houses" };
  }
}
// get all houses by locationId
export const getAllHousesInLocation = async (locationId: string, skip: number, take: number) => {
  try {
    const houses = await db.house.findMany({
      where: { locationId: Number(locationId) },
      skip: skip,
      take: take,
      include: {
        Location: true,
        Street: true,
      },
      orderBy: {
        lastUpdated: "desc",
      },
    });
    const total = await db.house.count({ where: { locationId: Number(locationId) } });
    const metadata = {
      totalRecords: total,
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    };

    return {
      data: houses,
      metadata: metadata,
    };
  } catch (error) {
	    console.error(error);
      return { error: "Error getting houses" };
  }
}

// get all houses by locationId
export const getAllHousesInLocationSeeding = async (locationId: string, skip: number, take: number) => {
  try {
    const houses = await db.house.findMany({
      where: {
        locationId: Number(locationId),
        isConcilatedInSalesForce: false,
        lastUpdatedBy:{
          not: 'SysAdmin',
        },        
       },
      skip: skip,
      take: take,
      include: {
        Location: true,
        Street: true,
      },
      orderBy: {
        lastUpdated: "desc",
      },
    });

    const total = await db.house.count({ where: { locationId: Number(locationId) } });
    const metadata = {
      totalRecords: total,
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    };

    // clean houses data
    const data = houses.map((house) => {
      return {
        id: house.id,
        streetNumber: house.streetNumber ,
        street: { name: house.Street.name as string },
        name: house.name as string,
        lastName: house.lastName as string,
        type: house.type as string,
        phone: house.phone as string,
        email: house.email as string,
        statusAttempt: house.statusAttempt as string,
        isConcilatedInSalesForce: house.isConcilatedInSalesForce as boolean,
        consent: house.consent as string,
        location: house.Location.name as string,
      };
    });

    return {
      data: data,
      metadata: metadata,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error getting houses" };
  }
}


export const getHousesInStreet = async (
  street: string | string[] | undefined,
  skip: number,
  take: number
) => {
  try {
    // Fetch the houses on a specific street with pagination
    const houses = await db.house.findMany({
      where: { streetId: Number(street) },
      skip: skip,
      take: take,
      select: {
        id: true,
        streetNumber: true,
        lastName: true,
        name: true,
        phone: true,
        email: true,
        internalNotes: true,
        externalNotes: true,
        type: true,
        streetId: true,
        locationId: true,
        statusAttempt: true,
        consent: true,
        lastUpdated: true,
        lastUpdatedBy: true,
        Location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
  
      // order by street number
      orderBy: {
        streetNumber: "asc",
      },
    });

    // total houses visited, by statusAttempt (Door Knock Attempt 1, Door Knock Attempt 2, Door Knock Attempt 3)
    const totalHousesVisited = await db.house.count({
      where: {
        streetId: Number(street),
        statusAttempt: {
          in: [
            "Door Knock Attempt 1",
            "Door Knock Attempt 2",
            "Door Knock Attempt 3",
            "Door Knock Attempt 4",
            "Door Knock Attempt 5",
            "Door Knock Attempt 6",
            "Consent Final Yes",
            "Consent Final No",
          ],
        },
      },
    });
    
    const response = { houses,  totalHousesVisited}
    
    
    // Count the total number of houses on the street
    const total = await db.house.count({
      where: { streetId: Number(street) },
    });

    return {
      data: response,
      metadata: {
        totalRecords: total,
        hasNextPage: skip + take < total,
        totalPages: Math.ceil(total / take),
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Error getting houses" };
  }
};

interface SeedData {
  name: string;
  neighborhood: string;
  priorityStatus: number;
  houses: Array<{
    streetNumber: number;
    lastName: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    statusAttempt: string;
    consent: string;
    type: string;
    street: string;
  }>;
  streets: string[];
}

export async function seed(data: SeedData) {
  // Create Location
  const location = await db.location.create({
    data: {
      name: data.name,
      neighborhood: data.neighborhood,
      priorityStatus: data.priorityStatus,
    },
  });

  // Create Streets and map their IDs
  const streetIds = new Map<string, number>();
  for (const streetName of data.streets) {
    const street = await db.street.create({
      data: {
        name: streetName,
        locationId: location.id,
      },
    });
    streetIds.set(streetName, street.id);
  }

  // Create Houses
  for (const house of data.houses) {
    await db.house.create({
      data: {
        streetNumber: house.streetNumber,
        lastName: house.lastName,
        name: house.name,
        phone: house.phone,
        email: house.email,
        externalNotes: house.notes,
        statusAttempt: house.statusAttempt,
        consent: house.consent,
        type: house.type,
        streetId: streetIds.get(house.street) || 0, // Assuming 0 is a valid default
        locationId: location.id,
      },
    });
  }
}

export async function createLocationAndHouses(jsonData: SeedData) {
  try {
    // Create location
    const location = await db.location.create({
      data: {
        name: jsonData.name,
        neighborhood: jsonData.neighborhood,
        priorityStatus: jsonData.priorityStatus,
      },
    });

    // Map to keep track of created streets for house association, with corrected type
    const streetsMap: { [key: string]: number } = {};

    // Create streets
    for (const streetName of jsonData.streets) {
      const street = await db.street.create({
        data: {
          name: streetName,
          locationId: location.id,
        },
      });
      streetsMap[streetName] = street.id; // Store street id for later use
    }

    // Create houses
    for (const house of jsonData.houses) {
      await db.house.create({
        data: {
          streetNumber: Number(house.streetNumber),
          lastName: house.lastName,
          name: house.name,
          type: house.type,
          streetId: streetsMap[house.street], // Associate with street using map
          locationId: location.id, // Associate with location
          lastUpdated: new Date(), // Assuming you want to set this manually
          statusAttempt: house.statusAttempt,
          consent: house.consent,
          email: house.email,
          externalNotes: house.notes, // Assuming 'notes' maps to 'externalNotes'
          phone: house.phone,
          isConcilatedInSalesForce: true, 
          // Add other fields as necessary
          
        },
      });
    }

    return { status: "success", message: "Location and houses created" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error creating location and houses" };
  }
}


export async function updateHouseRecordsAsAdmin(jsonData: SeedData) {
  try {
    for (const house of jsonData.houses) {
      const streetNumberInt = Number(house.streetNumber);

      if (isNaN(streetNumberInt)) {
        console.log(`Invalid street number for ${house.name}: ${house.streetNumber}`);
        continue;
      }

      const existingHouse = await db.house.findFirst({
        where: {
          // name: house.name,
          streetNumber: streetNumberInt,
          Street: { name: house.street },
        },
      });

      if (existingHouse) {
        await db.house.update({
          where: { id: existingHouse.id },
          data: {
            statusAttempt: house.statusAttempt,
            consent: house.consent,
            lastUpdated: new Date(),
            lastUpdatedBy: "SystemAdmin",
            isConcilatedInSalesForce: true,
          },
        });
      } else {
        console.log(`House not found for ${house.name}, ${house.streetNumber} ${house.street}`);


      }
    }

    return {
      status: "success",
      message: `Successfully updated ${jsonData.houses.length} houses`,
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error updating property" };
  }
}

export async function getHouseSFStatus(houseId: string) {
  try {
    const house = await db.house.findUnique({
      where: { id: Number(houseId) },
      select: {
        isConcilatedInSalesForce: true,
      },
    });

    if (!house) {
      return { error: "House not found" };
    }

    return house.isConcilatedInSalesForce;
  } catch (error) {
    console.error(error);
    return { error: "Error getting house" };
  }
}


export const switchSFStatus = async (houseId: string, status: boolean) => {
  try {
    const updatedHouse = await db.house.update({
      where: { id: Number(houseId) },
      data: { isConcilatedInSalesForce: status },
    });

    return { status: "success", message: "Property updated", house: updatedHouse };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error updating property" };
  }
};

// temporary function to delete all records from location 10, for testing purposes
export async function deleteRecords() {
  const today = new Date(2024, 0, 13); // JavaScript months are 0-indexed, so 0 represents January
  const tomorrow = new Date(2024, 0, 14);

  try {
    
  
    const result = await db.house.deleteMany({
      where: {
        AND: [
          {
            lastUpdated: {
              gte: today,
              lt: tomorrow, // Use 'lt' (less than) to exclude records from the next day
            },
          },
          {
            locationId: 8,
          },
          {
            statusAttempt: {
              not: "Door knock Attempt 1",
            },
          },
        ],
      },
    });
    console.log(`Deleted ${result.count} records.`);
    return { status: "success", message: `Deleted ${result.count} records.` };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error deleting property" };
  }
}



export const updateLatLonByStreetId = async ( streetId: string) => {
  const houses = await db.house.findMany({
    where: {
      // locationId: 7,
      streetId: Number(streetId),
    },
    select: {
      id: true,
      streetNumber: true,
      Street: {
        select: {
          name: true,
        },
      },
    },
  });

  let allData = [];

  for (const house of houses) {
    const address = `${house.streetNumber} ${house.Street.name}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}&accept-language=en&countrycodes=ca&limit=1`
    );
    const data = await response.json();
    if (data.length === 0) {
      console.log(`No data found for ${address}`);
      continue;
    }
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    await db.house.update({
      where: { id: house.id },
      data: {
        latitud: lat,
        longitud: lon,
      },
    });
    allData.push({ lat: lat, lon: lon });




    console.log(`Updated lat and lon for ${address}`);
  }
  return allData;
};

import { DateTime } from 'luxon';

type PaceData = {
  editedHouses: number;
  editedHousesFinal: number;
  shiftStart: Date;
  shiftEnd: Date;
};
  


export async function calculatePace({ editedHouses, editedHousesFinal, shiftStart, shiftEnd }: PaceData) {
  // Convert to number
  const updatedHouses = editedHouses as number;
  const updatedHousesFinal = editedHousesFinal as number;

  // Set the shift start and end times
  const startTime = DateTime.fromJSDate(new Date(shiftStart));
  const endTime = DateTime.fromJSDate(new Date(shiftEnd));

  // Calculate the shift duration in minutes
  const shiftDurationInMilliseconds = endTime.diff(
    startTime,
    "milliseconds"
  ).milliseconds;
  let shiftDurationInMinutes = shiftDurationInMilliseconds / 1000 / 60; // convert from ms to minutes

  // Adjust for the number of houses updated
  let shiftDurationAdjusted = shiftDurationInMinutes - updatedHouses * 1.5;

  let userPace = 0;
  if (updatedHousesFinal !== 0) {
    userPace = shiftDurationAdjusted / updatedHousesFinal; // this gives adjusted minutes per house update
  }
  return userPace;
}