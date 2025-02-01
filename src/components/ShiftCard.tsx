import { format } from "date-fns";
import { Shift } from "@/lib/Shift/types";
import AgentName from "./AgentName";
import SiteName from "./SiteName";
import {SingleShift } from "./PersonalShifts";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";


interface ShiftCardProps {
    shift: SingleShift | { message: string };
    /**
     * If true -> display "finished" shifts
     * If false -> display "active" shift
     */
    displayFinishedCard?: boolean;
}

export default function ShiftCard({ shift, displayFinishedCard = true }: ShiftCardProps) {
    // 1. If we have a message, display it and exit early
    if ("message" in shift) {
        return <div className="text-red-600">{shift.message}</div>;
    }

    // --------------------------------------------
    // At this point, we know `shift` is a SingleShift
    // because of the type guard above ("message" in shift).
    // --------------------------------------------

    // If displayFinishedCard is false, we want to display only "active" shift
    if (!displayFinishedCard) {
        // Shift must have a startingDate but no finishedDate
        if (!shift.startingDate || shift.finishedDate) {
            return <div>No active shifts found...</div>;
        }
    } else {
        // If displayFinishedCard is true, we want to show only completed shifts
        if (!shift.startingDate || !shift.finishedDate) {
            return <div>No finished shifts found...</div>;
        }
    }

    const formatElapsedTime = (totalHours: number) => {
        const hours = Math.floor(totalHours);
        // Using Math.floor for minutes is often more expected than Math.ceil
        const minutes = Math.floor((totalHours - hours) * 60);

        // Option A: "H:MMh" style (e.g., 3:05h)
        if (hours > 0) {
            // zero-pad the minutes to always be two digits
            const paddedMinutes = String(minutes).padStart(2, '0');
            return `${hours}:${paddedMinutes}h`;
        }
        // If < 1 hour, just show minutes
        return `${minutes}m`;

        /* 
         // Option B: "Hh Mm" style
         if (hours > 0 && minutes > 0) {
           return `${hours}h ${minutes}m`;
         } else if (hours > 0) {
           return `${hours}h`;
         } else if (minutes > 0) {
           return `${minutes}m`;
         } else {
           return '0m';
         }
         */
    };

    const endTime = shift.finishedDate || Date.now();

    // Total elapsed time in milliseconds
    const elapsedMs = endTime - shift.startingDate;

    // Convert to hours/minutes
    const elapsedTimeInHours = elapsedMs / 3600000;
    const elapsedTimeInMinutes = elapsedMs / 60000;

    // Houses updated
    const houseYes = shift.updatedHousesFinal ?? 0;
    const housesOthers = shift.updatedHouses ?? 0;
    const housesNo = shift.updatedHousesFinalNo ?? 0;
    const totalHouses = houseYes + housesOthers + housesNo;

    // Calculate pace: houses / minute
    const pace = elapsedTimeInMinutes > 0 ? totalHouses / elapsedTimeInMinutes : 0;

    // Format the elapsed time
    const formattedElapsedTime = formatElapsedTime(elapsedTimeInHours);

    return (
        <div
            className="bg-white shadow-md w-screen max-w-[300px] mx-2 md:max-w-[340px]
        flex flex-col  rounded-lg overflow-hidden border border-gray-600"
        >
            <div className="flex flex-row justify-between items-center px-4 py-2 bg-gray-800 text-white">
                <AgentName id={shift.userID} />                

                <div className="text-sm text-gray-200 uppercase tracking-wide">
                    {new Date(shift.startingDate).toLocaleDateString()}
                </div>

                <span>
                    <strong>{formattedElapsedTime}</strong>
                </span>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div>
                        <SiteName className="text-lg font-bold text-gray-400" id={shift.siteID} />                        
                    </div>

                    <div className="flex flex-col text-xs font-semibold">
                        <span>{new Date(shift.startingDate).toLocaleTimeString()}</span>
                        {shift.finishedDate && (
                            <span>{new Date(shift.finishedDate).toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <div className="flex justify-between items-center py-2">
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">Edited</span>
                            <span className="block text-sm font-medium">{shift.updatedHouses || "0"}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">With Consent</span>
                            <span className="block text-sm font-medium">
                                {(shift.updatedHousesFinal || 0) + " | " + (shift.updatedHousesFinalNo || 0)}
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">Pace</span>
                            <span className="block text-sm font-medium">{pace.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Break Info Section */}
                <div className="mt-2 ">
                    <h4 className="font-semibold bg-text-sm mb-1">Breaks:</h4>
                    <ScrollArea className="rounded-md bg- p-2">
                        <div className="max-h-[90px] ">
                    {shift.shiftBreaks && shift.shiftBreaks.length > 0 ? (
                        shift.shiftBreaks.map((b) => (
                            <div
                                key={b._id}
                                className="bg-gray-50 rounded flex p-2 mb-2 border-l-4 border-gray-300"
                            >
                                {/* <p className="text-xs">Status: {b.status}</p> */}
                                <div className='flex flex-col w-full '>
                                    <div className=' w-full flex justify-between ' >
                                 <p className="max-w-max self-end  text-xs">{b.motive.toLocaleUpperCase()}</p>
                                <p className="text-xs">
                                    {/* Start:{" "} */}
                                    {b._creationTime ? new Date(b._creationTime).toLocaleTimeString() : "N/A"}
                                </p>
                                <p className="text-xs">
                                    {/* End:{" "} */}
                                    {b.endTime ? new Date(b.endTime).toLocaleTimeString() : "N/A"}
                                </p>
                                    </div>
                                    {b.description && 
                                    <p className="text-xs">{b.description}</p>}                              
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500">No breaks recorded</p>
                        )}
                </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}