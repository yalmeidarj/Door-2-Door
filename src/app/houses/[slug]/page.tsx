import Form from "@/components/Form"
import HouseCard from "@/components/HouseCard"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { db } from "@/server/db"
import PaginationControls from "@/components/PaginationControls"
import { getHousesInStreet } from "@/app/actions/actions"
import GoBackButton from "@/components/GoBackButton"
import NotLoggedIn from "@/components/NotLoggedIn"
import { getShiftsByAgentId } from "@/app/actions/actions"
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/server/auth";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined }
}) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
                    <p>You are not logged in</p>
                </div>
            </div>
        );
    }

    const shifts = await getShiftsByAgentId(session.user.id);

    const page = searchParams['page'] ?? 1
    const perPage = Number(searchParams['per_page']) ?? 2
    const start = (Number(page) - 1) * Number(perPage)
    const end = Number(page) * Number(perPage)

    const streetId = searchParams.id

    const housesInStreet = await getHousesInStreet(streetId, start, perPage)
    
    if (!housesInStreet || !housesInStreet.data) {
        return <div>loading...</div>
    }

    // const orderedHouses = housesInStreet.data.houses.map(house => ({ ...house, streetNumber: house.streetNumber }))
    //     .sort((a, b) => a.streetNumber - b.streetNumber);
    
    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: Number(page),
        },
        data:
            housesInStreet.metadata
    }
    
    const { activeShifts } = shifts as { activeShifts: any[] };

    return (
        <main className="flex flex-col items-center ">
            <GoBackButton />

            {/* <div className="flex flex-col  text-xm w-sm justify-center   ">
                <h1>Street numbers in this street</h1>
                <div className='flex flex-row flex-wrap '>
                
            {orderedHouses.map((house) => (
                <span
                className="m-1 p-1 border border-white rounded hover:bg-white hover:text-black "
                key={house.id} >
                   {house.streetNumber}
                    </span>
                    ))}
                    </div>
            </div> */}

            <PaginationControls
                metadata={paginationControls}
            />
            <div className='flex flex-col   justify-center '>
            
            
                <Accordion
                    className="flex flex-col justify-center"
                    type="single" collapsible >
                    {housesInStreet.data.houses.map((house) => (
                    <div key={house.id}
                        // className={`flex flex-row justify-center bg-black w-full`}
                    >
                        <AccordionItem value={`${house.id}`} className="w-full">
                            <AccordionTrigger >
                                <HouseCard house={house} />
                            </AccordionTrigger>
                            <AccordionContent>
                                <HouseDetails props={house} />
                                
                                {activeShifts && activeShifts.length > 0
                                    ? <Form houseId={house.id} /> : <NotLoggedIn />}
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                ))}
                </Accordion>
            </div>
        </main>
    )
}

type house = {
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
    externalNotes: string | null;
    phone: string | null;
    email: string | null;

}


type HouseDetailsProps = {
    props: house;
    
}

async function HouseDetails({ props }: HouseDetailsProps) {
    return (
        <div className='p-4 mx-auto max-w-md '>
            <div className=' '>

                <p className="text-lg text-right"><span className="font-bold">{props.lastName ?? "No last name"}, {props.name ?? "No name"}</span></p>
                <p className="text-sm text-right font-light">{props.phone ?? "No phone"} | {props.email ?? "No email"}</p>
                {/* <p className="text-lg text-right"></p> */}

            </div>
            <h2 className="font-bold">SalesForce Notes: </h2>
            <p className="text-md font-normal">{props.externalNotes}</p>
            <h2 className="font-bold">Internal Notes: </h2>
            <p className="text-md font-thin">{props.internalNotes}</p>
        </div>
    )
}