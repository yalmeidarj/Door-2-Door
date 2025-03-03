"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { usePathname } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"
import { useForm } from "react-hook-form"

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
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

export default function AddSingleHouse() {
    const createNewHouse = useMutation(api.house.createNewHouse)
    const pathName = usePathname()
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ")
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id

    if (!orgId) {
        return <div className="p-4 text-center">Finding Organization: {orgName}...</div>
    }

    return (
        <SiteStreetSelector orgId={orgId} createNewHouse={createNewHouse} />
    )
}

interface HouseFormData {
    streetNumber: string
    // Add any other fields that are in your houseArgs schema
}

function SiteStreetSelector({ orgId, createNewHouse }: {
    orgId: Id<"organization">
    createNewHouse: any
}) {
    const [selectedSiteId, setSelectedSiteId] = useState<Id<"site"> | null>(null)
    const [selectedStreetId, setSelectedStreetId] = useState<Id<"street"> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<HouseFormData>({
        defaultValues: {
            streetNumber: "",
        },
    })

    const activeSites = useQuery(api.site.getActiveSitesByOrgId, { orgID: orgId })

    const streets = useQuery(
        api.street.getStreetsBySiteId,
        selectedSiteId ? { siteID: selectedSiteId } : "skip"
    )

    const selectedSite = activeSites?.find(site => site._id === selectedSiteId)
    const selectedStreet = streets?.find(street => street._id === selectedStreetId)

    const handleSiteChange = (siteId: string) => {
        setSelectedSiteId(siteId as Id<"site">)
        setSelectedStreetId(null) // Reset street when site changes
    }

    const handleStreetChange = (streetId: string) => {
        setSelectedStreetId(streetId as Id<"street">)
    }

    const onSubmit = async (data: HouseFormData) => {
        if (!selectedSiteId || !selectedStreetId || !selectedStreet) return

        setIsSubmitting(true)
        try {
            await createNewHouse({
                streetID: selectedStreetId,
                siteID: selectedSiteId,
                streetName: selectedStreet.name,
                streetNumber: data.streetNumber,
            })

            form.reset()
            setSelectedStreetId(null)
            toast.success("House created successfully!")
        } catch (error) {
            console.error("Error creating house:", error)
            toast.error("Failed to create house. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!activeSites) {
        return <div className="p-4 text-center">Loading active sites...</div>
    }

    return (
        <div className="px-4 py-6 space-y-6 w-full mx-auto">
            <Card className="rounded-xl shadow-lg">
                <CardHeader className="border-b border-gray-200 pb-4">
                    <CardTitle className="text-xl font-semibold">Add New House</CardTitle>
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

                    {/* Selection Summary */}
                    {(selectedSiteId || selectedStreetId) && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <h3 className="font-medium text-sm mb-2">Current Selection:</h3>
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
                        </div>
                    )}

                    {/* House Form */}
                    {selectedSiteId && selectedStreetId && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="streetNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter street number"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Additional form fields can be added here */}

                                <Button type="submit" className="w-full py-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create House"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
