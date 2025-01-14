
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

export default function SiteName({ id, byStreetId, className }: { id: string, byStreetId?: boolean, className?: string }) {
    if (!byStreetId) {
    const site = useQuery(api.site.getSiteById, { id: id })
    if (!site) {
        return <div>Loading...</div>
    }
    const siteName = site.name

    return (
        <span className={cn(className) }>{siteName}</span>
        )
    }
    else {
        const site = useQuery(api.site.getSiteByStreetId, { id: id })
        if (!site) {
            return <div>Loading...</div>
        }
        const siteName = site.name

        return (
            <span className={cn(className)}>{siteName}</span>
            )
    }
}