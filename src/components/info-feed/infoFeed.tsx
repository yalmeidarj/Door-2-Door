"use client"

import { useMutation, useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import LoadingSpinner from "../LoadingSpinner";
import SiteSwitchButton from "../SiteSwitch";
import { Switch } from "../ui/switch";
import { BiMoney } from "react-icons/bi";
import { MdPaid } from "react-icons/md";
import { FaBullseye } from "react-icons/fa6";

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

    return (
            <>
            <InfoConditionalFormat />
        <div className='flex flex-wrap w-full gap-2.5 mx-auto items-center '>
            {sites?.map((site) => (
                <InfoLocationCard key={site._id} siteId={site._id} />
            ))
        }
        </div>
        </>
    );
}
function calculatePercentage(portion: number, total: number): number {
    if (!total) {
        return 0;
    }
    const percentage = (portion / total) * 100;
    return parseFloat(percentage.toFixed(2));
}

// function InfoLocationCard({ siteId }: { siteId: string }) {
//     const site = useQuery(api.site.getSiteById, { id: siteId });
//     const siteStats = useQuery(api.house.getHouseStatsBySiteId, { siteId: siteId });
//     const houses = useQuery(api.house.getHousesBySiteId, { siteId: siteId });
//     const consentYesHouses = useQuery(api.house.getHousesConsentYesBySiteId, { siteId: siteId });
//     const consentNoHouses = useQuery(api.house.getHousesConsentNoBySiteId, { siteId: siteId });
//     const visitRequestHouses = useQuery(api.house.getHousesVisitRequestBySiteId, { siteId: siteId });
//     const nonExistHouses = useQuery(api.house.getHousesNonExistBySiteId, { siteId: siteId });

//     if (!siteStats || !site) {
//         return <LoadingSpinner />;
//     }

//     if (!houses || !consentYesHouses || !consentNoHouses || !visitRequestHouses || !nonExistHouses) {
//         return <LoadingSpinner />;
//     }

//     const totalHouses = houses.length;
//     const consentYesCount = consentYesHouses.length;
//     const consentNoCount = consentNoHouses.length;
//     const visitRequestCount = visitRequestHouses.length;
//     const nonExistCount = nonExistHouses.length;
//     const visitedCount = consentNoCount + consentYesCount + visitRequestCount;

//     const stillNeedsToBeVisited = totalHouses - visitedCount;
//     const consentYesPercent = calculatePercentage(consentYesCount, totalHouses);
//     const consentNoPercent = calculatePercentage(consentNoCount, totalHouses);

//     const getConsentYesColor = (percentage: number) => {
//         if (percentage > 83) {
//             return 'bg-green-500 text-white';
//         } else if (percentage >= 70 && percentage <= 83) {
//             return 'bg-yellow-500 text-white';
//         } else {
//             return 'bg-red-500 text-white';
//         }
//     };

//     const getBgColor = (payStatus: boolean | undefined) => {
//         if (payStatus === undefined) {
//             return 'bg-gray-200';
//         }
//         switch (payStatus) {
//             case true:
//                 return 'bg-green-200';
//             case false:
//                 return 'bg-red-200 text-night';
//             default:
//                 return 'bg-blue-100 text-white';
//         }
//     };

//     return (
//         <div className={`${getBgColor(site.payStatus)} p-4 mb-2 shadow rounded-lg text-sm border border-gray-200`}>
//             {/* Header section with improved alignment */}
//             <div className="flex items-start justify-between mb-1">
//                 <h2 className="text-lg font-bold text-gray-900">{site.name}</h2>
//                 <div className="flex flex-col items-end space-y-1">
//                     <div className="flex items-center gap-2">
//                         <span className={`text-xs ${site.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
//                             {site.isActive ? '' : ''}
//                         </span>
//                         <SiteSwitchButton
//                             className={site.isActive ? "data-[state=checked]:bg-green-700" : "data-[state=unchecked]:bg-red-400"}
//                             site={site}
//                         />
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <span className={`text-xs font-medium ${site.payStatus === true ? 'text-green-600' :
//                                 site.payStatus === false ? 'text-red-600' : 'text-gray-600'
//                             }`}>
//                             {site.payStatus === true ? '' :
//                                 site.payStatus === false ? '' : ' '}
//                         </span>
//                         <SwitchPayStatusButton
//                             className={
//                                 site.payStatus === true ? "data-[state=checked]:bg-green-700" :
//                                     site.payStatus === false ? "data-[state=unchecked]:bg-red-400" :
//                                         "data-[state=undefined]:bg-gray-200"
//                             }
//                             site={site}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Stats section with consistent spacing */}
//             <div className="bg-white rounded-md shadow-sm overflow-hidden">
//                 {/* Total Houses - Header row */}
//                 <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//                     <div className="flex justify-between items-center">
//                         <p className="font-semibold text-gray-700">Total Houses:</p>
//                         <p className="font-bold text-gray-900">{totalHouses}</p>
//                     </div>
//                 </div>

//                 {/* Consent Yes - Highlighted row */}
//                 <div className={`${getConsentYesColor(consentYesPercent)} px-4 py-3`}>
//                     <div className="flex justify-between items-center">
//                         <p className="font-semibold">Consent Yes:</p>
//                         <p className="font-bold">{consentYesCount} | {consentYesPercent}%</p>
//                     </div>
//                 </div>

//                 {/* Other stats - Consistent rows */}
//                 <div className="px-4 py-2 border-b border-gray-100">
//                     <div className="flex justify-between items-center">
//                         <p className="text-gray-700">Consent No:</p>
//                         <p className="font-medium text-gray-900">{consentNoCount} | {consentNoPercent}%</p>
//                     </div>
//                 </div>

//                 <div className="px-4 py-2 border-b border-gray-100">
//                     <div className="flex justify-between items-center">
//                         <p className="text-gray-700">Left to Visit:</p>
//                         <p className="font-medium text-gray-900">{stillNeedsToBeVisited}</p>
//                     </div>
//                 </div>

//                 <div className="px-4 py-2 border-b border-gray-100">
//                     <div className="flex justify-between items-center">
//                         <p className="text-gray-700">Visit Required:</p>
//                         <p className="font-medium text-gray-900">{visitRequestCount}</p>
//                     </div>
//                 </div>

//                 <div className="px-4 py-2">
//                     <div className="flex justify-between items-center">
//                         <p className="text-gray-700">Non-existent:</p>
//                         <p className="font-medium text-gray-900">{nonExistCount}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
function InfoLocationCard({ siteId }: { siteId: string }) {
    const site = useQuery(api.site.getSiteById, { id: siteId });
    const siteStats = useQuery(api.house.getHouseStatsBySiteId, { siteId: siteId });
    const houses = useQuery(api.house.getHousesBySiteId, { siteId: siteId });
    const consentYesHouses = useQuery(api.house.getHousesConsentYesBySiteId, { siteId: siteId });
    const consentNoHouses = useQuery(api.house.getHousesConsentNoBySiteId, { siteId: siteId });
    const visitRequestHouses = useQuery(api.house.getHousesVisitRequestBySiteId, { siteId: siteId });
    const nonExistHouses = useQuery(api.house.getHousesNonExistBySiteId, { siteId: siteId });

    if (!siteStats || !site) {
        return <LoadingSpinner />;
    }

    if (!houses || !consentYesHouses || !consentNoHouses || !visitRequestHouses || !nonExistHouses) {
        return <LoadingSpinner />;
    }

    const totalHouses = houses.length;
    const consentYesCount = consentYesHouses.length;
    const consentNoCount = consentNoHouses.length;
    const visitRequestCount = visitRequestHouses.length;
    const nonExistCount = nonExistHouses.length;
    const visitedCount = consentNoCount + consentYesCount + visitRequestCount;

    const stillNeedsToBeVisited = totalHouses - visitedCount;
    const consentYesPercent = calculatePercentage(consentYesCount, totalHouses);
    const consentNoPercent = calculatePercentage(consentNoCount, totalHouses);

    const getConsentYesColor = (percentage: number) => {
        if (percentage > 83) {
            return 'bg-green-500 text-white';
        } else if (percentage >= 70 && percentage <= 83) {
            return 'bg-yellow-500 text-white';
        } else {
            return 'bg-red-500 text-white';
        }
    };

    const getBgColor = (isActive: boolean | undefined) => {
        if (isActive === undefined) {
            return 'bg-gray-200';
        }
        switch (isActive) {
            case true:
                return 'bg-green-200';
            case false:
                return 'bg-red-200 text-night';
            default:
                return 'bg-blue-100 text-white';
        }
    };

    return (
        <div className={`${getBgColor(site.isActive)} p-4 mb-2 shadow rounded-lg text-sm border border-gray-200 relative`}>

            {/* Header section with improved alignment */}
            <div className="flex items-start justify-between mb-1">
                <div className="flex flex-col items-start gap-2">
                <h2 className={`text-lg font-bold text-gray-900`}>{site.name}</h2>
                    <h3 className={`text-sm font-medium bg-gray-100 px-2 w-full text-center rounded-lg text-gray-600 ${site.isActive ? 'invisible' : 'visible'}`}>Inactive</h3>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${site.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {site.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <SiteSwitchButton
                            className={site.isActive ? "data-[state=checked]:bg-green-700" : "data-[state=unchecked]:bg-red-400"}
                            site={site}
                        />
                    </div>
                        <SwitchPayStatusButton
                            className={
                                `bg-white                                
                                    site.payStatus === false ? "data-[state=unchecked]:bg-red-400" :
                                        data-[state=undefined]:bg-gray-200`
                            }
                            site={site}
                        />
                </div>
            </div>

            {/* Stats section with consistent spacing */}
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
                {/* Total Houses - Header row */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-700">Total Houses:</p>
                        <p className="font-bold text-gray-900">{totalHouses}</p>
                    </div>
                </div>

                {/* Consent Yes - Highlighted row */}
                <div className={`${getConsentYesColor(consentYesPercent)} px-4 py-3`}>
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Consent Yes:</p>
                        <p className="font-bold">{consentYesCount} | {consentYesPercent}%</p>
                    </div>
                </div>

                {/* Other stats - Consistent rows */}
                <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Consent No:</p>
                        <p className="font-medium text-gray-900">{consentNoCount} | {consentNoPercent}%</p>
                    </div>
                </div>

                <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Left to Visit:</p>
                        <p className="font-medium text-gray-900">{stillNeedsToBeVisited}</p>
                    </div>
                </div>

                <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Visit Required:</p>
                        <p className="font-medium text-gray-900">{visitRequestCount}</p>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Non-existent:</p>
                        <p className="font-medium text-gray-900">{nonExistCount}</p>
                    </div>
                </div>
            </div>

            {/* Active Site Visual Indicator - Border highlight */}            
            {/* <div className={`absolute inset-0 border-4  hover:border-green-500 rounded-lg pointer-events-none opacity-60`}></div> */}
            
        </div>
    );
}

function SwitchPayStatusButton({ site, className }: { site: any; className?: string }) {
    const SwitchPayStatus = useMutation(api.site.changeSitePayStatus);
    const payStatus = site.payStatus;

    async function onSubmit(status: boolean) {
        console.log('Switching pay status to:', status);
        try {
            await SwitchPayStatus({
                siteID: site._id,
                orgID: site.orgID,
                payStatus: status
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    // Fix the logic to handle undefined correctly
    const nextStatus = payStatus === true ? false : true;

    return (
        <button
        onClick={() => onSubmit(nextStatus)}
            className={`p-1 rounded-sm flex items-center gap-2 text-white
                    ${payStatus === false ? 'bg-red-700' : payStatus === true ? 'bg-green-700' : 'bg-gray-700'}                         `
        }>

            <span
            >
                {payStatus === true ? 'Paid' :
                    payStatus === false ? 'Not paid' : 'Not invoiced'}
            </span>
        <div
            className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${className}`}
        >
            {payStatus === undefined || payStatus === null ? (
                <BiMoney className="w-4 h-4 text-gray-600" />
            ) : payStatus === true ? (
                <MdPaid className="w-4 h-4 text-green-500" />
            ) : (
                <MdPaid className="w-4 h-4 text-red-500" />
            )}
            </div>
        </button>
    );
}

function InfoConditionalFormat() {
    return (
        <div className="p-2 mb-4 flex max-w-max justify-center gap-4 bg-gray-100 shadow rounded-lg text-xs">
            <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
                <span className="text-gray-700">{'>'} 83%</span>
            </div> |
            <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>
                <span className="text-gray-700">70% - 83%</span>
            </div> |
            <div className="flex items-center">
                <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
                <span className="text-gray-700">{'<'} 70%</span>
            </div>
        </div>
    );
}