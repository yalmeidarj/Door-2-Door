import { db } from "@/server/db";
import { HouseCount } from "./types";


// Function to calculate total hours spent by all users in a location
const calculateTotalHoursPerLocation = (shiftLoggers: any[]): number => {
  return shiftLoggers.reduce((totalHours, shiftLogger) => {
    if (shiftLogger.finishedDate) {
      const timeDiff = shiftLogger.finishedDate.getTime() - shiftLogger.startingDate.getTime();
      totalHours += timeDiff / (1000 * 60 * 60); // Convert milliseconds to hours
    }
    return totalHours;
  }, 0);
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
      
      GROUP BY "locationId"
    `;

    const totalHousesWithConsentNoPerLocation: HouseCount[] =
      await db.$queryRaw`
      SELECT "locationId",
       COUNT(DISTINCT id) as "totalHouses"
        FROM "House" 
        WHERE "statusAttempt" = 'Consent Final No' 
         
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

    const needToVisit: HouseCount[] = await db.$queryRaw`
      SELECT "locationId",
      COUNT(DISTINCT id) as "totalHouses"
      FROM "House" 
      WHERE "statusAttempt" 
      IN ('Door Knock Attempt 1',
      'Door Knock Attempt 2',
      'Door Knock Attempt 3',
      'Door Knock Attempt 4',
      'Door Knock Attempt 5',
      'Door Knock Attempt 6'      
      )
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

      const leftToVisit = needToVisit.find(
        (house: HouseCount) => house.locationId === location.id
      )?.totalHouses || 0;

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
      
      const shiftLoggersForLocation = location.ShiftLogger || [];
      const totalHours = calculateTotalHoursPerLocation(
        shiftLoggersForLocation
      );

      return {
        ...location,
        totalHousesVisited: location._count.House,
        totalHouses: totalHouses,
        leftToVisit: Number(leftToVisit),
        // leftToVisit: Number(Number(totalHouses) - Number(leftToVisit)),
        totalHousesWithConsentYes: Number(totalHousesWithConsentYes),
        totalHousesWithConsentNo: Number(totalHousesWithConsentNo),
        totalHousesWithToBeVisited: Number(totalHousesWithToBeVisited),
        totalHours: totalHours,
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

export const getLocationTotalHoursSpentByAllUsers = async (locationId: number) => {
  
  const excludedAgentIds = [
    "clqzzv2rp0000anwgwdm445kb",
    "clqauhij10000o4ihuxl3nu10",
  ];
  try {
    const shiftLoggers = await db.shiftLogger.findMany({
      where: {
        locationId: locationId,
        isFinished: true,
        NOT: {
          agentId: {
            in: excludedAgentIds,
          },
        },
        
      },
    });

    return calculateTotalHoursPerLocation(shiftLoggers);
  } catch (error) {
    console.error(error);
    return { error: "Error getting location total hours" };
  }
};
