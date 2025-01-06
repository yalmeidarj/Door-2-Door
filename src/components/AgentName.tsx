"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function AgentName({ id }: { id: string }) {
    if (!id) {
        return <></>;
    }
    const agent = useQuery(api.users.getUserById, { id: id as Id<"users"> });
    if (!agent) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center">
            {agent.name}
        </div>
    );
}