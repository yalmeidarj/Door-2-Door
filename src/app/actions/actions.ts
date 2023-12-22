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

  // const updatedData = {
  //   // id: Number(formData.get("id")),
  //   lastName: formData.get("lastName") ?? "",
  //   name: formData.get("name") ?? "",
  //   notes: formData.get("notes") ?? "",
  //   phoneOrEmail: formData.get("phoneOrEmail") ?? "",
  //   type: formData.get("type") ?? "",
  //   statusAttempt: formData.get("statusAttempt") ?? "",
  //   consent: formData.get("statusAttempt") ?? "",
  //   lastUpdated: new Date(),
  //   lastUpdatedBy: formData.get("lastUpdatedBy"),
  // };

  const id = Number(formData.get("id"));
  if (!id) throw new Error("No id found in form data");

  try {
    const updatedHouse = await db.house.update({
      where: { id: id },
      data: updatedData as object,
    });
    revalidatePath(`/`);
    return { success: "Property updated" };

    // return updatedHouse;
  } catch (error) {
    console.error(error);
    return { error: "Error updating property" };
  }
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
      data: {isFinished: true},
    });
    revalidatePath(`/`);
    return { success: "Successfully Clocked out" };
  } catch (error) {
    console.error(error);
    return { error: "Error clocking out" };
  }
};

export const  ClockIn = async (formData: FormData) => {

  const datas =  formData as object as shiftData;
  const userId = formData.get("agentId") as string;
  console.log(`Cuurent userId: ${userId}`);
  const locationId = formData.get("locationId") as unknown as number;


  if (!userId || !locationId ) throw new Error("No id found in form data");



  try {
    const newShift = await db.shiftLogger.create({
      data: {
        // startingDate: new Date(),
        // isFinished: false,
        // updatedHouses: 0,
        // updatedHousesFinal: 0,
        // pace: 0,
        // paceFinal: 0,
        // agentId: datas.agentId ?? "ff",
        // locationId: datas.locationId ?? 1,

        User: {
          connect: { id: userId as string},
        },
        Location: {
          connect: { id: Number(locationId) },
        },

        // Set other fields as necessary
      },
    });
    revalidatePath(`/`);
    return { success: "Successfully Clocked in" };
  } catch (error) {
    console.error(error);
    return { error: "Error clocking in" };
  }
}

// export const ClockOut = async ({data}: ShiftProps) => {
//   try {

//     const shift = await db.shiftLogger.update({
//       where: {id: data.id},
//       data: data
//     });


//     return { success: "Successfully Clocked out" };
//   }
//   catch (error) {
//     console.error(error);
//     return { error: "Error clocking out" };
//   }
// }

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
      where: {agentId: agentId}
    });
    return shifts;
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

// get shift by agentId and not finished
export const getShiftByAgentId = async (agentId: string) => {
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
    return shift;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shift" };
  }
};

// get all shifts by agentId and finished
export const getShiftsByAgentIdFinished = async (agentId: string) => {
  try {
    const shifts = await db.shiftLogger.findMany({
      where: {agentId: agentId, isFinished: true}
    });
    return shifts;
  } catch (error) {
    console.error(error);
    return { error: "Error getting shifts" };
  }
};



export const getLocations = async () => {
  try {
    const locations = await db.location.findMany();
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
