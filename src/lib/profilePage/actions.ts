import { db } from "@/server/db";

export const getShiftsByAgentId = async (agentId: string) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: { agentId: agentId },
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

    const activeShifts = shifts.filter((shift) => shift.isFinished === false);
    const finishedShifts = shifts
      .filter((shift) => shift.isFinished === true)
      .map((shift) => {
        const start = shift.startingDate?.getTime();
        const end = shift.finishedDate?.getTime();
        if (start && end && end > start) {
          const shiftLength = end - start;
          const hours = Math.floor(shiftLength / 3600000); // Convert milliseconds to hours and floor it
          const minutes = Math.floor((shiftLength % 3600000) / 60000); // Convert remainder to minutes
          const formattedShiftLength = `${hours}h ${minutes}m`;
          return { ...shift, formattedShiftLength };
        }
        return shift;
      });

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

export const getShiftsByLocation = async (agentId: string) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: { agentId: agentId },
      select: {
        Location: {
          select: {
            id: true,
            name: true,
          },
        },
        agentId: true,
        startingDate: true,
        finishedDate: true,
      },
      orderBy: {
        startingDate: "desc",
      },
    });

    type Shift = {
      Location: { id: number; name: string };
      agentId: string;
      startingDate: Date;
      finishedDate: Date | null;
    };

    // Define a type with an index signature
    type LocationGroup = {
      [key: string]: {
        [key: string]: {
          totalHours: number;
        };
      };
    };

    const locationGroups: LocationGroup = {};

    shifts.forEach((shift: Shift) => {
      const locationId = shift.Location.id.toString();
      const agentId = shift.agentId;
      const start = shift.startingDate.getTime();
      const end = shift.finishedDate?.getTime();
      if (end && end > start) {
        const shiftLength = end - start;
        const hours = Math.floor(shiftLength / 3600000); // Convert milliseconds to hours and floor it
        if (!locationGroups[locationId]) {
          locationGroups[locationId] = {};
        }
        if (!locationGroups[locationId][agentId]) {
          locationGroups[locationId][agentId] = { totalHours: 0 };
        }
        locationGroups[locationId][agentId].totalHours += hours;
      }
    });

    return locationGroups;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }

};


export  const getShiftsByLocationByUser = async(userId: string)  => {
    // Fetch shifts for the given user, including the related location data
    const shifts = await db.shiftLogger.findMany({
      where: {
        agentId: userId,
        isFinished: true, // Assuming you want to include only finished shifts
      },
      include: {
        Location: true, // Assuming 'Location' is the correct relation name
      },
    });

    if (shifts.length === 0) return null;

    // Define the accumulator with an index signature
    type ShiftsAccumulator = {
      [locationName: string]: number;
    };

    // Group shifts by location and calculate total hours for each
    const shiftsByLocation = shifts.reduce((acc: ShiftsAccumulator, shift) => {
      const locationName = shift.Location.name;
      const hours =
        shift.finishedDate && shift.startingDate
          ? (Number(shift.finishedDate) - Number(shift.startingDate)) /
            (1000 * 60 * 60) // Convert milliseconds to hours
          : 0;

      if (!acc[locationName]) acc[locationName] = 0;
      acc[locationName] += hours;

      return acc;
    }, {} as ShiftsAccumulator); // Initialize the accumulator with the correct type

  return shiftsByLocation;
}



