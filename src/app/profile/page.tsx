import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/server/auth";
import { getShiftsByAgentId } from "../actions/actions";
import { format } from "date-fns";
import { DateTime } from "luxon";

type shiftProps = {
    id: number;
    startingDate: Date;
    finishedDate: Date;
    agentId: number;
    locationId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    formattedShiftLength?: string;
}


const ProfilePage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You are not logged in</p>
                </div>
            </div>
        );
    }

    const shifts = await getShiftsByAgentId(session.user.id);

    if (!shifts) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You have no shifts</p>
                </div>
            </div>
        );
    }

    const { finishedShifts } = shifts as { finishedShifts: any[] };

    // Convert and format dates to Toronto time zone
    finishedShifts.forEach((shift: shiftProps) => {
        const torontoZone = 'America/Toronto';
        shift.startingDate = DateTime.fromJSDate(shift.startingDate).setZone(torontoZone).toJSDate();
        shift.finishedDate = DateTime.fromJSDate(shift.finishedDate).setZone(torontoZone).toJSDate();
        shift.formattedShiftLength = format(shift.finishedDate.getTime() - shift.startingDate.getTime(), 'H:mm');
    });
    
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex justify-around gap-2 md:items-center border-b border-gray-200 pb-1">
                    <div className="flex-grow">
                        <h2 className="text-sm font-semibold text-gray-700">Name:</h2>
                    </div>
                    <div className="flex-none text-sm text-gray-500">
                        <h4>{session?.user.name}</h4>
                    </div>
                </div>
                <div className="flex justify-around gap-2 md:items-center border-b border-gray-200 pb-1">
                    <div className="flex-grow">
                        <h2 className="text-sm font-semibold text-gray-700">Email:</h2>
                    </div>
                    <div className="flex-none text-sm text-gray-500">
                        <h4>{session?.user.email}</h4>
                    </div>
                </div>
            </div>


            <div className='flex flex-row flex-wrap mt-4 p-2 w-md'>
                <h1 className="w-full text-xl font-semibold text-gray-700">Past Shifts</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {finishedShifts.map((shift: any, index: number) => (
                        <div key={index} className="bg-white shadow-sm rounded-lg p-4">
                            <div className='border-b border-gray-200 pb-1'>                            
                            <div className='flex justify-between items-center  pb-1'>
                                <div className='flex-grow'>
                                    <h2 className='text-sm font-semibold text-gray-700'>{shift.Location.name}</h2>
                                </div>
                                <h4 className='text-xs text-gray-500'>{format(new Date(shift.startingDate), 'MMM do')}</h4>
                                    <h4 className='text-xs text-gray-500'></h4>
                            </div>
                            <div className='flex flex-row text-sm justify-end text-gray-500'>
                                <span>
                                    {format(new Date(shift.startingDate), 'h:mm a')}
                                    </span>
                                     -
                                <span>
                                    {format(new Date(shift.finishedDate), 'h:mm a')}
                                </span>
                                </div>
                            </div>
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
                            <div className='flex flex-row justify-end items-center mt-2'>
                                    <p className='text-sm text-gray-300'>Hours: </p>{" "}
                                <span className="text-gray-800 text-md ml-1">
                                    {" "}{shift.formattedShiftLength}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
