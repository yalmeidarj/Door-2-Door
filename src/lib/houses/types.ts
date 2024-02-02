export type house = {
  id: number;
  streetNumber: number;
  lastName: string | null;
  name: string | null;
  type: string | null;
  streetId: number;
  locationId: number;
  lastUpdated: Date;
  lastUpdatedBy: string | null;
  internalNotes: string | null;
  statusAttempt: string | null;
  consent: string | null;
  externalNotes: string | null;
  phone: string | null;
  email: string | null;
  Street: {
    name: string;
  };
  Location: {
    name: string;
  };
};

export type HouseDetailsProps = {
  props: house;
};

export type HousesFeedProps = {
  id: string | string[] | undefined;
  start: number;
  perPage: number;
  userId: string;
};

export type HouseFeedData = {
    feed: HousesFeedProps;
}

export type HouseItemProps = {
  house: house;
  activeShift: boolean;
  // locationId: number;
};
