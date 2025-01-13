'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Map, X } from 'lucide-react'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MapDialogProps {
    dialogTitle?: string;
    children?: React.ReactNode
}

const MapDialog: React.FC<MapDialogProps> = ({ dialogTitle, children }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
                        onClick={() => setIsOpen(true)}
                    >
                        <Map className="w-6 h-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] h-[95vh] max-w-full max-h-full p-0 sm:max-w-4xl sm:h-[80vh] sm:rounded-lg overflow-hidden">
                    <VisuallyHidden.Root>
                        <DialogTitle>{dialogTitle ? dialogTitle : 'Map'}</DialogTitle>
                    </VisuallyHidden.Root>
                    <div className="relative w-full h-full">
                        <Button
                            className="absolute top-2 right-2 z-50 rounded-full w-8 h-8 p-0 bg-red-300 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Card className="w-full h-full">
                            {children}
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MapDialog