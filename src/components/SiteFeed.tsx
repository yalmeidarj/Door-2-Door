'use client'
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SiteCard } from "./SiteCard";
import { usePathname } from 'next/navigation'

export default function SiteFeed() {

    const pathname = usePathname()
    const orgName = pathname.split("/")[2]
        .replace("%20", " ")
        .replace("-", " ")
        ;

    const data = useQuery(api.site.getActiveSitesByOrgName, { orgName: orgName });

    if (!Array.isArray(data)) {
        return <div>An issue occurred when fetching sites for this organization</div>;
    }
    if (data.length === 0) {
        return (
            <div className=" flex flex-col w-full items-center justify-center h-screen">
                <h1 className="text-2xl font-semibold  mb-4">
                No active sites found for this organization
                </h1>
                <h2 className="text-gray-600 font-bold">Check the name of the organization in the url:{" "}
                    <span className="text-gray-800">
                    {orgName}
                    </span>
                </h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-md h-screen items-center text-gray-600">
            {/* <PaginationControls
                metadata={paginationControls}
            /> */}
            <div className='flex flex-col md:flex-row md:flex-wrap md:justify-center '>
                {data.map((location) => (
                    <SiteCard
                        key={location._id}                    
                        siteId={location._id}
                    />
                ))}
                </div> 
        </div>
    );
}
