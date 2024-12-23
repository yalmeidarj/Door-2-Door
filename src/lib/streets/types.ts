export type StreetFeedProps = {
  id: string;
  start: number;
  perPage: number;
};

export type StreetType = {
  street: {
    id: string;
    name: string;
    totalHouses: number;
    totalHousesVisited: number;
    totalHousesWithConsentYes: number;
    totalHousesWithConsentNo: number;
    totalHousesWithVisitRequired: number;
    leftToVisit: number;
    lastVisited: string;
  };
};

export type StreetHouseCount = {
  streetId: number;
  totalHouses: number;
};