import { db } from "@/server/db";

import { HouseType } from "../houses/types";
import { LocationType } from "../sites/types";
import { StreetType } from "../streets/types";



// Fetch all locations
const getLocations = async () => {
    const locations = await db.location.findMany({
        select: {
            id: true,
            name: true,
            neighborhood: true,
        },
    });
    return locations;
}




// Fetch streets within a specific location
async function getStreetsInLocation(locationId: number) {
  return await db.street.findMany({
    where: { locationId },
  });
}

// Create a new house
async function createHouse(data: {
  streetNumber: number;
  lastName?: string;
  name?: string;
  type?: string;
  streetId: number;
  locationId: number;
  lastUpdatedBy?: string;
  statusAttempt?: string;
  consent?: string;
  email?: string;
  externalNotes?: string;
  internalNotes?: string;
  phone?: string;
  latitud?: number;
  longitud?: number;
}) {
  return await db.house.create({
    data,
  });
}

// Update an existing house
async function updateHouse(
  id: number,
  data: {
    streetNumber?: number;
    lastName?: string;
    name?: string;
    type?: string;
    streetId?: number;
    locationId?: number;
    lastUpdated?: Date;
    lastUpdatedBy?: string;
    statusAttempt?: string;
    consent?: string;
    email?: string;
    externalNotes?: string;
    internalNotes?: string;
    phone?: string;
    latitud?: number;
    longitud?: number;
  }
) {
  return await db.house.update({
    where: { id },
    data,
  });
}

// Delete a house
async function deleteHouse(id: number) {
  // Soft delete could be implemented here if needed by updating a flag instead of actual deletion
  // For hard delete:
  return await db.house.delete({
    where: { id },
  });
}

// Get houses in a specific street
async function getHousesInStreet(streetId: number) {
  return await db.house.findMany({
    where: { streetId },
  });
}

export {
  getLocations,
  getStreetsInLocation,
  createHouse,
  updateHouse,
  deleteHouse,
  getHousesInStreet,
};
