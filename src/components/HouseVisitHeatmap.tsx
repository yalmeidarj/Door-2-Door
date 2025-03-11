"use client";
import React, { JSX, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { usePathname } from "next/navigation";

// Type for house edit logs.
type HouseEditLog = {
    _id: string;
    _creationTime: number;
    houseId?: string;
};

// Type for a house document (from the "house" table).
type House = {
    _id: string;
    streetNumber: string;
    streetName?: string;
    name?: string;
};

// Helper type for detailed bucket data.
type BucketData = { count: number; times: number[] };
type BucketCounts = {
    Morning: BucketData;
    Afternoon: BucketData;
    Evening: BucketData;
    Night: BucketData;
};

type HouseVisitHeatmapProps = {
    siteId: Id<"site">;
};

const MapTable: React.FC<HouseVisitHeatmapProps> = ({ siteId }) => {
    // Query house visit logs using the provided siteId.
    const houseEditLogs = useQuery(api.houseEditLog.getAllHouseVisitsBySiteId, { siteId }) as
        | HouseEditLog[]
        | undefined;
    // Query houses for the given site to build an address lookup.
    const houses = useQuery(api.house.getHousesToBeVisitedBySiteId, { siteId }) as House[] | undefined;

    if (!houseEditLogs || !houses) {
        return <div>Loading...</div>;
    }

    // Build a lookup: houseId → address.
    const houseAddresses: Record<string, string> = {};
    houses.forEach((house) => {
        const address =
            house.streetNumber && house.streetName
                ? `${house.streetNumber} ${house.streetName}`
                : house.name || "Unknown Address";
        houseAddresses[house._id] = address;
    });

    // Initialize houseVisits for every house (even if no logs exist).
    const defaultCounts: BucketCounts = {
        Morning: { count: 0, times: [] },
        Afternoon: { count: 0, times: [] },
        Evening: { count: 0, times: [] },
        Night: { count: 0, times: [] },
    };

    // Create a record for each house.
    const houseVisits: Record<string, BucketCounts> = {};
    houses.forEach((house) => {
        houseVisits[house._id] = {
            Morning: { count: 0, times: [] },
            Afternoon: { count: 0, times: [] },
            Evening: { count: 0, times: [] },
            Night: { count: 0, times: [] },
        };
    });

    // Helper: assign a time bucket based on the hour.
    const getTimeBucket = (
        hour: number
    ): "Morning" | "Afternoon" | "Evening" | "Night" => {
        if (hour >= 6 && hour < 12) {
            return "Morning";
        } else if (hour >= 12 && hour < 18) {
            return "Afternoon";
        } else if (hour >= 18 && hour < 24) {
            return "Evening";
        } else {
            return "Night";
        }
    };

    // Process each house edit log and update the corresponding house.
    houseEditLogs.forEach((log) => {
        const houseKey = log.houseId;
        if (houseKey && houseVisits[houseKey]) {
            const hour = new Date(log._creationTime).getHours();
            const bucket = getTimeBucket(hour);
            houseVisits[houseKey][bucket].count += 1;
            houseVisits[houseKey][bucket].times.push(log._creationTime);
        }
        // Optionally handle logs with no houseId if needed.
    });

    // Define the order of buckets.
    const buckets: Array<keyof BucketCounts> = [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
    ];

    // Compute the next recommended visit time slot.
    const getNextVisitRecommendation = (counts: BucketCounts): string => {
        for (const bucket of buckets) {
            if (counts[bucket].count === 0) {
                return bucket;
            }
        }
        return "Night";
    };

    // Helper function to group times by date
    const groupTimesByDate = (times: number[]): Record<string, string[]> => {
        const grouped: Record<string, string[]> = {};

        times.forEach(timestamp => {
            const dateObj = new Date(timestamp);
            const shortDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            const time = dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

            if (!grouped[shortDate]) {
                grouped[shortDate] = [];
            }

            grouped[shortDate].push(time);
        });

        return grouped;
    };

    // Helper function to format grouped times for tooltip with alternating colors
    const formatGroupedTimesWithColors = (groupedTimes: Record<string, string[]>): JSX.Element => {
        const entries = Object.entries(groupedTimes);

        return (
            <div className="flex flex-col gap-1">
                {entries.map(([date, times], index) => (
                    <div
                        key={date}
                        className={`px-1 py-0.5 rounded ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}
                    >
                        <span className="font-semibold">{date}:</span>
                        <div className="pl-2">{times.join(", ")}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">House Visit Heatmap</h1>
            <p className="mb-4 text-gray-600">
                This table shows when each house was visited (by time of day) and suggests the next visit time.
            </p>
            {/* Set overflow-visible to allow tooltips to extend outside */}
            <div className="overflow-x-auto" style={{ overflow: 'visible' }}>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Address</th>
                            {buckets.map((bucket) => (
                                <th key={bucket} className="py-2 px-4 border-b">
                                    {bucket}
                                </th>
                            ))}
                            <th className="py-2 px-4 border-b">Next Recommended Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses.map((house) => {
                            const counts = houseVisits[house._id] || defaultCounts;
                            const nextVisit = getNextVisitRecommendation(counts);
                            const address = houseAddresses[house._id] || "Unknown Address";
                            return (
                                <tr key={house._id} className="text-center">
                                    <td className="py-2 px-4 border-b">{address}</td>
                                    {buckets.map((bucket) => {
                                        const bucketData = counts[bucket];
                                        // Sort times in ascending order.
                                        const sortedTimes = bucketData.times.sort((a, b) => a - b);

                                        // Group times by date
                                        const groupedTimes = groupTimesByDate(sortedTimes);

                                        return (
                                            <td key={bucket} className="py-2 px-4 border-b">
                                                {/* Relative positioning on this div for tooltip anchoring */}
                                                <div className="relative group">
                                                    <div
                                                        className={`w-10 h-10 flex items-center justify-center rounded ${bucketData.count > 0 ? "bg-blue-200" : "bg-gray-100"
                                                            }`}
                                                    >
                                                        {bucketData.count > 0 ? bucketData.count : "-"}
                                                    </div>

                                                    {/* Fixed position tooltip with alternating row colors */}
                                                    {bucketData.count > 0 && (
                                                        <div
                                                            className="fixed z-50 bg-gray-800 text-white p-2 rounded shadow-lg
                                                                    text-sm max-w-xs opacity-0 invisible 
                                                                    group-hover:opacity-100 group-hover:visible transition-opacity duration-200"
                                                            style={{
                                                                transform: 'translate(-50%, -100%)',
                                                                marginBottom: '10px',
                                                                pointerEvents: 'none'
                                                            }}
                                                        >
                                                            {formatGroupedTimesWithColors(groupedTimes)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="py-2 px-4 border-b">
                                        <span className="font-semibold text-green-600">
                                            {nextVisit}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
                Tip: Hover over a cell to see the exact visit times.
            </p>
        </div>
    );
};

const HouseVisitHeatmap: React.FC = () => {
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    // Query active sites for the given organization.
    const sites = useQuery(api.site.getActiveSitesByOrgName, { orgName }) as
        | Array<{ _id: Id<"site">; name: string }>
        | undefined;

    const [selectedSiteId, setSelectedSiteId] = useState<Id<"site"> | "">("");

    if (!sites) {
        return <div>Loading sites...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Select a Site</h2>
            <select
                className="p-2 border border-gray-300 rounded mb-4"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value as Id<"site">)}
            >
                <option value="">Select a site</option>
                {sites.map((site) => (
                    <option key={site._id} value={site._id}>
                        {site.name}
                    </option>
                ))}
            </select>

            {/* Render the heatmap only if a site has been selected */}
            {selectedSiteId && <MapTable siteId={selectedSiteId} />}
        </div>
    );
};

export default HouseVisitHeatmap;
