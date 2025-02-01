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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdTimer } from "react-icons/md";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
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
        <ClockOut
            clockOutProps={{
                shiftId: shifts._id
            }}
        />
    )
}

type ClockInProps = {  userId: string }

function ClockIn({ clockInProps }: { clockInProps: ClockInProps }) {
    const { userId } = clockInProps;
    const [selectedSite, setSelectedSite] = useState<string>('');
    const clockIn = useMutation(api.shiftLogger.createShift);
    const user = useQuery(api.users.getUserById, { id: userId as Id<"users"> });
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    const org = useQuery(api.organization.getOrgByName, { name: orgName });
    console.log("org ID: ", org?._id)

    // if (user?.inactivityBlocked) {
    //     return (
    //         <BlockedAgent />            
    //     )
    // }

    if (!org) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">No org...</div>
        )
    }

    const sites = useQuery(api.site.getActiveSitesByOrgId, { orgID: org._id });


    if (!sites || !user){
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
        <>
            {user.inactivityBlocked ? (
                <BlockedAgent />
            ) : (
                <div className="mt-2">
                    <div className="flex justify-between items-center gap-2 mb-2">
                        <FaClock className="text-night" />
                        <Select onValueChange={handleSiteSelect}>
                            <SelectTrigger className="bg-night text-white w-[120px] h-[25px] text-sm hover:bg-slate-200 hover:text-night">
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
                                className="text-white bg-green-700 text-xs h-6 px-2 py-0 hover:bg-slate-200 hover:text-night transition-colors"
                            >
                                Clock In
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function BlockedAgent() {
    return (
        <div className="max-w-max w-full flex flex-col items-center justify-center bg-red-500 text-white p-2">
            <h1 className="text-sm">            
            Blocked By Long Inactivity
            </h1>
            <h2 className="text-xs">            
            Please contact an administrator
            </h2>
        </div>
    )
}

type ClockOutProps = { shiftId: string }

function HasBreaks({ shiftId, children }: { shiftId: string, children?: React.ReactNode }) {
    const finishBreak = useMutation(api.shiftBreaks.endBreak)
    const breaks = useQuery(api.shiftBreaks.getActiveBreakByShiftId, {
        shiftId: shiftId as Id<"shiftLogger">
    })

    let hasBreaks = true
    if (breaks === undefined || breaks === null) {
        hasBreaks = false
    }

    // if (hasBreaks && breaks?.status === "finished") {
    //     hasBreaks = false
    // }

    const handleSubmit = async () => {            
        try {            
            const finished = await finishBreak({ shiftId: breaks?._id as string as Id<"shiftBreaks"> })        
            if (finished) {
                console.log('finished break')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex gap-2">
            {hasBreaks ? 
                <>
                {breaks?.status}
                <button
                        onClick={handleSubmit}
                        className="text-white text-center pt-12 items-center justify-center
                         bg-blue-700 p-3  text-sm gap-0 flex flex-col"
                    >
                        <span>
                        Finish
                        </span>
                        {/* <span>
                            {breaks?.motive}
                        </span> */}
                        <span>
                            Break
                        </span>
                    </button>
                    </>
                : children}
        </div>
    )
}

function ClockOut({ clockOutProps }: { clockOutProps: ClockOutProps }) {
    const clockOut = useMutation(api.shiftLogger.clockOut);
    const startBreak = useMutation(api.shiftBreaks.startBreak);
    const { shiftId } = clockOutProps;

    const shift = useQuery(api.shiftLogger.getShiftById, {
        id: shiftId as Id<"shiftLogger">,
    });

    // Dropdown state
    const [selectedAction, setSelectedAction] = useState<"clockOut" | "break">();
    const [breakType, setBreakType] = useState<"general" | "transit">();
    const [transitDescription, setTransitDescription] = useState("");

    if (!shift) {
        return <div>Loading shift...</div>;
    }


    // Format time examples
    const formatElapsedTime = (totalHours: number) => {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);

        if (hours > 0 && minutes > 0) {
            return `${hours}:${minutes}h`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return "0m";
        }
    };

    const startTime = new Date(shift.startingDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const elapsedTimeInHours = shift.startingDate
        ? (Date.now() - new Date(shift.startingDate).getTime()) / 3600000
        : 0;
    const elapsedTimeInMinutes = shift.startingDate
        ? (Date.now() - new Date(shift.startingDate).getTime()) / 60000
        : 0;

    const houseYes = shift.updatedHousesFinal ?? 0;
    const housesOthers = shift.updatedHouses ?? 0;
    const housesNo = shift.updatedHousesFinalNo ?? 0;
    const totalHouses = houseYes + housesOthers + housesNo;
    const pace = elapsedTimeInMinutes / totalHouses ;

    const handleClockOut = async () => {
        try {
            const id = shiftId as Id<"shiftLogger">;
            const result = await clockOut({ id });
            console.log("Shift clocked out successfully:", result);
        } catch (error) {
            console.error("Error clocking out:", error);
        }
    };

    const handleStartBreak = async (type: "general" | "transit", description?: string) => {
        try {
            // Example shiftBreak creation
            const shiftLoggerId = shiftId as Id<"shiftLogger">;
            await startBreak({
                shiftId: shiftLoggerId,
                motive: type,
                description: description ?? "",
            });
            console.log("Break started:", type, description);
        } catch (error) {
            console.error("Error creating break:", error);
        }
    };

    const onDropdownSelect = (action: "clockOut" | "break", breakKind?: "general" | "transit") => {
        setSelectedAction(action);
        setBreakType(breakKind);
        // If user directly clicked "Clock Out", handle it immediately
        if (action === "clockOut") {
            handleClockOut();
        } else if (action === "break" && breakKind === "general") {
            handleStartBreak("general");
        }
        // If user clicked "Transit break", we wait for the user to enter a description and confirm
    };

    const confirmTransitBreak = () => {
        if (breakType === "transit") {
            handleStartBreak("transit", transitDescription);
            setTransitDescription("");
        }
    };

    const formattedElapsedTime = formatElapsedTime(elapsedTimeInHours);

    return (
        <>
            <HasBreaks
                shiftId={shiftId}
            >
        <div className="max-w-auto">
            <div className="w-full flex flex-col mb-6 pt-6 h-full">
                <div className="text-sm flex justify-between w-full items-center">
                    {startTime}
                    <div className="flex items-center gap-0.5 text-xs">
                        <MdTimer className="text-green-600 animate-pulse" />
                        <span className="text-gray-500">{formattedElapsedTime}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="text-sm">
                        <span className="text-xs text-gray-500"> ~</span>
                        {pace.toFixed(1)}
                        <span className="text-xs text-gray-500">/m</span>
                    </span>

                    {/* Dropdown Menu Trigger */}
                    <DropdownMenu>
                                <DropdownMenuTrigger                                    
                                    asChild>    
                                    <p 
                                    className="text-xs  text-white bg-red-700
                                        rounded-md 
                                        px-1 cursor-pointer
                                        hover:text-night
                                        overflow-hidden
                                        "
                                    >   
                                    Clock Out    
                                    </p>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Shift Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Clock Out */}
                            <DropdownMenuItem onClick={() => onDropdownSelect("clockOut")}>
                                Clock Out
                            </DropdownMenuItem>
                            {/* Break Sub-Menu */}
                            <DropdownMenuLabel className="pt-2">Break</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* General Break */}
                            <DropdownMenuItem onClick={() => onDropdownSelect("break", "general")}>
                                General Break
                            </DropdownMenuItem>
                            {/* Transit Break */}
                            <div className="cursor-not-allowed">                                            
                                    <DropdownMenuItem
                                        disabled
                                        // className="cursor-wait"
                                        onClick={() => onDropdownSelect("break", "transit")}>
                                            Transit Break
                            </DropdownMenuItem>
                                        </div>
                            {/* Inactivity break is system-only, so not shown here */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* If transit break was selected, show a small form to enter description and confirm */}
                {selectedAction === "break" && breakType === "transit" && (
                    <div className="mt-3 flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Describe your transit:</label>
                        <input
                            className="border px-2 py-1 text-sm"
                            placeholder="E.g. Traveling to different street..."
                            value={transitDescription}
                            onChange={(e) => setTransitDescription(e.target.value)}
                        />
                        <Button
                            variant="default"
                            size="sm"
                            onClick={confirmTransitBreak}
                            className="mt-1"
                        >
                            Start Transit Break
                        </Button>
                    </div>
                )}
            </div>
        </div>
            </HasBreaks>
        </>
    );
}