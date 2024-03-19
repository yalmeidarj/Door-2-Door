import { db } from "@/server/db";

type TotalHousesResult = {
  totalHouses: bigint; // or number, depending on the actual type returned
}

type HouseCount = {
    locationId: number;
    totalHouses: number;
};
    
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
        'Home Does Not Exist'
      )
      GROUP BY "locationId"
    `;

    const leftToVisit =
      toBeVisited.find(
        (house: HouseCount) => house.locationId === house.locationId
      )?.totalHouses || 0;

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
    const isDeleted = location?.isDeleted;

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
      toBeVisited: Number(leftToVisit),
    };

    console.log(data);
    console.log(totalHousesWithConsentYes);
    return data;
  } catch (error) {
    console.error(error);
    return { error: "Error getting locations" };
  }
};