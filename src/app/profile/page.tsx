import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/server/auth";
import { getShiftsByAgentId } from "../actions/actions";


type shiftProps = {
    id: number;
    startingDate: Date;
    finishedDate: Date;
    agentId: number;
    locationId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
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

    if (!shifts ){ 
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You have no shifts</p>
                </div>
            </div>
        );        
    }

    const { finishedShifts } = shifts as { finishedShifts: any[] };



    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                <p>Name:</p>
                <p>{session?.user.name}</p>
                <p>Email:</p>
                <p>{session?.user.email}</p>
                {/* <p>Role:</p>
                <p>To be implemented</p> */}
                {/* <p>{session?.user.role}</p> */}
            </div>
            <div className='flex flex-row flex-wrap '>
            {/* <h1 className="w-full">Active Shift</h1>
            {activeShifts.map((shift: shiftProps) => (
                <div key={shift.id} className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>Shift Start:</p>
                    <p>{shift.startingDate.toLocaleString()}</p>
                    <p>Shift End:</p>
                    <p> - - </p>
                </div>
            ))} */}
            
                <h1 className="w-full">Past Shifts</h1>            
                <div className='flex flex-row flex-wrap space-x-1 justify-between '>
                    {finishedShifts.map((shift: any) => (
                        <div key={shift.id} className="bg-sky-700 text-slate-100 p-2 rounded shadow flex flex-col mt-9">
                            <div className='w-full '>
                            <h1 className="text-sm">{shift.Location.name}</h1>
                            </div>
                    <p className="text-xs">From: <span  className="text-sm">{shift.startingDate.toLocaleString()}</span></p>
                    <p className="text-xs">To: <span  className="text-sm">{shift.finishedDate.toLocaleString()}</span></p>
                </div>
            ))}
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;