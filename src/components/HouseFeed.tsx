import { getHousesInStreet, isAgentClockedIn } from "@/lib/houses/helperFunctions";
import { HouseFeedData, HouseType } from "@/lib/houses/types";
import HouseItem from "./HouseItem";
import PaginationControls from "./PaginationControls";
import FilterControls from "./FilterControls";

export default async function HousesFeed({ feed }: HouseFeedData) {
    const { id, start, perPage, userId, viewAll } = feed

    const housesInStreet = await getHousesInStreet(id, start, perPage, viewAll )

    if (!housesInStreet || !housesInStreet.data) {
        return <div>loading...</div>
    }

    const isClockedIn = await isAgentClockedIn(userId);

    let isClockedInLocationId = true
    if (isClockedIn.locationId !== housesInStreet.data.houses[0].locationId) {
        isClockedInLocationId = false
    }



    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: Number(start),
        },
        data:
            housesInStreet.metadata
    }

    return (
        <>
            <PaginationControls
                metadata={paginationControls}
            />
            <FilterControls />
            <div className='flex flex-col   justify-center '>
                {housesInStreet.data.houses.map((house: HouseType) => (
                        <HouseItem
                            key={house.id}
                            house={house}
                            activeShift={isClockedInLocationId}                       
                        />
                    ))}
            </div>
            <PaginationControls
                metadata={paginationControls}
            />
        </>
    )
}




