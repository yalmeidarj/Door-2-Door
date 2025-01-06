
import { format } from "date-fns";
import { Shift } from "@/lib/Shift/types";
import { DateTime } from "luxon";
import AgentName from "./AgentName";

export default function ShiftCard({ shift, diplayFinishedCard = true }: { shift: Shift, diplayFinishedCard: boolean   }) {
    const updatedHouses = shift.updatedHouses as number
    const updatedHousesFinal = shift.updatedHousesFinal as number
    const updatedHousesFinalNo = shift.updatedHousesFinalNo as number

    const allHouses = updatedHouses + updatedHousesFinal + updatedHousesFinalNo

    if (!diplayFinishedCard) {
        if (!shift.startingDate) {
            return <div>No active shifts found...</div>
        }
    } else {
        
        if (!shift.startingDate || !shift.finishedDate) {
            return <div>No finished shifts found...</div>
        }
    }
    const endTime = DateTime.fromJSDate(new Date(shift.finishedDate ? shift.finishedDate : shift.startingDate));


    const startTime = DateTime.fromJSDate(new Date(shift.startingDate));

    const shiftDurationInMilliseconds = endTime.diff(
        startTime,
        "milliseconds"
    ).milliseconds;
    let shiftDurationInMinutes = shiftDurationInMilliseconds / 1000 / 60; // convert from ms to minutes

    let shiftDurationInHours = shiftDurationInMilliseconds / 1000 / 60 / 60; // convert from ms to hours

    return (
        <div className="bg-white shadow-md
                 w-screen
                 max-w-[300px]
                 mx-2
                 md:max-w-[340px]
          flex flex-col justify-between rounded-lg overflow-hidden border border-gray-600">
            <div className="flex flex-row justify-between items-center px-4 py-2 bg-gray-800 text-white">
                {/* <div className="text-sm uppercase tracking-wide">{shift.Location.name}</div> */}
                <AgentName id={shift.userID} />
                <div className="text-sm text-gray-200 uppercase tracking-wide">
                    {format(new Date(shift.startingDate), 'MMM do')}
                </div>
                <span>
                    <strong>
                        {Math.floor(shiftDurationInHours)}h: {shiftDurationInMinutes.toFixed(0)}
                    </strong>
                </span>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="text-sm text-gray-500">
                        {/* <strong>{shift.Location.name}</strong> */}
                    </div>
                    <div className='flex  flex-col text-xs font-semibold'>
                    
                    <span>
                    {format(new Date(shift.startingDate), 'p')}
                    </span>
                            {shift.finishedDate && 
                        
                        <span>
                                { format(new Date(shift.finishedDate), 'p')}
                    </span>
                        
                            }
                            
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    <div className="flex justify-between items-center py-2">
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">Edited</span>
                            <span className="block text-sm font-medium">{shift.updatedHouses || '0'}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">With Consent</span>
                            <span className="block text-sm font-medium">{shift.updatedHousesFinal || '0'} | {shift.updatedHousesFinalNo || '0'}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">Pace</span>
                            <span className="block text-sm font-medium">{(allHouses/shiftDurationInMinutes).toFixed(2)}</span>
                            {/* <span className="block text-sm font-medium">{shift.paceFinal || '0'}</span> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="text-center bg-gray-800 p-1 rounded-b-sm text-white">
                <span className="block text-xs ">Hours</span>
                <span className="block text-sm font-medium">{shift.formattedDuration}</span>
            </div> */}
        </div>
    );
}


// "use client"
// import React, { useState, useEffect } from 'react';

// type Shift = {
//     formattedDuration?: string;
//     id: string;
//     agentId: string;
//     locationId: string;
//     startingDate: Date | null;
//     finishedDate: Date | null;
//     isFinished: boolean;
//     updatedHouses: number;
//     updatedHousesFinal: number;
//     updatedHousesFinalNo: number;
//     pace: number;
//     paceFinal: number;
//     formattedShiftLength?: string;
//     Location: Location | null;
// };

// type Location = {
//     id: string;
//     name: string;
// };

// type ShiftCardProps = {
//     shift: Shift;
//     availableLocations: Location[];
//     onClockIn: (locationId: string) => void;
//     onClockOut: () => void;
// };

// const ShiftCard: React.FC<ShiftCardProps> = ({
//     shift,
//     availableLocations,
//     onClockIn,
//     onClockOut,
// }) => {
//     const [selectedLocationId, setSelectedLocationId] = useState<string>('');
//     const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (shift.startingDate && !shift.isFinished) {
//             interval = setInterval(() => {
//                 const now = new Date();
//                 const elapsedMilliseconds = now.getTime() - new Date(shift.startingDate!).getTime();
//                 const hours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
//                 const minutes = Math.floor((elapsedMilliseconds / (1000 * 60)) % 60);
//                 const seconds = Math.floor((elapsedMilliseconds / 1000) % 60);
//                 setElapsedTime(
//                     `${hours.toString().padStart(2, '0')}:${minutes
//                         .toString()
//                         .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
//                 );
//             }, 1000);
//         }
//         return () => {
//             if (interval) clearInterval(interval);
//         };
//     }, [shift.startingDate, shift.isFinished]);

//     const handleClockIn = () => {
//         if (selectedLocationId) {
//             onClockIn(selectedLocationId);
//         }
//     };

//     const handleClockOut = () => {
//         onClockOut();
//     };

//     if (!shift.startingDate) {
//         // User has not clocked in yet
//         return (
//             <div className="shift-card">
//                 <h3>Start Shift</h3>
//                 <select
//                     value={selectedLocationId}
//                     onChange={(e) => setSelectedLocationId(e.target.value)}
//                 >
//                     <option value="">Select Location</option>
//                     {availableLocations.map((location) => (
//                         <option key={location.id} value={location.id}>
//                             {location.name}
//                         </option>
//                     ))}
//                 </select>
//                 <button onClick={handleClockIn} disabled={!selectedLocationId}>
//                     Clock In
//                 </button>
//             </div>
//         );
//     } else if (!shift.isFinished) {
//         // User is clocked in
//         return (
//             <div className="shift-card">
//                 <h3>Shift in Progress</h3>
//                 <p>Location: {shift.Location?.name || 'N/A'}</p>
//                 <p>Elapsed Time: {elapsedTime}</p>
//                 <p>Pace: {shift.pace}</p>
//                 <button onClick={handleClockOut}>Clock Out</button>
//             </div>
//         );
//     } else {
//         // Shift is finished
//         return (
//             <div className="shift-card">
//                 <h3>Shift Completed</h3>
//                 <p>Location: {shift.Location?.name || 'N/A'}</p>
//                 <p>Total Duration: {shift.formattedShiftLength}</p>
//                 <p>Final Pace: {shift.paceFinal}</p>
//             </div>
//         );
//     }
// };

// export default ShiftCard;
