"use client";
import { useRef, useState } from "react";

// import { PiCalendarDotsFill } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner"

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


