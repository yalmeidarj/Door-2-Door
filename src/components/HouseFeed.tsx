"use client"
import HouseItem from "./HouseItem";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge";
import MapDialog from "./maps/MapDialog";
import { sampleResultsData } from "@/lib/sampleData";
import dynamic from "next/dynamic";


// Place this dynamic import outside of your component, at the top level
const AddressMap = dynamic(
    () => import('./maps/AddressMap'),
    {
        ssr: false,
        loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />
    }
);

export default function HousesFeed({
    streetId,
    userId,
}: {
    streetId: string;
    userId: string;
    }) {

    // Control the displayed data from here based on selected filter
    const [selectedFilter, setSelectedFilter] = useState<string>("To be visited");

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <Filters selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} />
            {/* Grid Section */}
            {selectedFilter === "To be visited" && (
                <HousesToBeVisited
                    streetId={streetId}
                    userId={userId}                    
                />
            )}
            {selectedFilter === "Consent Final" && (                
                <HousesConsentFinal
                    streetId={streetId}
                    userId={userId}                    
                />
            )}
            {/* If the selected filter is none of the predefined ones, treat it as a custom status */}
            {selectedFilter && selectedFilter !== "To be visited" && selectedFilter !== "Consent Final" && (                
                <HousesCustomStatus
                    streetId={streetId}
                    userId={userId}
                    status={selectedFilter}
                />
            )}
            {/* <MapDialog results={sampleResultsData} /> */}
        </div>
    );
}

/////////// HELPER COMPONENTS ///////////

const PREDEFINED_STATUSES = [
    "To be visited",
    "Consent Final",
];

const STATUS_ATTEMPTS = [
    "Door Knock Attempt 1",
    "Door Knock Attempt 2",
    "Door Knock Attempt 3",
    "Door Knock Attempt 4",
    "Door Knock Attempt 5",
    "Door Knock Attempt 6",
    "Home does not exist",
    "Engineer Visit Required",
    "Consent Final Yes",
    "Consent Final No",
];

function Filters({
    selectedFilter,
    onFilterSelect,
}: {
    selectedFilter: string;
    onFilterSelect: (filter: string) => void;
}) {
    // selectedFilter is a single string representing the currently selected status
    // Allow user to choose from PREDEFINED_STATUSES or from STATUS_ATTEMPTS (custom)

    const handleStatusSelect = (status: string) => {
        onFilterSelect(status);
    };

    return (
        <div className="container rounded-md bg-night text-white mx-auto ml-4 flex flex-row-wrap items-center justify-between py-2">
            <div className="w-full flex gap-2 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-white">
                        Select <span className="group text-sm font-semibold">Status</span>
                        <IoIosArrowDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Predefined Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {PREDEFINED_STATUSES.map((status) => (
                            <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusSelect(status)}
                            >
                                <span>{status}</span>
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuLabel className="mt-2">Custom Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STATUS_ATTEMPTS.map((statusAttempt) => (
                            <DropdownMenuItem
                                key={statusAttempt}
                                onClick={() => handleStatusSelect(statusAttempt)}
                            >
                                <span>{statusAttempt}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex gap-2 w-full items-center justify-end p-2">
                {selectedFilter && (
                    <Badge
                        variant="secondary"
                        className={`text-xs mr-2 cursor-pointer transition-colors ${PREDEFINED_STATUSES.includes(selectedFilter) ? "bg-yellow-200" : "bg-gray-200"
                            }`}
                        onClick={() => onFilterSelect(selectedFilter)} 
                    >
                        {selectedFilter}
                    </Badge>
                )}
            </div>
        </div>
    );
}

function HousesToBeVisited({
    streetId,
    userId,
}: {
    streetId: string;
    userId: string;
}) {
    const activeShift = useQuery(api.shiftLogger.getActiveShiftByAgentId, { agentId: userId as Id<"users"> });
    const houses = useQuery(
        api.house.getActiveHousesByStreetId,
        { streetId: streetId as Id<"street"> }
    );

    if (!houses || houses.length === 0) {
        return <NoHouses />;
    }

    let currentShift = false;
    if (activeShift?.siteID === houses[0].siteID) {
        currentShift = true;
    }

    // Create mapsData with proper typing and handle undefined case
    const mapsData = houses.map((house: any) => ({
        address: `${house.streetName} ${house.streetNumber}`,
        position: [
            parseFloat(house.latitude),
            parseFloat(house.longitude)
        ] as [number, number],
    })).filter(data =>
        !isNaN(data.position[0]) &&
        !isNaN(data.position[1])
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1 sm:gap-y-1 sm:gap-8 justify-items-center">
            {houses.map((house: any) => (
                <div key={house._id} className="w-full max-w-sm">
                    <HouseItem
                        house={house}
                        activeShift={currentShift}
                        userId={userId}
                        shiftId={activeShift?._id as Id<"shiftLogger">}
                    />
                </div>
            ))}
            <MapDialog>
                <AddressMap data={mapsData} />
            </MapDialog>
        </div>
    );
}

function HousesConsentFinal({
    streetId,
    userId,
}: {
    streetId: string;
    userId: string;
}) {
    const activeShift = useQuery(api.shiftLogger.getActiveShiftByAgentId, { agentId: userId as Id<"users"> });
    const houses = useQuery(
        api.house.getHousesConsentFinalByStreetId,
        { streetId: streetId as Id<"street"> }
    );

    if (!houses || houses.length === 0) {
        return <NoHouses />;
    }

    let currentShift = false;
    if (activeShift?.siteID === houses[0].siteID) {
        currentShift = true;
    }

    const mapsData = houses.map((house: any) => ({
        address: `${house.streetName} ${house.streetNumber}`,
        position: [
            parseFloat(house.latitude),
            parseFloat(house.longitude)
        ] as [number, number],
    })).filter(data =>
        !isNaN(data.position[0]) &&
        !isNaN(data.position[1])
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1 sm:gap-y-1 sm:gap-8 justify-items-center">
            {houses.map((house: any) => (
                <div key={house._id} className="w-full max-w-sm">
                    <HouseItem
                        house={house}
                        activeShift={currentShift}
                        userId={userId}
                        shiftId={activeShift?._id as Id<"shiftLogger">}
                    />
                </div>
            ))}
            <MapDialog>
                <AddressMap data={mapsData} />
            </MapDialog>
        </div>
    );
}

function HousesCustomStatus({
    streetId,
    userId,
    status,
}: {
    streetId: string;
    userId: string;
    status: string;
}) {
    const activeShift = useQuery(api.shiftLogger.getActiveShiftByAgentId, { agentId: userId as Id<"users"> });
    const houses = useQuery(
        api.house.getHousesByStreetIdAndStatus,
        { streetId: streetId as Id<"street">, status }
    );

    if (!houses || houses.length === 0) {
        return <NoHouses />;
    }

    let currentShift = false;
    if (activeShift?.siteID === houses[0].siteID) {
        currentShift = true;
    }

    const mapsData = houses.map((house: any) => ({
        address: `${house.streetName} ${house.streetNumber}`,
        position: [
            parseFloat(house.latitude),
            parseFloat(house.longitude)
        ] as [number, number],
    })).filter(data =>
        !isNaN(data.position[0]) &&
        !isNaN(data.position[1])
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1 sm:gap-y-1 sm:gap-8 justify-items-center">
            {houses.map((house: any) => (
                <div key={house._id} className="w-full max-w-sm">
                    <HouseItem
                        house={house}
                        activeShift={currentShift}
                        userId={userId}
                        shiftId={activeShift?._id as Id<"shiftLogger">}
                    />
                </div>
            ))}
            <MapDialog>
                <AddressMap data={mapsData} />
            </MapDialog>
        </div>
    );
}

function NoHouses() {
    return (
        <div className="w-full h-[60vh] ml-4">
            <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">No Houses Found</h1>
            <p className="text-gray-600 text-center">
                No houses found for the selected status.
            </p>
        </div>
        </div>
    );
}
