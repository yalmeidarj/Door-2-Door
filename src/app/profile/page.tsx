import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/server/auth";
import { format } from "date-fns";
import { DateTime } from "luxon";
import { getShiftsByAgentId, getShiftsByLocation, getShiftsByLocationByUser } from "@/lib/profilePage/actions";
import PersonalShifts from "@/components/PersonalShifts";

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

    if (!session || !session.user ) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You are not logged in</p>
                </div>
            </div>
        );
    }

    // const agent  { id, name  }  = session.user;
    return (
        <div className="flex items-center mx-auto justify-center max-w-5xl">
            <PersonalShifts
                agentId={session.user.id}
                name={session.user.name as string}
            />
        </div>
    );
}

export default ProfilePage;
