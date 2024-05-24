'use client'
import { useEffect, useState } from "react";
import HousesFeed from "./HouseFeed";

type dataProps = {
    id: string | string[];
    start: number;
    perPage: number;
    userId: string;
}

function ViewAllHousesButton({ feed }: { feed: dataProps}) {
    const [viewAll, setViewAll] = useState(false)

    useEffect(() => {
        console.log('viewAll:', viewAll);
    }, [viewAll])
    
    return (
        <>
            <button
                className='bg-blue-500 text-white p-2 rounded-md'
                onClick={() => setViewAll(!viewAll)}>
            </button>
            <HousesFeed
                data={feed}
                viewAll={viewAll}
            />
        </>
    );
}

export default ViewAllHousesButton;

  