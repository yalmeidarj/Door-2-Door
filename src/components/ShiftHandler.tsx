"use client"
import { FaClock } from "react-icons/fa6";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { MdTimer } from "react-icons/md";
import { usePathname } from "next/navigation";


export default function ShiftHandler({ userId }: { userId: string }) {
    const shifts = useQuery(api.shiftLogger.getActiveShiftByAgentId, { agentId: userId })
    
    if (!shifts) {
        return (
            <ClockIn
            clockInProps={{                
                userId: userId
            }}
            />
        );
    }


    return (
        <div className="max-w-auto h-auto ">
            <ClockOut
                clockOutProps={{
                    shiftId: shifts._id
                }}
            />
        </div>
    )
}

type ClockInProps = {  userId: string }

function ClockIn({ clockInProps }: { clockInProps: ClockInProps }) {
    const { userId } = clockInProps;
    const [selectedSite, setSelectedSite] = useState<string>('');
    const clockIn = useMutation(api.shiftLogger.createShift);

    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    const org = useQuery(api.organization.getOrgByName, { name: orgName });
    console.log("org ID: ", org?._id)

    if (!org) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">No org...</div>
        )
    }

    const sites = useQuery(api.site.getActiveSitesByOrgId, { orgID: org._id });


    if (!sites) {
        return <div>Loading sites...</div>;
    }
    if (!Array.isArray(sites) || sites.length === 0) {
        
        return <div>No active sites...</div>;
    }
    const handleSiteSelect = (value: string) => {
        setSelectedSite(value);
    };


    const handleSubmit = () => {
        const agentId = userId as Id<"users">;
        const siteId = selectedSite as Id<"site">;
        console.log('Clocking in at site:', selectedSite);
        clockIn({ siteID: siteId, agentId: agentId, orgID: org._id });
    };

    return (
        <div className="">
            <div className="flex justify-between items-center gap-2 mb-2">
                <FaClock className="text-night" />
                <Select onValueChange={handleSiteSelect}>
                    <SelectTrigger className="bg-night text-white w-[180px] h-[25px] text-sm hover:bg-slate-200 hover:text-night">
                        <SelectValue placeholder="Clock In" />
                    </SelectTrigger>
                    <SelectContent className="bg-night text-white">
                        {sites.map((site) => (
                            <SelectItem
                                key={site._id}
                                value={site._id}
                                className="text-xs"
                            >
                                {site.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            {selectedSite && (
                <Button
                    onClick={handleSubmit}
                    // variant="ghost"
                        className="text-white bg-green-700 text-xs h-6 px-2 py-0  hover:bg-slate-200 hover:text-night transition-colors"
                        >
                    Clock In
                </Button>
            )}
            </div>
        </div>
    );
}

type ClockOutProps = { shiftId: string }

function ClockOut({ clockOutProps }: { clockOutProps: ClockOutProps }) {
    const clockOut = useMutation(api.shiftLogger.clockOut);
    const { shiftId } = clockOutProps;

    const shift = useQuery(api.shiftLogger.getShiftById, { id: shiftId as Id<"shiftLogger"> });
    
    if (!shift) {
        return <div>Loading shift...</div>;
    }

    const formatElapsedTime = (totalHours: number) => {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);

        // Handle different display cases
        if (hours > 0 && minutes > 0) {
            return `${hours}:${minutes}h`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return '0m';
        }
    };



    const startTime = new Date(shift.startingDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const elapsedTimeInHours = shift.startingDate
        ? (Date.now() - new Date(shift.startingDate).getTime()) / 3600000
        : 0; // Ensure elapsed time is in hours
    
    const elapsedTimeInMinutes = shift.startingDate
        ? (Date.now() - new Date(shift.startingDate).getTime()) / 60000
        : 0; // Ensure elapsed time is in minutes.
    
    const houseYes = shift.updatedHousesFinal ?? 0
    const housesOthers = shift.updatedHouses ?? 0 
    const housesNo = shift.updatedHousesFinalNo ?? 0

    // Calculate pace
    const totalHouses = houseYes + housesOthers + housesNo;
    const pace = totalHouses / elapsedTimeInMinutes;
    
    const handleSubmit = async () => {
        try {
            const id = shiftId as Id<"shiftLogger">;
            const result = await clockOut({ id });
            console.log("Shift clocked out successfully:", result);
        } catch (error) {
            console.error("Error clocking out:", error);
        }
    };

    const formattedElapsedTime = formatElapsedTime(elapsedTimeInHours);


    return (
        <div className=" w-full flex flex-col mb-6 pt-5 h-full">
                <div
                    className="text-sm flex justify-between w-full items-center"
                >
                    {/* {new Date(Date.now()).toLocaleString()} */}
                {startTime}
                <div className='flex items-center gap-0.5 text-xs '>                
                <MdTimer className=' text-green-600 animate-pulse ' />
            <span className=' text-gray-500'>
                        {formattedElapsedTime}
            </span>
                </div>
            </div>
            <div className="flex justify-between items-center gap-2 ">
                <span
                    className="text-sm"
                    >
                    Pace:
                    <span className='text-xs text-gray-500'>
                        ~
                    </span>
                    {pace.toFixed(1)}
                    <span className='text-xs text-gray-500'>
                    /m
                    </span>
                </span>
            <Button
                onClick={handleSubmit}
                className="text-white bg-red-700 text-xs h-4 px-2 py-0  hover:bg-slate-200 hover:text-night transition-colors"
                >
                Clock Out
            </Button>
                </div>
        </div>
    )
}
