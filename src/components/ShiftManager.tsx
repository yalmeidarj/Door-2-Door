// "use client"

import {
    AllLocations,
    ClockIn,
    getLocations,
    getActiveShiftByAgentId,
    isAgentClockedIn
} from "@/app/actions/actions";

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

    const availableLocationsData = await AllLocations()
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
        const pace = shiftId && 'pace' in shiftId && shiftId.pace
        const updateHouses = shiftId && 'updatedHouses' in shiftId && shiftId.updatedHouses
        const updateHousesFinal = shiftId && 'updatedHousesFinal' in shiftId && shiftId.updatedHousesFinal
        const paceFinal = shiftId && 'paceFinal' in shiftId && shiftId.paceFinal
        const startingDate = shiftId && 'startingDate' in shiftId && shiftId.startingDate


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
            // {updateHouses}
            <>
                {/* {`Pace: ${userPace} = ${shiftDurationAdjusted} /${updatedHousesFinal}`} */}
                {shiftId.shift?.id as string}
                <ClockOutCard

                    paceFinal={userPace as number}
                    formattedStartTime={formattedStartTime}
                    shiftDurationInMinutes={shiftDurationInMinutes as number}
                    shiftId={shiftId.shift?.id as string}
                />
            </>

        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center max-w-md self-end py-2 px-4 m-0 border-solid border-gray-300 border-x-2 border-b-2 rounded-bl-md">
                <div className='flex flex-row items-center justify-center gap-1'>
                    <h1 className="text-sm font-light">Clocked out
                    </h1>
                    <div className="bg-red-500 animate-blink rounded-full w-2 h-2"></div>
                </div>
                <ClockInHandler agentId={agentId} locations={availableLocations} />
            </div>
        )

    }
}


type ClockOutCardProps = {
    // pace: number;
    paceFinal: number;
    formattedStartTime: string;
    shiftDurationInMinutes: number;
    shiftId: string;
}

function ClockOutCard({  paceFinal, shiftDurationInMinutes, formattedStartTime, shiftId }: ClockOutCardProps) {
    return (
        <div className="flex flex-row items-center gap-2 justify-center max-w-md self-end py-2 px-4 m-0 border-solid border-gray-300 border-x-2 border-b-2 rounded-bl-md">

            <div className='flex  items-center gap-1'>    
                <div className="bg-green-500 animate-blink rounded-full w-2 h-2"></div>    
                {/* <p className="text-sm text font-bold">
                {formattedStartTime}
                </p>                 */}
                <p className="text-sm text font-bold">
                    {" "}pace: ~<span className="text-gray-400">
                        {paceFinal.toFixed(2) }
                </span>
            </p>
            </div>
            <ClockOutHandler props={shiftId} />
        </div>
    )
}
