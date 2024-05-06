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


type Agent = {
    id: string;
    name: string | null;
} []


export default function PastShiftsByAgentId() {
    const [finishedShifts, setFinishedShifts] = useState<Shift[]>([]);
    const [agents, setAgents] = useState<Agent>([]);
    const [agentId, setAgentId] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalHoursWorked, setTotalHoursWorked] = useState<string>('');
    const [totalTimePerLocation, setTotalTimePerLocation] = useState<{ [key: string]: string }>({});



    useEffect(() => {
        const allAgents = async () => {
            const result = await getAllAgents();
            if (result && !('error' in result)) {
                setAgents(result);
            } else {
                console.error(result.error);
            }
        };
        allAgents();
    }, []);
    

    // Your useEffect hooks for fetching agents and shifts remain unchanged

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
    }, [agentId, dateRange]); // Update dependency array

    function resetSelections() {
        setAgentId('');
        setDateRange({ from: subDays(new Date(), 5), to: new Date() });
        setFinishedShifts([]);
        setTotalHoursWorked('');
        setTotalTimePerLocation({});        
    }

    function handleAgentChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setAgentId(event.target.value);
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
            <h1 className="text-xl font-bold mb-4">Finished Shifts</h1>
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
                <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700">Select Agent</label>
                <select id="agent-select" value={agentId} onChange={handleAgentChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Select an Agent</option>
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                </select>
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