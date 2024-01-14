import { getAllClockedInAgents } from "@/app/actions/actions";
import ErrorComponent from "./ErrorComponent";
import { format } from "date-fns";

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

function ClockedInAgentCard({ agent }: { agent: PastShiftsProps }) {
    return (
        <div className='bg-white shadow-sm  rounded-lg p-4'>
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

                    <div className='flex flex-row justify-between mt-2 border-b border-gray-300 pb-2'>
                        <div className='flex flex-col items-center'>
                            <p className='text-sm text-gray-600 '>Edited</p>
                            <p className='text-sm text-gray-800'>{shift.updatedHouses}</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <p className='text-sm text-gray-600'>With Consent</p>
                            <p className='text-sm text-gray-800'>{shift.updatedHousesFinal}</p>
                        </div>
                    </div>
                    <div className='flex flex-row text-gray-300 justify-end items-center mt-2'>
                        Elapsed: {" "}
                        <span className="text-gray-800 text-md">
                            {agent.formatedShiftLength}
                        </span>

                    </div>
                </div>
            ))}
        </div>
    )
}


