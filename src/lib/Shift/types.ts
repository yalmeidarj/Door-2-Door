export type Shift = {
  formattedDuration?: string;
  id: string;
  agentId: string;
  locationId: string;
  startingDate: Date;
  finishedDate: Date;
  isFinished: boolean;
  updatedHouses: number;
  updatedHousesFinal: number;
  updatedHousesFinalNo: number;
  pace: number;
  paceFinal: number;
  formattedShiftLength?: string;
  Location: Location;
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