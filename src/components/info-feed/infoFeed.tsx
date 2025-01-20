"use client"

import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import LoadingSpinner from "../LoadingSpinner";

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


export default function InfoFeed() {
    const pathname = usePathname();
    const orgName = pathname.split("/")[2]
    const org = useQuery(api.organization.getOrgByName, { name: orgName });
    if (!org) {
        return (
            <LoadingSpinner />
        );
    }
    const orgId = org._id;
    const sites = useQuery(api.site.getAllSitesByOrgId, { orgID: orgId });





    // const allStats = await Promise.all(fetchStatsPromises);

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
        <div className='flex flex-wrap w-full gap-2.5 mx-auto items-center '>
            {sites?.map((site) => (
                <InfoLocationCard key={site._id} siteId={site._id} />
            ))
            }
        </div>
    );
}

function InfoLocationCard({ siteId }: { siteId: string }) {
    const site = useQuery(api.site.getSiteById, { id: siteId });
    const siteStats = useQuery(api.house.getHouseStatsBySiteId, { siteId: siteId });
    if (!siteStats || !site) {
        
        return (
            <LoadingSpinner />
        );
    }
    const getConsentYesColor = (percentage: number) => {
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
                <h2 className="text-lg font-semibold">{site.name}</h2>
                {site.isActive && (
                    <span className="flex items-center text-xs text-red-500">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-0.5"></span>
                        Not Active
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 text-gray-700">
                <div className=" w-full flex flex-col">
                    <div className={`flex justify-between items-center w-full`}>
                        <p>Total Houses:</p>
                        <p className="font-medium text-gray-900">{siteStats.totalHouses}</p>
                    </div>
                    <div className={`${getConsentYesColor(siteStats.consentYes)} flex justify-between items-center w-full`}>
                        <p className={`px-2 py-1 rounded font-semibold`}>
                            Consent Yes:
                        </p>
                        <p className={` px-2 py-1 rounded text-center font-semibold`}>
                            {siteStats.consentYes} | {siteStats.consentYes}%
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>Consent No:</p>
                        <p className="font-medium text-gray-900">{siteStats.consentNo} | {siteStats.consentNo}%</p>
                    </div>
                </div>
                {/* <div className="flex justify-between">
                    <p>Total with Consent:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesWithConsent}</p>
                </div> */}

                {/* <div className="flex justify-between">
                    <p>Houses Visited:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesVisited} | {location.percentageHousesVisited}%</p>
                </div> */}

                {/* <div className="flex justify-between">
                    <p>Left to Visit:</p>
                    <p className="font-medium text-gray-900">{siteStats.toBeVisited}</p>
                </div> */}

                <div className="flex justify-between">
                    <p>Visit Required:</p>
                    <p className="font-medium text-gray-900">{siteStats.visitRequired}</p>
                </div>


                {/* <div className="flex justify-between">
                    <p>Non-exist.:</p>
                    <p className="font-medium text-gray-900">{location.totalHousesNonExistent}</p>
                </div> */}
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