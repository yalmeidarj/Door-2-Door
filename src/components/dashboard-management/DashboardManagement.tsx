"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FaClock, FaUserAlt } from "react-icons/fa";
import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import { FaUserPlus, FaUserCog, FaUsers } from "react-icons/fa"; // User actions icons
import { FaPlusCircle, FaCalendar, FaSync, FaDatabase } from "react-icons/fa"; // Site management icons
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "../ui/input";
import { CiStopwatch } from "react-icons/ci";
import { LuFolderClock } from "react-icons/lu";
// import { PiCalendarDotsFill } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner"
import ShiftCard from "../ShiftCard";
import { Shift } from "@/lib/Shift/types";


type ManagementOption = "site" | "user";

// export default function ManagementSelector({
function ManagementSelector({
    defaultValue = "site",
}: {
    defaultValue?: ManagementOption;
}) {
    const [selectedOption, setSelectedOption] = useState<ManagementOption>(defaultValue);
    const oldShifts = useQuery(api.shiftLogger.getFinishedShiftsByOrgId, { orgId: "js7413r95wv81erp2shxt9nhsd741y3a" });
    const currentShifts = useQuery(api.shiftLogger.getActiveShiftsByOrgId, { orgId: "js7413r95wv81erp2shxt9nhsd741y3a" });

    const handleValueChange = useCallback((value: string) => {
        setSelectedOption(value as ManagementOption);
    }, []);

    useEffect(() => {
        console.log(`Selected option changed to: ${selectedOption}`);
    }, [selectedOption]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 rounded-md ">
            <Tabs value={selectedOption} onValueChange={handleValueChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="site" className="flex items-center justify-center gap-2">
                        <BsReverseLayoutTextWindowReverse className="w-4 h-4" />
                        <span className="hidden sm:inline">Site Management</span>
                        <span className="sm:hidden">Site</span>
                    </TabsTrigger>
                    <TabsTrigger value="user" className="flex items-center justify-center gap-2">
                        <FaUserAlt className="w-4 h-4" />
                        <span className="hidden sm:inline">User Management</span>
                        <span className="sm:hidden">Users</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="site">
                    <div className="">
                        <ActionCard
                            title="Site Management"
                            actions={[
                                { label: "Create New Site", icon: <FaPlusCircle className="w-4 h-4" /> },
                                { label: "Update Current Site", icon: <FaSync className="w-4 h-4" /> },
                                // { label: "Change Site Data", icon: <FaDatabase className="w-4 h-4" /> },
                            ]}

                        />
                    </div>
                </TabsContent>
                <TabsContent value="user">
                    <div className="">
                        <ActionCard
                            title="User Actions"
                            actions={[
                                { label: "Add New User", icon: <FaUserPlus className="w-4 h-4" /> },
                                { label: "Manage User Roles", icon: <FaUserCog className="w-4 h-4" /> },
                                { label: "View Current Shifts", icon: <FaClock className="w-4 h-4" />, data: currentShifts },
                                { label: "View Past Shifts", icon: <FaCalendar className="w-4 h-4" />, data: currentShifts },
                            ]}  
                        />
                    </div>
                </TabsContent>
            </Tabs>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Currently selected:{" "}
                <span className="font-semibold">
                    {selectedOption === "site" ? "Site Management" : "User Management"}
                </span>
            </div>            
                {/* {currentShifts?.map((shift, index) => <ShiftCard key={index} shift={shift} />)} */}
        </div>
    );
} 






function ActionCard({ title, actions }: { title: string; actions: { label: string; icon: React.ReactNode, data?: any }[] }) {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedData, setSelectedData] = useState<any[]>([]);

    const handleActionClick = (label: string, data?: any) => {
        setSelectedAction(label);
        if (data) {
            setSelectedData(data);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className=' gap-6'>
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start my-1"
                            onClick={() => handleActionClick(action.label, action.data)}
                        >
                            {action.icon}
                            <span className="ml-2 ">{action.label}</span>
                        </Button>
                    ))}
                </div>
                <div className=''>
                    {selectedAction && (
                        <div className="mt-4">
                            {renderForm(selectedAction, selectedData)}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function renderForm(action: string, data?: any) {

    switch (action) {
        case "Create New Site":
            return <>
                {/* <DocumentUploader /> */}
            </>;
        case "Update Current Site":
            return <>
                <LayeredSiteManagement />
            </>;
        case "View Current Shifts":
            return <>
                <CurrentShifts
                    //TODO[HIGH]: Fetch 'orgId' from db
                    // orgId="js7413r95wv81erp2shxt9nhsd741y3a"
                    shifts={data}
                />
            </>;
        case "View Past Shifts":
            return <>
                <CurrentShifts
                    //TODO[HIGH]: Fetch 'orgId' from db
                    // orgId="js7413r95wv81erp2shxt9nhsd741y3a"
                    shifts={data}
                />
            </>;
        case "Change Site Data":
            return <form>{/* Form elements for changing site data */}</form>;
        case "Add New User":
            return <form>{/* Form elements for adding a new user */}</form>;
        case "Manage User Roles":
            return <form>{/* Form elements for managing user roles */}</form>;
        case "View All Users":
            return <form>{/* Form elements for viewing all users */}</form>;
        default:
            return null;
    }
}


// const DocumentUploader: React.FC = () => {
export default function DocumentUploader({ orgName }: { orgName: string } ) {
    
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string[]>([]);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const organization = useQuery(api.organization.getOrgByName, { name: orgName });
    // if (!organization ) {
    //     return (
    //         <div>Loading...</div>
    //     )
    // }
    const createNewSite = useMutation(api.site.createNewSite)
    const createNewStreet = useMutation(api.street.createNewStreet)
    const createNewHouse = useMutation(api.house.createNewHouse)

    const jsonExample = `{
  "name": "GMLYON20_3971A",
  "neighborhood": "to be verified",
  "priorityStatus": 1,
  "houses": [
    {
      "streetNumber": "124",
      "lastName": "",
      "name": "",
      "phone": "",
      "email": "",
      "notes": "",
      "statusAttempt": "Consent Final Yes",
      "consent": "Yes",
      "type": "",
      "street": "WEATHERILL RD"
    }
  ],
  "streets": ["WEATHERILL RD"]
}`;

    type House = {
        streetNumber: string;
        lastName: string;
        name: string;
        phone: string;
        email: string;
        notes: string;
        statusAttempt: string;
        consent: string;
        type: string;
        street: string;
    };

    type Create = {
        name: string;
        neighborhood: string;
        priorityStatus: number;
        orgId: string;
        houses: House[];
        streets: string[];
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setUploadError(null);
        }
    };

    const handleUpload = () => {
        if (!file) {
            setUploadError("Please select a file to upload.");
            return;
        }

        setIsUploading(true);
        setLoadingMessage(null); // Clear previous messages
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileContent = e.target?.result;
            if (file?.type === "application/json") {
                try {
                    const jsonData = JSON.parse(fileContent as string);
                    if (isCreateType(jsonData)) {
                        const siteName = jsonData.name;
                        // TODO[HIGH]: GET orgId from pathName
                        const orgId = organization?._id as string;
                        try {
                            // Create Site
                            setLoadingMessage("Creating site...");
                            const newSiteId = await createNewSite({
                                name: siteName,
                                orgID: orgId,
                            });
                            setLoadingMessage("Site created successfully");

                            // Create Streets in Parallel
                            setLoadingMessage("Creating streets...");
                            const streetPromises = jsonData.streets.map(async (streetName) => {
                                setLoadingMessage(`Creating street ${streetName}...`);
                                const newStreetId = await createNewStreet({
                                    name: streetName,
                                    siteId: newSiteId.toString(),
                                });
                                setLoadingMessage(`Street ${streetName} created successfully`);
                                return { streetName, streetId: newStreetId };
                            });
                            const streetResults = await Promise.all(streetPromises);

                            // Map Street Names to IDs
                            const streetNameToIdMap = new Map<string, string>();
                            streetResults.forEach(({ streetName, streetId }) => {
                                streetNameToIdMap.set(streetName, streetId);
                            });

                            // Create Houses in Parallel
                            setLoadingMessage("Creating houses...");
                            const housePromises = jsonData.houses.map(async (house) => {
                                const streetId = streetNameToIdMap.get(house.street);
                                if (!streetId) {
                                    throw new Error(`Street ${house.street} not found`);
                                }
                                setLoadingMessage(
                                    `Creating house at ${house.streetNumber} ${house.street}...`
                                );
                                const newHouse = await createNewHouse({
                                    streetID: streetId,
                                    siteID: newSiteId,
                                    streetName: house.street,
                                    streetNumber: house.streetNumber,
                                    name: house.name,
                                    lastName: house.lastName,
                                    phone: house.phone,
                                    email: house.email,
                                    type: house.type,
                                    notes: house.notes,
                                    statusAttempt: house.statusAttempt,
                                    consent: house.consent,
                                    isConcilatedInSalesForce: true,
                                    latitude: "",
                                    longitude: "",
                                    lastUpdatedBy: "",
                                    
                                });
                                setLoadingMessage(
                                    `House at ${house.streetNumber} ${house.street} created successfully`
                                );
                                return newHouse;
                            });
                            await Promise.all(housePromises);

                            setLoadingMessage("All data uploaded successfully");
                            setFile(null)
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ""; // Clear the file input
                            }
                            toast.success("All data uploaded successfully")
                            setUploadStatus([]);
                        } catch (error) {
                            setUploadError("An error occurred during upload.");
                        } finally {
                            setIsUploading(false);
                        }
                    } else {
                        setUploadError("Invalid JSON structure.");
                        setIsUploading(false);
                    }
                } catch (error) {
                    setUploadError("Invalid JSON format.");
                    setIsUploading(false);
                }
            } else {
                setUploadError("Unsupported file type. Please upload a JSON or Excel file.");
                setIsUploading(false);
            }
        };

        if (file.type === "application/json") {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };



    const isCreateType = (data: any): data is Create => {
        return (
            typeof data.name === "string" &&
            typeof data.neighborhood === "string" &&
            typeof data.priorityStatus === "number" &&
            Array.isArray(data.houses) &&
            data.houses.every(
                (house: any) =>
                    typeof house.streetNumber === "string" &&
                    typeof house.lastName === "string" &&
                    typeof house.name === "string" &&
                    typeof house.phone === "string" &&
                    typeof house.email === "string" &&
                    typeof house.notes === "string" &&
                    typeof house.statusAttempt === "string" &&
                    typeof house.consent === "string" &&
                    typeof house.type === "string" &&
                    typeof house.street === "string"
            ) &&
            Array.isArray(data.streets) &&
            data.streets.every((street: any) => typeof street === "string")
        );
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".json, .xlsx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-1 focus:outline-none"
                />
            </div>
            {uploadError && <div className="text-red-500 mb-4">{uploadError}</div>}
            <button
                type="button"
                hidden={isUploading}
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Upload"}
            </button>

            
            {loadingMessage && isUploading && (
                <div className="mt-4 bg-gray-200 rounded-md p-4 justify-center items-center flex flex-col ">
                    <div className='animate-pulse'>
                        <FaGear className="w-12 h-12 text-primary animate-spin " />
                    </div>
                    <div className="text-gray-800 font-medium text-lg">{loadingMessage || "Processing..."}</div>
                </div>
            )}

            <p className="text-gray-600 mt-4 text-sm">
                Note: The document should be in JSON format. Ensure the JSON
                structure matches the example below.
            </p>
            <textarea
                readOnly
                value={jsonExample}
                className="mt-2 w-full h-40 border rounded-md p-2"
            />
        </div>
    );

};
// export default DocumentUploader;
const mockSites = [
    { id: "1", name: "New York Office", status: "active", neighborhood: "Manhattan" },
    { id: "2", name: "London Office", status: "inactive", neighborhood: "Westminster" },
]

const mockStreets = {
    "1": [{ id: "101", name: "Broadway" }, { id: "102", name: "5th Avenue" }],
    "2": [{ id: "201", name: "Baker Street" }, { id: "202", name: "Oxford Street" }],
}

const mockHouses = {
    "101": [{ id: "1001", name: "John", lastName: "Doe", phone: "123-456-7890", email: "john@example.com", construction: "2010" }],
    "102": [{ id: "1002", name: "Jane", lastName: "Smith", phone: "098-765-4321", email: "jane@example.com", construction: "2015" }],
    "201": [{ id: "2001", name: "Alice", lastName: "Johnson", phone: "111-222-3333", email: "alice@example.com", construction: "2005" }],
    "202": [{ id: "2002", name: "Bob", lastName: "Williams", phone: "444-555-6666", email: "bob@example.com", construction: "2020" }],
}



function LayeredSiteManagement() {
    const [selectedSite, setSelectedSite] = useState<string | null>(null)
    const [selectedStreet, setSelectedStreet] = useState<string | null>(null)
    const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        site: { name: '', status: '', neighborhood: '' },
        street: { name: '' },
        house: { name: '', lastName: '', phone: '', email: '', construction: '' },
    })

    const handleSiteSelect = (value: string) => {
        setSelectedSite(value)
        setSelectedStreet(null)
        setSelectedHouse(null)
        const site = mockSites.find(s => s.id === value)
        setFormData(prev => ({
            ...prev,
            site: { name: site?.name || '', status: site?.status || '', neighborhood: site?.neighborhood || '' },
            street: { name: '' },
            house: { name: '', lastName: '', phone: '', email: '', construction: '' },
        }))
    }

    const handleStreetSelect = (value: string) => {
        setSelectedStreet(value)
        setSelectedHouse(null)
        const street = mockStreets[selectedSite as keyof typeof mockStreets]?.find(s => s.id === value)
        setFormData(prev => ({
            ...prev,
            street: { name: street?.name || '' },
            house: { name: '', lastName: '', phone: '', email: '', construction: '' },
        }))
    }

    const handleHouseSelect = (value: string) => {
        setSelectedHouse(value)
        const house = mockHouses[selectedStreet as keyof typeof mockHouses]?.find(h => h.id === value)
        setFormData(prev => ({
            ...prev,
            house: {
                name: house?.name || '',
                lastName: house?.lastName || '',
                phone: house?.phone || '',
                email: house?.email || '',
                construction: house?.construction || '',
            },
        }))
    }

    const handleInputChange = (level: 'site' | 'street' | 'house', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [level]: {
                ...prev[level],
                [field]: value,
            },
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitted data:', { selectedSite, selectedStreet, selectedHouse, ...formData })
        // Here you would typically send this data to your backend
    }

    return (
        <Card className="w-full max-w-2xl mx-auto py-0">
            <CardHeader>
                <CardTitle>Select a Site to Manage</CardTitle>
                <CardDescription>Manage sites, streets, and houses.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="site-select">Site</Label>
                        <Select onValueChange={handleSiteSelect} value={selectedSite || undefined}>
                            <SelectTrigger id="site-select">
                                <SelectValue placeholder="Select a site" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockSites.map((site) => (
                                    <SelectItem key={site.id} value={site.id}>
                                        {site.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedSite && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Name</Label>
                                    <Input
                                        id="site-name"
                                        value={formData.site.name}
                                        onChange={(e) => handleInputChange('site', 'name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site-status">Status</Label>
                                    <Input
                                        id="site-status"
                                        value={formData.site.status}
                                        onChange={(e) => handleInputChange('site', 'status', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site-neighborhood">Neighborhood</Label>
                                    <Input
                                        id="site-neighborhood"
                                        value={formData.site.neighborhood}
                                        onChange={(e) => handleInputChange('site', 'neighborhood', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedSite && (
                        <div className="space-y-4">
                            <Label htmlFor="street-select">Street</Label>
                            <Select onValueChange={handleStreetSelect} value={selectedStreet || undefined}>
                                <SelectTrigger id="street-select">
                                    <SelectValue placeholder="Select a street" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockStreets[selectedSite as keyof typeof mockStreets]?.map((street) => (
                                        <SelectItem key={street.id} value={street.id}>
                                            {street.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedStreet && (
                                <div className="space-y-2">
                                    <Label htmlFor="street-name">Name</Label>
                                    <Input
                                        id="street-name"
                                        value={formData.street.name}
                                        onChange={(e) => handleInputChange('street', 'name', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {selectedStreet && (
                        <div className="space-y-4">
                            <Label htmlFor="house-select">House</Label>
                            <Select onValueChange={handleHouseSelect} value={selectedHouse || undefined}>
                                <SelectTrigger id="house-select">
                                    <SelectValue placeholder="Select a house" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockHouses[selectedStreet as keyof typeof mockHouses]?.map((house) => (
                                        <SelectItem key={house.id} value={house.id}>
                                            {house.name} {house.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedHouse && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="house-name">Name</Label>
                                        <Input
                                            id="house-name"
                                            value={formData.house.name}
                                            onChange={(e) => handleInputChange('house', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="house-lastName">Last Name</Label>
                                        <Input
                                            id="house-lastName"
                                            value={formData.house.lastName}
                                            onChange={(e) => handleInputChange('house', 'lastName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="house-phone">Phone</Label>
                                        <Input
                                            id="house-phone"
                                            value={formData.house.phone}
                                            onChange={(e) => handleInputChange('house', 'phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="house-email">Email</Label>
                                        <Input
                                            id="house-email"
                                            type="email"
                                            value={formData.house.email}
                                            onChange={(e) => handleInputChange('house', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="house-construction">Construction Year</Label>
                                        <Input
                                            id="house-construction"
                                            value={formData.house.construction}
                                            onChange={(e) => handleInputChange('house', 'construction', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedSite(null)
                        setSelectedStreet(null)
                        setSelectedHouse(null)
                        setFormData({
                            site: { name: '', status: '', neighborhood: '' },
                            street: { name: '' },
                            house: { name: '', lastName: '', phone: '', email: '', construction: '' },
                        })
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!selectedSite}
                    onClick={handleSubmit}
                >
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}

