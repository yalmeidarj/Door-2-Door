
// import Form from "./Form";
// import HouseCard from "./HouseCard";
// import HouseDetails from "./HouseDetails";
// import NotClockedIn from "./NotLoggedIn";
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

// export default function HouseItem({ house, activeShift, userId, shiftId }: { house: any, activeShift: boolean, userId:string, shiftId: string }) {
//     return (
//         <Dialog>
//             <DialogTrigger className="w-full m-4 z-40" >
//                     <HouseCard house={house} />
//             </DialogTrigger>
//                     <DialogContent
//                 className="h-full max-w-2xl bg-blue-100 p-0 m-0"
//                     >
//                 <ScrollArea className="">
//                     <DialogHeader className="m-4 p-4">
//                         <DialogTitle>{house.streetNumber} {house.streetName}</DialogTitle>
//                         <DialogDescription >
//                         {house.streetNumber} {house.streetName}
//                     </DialogDescription>
//                             </DialogHeader>
                            
//                     <div className="m-4 p-4">
//                     <HouseDetails props={house} />
//                 </div>
//                     <div className="w-full p-0 m-0">
//                     {activeShift ? (
//                         <Form
//                         info={{
//                             streetNumber: `${house.streetNumber}`,
//                             streetName: ` ${house.streetName}`,
//                             locationName: `${house.locationName}`,
//                                 notes: `${house.notes}`,
//                             }}
//                             houseId={house._id}
//                                 userId={userId}
//                                 shiftId={shiftId}
//                         />
//                     ) : (
//                         <NotClockedIn />
//                     )}
//                 </div>
//                     </ScrollArea>
//                     </DialogContent>
//         </Dialog>
//     );
// }
import Form from "./Form";
import HouseCard from "./HouseCard";
import HouseDetails from "./HouseDetails";
import NotClockedIn from "./NotLoggedIn";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

export default function HouseItem({ house, activeShift, userId, shiftId }: { house: any, activeShift: boolean, userId: string, shiftId: string }) {
    return (
        <Dialog>
            <DialogTrigger className="w-full m-4 z-40" >
                <HouseCard house={house} />
            </DialogTrigger>
            <DialogContent
                className="h-full max-w-2xl bg-blue-100 p-0 m-0"
            >
                <ScrollArea className="">
                    <DialogHeader className="m-4 p-4">
                        <DialogTitle>{house.streetNumber} {house.streetName || ''}</DialogTitle>
                        <DialogDescription>
                            {house.name ? `${house.name} ${house.lastName || ''}` : 'No resident information'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="m-4 p-4">
                        <HouseDetails props={house} />
                    </div>
                    <div className="w-full p-0 m-0">
                        {activeShift ? (
                            <Form
                                info={{
                                    streetNumber: house.streetNumber,
                                    streetName: house.streetName || '',
                                    locationName: house.locationName || '',
                                    notes: house.notes || '',
                                }}
                                houseId={house._id}
                                userId={userId}
                                shiftId={shiftId}
                                house={house} // Pass the full house object directly
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