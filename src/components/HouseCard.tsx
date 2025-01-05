import { getConditionalClass } from "@/lib/utils";
import { Home, ClipboardList} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type HouseCardProps = {
    house: {
        id: number
        streetNumber: number
        lastName: string | null
        name: string | null
        type: string | null
        streetId: number
        locationId: number
        lastUpdated: Date
        lastUpdatedBy: string | null
        notes: string | null
        statusAttempt: string | null
        consent: string | null
        phone: string | null
    }
}

export default function HouseCard({ house }: HouseCardProps) {
    const statusClass = getConditionalClass(
        house.statusAttempt ?? "",
        house.consent ?? ""
    )

    return (
        <Card className={`w-full ${statusClass}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Home className="h-5 w-5" />
                        <h2 className="text-2xl font-bold">{house.streetNumber}</h2>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {house.type || "To verify"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <ClipboardList className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-semibold ">
                            {house.statusAttempt || house.consent || "No status"}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 pt-2 items-start flex flex-col">
                <span>Notes:</span>
                <p className="text-sm text-gray-600 text-start line-clamp-4">{house.notes}</p>
            </CardFooter>
        </Card>
    )
}


// type HouseCardProps = {
//     id: number;
//     streetNumber: number;
//     lastName: string | null;
//     name: string | null;
//     type: string | null;
//     streetId: number;
//     locationId: number;
//     lastUpdated: Date;
//     lastUpdatedBy: string | null;
//     notes: string | null;
//     statusAttempt: string | null;
//     consent: string | null;


//     phone: string | null;
// }

// type HouseData = {
//     house: HouseCardProps;
// }


// export default function HouseCard(house: HouseData) {

//     const property = house.house;

//     return (
//         <>
//             <div key={property.id} className={`  w-[280px]  shadow-lg ${getConditionalClass(
//                 property.statusAttempt ?? " ",
//                 property.consent ?? " "
//             )
//                 }`}>
//                 <div className="flex flex-row  justify-between border-b border-white shadow:lg py-2 mb-2">
//                     <div className="flex flex-col justify-center items-center p-2">
//                         <h1 className="text-xl font-bold leading-tight mb-2 text-center">
//                             {property.streetNumber}                            
//                         </h1>
//                     </div>
//                     <div className="flex flex-row justify-center items-center p-2 space-x-4">
//                         <div className="flex flex-col justify-center items-center">
//                             <h2 className="text-md font-semibold leading-snug mb-1">Att:</h2>
//                             <span className="text-sm">
//                                 {property.statusAttempt ?? property.consent ?? property.consent}
//                             </span>
//                         </div>
//                         <div className="flex flex-col justify-center items-center">
//                             <h2 className="text-md font-semibold leading-snug mb-1">Type:</h2>
//                             <span className="text-sm">{property.type ?? 'To verify'}</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="text-sm leading-relaxed text-gray-700">
//                     <span className="font-bold">Notes:</span> {property.notes?.substring(0, 100)}...
//                 </div>
//             </div>
//         </>
//     )
// }