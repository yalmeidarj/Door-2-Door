"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { usePathname } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"

export default function DeleteSingleHouse() {
    
    const pathName = usePathname()
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ")
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id

    if (!orgId) {
        return <div className="p-4 text-center">Finding Organization: {orgName}...</div>
    }

    return (
        <HouseSelector orgId={orgId}  />
    )
}

function HouseSelector({ orgId }: {
    orgId: Id<"organization">
}) {
    const deleteHouse = useMutation(api.house.deleteHouse)
    const [selectedSiteId, setSelectedSiteId] = useState<Id<"site"> | null>(null)
    const [selectedStreetId, setSelectedStreetId] = useState<Id<"street"> | null>(null)
    const [selectedHouseId, setSelectedHouseId] = useState<Id<"house"> | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const activeSites = useQuery(api.site.getActiveSitesByOrgId, { orgID: orgId })

    const streets = useQuery(
        api.street.getStreetsBySiteId,
        selectedSiteId ? { siteID: selectedSiteId } : "skip"
    )

    const houses = useQuery(
        api.house.getHousesByStreetId,
        selectedStreetId ? { streetId: selectedStreetId } : "skip"
    )

    const selectedSite = activeSites?.find(site => site._id === selectedSiteId)
    const selectedStreet = streets?.find(street => street._id === selectedStreetId)
    const selectedHouse = houses?.find(house => house._id === selectedHouseId)

    const handleSiteChange = (siteId: string) => {
        setSelectedSiteId(siteId as Id<"site">)
        setSelectedStreetId(null) // Reset street when site changes
        setSelectedHouseId(null) // Reset house when site changes
    }

    const handleStreetChange = (streetId: string) => {
        setSelectedStreetId(streetId as Id<"street">)
        setSelectedHouseId(null) // Reset house when street changes
    }

    const handleHouseChange = (houseId: string) => {
        setSelectedHouseId(houseId as Id<"house">)
    }

    const handleDeleteClick = () => {
        setShowConfirmDialog(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedHouseId) return

        setIsDeleting(true)
        try {
            await deleteHouse({
                id: selectedHouseId as Id<"house">
            })

            setSelectedHouseId(null)
            setShowConfirmDialog(false)
            toast.success("House deleted successfully!")
        } catch (error) {
            console.error("Error deleting house:", error)
            toast.error("Failed to delete house. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (!activeSites) {
        return <div className="p-4 text-center">Loading active sites...</div>
    }

    return (
        <div className="px-4 py-6 space-y-6 w-full mx-auto">
            <Card className="rounded-xl shadow-lg">
                <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-xl font-semibold">Delete House</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Site Selection */}
                    <div className="space-y-1">
                        <Label htmlFor="site-select" className="text-sm font-medium">
                            Select Site
                        </Label>
                        <Select onValueChange={handleSiteChange} value={selectedSiteId || undefined}>
                            <SelectTrigger id="site-select" className="w-full">
                                <SelectValue placeholder="Select a site" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSites.map((site) => (
                                    <SelectItem key={site._id} value={site._id}>
                                        {site.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Street Selection */}
                    {selectedSiteId && (
                        <div className="space-y-1">
                            <Label htmlFor="street-select" className="text-sm font-medium">
                                Select Street
                            </Label>
                            <Select
                                onValueChange={handleStreetChange}
                                value={selectedStreetId || undefined}
                                disabled={!streets || streets.length === 0}
                            >
                                <SelectTrigger id="street-select" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            !streets
                                                ? "Loading streets..."
                                                : streets.length === 0
                                                    ? "No streets available"
                                                    : "Select a street"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {streets &&
                                        streets.map((street) => (
                                            <SelectItem key={street._id} value={street._id}>
                                                {street.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* House Selection */}
                    {selectedStreetId && (
                        <div className="space-y-1">
                            <Label htmlFor="house-select" className="text-sm font-medium">
                                Select House
                            </Label>
                            <Select
                                onValueChange={handleHouseChange}
                                value={selectedHouseId || undefined}
                                disabled={!houses || houses.length === 0}
                            >
                                <SelectTrigger id="house-select" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            !houses
                                                ? "Loading houses..."
                                                : houses.length === 0
                                                    ? "No houses available"
                                                    : "Select a house"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {houses &&
                                        houses.map((house) => (
                                            <SelectItem key={house._id} value={house._id}>
                                                {house.streetNumber} {house.streetName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Selection Summary */}
                    <h3 className="font-medium text-sm mb-2">Current Selection:</h3>
                    {(selectedSiteId || selectedStreetId || selectedHouseId) && (
                        <div className="flex flex-col md:flex-row justify-between mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <div className="items-start flex flex-col justify-center">
                            {selectedSite && (
                                <p className="text-sm">
                                    Site: <span className="font-semibold">{selectedSite.name}</span>
                                </p>
                            )}
                            {selectedStreet && (
                                <p className="text-sm">
                                    Street: <span className="font-semibold">{selectedStreet.name}</span>
                                </p>
                            )}
                            {selectedHouse && (
                                <p className="text-sm">
                                    House: <span className="font-semibold">{selectedHouse.streetNumber} {selectedHouse.streetName}</span>
                                </p>
                            )}
                            </div>
                            {/* <Separator orientation="vertical" className="h-full mx-4" /> */}
                            <div className="border border-gray-200 p-4">

                            {selectedHouseId && selectedStreetId && selectedSiteId && (
                                
                                <HouseSummary
                                houseId={selectedHouseId as string}
                                streetId={selectedStreetId as string}
                                siteId={selectedSiteId as string}
                                />
                            )}
                            </div>
                        </div>
                    )}

                    {/* Delete Button */}
                    {selectedHouseId && (
                        <Button
                            onClick={handleDeleteClick}
                            variant="destructive"
                            className="w-full py-2 mt-4"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete House"}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the house
                            {selectedHouse && ` at ${selectedHouse.streetNumber} ${selectedHouse.streetName}`}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function HouseSummary({ houseId, streetId, siteId }: { houseId: string, streetId: string, siteId: string }) {
    const house = useQuery(api.house.getHouseById, {
        id: houseId as Id<"house">,
        streetId: streetId as Id<"street">,
        siteId: siteId as Id<"site">        
     });

    if (!house) {
        return (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium text-sm mb-2">House Summary:</h3>
                <p className="text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <div className=" rounded-md items-center">
            {/* <h3 className="font-medium text-sm mb-2">House Summary:</h3> */}
            <p className="text-sm">
                Name: <span className="font-semibold">{house.name}</span>
            </p>
            <p className="text-sm">
                Last Name: <span className="font-semibold">{house.lastName}</span>
            </p>
            <p className="text-sm">
                Email: <span className="font-semibold">{house.email}</span>
            </p>
            <p className="text-sm">
                Phone: <span className="font-semibold">{house.phone}</span>
            </p>
            <p className="text-sm">
                Status: <span className="font-semibold">{house.statusAttempt}</span>
            </p>
        </div>
    )
}