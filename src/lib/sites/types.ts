export type User = {
  name: string | null;
};

export type ShiftLogger = {
  isFinished: boolean;
  User: User;
};

export type location = {
  id: number;
  name: string | null;
  neighborhood: string;
  priorityStatus: number;
  totalHouses: number;
  totalHousesVisited: number;
  leftToVisit: number;
  ShiftLogger: ShiftLogger[];
  totalHousesWithConsentYes: number;
  totalHousesWithConsentNo: number;
  totalHousesWithToBeVisited: number;
  totalHours: number;
};

export type SiteCardProps = {
  props: location;
};

    
export type HouseCount = {
    locationId: number;
    totalHouses: number;
};