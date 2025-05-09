"use client"
import { useQuery } from "convex/react";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, User, Home, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface HouseEditLogEntry {
    agentId?: string
    email?: string
    houseId?: string
    lastName?: string
    name?: string
    notes?: string
    phone?: string
    statusAttempt?: string
    type?: string
    _id?: string
    _creationTime?: number
}

interface HouseEditLogEntryProps {
    entry: HouseEditLogEntry
}

interface FieldDefinition {
    key: keyof HouseEditLogEntry
    icon: React.ReactNode
    label: string
}

const HouseEditLogEntry: React.FC<HouseEditLogEntryProps> = ({ entry }) => {
    const hasData = (value: any): boolean =>
        value !== undefined && value !== null && value !== ''

    const fields: FieldDefinition[] = [
        { key: 'name', icon: <User className="w-4 h-4" />, label: 'First Name' },
        { key: 'lastName', icon: <User className="w-4 h-4" />, label: 'Last Name' },
        { key: 'email', icon: <Mail className="w-4 h-4" />, label: 'Email' },
        { key: 'phone', icon: <Phone className="w-4 h-4" />, label: 'Phone' },
        { key: 'notes', icon: <FileText className="w-4 h-4" />, label: 'Notes' },
        { key: 'statusAttempt', icon: <AlertCircle className="w-4 h-4" />, label: 'Status Attempt' },
        { key: 'type', icon: <FileText className="w-4 h-4" />, label: 'Type' }
    ]

    const formatTimestamp = (timestamp: number): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: '2-digit',       // Short year
            month: 'short',        // Abbreviated month
            day: '2-digit',        // Day with leading zero if needed
            hour: '2-digit',       // 24-hour format
            minute: '2-digit',     // Include minutes
            hour12: false          // Disable 12-hour format
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp));
    };

    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="border-b m-auto  p-1 w-full flex flex-row justify-between items-center">
                {entry._creationTime && (
                    <p className="text-sm text-muted-foreground">
                        {formatTimestamp(entry._creationTime)}
                    </p>
                )}
                    <div className="">
                        <AgentName agentId={entry.agentId } />
                    </div>
                {/* {entry.agentId && (
                )} */}
            </CardHeader>
            <CardContent>
                <div className="pt-4">
                    {fields.map(({ key, icon, label }) => (
                        hasData(entry[key]) && (
                            <div key={key} className="flex items-start space-x-2">
                                <div className="mt-0.5 text-muted-foreground">{icon}</div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                                    <p className="text-sm">{entry[key]}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

interface AgentNameProps {
    agentId: string | undefined
}

export function AgentName({ agentId }: AgentNameProps) {
    const [id, setAgentId] = useState<string>("");

    if (!agentId || agentId === undefined) {
        return (<Skeleton className="h-4 w-24" />)
    }

    useEffect(() => {
        setAgentId(agentId);
    }, [agentId]);

    const agent = useQuery(api.users.getUserById, { id: id as Id<"users"> }); 

    // const agentName = `${agent?.name}`    

    return (
        <div className="flex items-center ">
            {/* <User className="text-muted-foreground" /> */}
            <span>{agent?.name}</span>
        </div>
    )
}

const HouseEditLog = ({ houseId }: { houseId: string }) => {
    
    const HouselogHistory = useQuery(api.houseEditLog.getEditsByHouseId, {
        houseId: houseId as Id<"house">,
    });

    if (!HouselogHistory) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full mt-4">
            {/* <h2 className="text-xl font-semibold mb-4">Edit History</h2> */}
            {HouselogHistory?.map((log, index) => (
                <div className="w-full" key={index}>
                    <HouseEditLogEntry  entry={log} />
                </div>
            ))}
        </div>
    );
};

export default HouseEditLog;