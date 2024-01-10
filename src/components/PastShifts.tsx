"use client";
import { useState, useEffect } from 'react';
import { getAllAgents, getShiftsByAgentIdFinished } from "@/app/actions/actions";
import { FormWrapper } from "./FormWrapper";
import SubmitFormButton from "./SubmitFormButton";

interface Shift {
    id: string;
    agentId: string;
    locationId: number;
    startingDate: Date;
    finishedDate: Date | null;
    isFinished: boolean;
    updatedHouses: number | null;
    updatedHousesFinal: number | null;
    pace: number | null;
    paceFinal: number | null;
}

interface PastShiftsProps {
    name: string | null;
    id: string;
}

interface AgentProps {
    agents: PastShiftsProps[] | { error: string };
}

export default function PastShifts({ agents }: AgentProps) {
    const [selectedAgent, setSelectedAgent] = useState<string>('');
    const [pastShifts, setPastShifts] = useState<Shift[]>([]);

    const isAgentsArray = Array.isArray(agents);
    
    useEffect(() => {
        if (selectedAgent) {
            const fetchPastShifts = async () => {
                const result = await getShiftsByAgentIdFinished(selectedAgent);
                if ('error' in result) {
                    console.error(result.error);
                } else {
                    setPastShifts(result);
                }
            };

            fetchPastShifts();
        } else {
            // Reset past shifts if no agent is selected
            setPastShifts([]);
        }
    }, [selectedAgent]);

    const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAgent(event.target.value);
    };

    return (
        <div className=' '>
            <FormWrapper
                title="Finished Shifts"
                description="Use this form to view finished shifts of a specific agent"
            >
                <form >
                    <div className='flex flex-col gap-4'>
                        <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Choose an Agent:</label>
                        <div className='flex flex-row '>
                            <select
                                required
                                name="agent" id="site"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={handleAgentChange}
                            >
                                <option value=""></option>
                                {isAgentsArray && agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name || "Unnamed Agent"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Display PAST shifts here */}
                    {pastShifts.length > 0 ? (
                        <div className="past-shifts-container">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Past Shifts</h3>
                            <ul className="mt-4">
                                {pastShifts.map((shift, index) => (
                                    <li key={index} className="mb-2 p-2 border border-gray-200 rounded shadow-sm">
                                        <div className="text-sm text-gray-700">
                                            {/* Display shift details here */}
                                            <p>Shift ID: {shift.id}</p>
                                            <p>Shift Date: {shift.startingDate.toLocaleDateString()}</p>
                                            {/* Display the time here */}
                                            <p>Updated Houses: {shift.updatedHouses}</p>
                                            <p>Updated Houses Final: {shift.updatedHousesFinal}</p>
                                            <p>From: {shift.startingDate.toLocaleTimeString()} to: {shift.finishedDate?.toLocaleTimeString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="text-gray-700">
                            {selectedAgent ? 'No past shifts found for this agent.' : 'Select an agent to view past shifts.'}
                        </div>
                    )}
                </form>
            </FormWrapper >
        </div>
    )
}

