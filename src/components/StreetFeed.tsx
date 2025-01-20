"use client"
import StreetCard from "./StreetCard";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddressMap from "./maps/AddressMap";
import { Id } from "../../convex/_generated/dataModel";
import MapDialog from "./maps/MapDialog";



export default function StreetFeed({ id }: {id: string, }) {
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgUrlFormat = pathName.split("/")[2].replace("%20", " ");

    const streetsInLocations = useQuery(api.street.getStreetsBySiteId, { siteID: id })

    
    
    return (
        <>
            <div className="container flex flex-col">
            <div className="w-full flex flex-row justify-center items-center flex-wrap justify gap-4  py-5">
                {streetsInLocations?.map((street) => (
                    <Link                        
                        href={`/org/${orgUrlFormat}/houses/${street.name}?street=${street._id}&site=${street.siteID}`}
                            key={street.name}
                    className=""
                    >
                        <StreetCard
                            // key={street._id}
                            streetId={street._id}
                            name={street.name}
                        />
                    </Link >
                ))}
            </div>
                    <div>
                        
                    {<SiteMap siteId={id} />}

                </div>
            </div>
        </>
    )
}

function SiteMap({ siteId }: { siteId: string}) {
    const allHousesInSite = useQuery(api.house.getHousesBySiteId, { siteId: siteId as Id<"site"> });

    if (!allHousesInSite || !Array.isArray(allHousesInSite) || allHousesInSite.length === 0) {
        
        return <div>Loading...</div>;
    }

    // 1) Separate houses that have valid lat/lng from those that do not
    const validHouses = allHousesInSite.filter((house) => {
        return (
            house.latitude &&
            house.longitude &&
            !isNaN(parseFloat(house.latitude)) &&
            !isNaN(parseFloat(house.longitude))
        );
    });

    const invalidHouses = allHousesInSite.filter((house) => {
        // Invalid if missing latitude or longitude,
        // or parseFloat(...) is NaN
        return (
            !house.latitude ||
            !house.longitude ||
            isNaN(parseFloat(house.latitude)) ||
            isNaN(parseFloat(house.longitude))
        );
    });

    // 2) Create the data array for the AddressMap
    const mapsData = validHouses.map((house) => ({
        address: `${house.streetName} ${house.streetNumber}`,
        position: [parseFloat(house.latitude as string), parseFloat(house.longitude as string)] as [number, number],
        statusAttempt: house.statusAttempt
    }));

    return (
        <>
            <MapDialog>
                <AddressMap data={mapsData} />
            </MapDialog>

            {/* 3) Display any houses that do not have valid lat/lng */}
            {invalidHouses.length > 0 && (
                <div className="mt-4 p-2 border rounded flex flex-col">
                    <h2 className="font-semibold text-lg mb-2">Houses Missing Coordinates</h2>
                    <span>
                    Valid Houses: {validHouses.length}
                    </span>
                    <span>
                    Total Houses:{allHousesInSite.length}
                    </span>
                    <span>
                    Invalid Houses: {invalidHouses.length}
                    </span>
                    <ul className="list-disc list-inside">
                        {invalidHouses.map((house, idx) => (
                            <li key={idx}>
                                {house.streetName} {house.streetNumber} — Latitude{" "}
                                {house.latitude }, Longitude {house.longitude}
                            </li>
                        ))}
                    </ul>
                    -----------
                    <ul className="list-disc list-inside">
                        {validHouses.map((house, idx) => (
                            <li key={idx}>
                                {house.streetName} {house.streetNumber} — Latitude{" "}
                                {house.latitude }, Longitude {house.longitude}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}