"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type SwitchButton = {
    _id: Id<"site">;
    _creationTime: number;
    priorityStatus?: number;
    neighborhood?: string;
    maxInactiveDuration?: number;
    name: string;
    orgID: string;
    isActive: boolean;
} ;

type SwitchButtonProps = {
    site: SwitchButton,
    children?: React.ReactNode,
    className?: string,

}

export default function SiteSwitchButton({
    site,
    children,
    className
}: SwitchButtonProps) {
    
    const switchStatus = useMutation(api.site.switchSiteStatus);

    async function onSubmit(id: string) {
        await switchStatus({ siteID: id });
    }

    return (
        <>
                <div >
            <Switch
                    id={site._id}
                    checked={site.isActive}
                    className={cn(className,'h-5.5 pr-1')}
                onCheckedChange={onSubmit.bind(null, site._id)}
                />
                {children &&
                <Label htmlFor={site._id}>{children}</Label>
                }
                </div>         
                </>
    );
}