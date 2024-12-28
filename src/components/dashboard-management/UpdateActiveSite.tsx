"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export default function UpdateActiveSite({ orgName, children }: { orgName: string, children?: React.ReactNode }) {
    const [siteId, setSiteId] = useState("");
    
    const sites = useQuery(api.site.getActiveSitesByOrgName, { orgName: orgName });
    return (
        <div className='w-full flex flex-col'>
            <DropdownMenu>
                <DropdownMenuTrigger>Select a site</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Active Sites</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        {sites?.map((site) => (
                            <DropdownMenuItem
                                key={site._id}
                                onClick={() => setSiteId(site._id)}
                                className="cursor-pointer"
                            >
                                {site.name}
                            </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <SitePdfUploader siteId={siteId} />
        </div>
    )
}

function SitePdfUploader({ siteId }: { siteId: string }) {
    return (
        <div className="w-full flex flex-row min-h-[200px]">
        <div className="w-auto h-full">
            {siteId}
            </div>
            <div className='w-full flex justify-center items-center border border-gray-200 border-0.5 border-dotted  '>
                <span>
                UPLOAD PDF
                </span>
            </div>
        </div>
    )
}                