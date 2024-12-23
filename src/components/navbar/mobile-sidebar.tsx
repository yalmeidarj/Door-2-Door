"use client"
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FiHome, FiInfo, FiPackage, FiMail } from "react-icons/fi"

export function MobileSidebar() {
    return (
        <ScrollArea className="h-full py-6">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start">
                            <FiHome className="mr-2 h-4 w-4" />
                            Home
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <FiInfo className="mr-2 h-4 w-4" />
                            About
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <FiPackage className="mr-2 h-4 w-4" />
                            Products
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <FiMail className="mr-2 h-4 w-4" />
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}