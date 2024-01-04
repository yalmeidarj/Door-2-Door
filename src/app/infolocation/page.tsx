import { defaultValues } from "@/lib/utils";
import { getAllLocationIds, getLocationsStats } from "../actions/actions"


export default async function Page() {

    const { defaultPage, defaultPerPage } = defaultValues
    const start = (Number(defaultPage) - 1) * Number(defaultPerPage)

    const allIds = await getAllLocationIds();

    if ('error' in allIds) {
        return <div>Error: {allIds.error}</div>;
    }

    const fetchStatsPromises = allIds.map(id =>
        getLocationsStats(id.id)
    );

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
        <div className="flex flex-col items-center p-4 bg-gray-100">
            <h1 className="text-xl font-semibold mb-4">STATS:</h1>
            {allStats.map((location, index) => (
                <div key={index} className="p-4 mb-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold">{location.name ?? ''}</h2>
                    <p className="text-gray-600">Total Houses: {location.totalHouses}</p>
                    <p className="text-gray-600">Houses with Consent: {location.totalHousesWithConsent}</p>
                    <p className="text-gray-600">Consent Yes: {location.totalHousesWithConsentYes} | 
                    <span className={`${getCardClassName(location.percentageHousesWithConsentYes)}`}>{location.percentageHousesWithConsentYes}%</span>
                    </p>
                    <p className="text-gray-600">Consent No: {location.totalHousesWithConsentNo} | 
                        <span className="text-red-500">{location.percentageHousesWithConsentNo}%</span>
                    </p>
                    <p className="text-gray-600">Houses Visited: {location.totalHousesVisited} | 
                        <span className={`${getCardClassName(location.percentageHousesVisited)}`}>{location.percentageHousesVisited}%</span>
                    </p>
                    <p className="text-gray-600">Non-existent Houses: {location.totalHousesNonExistent}</p>
                </div>
            ))}
        </div>
    );
}

