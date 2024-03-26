"use client"
import React, { useState, useEffect } from 'react';
import { getAllAgents, getShiftsByAgentId } from '@/app/actions/actions';
import { format, subDays } from 'date-fns';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { Shift, ShiftsResponse } from '@/lib/Shift/types';
import ShiftCard from './ShiftCard';
import ShiftReportByDateRange from './ShiftReportByDateRange';
import LoadingSpinner from './LoadingSpinner';


export default function PersonalShifts({ agentId, name }: { agentId: string, name: string }) {
    const [finishedShifts, setFinishedShifts] = useState<Shift[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalHoursWorked, setTotalHoursWorked] = useState<string>('');
    const [totalTimePerLocation, setTotalTimePerLocation] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchShifts = async () => {
            if (!agentId || !dateRange?.from || !dateRange?.to) return;
            setIsLoading(true);
            const startDate = format(dateRange.from, 'yyyy-MM-dd');
            const endDate = format(dateRange.to, 'yyyy-MM-dd');
            const result = await getShiftsByAgentId(agentId, startDate, endDate);
            setIsLoading(false);
            if (isShiftsResponse(result)) {
                setFinishedShifts(result.finishedShifts);
                setTotalHoursWorked(result.totalHoursWorked);
                setTotalTimePerLocation(result.totalTimePerLocation);
            } else {
                console.error("Error fetching shifts");
            }
        };

        fetchShifts();
    }, [dateRange]); 

    function resetSelections() {
        setDateRange({ from: subDays(new Date(), 5), to: new Date() });
        setFinishedShifts([]);
        setTotalHoursWorked('');
        setTotalTimePerLocation({});
    }

    function isShiftsResponse(response: any): response is ShiftsResponse {
        return (response as ShiftsResponse).finishedShifts !== undefined;
    }

    return (
        <div className=" mx-auto p-4 flex flex-col justify-start w-full ">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>

                </>
            )}
            <div className='w-full flex justify-between '>
            
            <h1 className="text-xl font-bold mb-4">Finished Shifts</h1>
            <h2 className="text-xl font-bold mb-4">{name}</h2>
            </div>
            {/* Display feedback message */}
            {(dateRange?.from && dateRange?.to) && (
                <p className="text-sm mb-4">Displaying shifts from <strong>{format(new Date(dateRange.from), 'MMM dd, yyyy')}</strong> to <strong>{format(new Date(dateRange.to), 'MMM dd, yyyy')}</strong>.</p>
            )}
            {/* Existing date and agent selection inputs remain unchanged */}
            {/* Reset Button */}
            <button
                onClick={resetSelections}
                className="mb-4 px-4 py-2 sm:w-[300px] bg-red-500 text-white max-w-auto rounded hover:bg-red-700 transition duration-150 ease-in-out">Reset</button>
            {/* The rest of your component remains unchanged */}

            <div className="mb-4">
                <DatePickerWithRange
                    dateRange={dateRange}
                    className="mb-4"
                    onChange={(range) => setDateRange(range)} />
            </div>
            <ShiftReportByDateRange
                totalHoursWorked={totalHoursWorked}
                totalTimePerLocation={totalTimePerLocation}
            />
            <div className="grid grid-cols-1 w-full items-center mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-4">
                {finishedShifts.length > 0 ? (
                    finishedShifts.map((shift) => (
                        <ShiftCard key={shift.id} shift={shift} />
                    ))
                ) : (
                    <div
                        className="flex justify-center items-center h-14 w-full text-center text-gray-800 font-medium">
                        <p>No finished shifts available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}