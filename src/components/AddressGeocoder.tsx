"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";

const PROVINCES = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NS", label: "Nova Scotia" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NU", label: "Nunavut" },
    { value: "YT", label: "Yukon" },
];

type GeocodioBatchResponse = {
    results: Array<{
        query: string;
        response: {
            results: Array<{
                formatted_address: string;
                location: {
                    lat: number;
                    lng: number;
                };
                accuracy?: number;
                accuracy_type?: string;
                source?: string;
                address_components?: {
                    number?: string;
                    street?: string;
                    suffix?: string;
                    city?: string;
                    state?: string;
                    zip?: string;
                    country?: string;
                };
            }>;
        };
    }>;
};

export default function AddressGeocoder() {
    // Extract orgName from the current path
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    // Convex queries
    const activeSites = useQuery(api.site.getActiveSitesByOrgName, {
        orgName: orgName,
    });
    // Houses from selected site
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");
    const selectedSiteAddresses = useQuery(
        api.house.getHousesBySiteId,
        selectedSiteId ? { siteId: selectedSiteId } : "skip"
    );

    // Convex mutation
    const updateHouseCoordinate = useMutation(api.house.editHouseCoordinate);

    // Local states
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [result, setResult] = useState<GeocodioBatchResponse | undefined>();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Build addresses along with houseId reference to match results later
    const addressesToGeocode = useMemo(() => {
        if (!selectedSiteAddresses) return [];
        return selectedSiteAddresses.map((house) => ({
            houseId: house._id,
            query: `${house.streetNumber} ${house.streetName}, ${city.trim()}, ${selectedProvince} Canada`,
        }));
    }, [selectedSiteAddresses, city, selectedProvince]);

    // Just the raw address strings (for the POST body)
    const addressStrings = addressesToGeocode.map((item) => item.query);

    async function handleBatchGeocode() {
        if (!addressStrings.length || !selectedProvince || !city.trim()) {
            setError("Please select a province and enter a city before geocoding.");
            return;
        }

        setIsLoading(true);
        setError("");
        setResult(undefined);

        try {
            // POST addresses to your API endpoint
            const response = await fetch("/api/geocode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressStrings),
            });

            const data: GeocodioBatchResponse = await response.json();

            if (!response.ok) {
                throw new Error(
                    (data as any).error || "Failed to geocode addresses"
                );
            }

            // Save to state so we can render
            setResult(data);

            // For each geocoded batch item, find the matching house
            // and pick the result with the highest accuracy
            data.results.forEach((batchItem) => {
                // Find the address in addressesToGeocode to get the houseId
                const matchedAddress = addressesToGeocode.find(
                    (addr) => addr.query === batchItem.query
                );
                if (!matchedAddress) return; // safety check

                // Find the "best" result by highest accuracy
                const bestResult = batchItem.response.results.reduce((acc, cur) => {
                    // If there's no accuracy, default to 0
                    const accAccuracy = acc.accuracy ?? 0;
                    const curAccuracy = cur.accuracy ?? 0;
                    return curAccuracy > accAccuracy ? cur : acc;
                }, batchItem.response.results[0]);

                if (bestResult) {
                    // Update the house coordinate in your DB
                    updateHouseCoordinate({
                        id: matchedAddress.houseId,
                        lat: bestResult.location.lat,
                        lng: bestResult.location.lng,
                    });
                }
            });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold">Batch Geocode Demo</h1>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Select Site */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Site</label>
                                    <Select onValueChange={setSelectedSiteId} value={selectedSiteId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a site" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeSites?.map((site) => (
                                                <SelectItem key={site._id} value={site._id}>
                                                    {site.name || site._id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Select Province */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Province</label>
                                    <Select onValueChange={setSelectedProvince} value={selectedProvince}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROVINCES.map((province) => (
                                                <SelectItem key={province.value} value={province.value}>
                                                    {province.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Enter City */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Enter City</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter city name"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Preview addresses */}
                            {selectedSiteId && selectedProvince && city && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">Addresses to Geocode:</h3>
                                    <div className="bg-gray-50 p-4 rounded-md space-y-1">
                                        {addressStrings.map((address, index) => (
                                            <p key={index} className="text-sm">
                                                {address}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Geocode button */}
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                    disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    onClick={handleBatchGeocode}
                                    disabled={
                                        isLoading ||
                                        addressStrings.length === 0 ||
                                        !selectedProvince ||
                                        !city.trim()
                                    }
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isLoading ? "Processing..." : "Geocode Addresses"}
                                </button>
                                <span className="text-sm text-gray-500">
                                    {addressStrings.length} address
                                    {addressStrings.length !== 1 ? "es" : ""} selected
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Results */}
                <h2 className="text-xl font-semibold mb-4">Results</h2>
                <ScrollArea>
                    <div className="max-h-[400px]">
                        {result && (
                            <Card>
                                <CardContent>
                                    <div className="space-y-4">
                                        {result.results.map((batchItem, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-50 p-4 rounded-md space-y-2"
                                            >
                                                <p className="text-sm">
                                                    <strong>Query:</strong> {batchItem.query}
                                                </p>
                                                {batchItem.response.results.map((res, rIdx) => (
                                                    <div
                                                        key={rIdx}
                                                        className="pl-4 border-l border-gray-300"
                                                    >
                                                        <p className="text-sm">
                                                            <strong>Address:</strong> {res.formatted_address}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Latitude:</strong> {res.location.lat}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Longitude:</strong> {res.location.lng}
                                                        </p>
                                                        <p className="text-sm">
                                                            <strong>Accuracy:</strong> {res.accuracy ?? "N/A"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}
