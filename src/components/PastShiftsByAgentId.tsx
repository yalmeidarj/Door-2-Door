"use client"
import React, { useState, useEffect } from 'react';
import { getAllAgents, getShiftsByAgentId } from '@/app/actions/actions';
import { format } from 'date-fns';

type Shift = {
    id: string;
    agentId: string;
    locationId: string;
    startingDate: Date;
    finishedDate: Date;
    isFinished: boolean;
    updatedHouses: number;
    updatedHousesFinal: number;
    pace: number;
    paceFinal: number;
    formattedShiftLength?: string;
    Location: Location;    
};

type Location = {
    id: string;
    name: string;
};

type ShiftsResponse = {
    activeShifts: Shift[];
    finishedShifts: Shift[];
};

type ErrorResponse = {
    error: string;
};

type Agent = {
    id: string;
    name: string | null;
} []


export default function PastShiftsByAgentId() {
    const [finishedShifts, setFinishedShifts] = useState<Shift[]>([]);
    const [agents, setAgents] = useState<Agent>([]);
    const [agentId, setAgentId] = useState<string>('');
    // const agentId = 'clr6rleds0000bgkypvq2sydb'; // Replace with actual agent ID

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
    
    useEffect(() => {
        const fetchShifts = async () => {
            const result = await getShiftsByAgentId(agentId);
            if (isShiftsResponse(result )) {
                setFinishedShifts(result.finishedShifts);
            } else {
                console.error("result.error");
            }
        };

        fetchShifts();
    }, [agentId]);

    function isShiftsResponse(response: any): response is ShiftsResponse {
        return (response as ShiftsResponse).finishedShifts !== undefined;
    }

    function handleAgentChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setAgentId(event.target.value);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Finished Shifts</h1>
            <div className="mb-4">
                <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700">Select Agent</label>
                <select id="agent-select" value={agentId} onChange={handleAgentChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Select an Agent</option>
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-4 md:space-y-6 flex flex-col md:flex-row flex-wrap justify-between">
                {finishedShifts.length > 0 ? (
                    finishedShifts.map((shift) => (
                        <div key={shift.id} className="p-4 md:p-6 border border-gray-200 rounded-lg">
                            <div className="font-semibold text-lg text-gray-800 mb-2">Site: {shift.Location.name}</div>
                            <div className="text-gray-700">
                                <p>Start: {format(new Date(shift.startingDate), 'PPPpp')}</p>
                                <p>End: {format(new Date(shift.finishedDate), 'PPPpp')}</p>
                                <p>Duration: {shift.formattedShiftLength}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center mt-4">
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600'>Edited</p>
                                    <p className='font-medium text-gray-800'>{shift.updatedHouses}</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600'>With Consent</p>
                                    <p className='font-medium text-gray-800'>{shift.updatedHousesFinal}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-800 font-medium">No finished shifts available.</div>
                )}
            </div>
        </div>
    );
}
