"use client"

import AddressGeocoder from "@/components/AddressGeocoder"
import DataProcessor from "@/components/DataProcessor"

export default function Page() {

    return (
        <div className="w-full h-full">
            <div className="container  ">
                <AddressGeocoder  />

                <DataProcessor />
            </div>
        </div>
    )
}