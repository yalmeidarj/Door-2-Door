// "use client"

import {
    AllLocations,
    ClockIn,
    getLocations,
    getActiveShiftByAgentId,
    isAgentClockedIn,
    getActiveLocations
} from "@/app/actions/actions";
import { cn } from "@/lib/utils";
import ClockInHandler from "./ClockInHandler";
import ClockOutHandler from "./ClockOutHandler";
import { db } from "@/server/db";
// import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { DateTime } from 'luxon';



export default async function ShiftManager() {
    // const session = useSession();

    // get session from server
    const session = await getServerSession(authOptions)


    if (!session ) {
        return <div>loading...</div>
    }

    const agentId = session.user.id

    const availableLocationsData = await getActiveLocations()
    // Check if availableLocationsData is an error object
    if ('error' in availableLocationsData) {
        // Handle the error appropriately
        // For example, display an error message or log the error
        console.error(availableLocationsData.error);
        // Return a relevant JSX element or null
        return <div>Error: {availableLocationsData.error}</div>;
    }

    const isAgentClockedInData = await isAgentClockedIn(agentId)

    const [isClockedIn, availableLocations ] = await Promise.all([isAgentClockedInData, availableLocationsData])

    if (isClockedIn){

        const shiftId = await getActiveShiftByAgentId(agentId)

        // Check if shiftId is an error object
        if (!shiftId || !shiftId.shift) {
            return <div>loading...</div>
        }
        const pace = shiftId.shift.pace
        const updateHouses = shiftId.shift.updatedHouses
        const updateHousesFinal = shiftId.shift.updatedHousesFinal
        const paceFinal = shiftId.shift.paceFinal
        const startingDate = shiftId.shift.startingDate


        const updatedHouses = updateHouses as number;
        const updatedHousesFinal = updateHousesFinal as number;
        const startTime = DateTime.fromJSDate(new Date(startingDate as Date));

        const formattedStartTime = startTime.toLocaleString(DateTime.DATETIME_MED);
        const now = DateTime.now().setZone('America/Toronto');
        const shiftDurationInMilliseconds = now.diff(startTime, 'milliseconds').milliseconds;

        let shiftDurationInMinutes = shiftDurationInMilliseconds / 1000 / 60; // convert from ms to minutes

        let shiftDurationAdjusted = shiftDurationInMinutes - (updatedHouses * 1.5);

        let userPace = 0;
        if (updatedHousesFinal !== 0) {
            userPace = shiftDurationAdjusted / updatedHousesFinal; // this gives adjusted minutes per house update
        }

        // Ensure userPace is not NaN
        if (isNaN(userPace)) {
            userPace = 0;
        }

        if (!shiftId || !shiftId.shift) {
            return <div>loading...</div>
        }

        return (
            <>
                <ClockOutCard
                    className='bg-slate-300 mb-9 shadow-md'
                    paceFinal={userPace as number}
                    formattedStartTime={formattedStartTime}
                    shiftDurationInMinutes={shiftDurationInMinutes as number}
                    shiftId={shiftId.shift?.id as string}
                />
            </>

        )
    } else {
        return (
            <ClockInCard
                className='bg-slate-300 mb-9 shadow-md'
                agentId={agentId}
                availableLocations={availableLocations}
            />
        )

    }
}


type ClockOutCardProps = {
    className?: string;    
    paceFinal: number;
    formattedStartTime: string;
    shiftDurationInMinutes: number;
    shiftId: string;
}

function ClockOutCard({ className, paceFinal, formattedStartTime, shiftDurationInMinutes, shiftId }: ClockOutCardProps) {
    return (
        <div className={cn("flex flex-col max-w-md self-end py-2 px-4 m-0 mb-2 border-solid border-gray-300 border-x-2 border-b-2 rounded-bl-md", className)}>
            <div className='flex  items-center justify-start gap-2'>    
                <h1 className="text-sm font-semibold">Clocked In
                </h1><div className="bg-green-500 animate-blink rounded-full w-2 h-2"></div>    
                <p className="text-sm text font-bold">
                {formattedStartTime}
            </p>                
                
            </div>
            <div className='flex flex-row gap-2 '>            
            <p className="text-sm text font-bold">
                {" "}Pace: <span className="text-gray-400">
                        {paceFinal.toFixed(2)}
                    {/* {paceFinal.toFixed(2)} */}
                </span>
            </p>
            <ClockOutHandler props={shiftId} />
            </div>
        </div>
    )
}

type ClockInCardProps = {
    className?: string;
    agentId: string;
    availableLocations: { id: number; name: string }[];
}


function ClockInCard({ className, agentId, availableLocations }: ClockInCardProps) {
    return (
        
        <div className={cn("flex flex-col max-w-md self-end py-2 px-4 m-0 mb-2 border-solid border-gray-300 border-x-2 border-b-2 rounded-bl-md", className)}>

        <div className='flex  items-center justify-start gap-2'>
            <h1 className="text-sm font-semibold">Clocked out
            </h1>
            <div className="bg-red-500 animate-blink rounded-full w-2 h-2"></div>
        </div>

        <ClockInHandler agentId={agentId} locations={availableLocations} />
    </div>
        )
}


