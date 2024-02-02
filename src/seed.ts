import { db } from "@/server/db";

type PlaceInfo = {
  place_id: number;
  licence: string;
  osm_type: "node";
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
};

const updateLatLon = async () => {
  const houses = await db.house.findMany({
    where: {
      locationId: 12,
    },
    include: {
      Location: true,
      Street: true,
    },
  });
  for (const house of houses) {
    const address = `${house.streetNumber} ${house.Street.name}`;
    // const response: PlaceInfo = await fetch(
    //   `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    // );
    // const data = await response.json();
    // await db.house.update({
    //   where: { id: house.id },
    //   data: {
    //     lat: response.lat,
    //     lon: response.lon,
    //   },
    // });
    console.log(address);
  }
};
