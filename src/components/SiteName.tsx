"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function SiteName({ id, className }: { id: string | undefined, className?: string }) {
    if (!id) {
        return <></>;
    }
    const site = useQuery(api.site.getSiteById, { id: id as Id<"site"> });
    if (!site) {
        return <div>Loading...</div>;
    }

    return (
        <p className={cn(className)}>
            {site.name}
        </p>
    );
}