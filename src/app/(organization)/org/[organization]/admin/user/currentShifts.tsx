"use client"

import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import ShiftCard from "@/components/ShiftCard";
import { usePathname } from "next/navigation";

export default function CurrentShifts() {
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id;
    if (!orgId) {
        return <div>Finding Organization: {orgName}...</div>;
    }
    const shifts = useQuery(api.shiftLogger.getActiveShiftsByOrgId, { orgId: orgId });
    if (!shifts) {
        return <div>Looking for Active Shifts for {orgName}...</div>;
    }
    if (!Array.isArray(shifts)) {
        return <div>No Active Shifts for {orgName}</div>;
    }    
    return (
        <form className="">
            {shifts.map((shift) => (
                <ShiftCard
                    key={shift._id}
                    shift={shift}
                    displayFinishedCard={false}  
                />
            ))}
        </form>
    )
}