"use client"
import { getAllLocationsDropDown } from "@/app/actions/actions";
import { FormWrapper } from "./FormWrapper";
import SubmitFormButton from "./SubmitFormButton";
import { massUpdateStatusAttemptByLocationId } from "@/lib/automations/updateFromAppToSF";
import { useRef } from "react";


type Location = {
    id: number;
    name: string;
    neighborhood: string;
    priorityStatus: number;
    isDeleted: boolean;
}[] | {
    error: string;
}

type Props = {
    data: Location;
};

export default function deleteLocationById(locationId: number) {
    return (
    <div className=' '>
    
    </div>
)
}



// async function deleteLocationById(locationId: number): Promise<void> {
//     try {
//         await prisma.location.delete({
//             where: {
//                 id: locationId,
//             },
//         });
//         console.log(`Location with ID ${locationId} and all related entities have been deleted.`);
//     } catch (error) {
//         console.error("Error occurred while deleting the location:", error);
//         throw error;
//     }
// }