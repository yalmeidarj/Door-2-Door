import { db } from "@/server/db";

export const isAgentClockedIn = async (agentId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: agentId },
      select: {
        isClockedIn: true,
        ShiftLogger: {
          where: {
            isFinished: false, // Assuming you want the current (unfinished) shift
          },
          select: {
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

    if (!user) {
      return { activeShift: false, locationId: 0 };
    }

    const location = user.ShiftLogger[0]?.Location;
    return {
      activeShift: user.isClockedIn,
      locationId: location.id,
    };
  } catch (error) {
    console.error(error);
    return { activeShift: false };
  }
};


export const houseCurrentStreet = async (streetId: number) => {
    try {
        const street = await db.house.findFirst({
            where: { streetId: streetId },
            select: { Street: { select: { name: true } }, Location: { select: { id: true } } },
        });
        return street;
    } catch (error) {
        console.log(error);
        return false;
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

    const response = { houses, totalHousesVisited };

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
