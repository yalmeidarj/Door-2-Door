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

// export const updateProperty = async (formData: FormData) => {
//   const data: UpdatePropertyFormData = {
//     id: parseInt(formData.get("id") as string),
//     lastName: formData.get("lastName") as string,
//     name: formData.get("name") as string,
//     internalNotes: formData.get("internalNotes") as string,
//     externalNotes: formData.get("externalNotes") as string,
//     email: formData.get("email") as string,
//     phone: formData.get("phone") as string,
//     type: formData.get("type") as string,
//     statusAttempt: formData.get("statusAttempt") as string,
//     consent: formData.get("consent") as string,
//     lastUpdatedBy: formData.get("lastUpdatedBy") as string,
//     // shiftLoggerId: formData.get("shiftLoggerId") as string,

//   };

    


//   if (isNaN(data.id)) {
//     throw new Error("Invalid property ID");
//   }

//   const updatedData = {
//     ...data,
//     lastUpdated: new Date(),
//   };

//   try {
//     await db.house.update({
//       where: { id: data.id },
//       data: updatedData,
//     });

//     // await db.shiftLogger.update({
//     //   where: { id: data.id as unknown as string },
//     //   data: { updatedHouses: { increment: 1 } },
//     // });

//     revalidatePath(`/`);
//     return { status: "success", message: "Property updated" };
//   } catch (error) {
//     console.error(error);
//     return { status: "error", message: "Error updating property" };
//   }
// };


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

  console.log(`Cuurent shiftId: ${shiftId}`);
  const data = formData as object;
  try {
    const shift = await db.shiftLogger.update({
      where: {id: shiftId
      },
      data: {isFinished: true},
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
      data: { isClockedIn: true },
    });

    revalidatePath(`/`);
    
    return { status: "success", message: "Successfully clocked in" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Error clocking in" };
  }
};

// export const  ClockIn = async (formData: FormData) => {

//   const datas =  formData as object as shiftData;
//   const userId = formData.get("agentId") as string;
//   console.log(`Cuurent userId: ${userId}`);
//   const locationId = formData.get("locationId") as unknown as number;


//   if (!userId || !locationId ) throw new Error("No id found in form data");



//   try {
//     const newShift = await db.shiftLogger.create({
//       data: {
//         // startingDate: new Date(),
//         // isFinished: false,
//         // updatedHouses: 0,
//         // updatedHousesFinal: 0,
//         // pace: 0,
//         // paceFinal: 0,
//         // agentId: datas.agentId ?? "ff",
//         // locationId: datas.locationId ?? 1,

//         User: {
//           connect: { id: userId as string},
//         },
//         Location: {
//           connect: { id: Number(locationId) },
//         },

//         // Set other fields as necessary
//       },
//     });

    
//   const userClockIn = await db.user.update({
//     where: { id: userId },
//     data: { isClockedIn: true },
//   });


//     revalidatePath(`/`);
//     return { success: "Successfully Clocked in" };
//   } catch (error) {
//     console.error(error);
//     return { error: "Error clocking in" };
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
        data: { updatedHouses: { increment: 1 } },
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
        data: { updatedHousesFinal: { increment: 1 } },
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
