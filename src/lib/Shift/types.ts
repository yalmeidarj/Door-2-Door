import { Id } from "../../../convex/_generated/dataModel";

export type Shift = {
  _id: Id<"shiftLogger">;
  userID?: string | undefined;
  _creationTime: number;
  startingDate?: number | undefined;
  finishedDate?: number | undefined;
  updatedHouses?: number | undefined;
  updatedHousesFinal?: number | undefined;
  updatedHousesFinalNo?: number | undefined;
  siteID: string;
  isFinished: boolean;
};


export type Location = {
    id: string;
    name: string;
};

export type ShiftsResponse = {
    activeShifts: Shift[];
    finishedShifts: Shift[];
    totalHoursWorked: string;
  totalTimePerLocation: { [key: string]: string };
  housesNotFinal: number;
  housesYes: number;
  housesNo: number;
  totalHouses: number;
};