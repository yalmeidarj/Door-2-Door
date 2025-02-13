"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConflictSign() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative inline-block">
            {/* The button always stays the same size */}
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-1">
                    <AlertTriangle />
                    <span>Conflict</span>
                </div>
            </Button>

            {/* The extra info is shown in a small overlay panel */}
            {isOpen && (
                <div
                    className=" bg-night text-white ml-8 absolute  mt-2 w-max
                     rounded-md p-2 text-sm shadow-md"
                >
                    <span>
                        When fetching data from Salesforce, the house's final status differed from the one in the Door2Door system.
                    </span>
                </div>
            )}
        </div>
    )
}
