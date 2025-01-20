import { format } from "date-fns";
import { Shift } from "@/lib/Shift/types";
import AgentName from "./AgentName";
import SiteName from "./SiteName";

export default function ShiftCard({ shift, diplayFinishedCard = true }: { shift: Shift, diplayFinishedCard: boolean   }) {

    if (!diplayFinishedCard) {
        if (!shift.startingDate) {
            return <div>No active shifts found...</div>
        }
    } else {
        
        if (!shift.startingDate || !shift.finishedDate) {
            return <div>No finished shifts found...</div>
        }
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

    const formattedElapsedTime = formatElapsedTime(elapsedTimeInHours);

    return (
        <div className="bg-white shadow-md
                 w-screen
                 max-w-[300px]
                 mx-2
                 md:max-w-[340px]
          flex flex-col justify-between rounded-lg overflow-hidden border border-gray-600">
            <div className="flex flex-row justify-between items-center px-4 py-2 bg-gray-800 text-white">
                <AgentName id={shift.userID} />
                <div className="text-sm text-gray-200 uppercase tracking-wide">
                    {format(new Date(shift.startingDate), 'MMM do')}
                </div>
                <span>
                    <strong>                        
                        {formattedElapsedTime}
                    </strong>
                </span>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="">
                        <SiteName className="text-lg font-bold text-gray-400" id={shift.siteID} />
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
                            <span className="block text-sm font-medium">{pace.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}