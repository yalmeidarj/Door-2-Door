import { db } from "@/server/db";
import { HouseCount } from "./types";

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
