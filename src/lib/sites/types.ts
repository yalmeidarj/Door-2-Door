export type User = {
  name: string | null;
};

export type ShiftLogger = {
  isFinished: boolean;
  User: User;
};

// totalHousesVisited: number;
export type LocationType = {
  id: number;
  name: string | null;
  // neighborhood: string;
  // priorityStatus: number;
  // totalHouses: number;
  // leftToVisit: number; // Excludes houses that have no consent, or non-existent houses.
  // ShiftLogger: ShiftLogger[];
  // totalHousesWithConsentYes?: number;
  // totalHousesWithConsentNo?: number;
  // EngVisitRequired: number; // All houses with status 'Engineer visit required'
  // totalHours?: number;
};

export type SiteCardProps = {
  props: LocationType;
};

    
export type HouseCount = {
    locationId: number;
    totalHouses: number;
};