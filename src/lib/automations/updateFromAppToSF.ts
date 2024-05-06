"use server";

import { db } from "@/server/db";

export async function getHousesByStatusAttempt(status: string) {
  const houses = await db.house.findMany({
    where: {
      statusAttempt: status,
    },
  });
  return houses;
}

export async function changeStatusAttempt(houseId: number, status: string) {
  const house = await db.house.update({
    where: {
          id: houseId,
        
    },
    data: {
      statusAttempt: status,
    },
  });
  return house;
}

export async function massUpdateStatusAttemptByLocationId(locationId: string, currentStatusAttempt: string, newStatusAttempt: string) {

    if (
      currentStatusAttempt === " " ||
      currentStatusAttempt === "" ||
      currentStatusAttempt === undefined ||
        currentStatusAttempt === null ||
        currentStatusAttempt === "No Attempt "
        
    ) {
        console.log("currentStatusAttempt is empty");
      try {
        const houses = await db.house.updateMany({
          where: {
            locationId: Number(locationId),
            statusAttempt: "No Attempt ",
          },
          data: {
            statusAttempt: newStatusAttempt,
          },
        });
          
          const HousesCount = houses.count;
          
        // const data = {
        //   chosenLocationId: locationId,
        //     housesFound: houses.length,
        //     currentStatusAttempt: currentStatusAttempt,
        //     newStatusAttempt: newStatusAttempt,
          // };
          
          const statusMessage = `successfully updated ${Number(HousesCount)} houses to ${newStatusAttempt}`;
          console.log(statusMessage);
          return {
            status: "success",
            statusMessage: statusMessage,
          };
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          error: error,
        };
    }
    
    
    }
    else {
        console.log("currentStatusAttempt is not empty");
        try {
            const houses = await db.house.updateMany({
            where: {
                locationId: Number(locationId),
                statusAttempt: currentStatusAttempt,
                },
                data: {
                  statusAttempt: newStatusAttempt,
                  lastUpdatedBy: "systemAdmin",
                  lastUpdated: new Date(),
                },
            });

            const HousesCount = houses.count;

            // const data = {
            //     currentStatusAttempt: currentStatusAttempt,
            //     newStatusAttempt: newStatusAttempt,
            // chosenLocationId: locationId,
            // housesFound: houses.length,
            // };
            
            const statusMessage = `successfully updated ${Number(HousesCount)} houses to ${newStatusAttempt}`;
            console.log(statusMessage);
            return {
              status: "success",
              statusMessage: statusMessage,
              // data: data,
            };
        } catch (error) {
            console.error(error);
            return {
            status: "error",
            error: error,
            };
        }
    }
}