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
    // map through all houses in site, create addresses from street name and street number, latitude and longitude as lat and lng, and statusAttempt
    const mapsData = allHousesInSite.map((house: any) => ({
        address: `${house.streetName} ${house.streetNumber}`,
        position: [
            parseFloat(house.latitude),
            parseFloat(house.longitude)
        ] as [number, number],
        statusAttempt: house.statusAttempt
    }))

    return (
        <>
            <MapDialog>
                <AddressMap
                    data={mapsData}
                />
            </MapDialog>
        </>
    )
}