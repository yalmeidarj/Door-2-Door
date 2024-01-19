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

    const totalHousesAlreadyVisitedPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
      FROM "House"
      WHERE "statusAttempt" IN (
'Home Does Not Exist', 
      'Consent Final', 
      'Consent Final Yes', 
      'Consent Final No', 
      'Site Visit Required', 
      'Drop Type Unverified', 
      'Engineer Visit Required',
      'Door Knock Attempt 1',
      'Door Knock Attempt 2',
      'Door Knock Attempt 3',
      'Door Knock Attempt 4',
      'Door Knock Attempt 5',
      'Door Knock Attempt 6'  
      )
      GROUP BY "streetId"
    `;

    const totalHousesWithConsentYesPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
  SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" 
  FROM "House" 
      WHERE "statusAttempt" = 'Consent Final Yes' 
      OR "consent" = 'Yes'
  GROUP BY "streetId"
`;

    const totalHousesWithYes: StreetHouseCount[] = await db.$queryRaw`
    SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
      FROM "House"
      WHERE "consent" = 'Yes' GROUP BY "streetId"
  `;

    // const totalHousesWithConsentYesPerStreet = yes + totalHousesWithYes;

    // combine totalHousesWithConsentYesPerStreet and totalHousesWithYes

    const totalHousesWithConsentNoPerStreet: any[] = await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses"
       FROM "House" 
       WHERE ("consent" = 'No')
      GROUP BY "streetId"
    `;

    const totalHousesWithVisitRequiredPerStreet: StreetHouseCount[] =
      await db.$queryRaw`
      SELECT "streetId", COUNT(DISTINCT id) as "totalHouses" FROM "House" WHERE "statusAttempt" = 'Site Visit Required' GROUP BY "streetId"
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

      const leftToVisit = Number(totalHouses) - Number(street._count.House);

      return {
        ...street,
        totalHousesVisited: Number(street._count.House),
        totalHouses: Number(totalHouses),
        leftToVisit: leftToVisit,
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
