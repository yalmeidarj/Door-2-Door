"use client"

import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import ShiftCard from "@/components/ShiftCard";
import { Shift } from "@/lib/Shift/types";
import { usePathname } from "next/navigation";
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import PersonalShifts from "@/components/PersonalShifts";

export default function PastShifts(
) {
    const [selectedAgent, setSelectedAgent] = useState<string>("");

    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id;
    const orgUsers = useQuery(api.users.getAllUsersInOrgByName, { orgName: orgName });
    if (!orgId) {
        return <div>Finding Organization: {orgName}...</div>;
    }

    return (
        <>
            <Select
                value={selectedAgent}
                onValueChange={setSelectedAgent}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{" "}</SelectLabel>
                        <SelectItem               
                            key={"blackspace"}    
                            value={" "}>{"Select an agent"}
                        </SelectItem>
                        {orgUsers?.map((user: any) => (
                            <>
                                <SelectItem    
                                    key={user._id}    
                                    value={user._id}>
                                    {user.name}
                                </SelectItem>
                            </>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>  
            <PersonalShifts
                agentId={selectedAgent}
            />
        </>
    )
}
