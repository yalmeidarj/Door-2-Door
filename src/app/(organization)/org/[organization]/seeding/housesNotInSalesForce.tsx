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
import Table, { ConciliationProvider } from "@/components/compactTable/Table";
import { Input } from "@/components/ui/input";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";





// Updated main component with ConciliationProvider
// export default function HousesNotInSalesForce({ userId }: { userId: string }) {
    
//     const [siteId, setSiteId] = useState("");
//     const [selectedSiteName, setSelectedSiteName] = useState("Select a site");
//     const pathName = usePathname();
//     const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

//     return (
//         <div className="w-full">
//             <div className="container mx-auto flex flex-col">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">
//                     Get houses not updated in SalesForce
//                 </h1>
//                 <div className="flex flex-row gap-4 justify-between items-center">
                    
//                 <SiteSelector
//                     orgName={orgName}
//                     setSiteId={setSiteId}
//                     selectedSiteName={selectedSiteName}
//                     setSelectedSiteName={setSelectedSiteName}
//                     />
//                 <HouseSearch userId={userId} siteId={siteId} />
//                     </div>
//                 <TableSeparator />
//                 <ConciliationProvider>
//                     <DataTable
//                         id={siteId}
//                         userId={userId}
//                         />
//                 </ConciliationProvider>
//             </div>
//         </div>
//     );
// }

// function TableSeparator() {
//     return (
//         <div className="relative w-full min-h-[100px] flex items-center justify-center">
//             <div className="w-full border-t border-gray-400"></div>
//             <span className="absolute bg-white px-4 text-gray-600 text-sm font-medium">
//                 Houses not updated in SalesForce
//             </span>
//         </div>
//     );
// }



// function HouseSearch({ siteId, userId }: { siteId: string; userId: string }) {
//     const [site, setSite] = useState(siteId); // Site ID state
//     const [selectedStreetId, setSelectedStreetId] = useState<string | null>(null); // Track selected street
//     const [searchTerm, setSearchTerm] = useState("");

//     // Get streets for the dropdown
//     const streets = useQuery(api.street.getStreetsBySiteId, { siteID: siteId as Id<"site"> });

//     if (!streets) {
//         return <div>Loading...</div>;
//     }

//     // Handle street selection
//     const handleStreetSelection = (streetId: string) => {
//         setSelectedStreetId(streetId);
//     };

//     return (
//         <div className="space-y-4">
//             {/* Street Selection Dropdown */}
//             <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 border rounded-md w-64">
//                     {selectedStreetId
//                         ? streets.find(street => street._id === selectedStreetId)?.name || "Select street"
//                         : "Select street"}
//                     <ChevronDown className="h-4 w-4 opacity-50" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuLabel>Streets</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                         key={"empty"}
//                         onClick={() => handleStreetSelection("")}
//                         className="cursor-pointer"
//                     >
//                         None
//                         </DropdownMenuItem>
//                     {streets.map((street) => (
//                         <DropdownMenuItem
//                             key={street._id}
//                             onClick={() => handleStreetSelection(street._id)}
//                             className="cursor-pointer"
//                         >
//                             {street.name}
//                         </DropdownMenuItem>
//                     ))}
//                 </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Display the house data table when a street is selected */}
//             {selectedStreetId && (
//                 <SingleHouseDataTable
//                     siteId={siteId}
//                     streetId={selectedStreetId}
//                     userId={userId}
//                 />
//             )}
//         </div>
//     );
// }

// function SingleHouseDataTable({ siteId, streetId, userId }: { siteId: string; streetId: string; userId: string }) {
//     const housesInStreet = useQuery(api.house.getHousesByStreetId, { streetId: streetId as Id<"street"> });

//     if (!housesInStreet || !Array.isArray(housesInStreet)) {
//         return <div>Loading...</div>;
//     }

//     const data = housesInStreet.map((house) => ({
//         _id: house._id,
//         streetNumber: house.streetNumber,
//         streetName: house.streetName,
//         lastName: house.lastName,
//         name: house.name,
//         phone: house.phone,
//         email: house.email,
//         notes: house.notes,
//         type: house.type,
//         salesForceConflict: house.salesForceConflict,
//         statusAttempt: house.statusAttempt,
//     }));

//     return (
//         <div>
//             <Table
//                 data={data}
//                 siteId={siteId}
//                 userId={userId}
//             />
//         </div>
//     );
// }

// function DataTable({ id, userId }: { id: string; userId: string }) {
    
//     const housesNotInSalesForce = useQuery(
//         api.house.getHousesNotInSalesForceBySiteId,
//         { siteId: id }
//     );

//     if (!housesNotInSalesForce || !Array.isArray(housesNotInSalesForce)) {
//         return <div>Loading...</div>;
//     }

//     const data = housesNotInSalesForce.map((house) => ({
//         _id: house._id,
//         streetNumber: house.streetNumber,
//         streetName: house.streetName,
//         lastName: house.lastName,
//         name: house.name,
//         phone: house.phone,
//         email: house.email,
//         notes: house.notes,
//         type: house.type,
//         salesForceConflict: house.salesForceConflict,
//         statusAttempt: house.statusAttempt,
//     }));

//     return (
//         <div>
//             <Table
//                 data={data}
//                 siteId={id}
//                 userId={userId}
//             />
//         </div>
//     );
// }

// type SiteSelectorProps = {
//     orgName: string;
//     setSiteId: (siteId: string) => void;
//     selectedSiteName: string;
//     setSelectedSiteName: (name: string) => void;
// }

// function SiteSelector({
//     orgName,
//     setSiteId,
//     selectedSiteName,
//     setSelectedSiteName
// }: SiteSelectorProps) {
//     const activeSites = useQuery(api.site.getActiveSitesByOrgName, { orgName });

//     const handleSiteSelect = (siteId: string, siteName: string) => {
//         setSiteId(siteId);
//         setSelectedSiteName(siteName);
//     };

//     return (
//         <div className="flex w-full justify-between items-start gap-2">
            
//             <DropdownMenu>
//                 <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                     {selectedSiteName}
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuLabel>Select a site</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     {activeSites?.map((site) => (
//                         <DropdownMenuItem
//                             key={site._id}
//                             onClick={() => handleSiteSelect(site._id, site.name)}
//                             className="cursor-pointer"
//                         >
//                             {site.name}
//                         </DropdownMenuItem>
//                     ))}
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             {/* <ConflictExplainer /> */}
//         </div>
//     );
// }
export default function HousesNotInSalesForce({ userId }: { userId: string }) {

    const [siteId, setSiteId] = useState("");
    const [selectedSiteName, setSelectedSiteName] = useState("Select a site");
    const [selectedStreetId, setSelectedStreetId] = useState<string | null>(null);
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    return (
        <div className="w-full">
            <div className="container mx-auto flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Get houses not updated in SalesForce
                </h1>
                <div className="flex flex-row gap-4 justify-between items-center">
                    <SiteSelector
                        orgName={orgName}
                        setSiteId={setSiteId}
                        selectedSiteName={selectedSiteName}
                        setSelectedSiteName={setSelectedSiteName}
                    />
                    <StreetSelector
                        siteId={siteId}
                        selectedStreetId={selectedStreetId}
                        setSelectedStreetId={setSelectedStreetId}
                    />
                </div>

                {/* First Table - Street-specific houses (from HouseSearch) */}
                {selectedStreetId && (
                    <>
                        <TableSeparator title="All Houses on Selected Street" />
                        <SingleHouseDataTable
                            siteId={siteId}
                            streetId={selectedStreetId}
                            userId={userId}
                        />
                    </>
                )}

                {/* Second Table - All houses not in Salesforce (from DataTable) */}
                <TableSeparator title="Houses not updated in SalesForce" />
                <ConciliationProvider>
                    <DataTable
                        id={siteId}
                        userId={userId}
                    />
                </ConciliationProvider>
            </div>
        </div>
    );
}

function TableSeparator({ title }: { title: string }) {
    return (
        <div className="relative w-full min-h-[100px] flex items-center justify-center mt-4">
            <div className="w-full border-t border-gray-400"></div>
            <span className="absolute bg-white px-4 text-gray-600 text-sm font-medium">
                {title}
            </span>
        </div>
    );
}

function StreetSelector({ siteId, selectedStreetId, setSelectedStreetId }: {
    siteId: string;
    selectedStreetId: string | null;
    setSelectedStreetId: (id: string | null) => void;
}) {
    // Get streets for the dropdown
    const streets = useQuery(api.street.getStreetsBySiteId, { siteID: siteId as Id<"site"> });

    if (!streets) {
        return <div>Loading streets...</div>;
    }

    // Handle street selection
    const handleStreetSelection = (streetId: string) => {
        setSelectedStreetId(streetId || null);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 border rounded-md w-64">
                {selectedStreetId
                    ? streets.find(street => street._id === selectedStreetId)?.name || "Select street"
                    : "Select street"}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Streets</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    key={"empty"}
                    onClick={() => handleStreetSelection("")}
                    className="cursor-pointer"
                >
                    None
                </DropdownMenuItem>
                {streets.map((street) => (
                    <DropdownMenuItem
                        key={street._id}
                        onClick={() => handleStreetSelection(street._id)}
                        className="cursor-pointer"
                    >
                        {street.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SingleHouseDataTable({ siteId, streetId, userId }: { siteId: string; streetId: string; userId: string }) {
    const housesInStreet = useQuery(api.house.getHousesByStreetId, { streetId: streetId as Id<"street"> });

    if (!housesInStreet || !Array.isArray(housesInStreet)) {
        return <div>Loading houses...</div>;
    }

    const data = housesInStreet.map((house) => ({
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
                siteId={siteId}
                userId={userId}
            />
        </div>
    );
}

function DataTable({ id, userId }: { id: string; userId: string }) {

    const housesNotInSalesForce = useQuery(
        api.house.getHousesNotInSalesForceBySiteId,
        { siteId: id }
    );

    if (!housesNotInSalesForce || !Array.isArray(housesNotInSalesForce)) {
        return <div>Loading data...</div>;
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
        <div className="flex items-center">
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

                    