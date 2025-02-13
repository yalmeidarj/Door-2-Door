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
import { api } from "../../../../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Table from "@/components/compactTable/Table";



export default function HousesNotInSalesForce({ userId }: { userId:string }) {
    const [siteId, setSiteId] = useState("");
    const [selectedSiteName, setSelectedSiteName] = useState("Select a site");
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    return (
        <div className="w-full">
            <div className="container mx-auto flex flex-col">
            <h1 className=" text-2xl font-bold text-gray-800 mb-6">
                Get houses not updated in SalesForce
            </h1>
            <SiteSelector
                orgName={orgName}
                setSiteId={setSiteId}
                selectedSiteName={selectedSiteName}
                setSelectedSiteName={setSelectedSiteName}
            />
            <DataTable
                    id={siteId}
                    userId={userId}
            />
        </div>
        </div>
    );
}

function DataTable({ id, userId }: { id: string, userId: string }) {
    const housesNotInSalesForce = useQuery(
        api.house.getHousesNotInSalesForceBySiteId,
        { siteId: id }
    );

    if (!housesNotInSalesForce || !Array.isArray(housesNotInSalesForce)) {        
        
        return <div>Loading...</div>;
    }

    const data = housesNotInSalesForce.map((house) => ({
        _id: house._id,
        streetNumber: house.streetNumber,
        streetName: house.streetName,
        lastName: house.lastName,
        name: house.name,
        phone: house.phone,
        email: house.email,
        notes: house.notes,
        type: house.type,
        salesForceConflict: house.salesForceConflict,
        statusAttempt: house.statusAttempt,
    }));

    return (
        <div>
            <Table
                data={data}
                siteId={id}
                userId={userId}
            />
        </div>
    );
}

type SiteSelectorProps = {
    orgName: string;
    setSiteId: (siteId: string) => void;
    selectedSiteName: string;
    setSelectedSiteName: (name: string) => void;
}

function SiteSelector({
    orgName,
    setSiteId,
    selectedSiteName,
    setSelectedSiteName
}: SiteSelectorProps) {
    const activeSites = useQuery(api.site.getActiveSitesByOrgName, { orgName });

    const handleSiteSelect = (siteId: string, siteName: string) => {
        setSiteId(siteId);
        setSelectedSiteName(siteName);
    };

    return (
        <div className="flex w-full justify-between items-start gap-2">
            
            <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {selectedSiteName}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Select a site</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {activeSites?.map((site) => (
                        <DropdownMenuItem
                            key={site._id}
                            onClick={() => handleSiteSelect(site._id, site.name)}
                            className="cursor-pointer"
                        >
                            {site.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* <ConflictExplainer /> */}
        </div>
    );
}


                    