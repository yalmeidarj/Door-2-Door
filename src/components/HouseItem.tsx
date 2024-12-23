
import Form from "./Form";
import HouseCard from "./HouseCard";
import HouseDetails from "./HouseDetails";
import NotClockedIn from "./NotLoggedIn";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

export default function HouseItem({ house, activeShift, userId, shiftId }: { house: any, activeShift: boolean, userId:string, shiftId: string }) {
    return (
        <Dialog>
            <DialogTrigger className="w-full m-4 z-40" >
                    <HouseCard house={house} />
            </DialogTrigger>
                    <DialogContent                    
                className="h-full max-w-2xl "
                    >
                <ScrollArea className="h-full w-full m-3 pr-2 z-40">                                                    
                <DialogHeader>
                        <DialogTitle>{house.streetNumber} {house.streetName}</DialogTitle>
                    <DialogDescription>
                        {house.streetNumber} {house.streetName}
                    </DialogDescription>
                            </DialogHeader>
                            
                <div className="mt-1">
                    <HouseDetails props={house} />
                </div>
                <div className="mt-2">
                    {activeShift ? (
                        <Form
                        info={{
                            streetNumber: `${house.streetNumber}`,
                            streetName: ` ${house.streetName}`,
                            locationName: `${house.locationName}`,
                                notes: `${house.notes}`,
                            }}
                            houseId={house._id}
                                userId={userId}
                                shiftId={shiftId}
                        />
                    ) : (
                        <NotClockedIn />
                    )}
                </div>
                    </ScrollArea>
                    </DialogContent>
        </Dialog>
    );
}