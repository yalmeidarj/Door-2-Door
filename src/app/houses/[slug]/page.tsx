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

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined }
}) {


    const page = searchParams['page'] ?? 1
    const perPage = Number(searchParams['per_page']) ?? 2
    const start = (Number(page) - 1) * Number(perPage)
    const end = Number(page) * Number(perPage)

    const streetId = searchParams.id

    const housesInStreet = await getHousesInStreet(streetId, start, perPage)

    if (!housesInStreet || !housesInStreet.data) {
        return <div>loading...</div>
    }

    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: Number(page),
        },
        data:
            housesInStreet.metadata
    }

    return (
        <main className="flex flex-col items-center ">
            <GoBackButton />
            <PaginationControls
                metadata={paginationControls}
            />
            <Accordion type="single" collapsible >
                {housesInStreet.data.map((house) => (
                    <div key={house.id}
                        className={`flex justify-center`}
                    >
                        <AccordionItem value={`${house.id}`} className="w-full">
                            <AccordionTrigger >
                                <HouseCard house={house} />
                            </AccordionTrigger>
                            <AccordionContent>
                                <HouseDetails props={house} />
                                <Form houseId={house.id} />
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                ))}
            </Accordion>
        </main>
    )
}

type house = {
    id: number;
    streetNumber: string;
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