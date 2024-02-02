import { getActiveShiftByAgentId, getAllClockedInAgents } from "@/app/actions/actions";
import ErrorComponent from "./ErrorComponent";
import { format } from "date-fns";
import { DateTime } from 'luxon';

interface ShiftLoggerProps {
    id: string;
    startingDate: Date;
    finishedDate: Date | null;
    updatedHouses: number | null;
    updatedHousesFinal: number | null;
    Location: {
        id: number;
        name: string;
    };
}

interface PastShiftsProps {
    id: string;
    name: string | null;
    pace?: number;
    formatedShiftLength?: string;
    ShiftLogger: ShiftLoggerProps[];  // Note this change to an array
}



export default async function ClockedInAgents() {
    const result = await getAllClockedInAgents();

    if (!Array.isArray(result)) {
        return <ErrorComponent error={result.error} />;
    }

    const agents = result;   

    

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>All Agents Currently Clocked In</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {agents.map((agent) => (
                    <ClockedInAgentCard agent={ agent } />
                ))}

            </div>
        </div>
    )
}

async function ClockedInAgentCard({ agent }: { agent: PastShiftsProps }) {
    //
    
    const agentId = agent.id
    const shiftId = await getActiveShiftByAgentId(agentId)
    // Check if shiftId is an error object
    if (!shiftId || !shiftId.shift) {
        return <div>loading...</div>
    }

    const startingDate = shiftId.shift.startingDate
    const updateHouses = shiftId.shift.updatedHouses
    const updateHousesFinal = shiftId.shift.updatedHousesFinal

        const updatedHouses = updateHouses as number;
        const updatedHousesFinal = updateHousesFinal as number;
    const startTime = DateTime.fromJSDate(new Date(startingDate as Date));
    const now = DateTime.now().setZone('America/Toronto');
    const shiftDurationInMilliseconds = now.diff(startTime, 'milliseconds').milliseconds;

    let shiftDurationInMinutes = shiftDurationInMilliseconds / 1000 / 60; // convert from ms to minutes
    let shiftDurationAdjusted = shiftDurationInMinutes - (updatedHouses * 1.5);

    let userPace = 0;
    if (updatedHousesFinal !== 0) {
        userPace = shiftDurationInMinutes / updatedHousesFinal; // this gives adjusted minutes per house update
    }
    return (
        <div className='bg-white shadow-md  rounded-lg p-4'>
            <div className='flex justifiy-between gap-2 md:items-center border-b border-gray-200 pb-1'>
                <div className='flex-grow'>
                    <h2 className='text-sm font-semibold text-gray-700'>{agent.name}</h2>
                </div>
                <div className='flex-none text-xs text-gray-500'>
                    <h4 className=''>{format(new Date(agent.ShiftLogger[0].startingDate), 'MMM do')}</h4>
                    <span>
                        {format(new Date(agent.ShiftLogger[0].startingDate), 'h:mm a')}
                    </span>
                </div>
            </div>

            {agent.ShiftLogger.map((shift, index) => (
                <div key={index} className=''>
                    <div className='flex flex-row items-center border-b border-gray-300 gap-2 '>
                        <div className='flex flex-col justify-between mt-2 py-2 pr-2 border-r  border-gray-300 pb-2'>
                            <div className='flex flex-row items-center justify-between gap-1'>
                                <p className='text-xs text-gray-600 '>Edited</p>
                                <p className='text-sm text-gray-800'>{shift.updatedHouses}</p>
                            
                                </div>
                            <div className='flex flex-row items-center justify-between gap-1'>
                                <p className='text-xs text-gray-600'>With Consent</p>
                                <p className='text-sm text-gray-800'>{shift.updatedHousesFinal}</p>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-1 '>
                            <p className='text-xs text-gray-600 '>Pace</p>
                            <p className='text-sm text-gray-800'>{userPace.toFixed(2)}</p>

                        </div>
                    </div>
                    <div className='flex flex-col text-gray-300 text-sm justify-start text-end mt-2'>
                        <span className="text-gray-800 text-xs">
                            Elapsed:
                        </span>
                            {agent.formatedShiftLength}
                        {/* <span className="text-gray-800 text-md">
                            Pace: {userPace.toFixed(2)}
                        </span> */}

                    </div>
                </div>
            ))}
        </div>
    )
}


