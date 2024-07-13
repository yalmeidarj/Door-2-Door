import StreetCard from "./StreetCard";
import PaginationControls from "./PaginationControls";
import { StreetFeedProps } from "@/lib/streets/types";
import { getStreetsInLocation } from "@/lib/streets/helperFunctions";

export default async function StreetFeed({ id, start, perPage }: StreetFeedProps) {
    const streetsInLocations = await getStreetsInLocation(id, start, perPage)

    if (!streetsInLocations ||
        !streetsInLocations.data ||
        !streetsInLocations.metadata
        
    ) {
        return <div>loading...</div>
    }

    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: Number(start),
        },
        data:
            streetsInLocations.metadata
    } 

    const streets =  streetsInLocations.data
    return (
        <>
            <PaginationControls
                metadata={paginationControls}
            />
            <div className="container mx-auto px-4 py-5">
                {streets.map((street: {
                    id: number;
                    name: string;
                    totalHouses: number;
                    totalHousesVisited: number;
                    totalHousesWithConsentYes: number;
                    totalHousesWithConsentNo: number;
                    totalHousesWithVisitRequired: number;
                    leftToVisit: number;
                    lastVisited: Date | null;
                }) => (
                    <>                  
                        <StreetCard key={street.id} street={street} />
                    </>                
                ))}
            </div>
            <PaginationControls
                metadata={paginationControls}
            />
        </>
    )
}