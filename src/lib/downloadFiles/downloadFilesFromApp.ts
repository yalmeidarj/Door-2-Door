import { db } from "@/server/db";

type ProjectData = {
  name: string;
  neighborhood: string;
  priorityStatus: number;
  houses: House[];
  streets: string[];
};

type House = {
  streetNumber: number;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  statusAttempt: string;
  consent: string;
  type: string;
  street: string;
  externalNotes: string;
};

// Assume this function fetches location data from a database or API
export async function fetchLocationById(locationId: number){
    const location = await db.location.findUnique({
        where: { id: locationId },
        include: {
        House: {
            include: {
            Street: true,
                },
            
        },
        Street: true,
        },
        
    });

    return location;

}

// Function to transform location data to ProjectData
export async function getLocationProjectData(
  locationId: string
) {

    const id = Number(locationId);

  const location = await fetchLocationById(id);

  // Transforming Location data to ProjectData
  const projectData = {
    name: location?.name,
    neighborhood: location?.neighborhood,
    priorityStatus: location?.priorityStatus,
    houses: location?.House.map((house) => ({
      streetNumber: house.streetNumber,
      lastName: house.lastName,
      name: house.name,
      phone: house.phone,
      email: house.email,
      notes: house.internalNotes + " " + house.externalNotes,
      statusAttempt: house.statusAttempt,
      consent: house.consent,
      type: house.type,
      street: house.Street.name,
      externalNotes: house.externalNotes,
    })),
    streets: location?.Street.map((street) => street.name),
  };

  return projectData;
}
