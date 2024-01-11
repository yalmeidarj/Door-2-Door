"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export const updateProperty = async (formData: FormData) => {
  const updatedData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => {
      // Exclude 'id' field
      if (key === "id") {
        return false;
      }
      // Check if the value is a string and not empty after trimming
      return typeof value === "string" ? value.trim() !== "" : true;
    }),
  );

  const id = Number(formData.get("id"));
  if (!id) throw new Error("No id found in form data");

  try {
    const updatedHouse = await db.house.update({
      where: { id: id },
      data: {...updatedData},

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

export const getShiftsByAgentId = async (agentId: string) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: { agentId: agentId },
      select: {
        Location: true,
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
      }, orderBy: {
        startingDate: "desc"
      }
    });

    const activeShifts = shifts.filter((shift) => shift.isFinished === false);
    const finishedShifts = shifts.filter((shift) => shift.isFinished === true);

    const data = {
      activeShifts: activeShifts,
      finishedShifts: finishedShifts,
    };
    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};

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
        isClockedIn: true
      },
      select: {
        id: true,
        name: true,
      },
      // select: {
      //   id: true,
      //   name: true,
      //   currentShiftId: true,
      //   ShiftLogger: {
      //     include: {
      //       Location: true,
      //     },
      //     select: {
      //       id: true,
      //       startingDate: true,
      //       finishedDate: true,
      //       updatedHouses: true,
      //       updatedHousesFinal: true,
      //       pace: true,
      //       paceFinal: true,
      //     },
      //   }
      // }
    });
    return agents;
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

type UpdateShiftFormData = {
  id: string;
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
      where: {isDeleted: false}
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

      const leftToVisit =  Number(totalHouses) - Number(location._count.House);
      console.log(leftToVisit);
      return {
        ...location,
        totalHousesVisited: location._count.House,
        totalHouses: totalHouses,
        leftToVisit: leftToVisit,
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


export const getLocationsStats = async (locationId: number) => {
  try {
    // Location name
    const location = await db.location.findUnique({
      where: { id: locationId },
      select: {
        name: true,
        isDeleted: true,
      },
    });

    // Total number of houses in the location
    const totalHouses = await db.house.count({
      where: { locationId: locationId },
    });

    // Total number of houses with consent Yes
    const totalHousesWithConsentYes = await db.house.count({
      where: { locationId: locationId, statusAttempt: "Consent Final Yes" },
    });

    // Total number of houses with consent No
    const totalHousesWithConsentNo = await db.house.count({
      where: { locationId: locationId, statusAttempt: "Consent Final No" },
    });

    // total houses visited, by statusAttempt (Door Knock Attempt 1, Door Knock Attempt 2, Door Knock Attempt 3)
    const totalHousesVisited = await db.house.count({
      where: {
        locationId: locationId,
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
    }
    );

    // Total number of houses non existent
    const totalHousesNonExistent = await db.house.count({
      where: { locationId: locationId, statusAttempt: "Non Existent" },
    });

    
    // Total number of houses with consent
    const totalHousesWithConsent =
      totalHousesWithConsentYes + totalHousesWithConsentNo;

    
    // Percentage of houses with consent Yes
    const percentageHousesWithConsentYes =
      Math.ceil((totalHousesWithConsentYes / totalHouses) * 100);
    
    // Percentage of houses with consent No
    const percentageHousesWithConsentNo =
      Math.ceil((totalHousesWithConsentNo / totalHouses) * 100);
    
    // Percentage of houses visited
    const percentageHousesVisited =
      Math.ceil((totalHousesVisited / totalHouses) * 100);
    
    const name = location?.name ?? "";
    const isDeleted = location?.isDeleted ?? false;

    const data = {
      isDeleted: isDeleted,
      name: name,
      totalHouses: totalHouses,
      totalHousesWithConsent: totalHousesWithConsent,
      totalHousesWithConsentYes: totalHousesWithConsentYes,
      totalHousesWithConsentNo: totalHousesWithConsentNo,
      totalHousesVisited: totalHousesVisited,
      totalHousesNonExistent: totalHousesNonExistent,
      percentageHousesWithConsentYes: percentageHousesWithConsentYes,
      percentageHousesWithConsentNo: percentageHousesWithConsentNo,
      percentageHousesVisited: percentageHousesVisited,
    };

    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};

export const getAllLocationIds = async () => {
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
};

export const AllLocations = async () => {
  try {
    const locations = await db.location.findMany({
      select: {
        id: true,
        name: true ?? "",
      },
    });
    return locations;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};

type StreetHouseCount = {
  streetId: number;
  totalHouses: number;
};

export const getStreetsInLocation = async (location: string | string[] | undefined, skip: number, take: number) => {
  try {
    const streets = await db.street.findMany({
      where: { locationId: Number(location) },
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
      },
      // order by street number
      orderBy: {
        name: "asc",
      },
    });

    const total = await db.street.count({ where: { locationId: Number(location) } });

    const totalHousesPerStreet: StreetHouseCount[] = await db.$queryRaw` 
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" FROM "House" GROUP BY "streetId"
    `;

    
    const totalHousesWithConsentYesPerStreet: StreetHouseCount[] = await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" FROM "House" WHERE "statusAttempt" = 'Consent Final Yes' GROUP BY "streetId"
    `;

    const data = streets.map((street) => {
      const totalHouses =
        totalHousesPerStreet.find(
          (house: StreetHouseCount) => house.streetId === street.id
        )?.totalHouses || 0;
      
      const totalHousesWithConsentYes =
        totalHousesWithConsentYesPerStreet.find(
          (house: StreetHouseCount) => house.streetId === street.id
        )?.totalHouses || 0;

      const leftToVisit = Number(totalHouses) - Number(street._count.House);
      return {
        ...street,
        totalHousesVisited: street._count.House,
        totalHouses: Number(totalHouses),
        leftToVisit: leftToVisit,
        totalHousesWithConsentYes: Number(totalHousesWithConsentYes),
      };
    });


    return {
      data: data,
      metadata: {
        totalRecords: total,
        hasNextPage: skip + take < total,
        totalPages: Math.ceil(total / take),
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Error getting streets" };
  }
};

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

