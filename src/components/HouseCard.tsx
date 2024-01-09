import { getConditionalClass } from "@/lib/utils";


type HouseCardProps = {
    id: number;
    streetNumber: number;
    lastName: string | null;
    name: string | null;
    type: string | null;
    streetId: number;
    locationId: number;
    lastUpdated: Date;
    lastUpdatedBy: string | null;
    internalNotes: string | null;
    statusAttempt: string | null;
    consent: string | null;


    phone: string | null;
}

type HouseData = {
    house: HouseCardProps;
}


export default function HouseCard(house: HouseData) {

    const property = house.house;

    return (
        <>
            <div key={property.id} className={`  w-[280px]  shadow-lg ${getConditionalClass(
                property.statusAttempt ?? " ",
                property.consent ?? " "
            )
                }`}>
                <div className="flex flex-row  justify-between border-b border-white shadow:lg py-2 mb-2">
                    <div className="flex flex-col justify-center items-center p-2">
                        <h1 className="text-xl font-bold leading-tight mb-2 text-center">
                            {property.streetNumber}
                        </h1>
                    </div>
                    <div className="flex flex-row justify-center items-center p-2 space-x-4">
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-md font-semibold leading-snug mb-1">Att:</h2>
                            <span className="text-sm">
                                {property.statusAttempt ?? property.consent ?? property.consent}
                            </span>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-md font-semibold leading-snug mb-1">Type:</h2>
                            <span className="text-sm">{property.type ?? 'To verify'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-sm leading-relaxed text-gray-700">
                    <span className="font-bold">Notes:</span> {property.internalNotes?.substring(0, 100)}...
                </div>
            </div>
        </>
    )
}