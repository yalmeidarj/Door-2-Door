import { defaultValues } from "@/lib/utils";
import { getAllLocationsStats, getLocationsStats } from "@/lib/infolocation/helperFunctions";
import { getAllLocationIds } from "@/app/actions/actions";


// Assuming this is the type of your successful response
type LocationStats = {
    isDeleted: boolean | undefined;
    name: string;
    totalHouses: number;
    totalHousesWithConsent: number;
    totalHousesWithConsentYes: number;
    totalHousesWithConsentNo: number;
    totalHousesVisited: number;
    totalHousesNonExistent: number;
    percentageHousesWithConsentYes: number;
    percentageHousesWithConsentNo: number;
    percentageHousesVisited: number;
    totalHousesVisitRequired: number;
    toBeVisited: number;
};

type ErrorResponse = {
    error: string;
};


export default async function InfoFeed({ isActive }: { isActive: boolean }) {

    const { defaultPage, defaultPerPage } = defaultValues
    const start = (Number(defaultPage) - 1) * Number(defaultPerPage)

    const allIds = await getAllLocationIds(isActive);

    if ('error' in allIds) {
        return <div>Error: {allIds.error}</div>;
    }

    const fetchStatsPromises = await getAllLocationsStats(isActive);

    if ('error' in fetchStatsPromises) {
        return <div>Error: {fetchStatsPromises.error}</div>;
    }



    const allStats = await Promise.all(fetchStatsPromises);

    function getCardClassName(number: number) {
        switch (true) {
            case (number >= 75):
                return "text-green-500";
            case (number > 50):
                return "text-blue-500";
            case (number > 20):
                return "text-red-500";
        }
    }


    return (
        <div className='flex flex-col gap-4 mx-auto items-center '>
            <InfoConditionalFormat />
        <div className='flex justify-evenly flex-wrap flex-row gap-0 items-center '>
            {
                allStats.map((location, index) => {
                    if ("totalHouses" in location) {
                        return (
                            <>
                                <InfoLocationCard
                                    key={index}
                                    location={location}
                                />
                            </>
                        )
                    } else {
                        // Handle error response
                        return <div key={index}>Error: {location.error}</div>;
                    }
                })
            }
        </div>
        </div>
    );
}

function InfoLocationCard({ location }: { location: LocationStats }) {
    
    const getConsentYesColor = (percentage:number) => {
        if (percentage > 83) {
            return 'bg-green-500 text-white';
        } else if (percentage >= 70 && percentage <= 83) {
            return 'bg-yellow-500 text-white';
        } else {
            return 'bg-red-500 text-white';
        }
    };

    return (
        <div className="p-3 mb-6 bg-white shadow rounded-lg text-sm border border-gray-200 ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{location.name}</h2>
                {location.isDeleted && (
                    <span className="flex items-center text-red-500">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                        Not Active
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 text-gray-700">
                <div className=" w-full flex flex-col">
                <div className={`flex justify-between items-center w-full`}>
                    <p>Total Houses:</p>
                    <p className="font-medium text-gray-900">{location.totalHouses}</p>
                </div>
                    <div className={`${getConsentYesColor(location.percentageHousesWithConsentYes)} flex justify-between items-center w-full`}>
                        <p className={`px-2 py-1 rounded font-semibold`}>
                            Consent Yes:
                        </p>
                        <p className={` px-2 py-1 rounded text-center font-semibold`}>
                            {location.totalHousesWithConsentYes} | {location.percentageHousesWithConsentYes}%
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>Consent No:</p>
                        <p className="font-medium text-gray-900">{location.totalHousesWithConsentNo} | {location.percentageHousesWithConsentNo}%</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <p>Total with Consent:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesWithConsent}</p>
                </div>

                <div className="flex justify-between">
                    <p>Houses Visited:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesVisited} | {location.percentageHousesVisited}%</p>
                </div>
                <div className="flex justify-between">
                    <p>Visit Required:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesVisitRequired}</p>
                </div>

                {/* <div className="flex justify-between">
                    <p>To be Visited:</p>
                    <p className="font-medium text-gray-900">{location.toBeVisited}</p>
                </div> */}

                <div className="flex justify-between">
                    <p>Non-exist.:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesNonExistent}</p>
                </div>
            </div>
        </div>
    );
}


function InfoConditionalFormat() {
    return (
        <div className="p-2 mb-4 bg-gray-100 shadow rounded-lg text-xs">
            <h3 className="text-md font-semibold mb-2">Conditional Format Rules</h3>
            <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
                <span className="text-gray-700">{'>'} 83%</span>
            </div>
            <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>
                <span className="text-gray-700">70% - 83%</span>
            </div>
            <div className="flex items-center">
                <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
                <span className="text-gray-700">{'<'} 70%</span>
            </div>
        </div>
    );
}
