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
};