import { format } from "date-fns";
import { Shift } from "@/lib/Shift/types";

export default function ShiftCard({ shift }: { shift: Shift }) {
    return (
        <div className="bg-white shadow-md w-5/5 max-h-[220px] flex flex-col justify-between rounded-lg overflow-hidden border border-gray-600">
            <div className="flex flex-row justify-between items-center px-4 py-2 bg-gray-800 text-white">
                {/* <div className="text-sm uppercase tracking-wide">{shift.Location.name}</div> */}
                <div className="text-sm text-gray-200 uppercase tracking-wide">
                    {format(new Date(shift.startingDate), 'MMM do')}
                </div>
                <span>
                    <strong>
                    {shift.formattedDuration}
                    </strong>
                </span>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="text-sm text-gray-500">
                        <strong>{shift.Location.name}</strong>
                    </div>
                    <div className='flex  flex-col text-xs font-semibold'>
                    
                    <span>
                    {format(new Date(shift.startingDate), 'p')}
                    </span>
                    <span>
                    {format(new Date(shift.finishedDate), 'p')}
                    </span>
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
                            <span className="block text-sm font-medium">{shift.updatedHousesFinal || '0'}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs text-gray-600">Pace</span>
                            <span className="block text-sm font-medium">{shift.paceFinal || '0'}</span>
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
