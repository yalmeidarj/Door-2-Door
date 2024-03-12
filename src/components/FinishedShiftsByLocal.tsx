"use client"


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
}[]

import { getAllAgents, getShiftsByAgentId } from '@/app/actions/actions';
import { LocationType } from '@/lib/sites/types';
import React, { useState, useEffect } from 'react';
export default async function FinishedShiftsByLocal() {
    // const [locations, setLocations] = useState<LocationType[]>([]);
    // const [finishedShifts, setFinishedShifts] = useState<Shift[]>([]);
    // const [agents, setAgents] = useState<Agent>([]);
    // const [agentId, setAgentId] = useState<string>('');

    // useEffect(() => {
    //     const allAgents = async () => {
    //         const result = await getAllAgents();
    //         if (result && !('error' in result)) {
    //             setAgents(result);
    //         } else {
    //             console.error(result.error);
    //         }
    //     };
    //     allAgents();
    // }, []);

    // useEffect(() => {
    //     const fetchShifts = async () => {
    //         const result = await getShiftsByAgentId(agentId);
    //         if (!result || result.location) {
    //             setFinishedShifts(result.);
    //         } else {
    //             console.error(result.error);
    //         }
    //     };
    //     fetchShifts();
    // }, [agentId]);
    
    
    return (
        <div className="flex flex-col">
            FinishedShiftsByLocal
        </div>
    )
}