import { db } from "@/server/db";
import { StreetHouseCount } from "./types";

export const getStreetsInLocation = async (
  location: string | string[] | undefined,
  skip: number,
  take: number
) => {
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
                    "Home Does Not Exist",
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

    const total = await db.street.count({
      where: { locationId: Number(location) },
    });

    const totalHousesPerStreet: StreetHouseCount[] = await db.$queryRaw` 
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" FROM "House" GROUP BY "streetId"
    `;

          // "Door Knock Attempt 1",
          //   "Door Knock Attempt 2",
          //   "Door Knock Attempt 3",
          //   "Door Knock Attempt 4",
          //   "Door Knock Attempt 5",
          //   "Door Knock Attempt 6";
    
    const totalHousesLeftToVisitPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) AS "totalHouses"
      FROM "House"
      WHERE "statusAttempt" NOT IN (
        'Consent Final Yes',
        'Consent Final No',
        'Site Visit Required',
        'Engineer Visit Required',
        'Home Does Not Exist'
      )
      GROUP BY "streetId"
    `;

    const totalHousesWithConsentYesPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
  SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" 
  FROM "House" 
      WHERE "statusAttempt" = 'Consent Final Yes' 
      
  GROUP BY "streetId"
`;

    const totalHousesWithYes: StreetHouseCount[] = await db.$queryRaw`
    SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
      FROM "House"
      WHERE "consent" = 'Yes'
      OR "statusAttempt" = 'Consent Final Yes'
      GROUP BY "streetId"
  `;

    const totalHousesWithConsentNoPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
       FROM "House" 
       WHERE "consent" = 'No'
       OR "statusAttempt" = 'Consent Final No' 
      
      GROUP BY "streetId"
    `;

    const totalHousesWithVisitRequiredPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
      FROM "House" 
      WHERE "statusAttempt" = 'Site Visit Required'
      OR "statusAttempt" = 'Engineer Visit Required'
      GROUP BY "streetId"
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

      const totalHousesWithConsentNo =
        totalHousesWithConsentNoPerStreet.find(
          (house: StreetHouseCount) => house.streetId === street.id
        )?.totalHouses || 0;

      const totalHousesWithVisitRequired =
        totalHousesWithVisitRequiredPerStreet.find(
          (house: StreetHouseCount) => house.streetId === street.id
        )?.totalHouses || 0;

      const leftToVisit = 
        totalHousesLeftToVisitPerStreet.find(
          (house: StreetHouseCount) => house.streetId === street.id
        )?.totalHouses || 0;

      return {
        ...street,
        totalHousesVisited: Number(street._count.House),
        // totalHousesVisited: Number(leftToVisit),
        totalHouses: Number(totalHouses),
        leftToVisit: Number(leftToVisit),
        totalHousesWithConsentYes: Number(totalHousesWithConsentYes),
        totalHousesWithConsentNo: Number(totalHousesWithConsentNo),
        totalHousesWithVisitRequired: Number(totalHousesWithVisitRequired),
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
