import { getHousesInStreet, isAgentClockedIn } from "@/lib/houses/helperFunctions";
import { HouseFeedData } from "@/lib/houses/types";
import HouseItem from "./HouseItem";
import PaginationControls from "./PaginationControls";

export default async function HousesFeed({ feed }: HouseFeedData) {
    const { id, start, perPage, userId } = feed

    const housesInStreet = await getHousesInStreet(id, start, perPage)

    if (!housesInStreet || !housesInStreet.data) {
        return <div>loading...</div>
    }

    const isClockedIn = await isAgentClockedIn(userId) as boolean;

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
            <div className='flex flex-col   justify-center '>
                    {housesInStreet.data.houses.map((house) => (
                        <HouseItem
                            key={house.id}
                            house={house}
                            activeShift={isClockedIn}                        
                        />
                    ))}
              </div>
        </>
    )
}




