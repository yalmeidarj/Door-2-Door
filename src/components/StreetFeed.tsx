"use client"
import StreetCard from "./StreetCard";
import PaginationControls from "./PaginationControls";
import { StreetFeedProps } from "@/lib/streets/types";
import { getStreetsInLocation } from "@/lib/streets/helperFunctions";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function StreetFeed({ id }: {id: string, }) {
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgUrlFormat = pathName.split("/")[2].replace("%20", " ");

    const streetsInLocations = useQuery(api.street.getStreetsBySiteId, { siteID: id })

    
    return (
        <>
                <div className="container flex flex-row justify-center items-center flex-wrap justify gap-4  py-5">
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
                <div>
                    {/* {getVisitedHousesByStatusAttempt?.map((house) => (
                        <div key={house._id}>
                            {house.statusAttempt}
                        </div>  
                    ))} */}
                </div>
            </div>
        </>
    )
}