// "src/components/DataProcessor.tsx"
"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";

// 1) Import the convex mutations
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

/** Types */

interface House {
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
}

interface ProcessedData {
    name: string;
    neighborhood: string;
    priorityStatus: number;
    houses: House[];
    streets: string[];
}

type DataProcessorProps = {
    /**
     * Switches the component between two modes
     * (for example, "Data Processor" vs "Update Data Processor").
     */
    userId?: string;
    update?: boolean;

};

const DataProcessor: React.FC<DataProcessorProps> = ({ userId, update = false }) => {
    const pathName = usePathname();
    const orgName = pathName?.split("/")[2]?.replace("%20", " ").replace("-", " ");
    // get org using orgName
    const org = useQuery(api.organization.getOrgByName, { name: orgName });
    if (!org) {
        return (<div>Loading...</div>)
    }
    const orgId = org._id;
    const [inputText, setInputText] = useState("");
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

    // 2) States for UI feedback
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // 3) Create our mutations
    const createNewSiteMutation = useMutation(api.site.createNewSite);
    const createNewStreetMutation = useMutation(api.street.createNewStreet);
    const createNewHouseMutation = useMutation(api.house.createNewHouse);
    const updateSiteMutation = useMutation(api.house.updateSiteMutation);

    /**
     * Updates the site in the database based on the processed data.    
     * @param processedData - The processed data containing the site and houses to update.
     */
    const updateSite = async () => {
        console.log("Updating site with processed data:", processedData);
        if (!processedData) return;

        setIsUploading(true);
        setUploadError(null);
        setLoadingMessage("Starting update process...");

        try {
            if (!orgId) {
                throw new Error("No orgId provided. Please supply an orgId as a prop or fetch it.");
            }

            // 1) Update the Site
            setLoadingMessage("Updating site...");
            for (const house of processedData.houses) {
                // Apply the same address parsing function to ensure consistent format
                const fullAddress = `${house.streetNumber} ${house.street}`;
                const { streetNumber, streetName } = parseAddress(fullAddress);

                setLoadingMessage(`Updating house ${streetNumber} ${streetName}...`);

                let consent = ''
                if (house.statusAttempt === "Consent Final" || house.statusAttempt === "Consent Final Yes" || house.statusAttempt === "Consent Final No") {
                    consent = house.consent
                }

                await updateSiteMutation({
                    orgId: orgId,
                    streetName: streetName,
                    streetNumber: streetNumber,
                    agentId: userId as Id<"users">,
                    siteName: processedData.name,
                    statusAttempt: house.statusAttempt,
                    consent: consent,
                });
            }
            setLoadingMessage(`Site "${processedData.name}" updated successfully.`);
        } catch (err: any) {
            console.error(err);
            setUploadError(err.message || "An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    }


    /**
     * Create a new site, with streets & houses, following the same pattern
     */
    const createNewSite = async () => {
        if (!processedData) return;

        setIsUploading(true);
        setUploadError(null);
        setLoadingMessage("Starting creation process...");

        try {
            if (!orgId) {
                throw new Error("No orgId provided. Please supply an orgId as a prop or fetch it.");
            }

            // 1) Create the Site
            setLoadingMessage("Creating site...");
            const newSiteId = await createNewSiteMutation({
                name: processedData.name,
                orgID: orgId,
            });
            setLoadingMessage(`Site "${processedData.name}" created successfully.`);

            // 2) Create all Streets in parallel
            setLoadingMessage("Creating streets...");
            const streetPromises = processedData.streets.map(async (streetName) => {
                setLoadingMessage(`Creating street: ${streetName}`);
                const streetId = await createNewStreetMutation({
                    name: streetName,
                    siteId: newSiteId.toString(),
                });
                return { streetName, streetId };
            });

            const streetResults = await Promise.all(streetPromises);

            // 3) Build a map from streetName -> streetId
            const streetNameToIdMap = new Map<string, string>();
            streetResults.forEach(({ streetName, streetId }) => {
                streetNameToIdMap.set(streetName, streetId);
            });
            setLoadingMessage("All streets created successfully.");

            // 4) Create Houses in parallel
            setLoadingMessage("Creating houses...");
            const housePromises = processedData.houses.map(async (house) => {
                // Consistently parse the address with our address parser
                const fullAddress = `${house.streetNumber} ${house.street}`;
                const { streetNumber, streetName } = parseAddress(fullAddress);

                const streetId = streetNameToIdMap.get(streetName);
                if (!streetId) {
                    throw new Error(`Street not found for name: ${streetName}`);
                }
                setLoadingMessage(
                    `Creating house at ${streetNumber} ${streetName}...`
                );

                let status = house.statusAttempt;
                if (house.statusAttempt === "Consent Final") {
                    status = house.statusAttempt + " " + house.consent;
                }

                await createNewHouseMutation({
                    streetID: streetId as Id<"street">,
                    siteID: newSiteId as Id<"site">,
                    streetName: streetName,
                    streetNumber: streetNumber,
                    name: house.name,
                    lastName: house.lastName,
                    phone: house.phone,
                    email: house.email,
                    type: house.type,
                    notes: house.notes,
                    statusAttempt: status,
                    consent: house.consent,
                    isConcilatedInSalesForce: true,
                    latitude: "",
                    longitude: "",
                    lastUpdatedBy: "",
                });
            });

            await Promise.all(housePromises);

            setLoadingMessage("All data uploaded successfully.");
            console.log("All data uploaded successfully.");
        } catch (err: any) {
            console.error(err);
            setUploadError(err.message || "An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Parses an address into street number and street name components
     * Handles various formats like:
     * - "3316 SEARCHMONT"
     * - "3694 556 HWY"
     * - "B - 3873 556 HWY"
     * - "1 - 3523 556 HWY"
     * @param address The full address string to parse
     * @returns An object with streetNumber and streetName properties
     */
    const parseAddress = (address: string) => {
        // Regular expression to handle various address formats
        // This pattern matches:
        // 1. Optional prefix (like "B - ", "1 - ", etc.)
        // 2. The numeric part of the street number
        // 3. The remaining street name
        const addressMatch = address.match(/^((?:[A-Z0-9]+ - )?)([\d]+)\s+(.+?)\s*$/);

        if (addressMatch) {
            const [, prefix, numericPart, streetName] = addressMatch;
            const streetNumber = prefix ? `${prefix}${numericPart}` : numericPart;
            return { streetNumber: streetNumber.trim(), streetName: streetName.trim() };
        }

        // Fallback for addresses that don't match the pattern
        console.warn(`Address didn't match expected pattern: ${address}`);
        const parts = address.split(' ');
        return {
            streetNumber: parts[0] || '',
            streetName: parts.slice(1).join(' ') || ''
        };
    };

    /**
     * Processes the raw text input to produce a "processedData" object,
     * the same way you had it before.
     */
    const processData = () => {
        const lines = inputText
            .trim()
            .split("\n")
            .filter((line) => line.trim());

        const houses: House[] = [];
        const streetsSet = new Set<string>();

        let siteName = "";

        lines.forEach((line) => {
            // Handle both tab and pipe delimited data
            const parts = line.includes("|")
                ? line.split("|").filter((part) => part.trim())
                : line.split("\t").filter((part) => part.trim());

            if (parts.length >= 4) {
                const fullAddress = parts[0].trim();
                const status = parts[1].trim();
                const projectCode = parts[2].trim();
                const consent = parts[3].trim();

                siteName = projectCode;

                // Use the new address parsing function
                const { streetNumber, streetName } = parseAddress(fullAddress);

                if (streetName) {
                    streetsSet.add(streetName);

                    let newConsent = "";
                    if (consent === "Go To   Follow Up") {
                        newConsent = "";
                    } else {
                        newConsent = consent;
                    }

                    houses.push({
                        streetNumber,
                        lastName: "",
                        name: "",
                        phone: "",
                        email: "",
                        notes: "",
                        statusAttempt: status,
                        consent: newConsent,
                        type: "",
                        street: streetName,
                    });
                }
            }
        });

        // Sort houses by street name and street number
        const sortedHouses = houses.sort((a, b) => {
            const streetCompare = a.street.localeCompare(b.street);
            if (streetCompare !== 0) return streetCompare;
            return parseInt(a.streetNumber, 10) - parseInt(b.streetNumber, 10);
        });

        // Sort streets alphabetically
        const sortedStreets = Array.from(streetsSet).sort();

        setProcessedData({
            name: siteName,
            neighborhood: "n/a",
            priorityStatus: 1,
            houses: sortedHouses,
            streets: sortedStreets,
        });
    };

    /**
     * Start over method: clears out everything.
     */
    const startOver = () => {
        setInputText("");
        setProcessedData(null);
        setUploadError(null);
        setLoadingMessage(null);
        setIsUploading(false);
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4">
            <Card>
                <CardHeader className="w-full flex flex-row justify-between bg-blu items-center">
                    <CardTitle>
                        Site Data Manager
                        <CardDescription>
                            {update ? (
                                <>
                                    <p>
                                        Copy and paste the data from SF table here to
                                        <span className="font-bold uppercase"> update an existing Site</span>
                                    </p>
                                    <p className="text-night">
                                        Select only the status to be updated:
                                        <span className="font-bold uppercase"> Consent Final, Drop Type Unverified</span>
                                    </p>
                                </>
                            ) : (
                                "Copy and paste the data from SF table here to create a new Site"
                            )}
                        </CardDescription>
                    </CardTitle>

                    {/* Show 'Start Over' button only if processedData is set */}
                    {processedData && (
                        <Button variant="destructive" onClick={startOver}>
                            <RiDeleteBack2Fill />
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* If data is NOT processed, show the Textarea and "Process Data" button */}
                    {!processedData && (
                        <div>
                            <Textarea
                                placeholder="Paste your data here..."
                                className="min-h-[200px]"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button onClick={processData} className="mt-2">
                                Process Data
                            </Button>
                        </div>
                    )}

                    {/* If data IS processed, show the results (and hide the Textarea/Process Data) */}
                    {processedData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">{processedData.name}</h3>
                            <div className="mb-4">
                                <h4 className="font-medium">
                                    Houses: {processedData.houses.length}
                                </h4>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-medium">
                                    Found
                                    <span className="text-gray-600 underline m-1">
                                        {processedData.streets.length}
                                    </span>
                                    Streets:
                                </h4>
                                <p className="text-sm">{processedData.streets.join(", ")}</p>
                            </div>

                            {/* 
                Bottom-right corner: 
                Show "Create New Site" or "Update Site" after data is processed.
              */}
                            <div className="flex flex-col items-end space-y-2">
                                {uploadError && (
                                    <div className="text-red-600 font-medium text-sm">
                                        {uploadError}
                                    </div>
                                )}

                                {isUploading && loadingMessage && (
                                    <div className="text-gray-800 font-medium text-sm">
                                        {loadingMessage}
                                    </div>
                                )}

                                {update ? (
                                    <Button onClick={updateSite} disabled={isUploading}>
                                        {isUploading
                                            ? `Working on ${processedData.name}...`
                                            : `Update ${processedData.name}`}
                                    </Button>
                                ) : (
                                    <Button onClick={createNewSite} disabled={isUploading}>
                                        {isUploading
                                            ? `Working on ${processedData.name}...`
                                            : "Create New Site"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* If processed, you can show the JSON for debugging */}
            {processedData && (
                <pre className="bg-gray-100 p-4 rounded-md text-sm">
                    {JSON.stringify(processedData, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default DataProcessor;