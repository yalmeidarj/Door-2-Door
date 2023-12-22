import Form from "@/components/Form"
import HouseCard from "@/components/HouseCard"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { db } from "@/server/db"

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { [id: string]: string | string[] | undefined }
}) {

    const streetId = searchParams.id
    const housesInStreet = await db.house.findMany({
        where: { locationId: Number(streetId) },
    })

    if (!housesInStreet ) {
        return <div>loading...</div>
    }



    return (
        <main className="flex flex-col items-center ">
            <Accordion type="single" collapsible >
                {housesInStreet.map((house) => (
                    <div key={house.id}
                        className={`flex justify-center max-w-sm `}
                    >
                        <AccordionItem  value={`${house.id}`}>
                            <AccordionTrigger className="">
                                <HouseCard house={house} />
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='p-4 mx-auto max-w-md '>
                                <div className=' '>
                                
                                    <p className="text-lg text-right"><span className="font-bold">{house.lastName ?? "No last name"}, {house.name ?? "No name"}</span></p>
                                    <p className="text-sm text-right font-light">{house.phone ?? "No phone"} | {house.email ?? "No email"}</p>
                                    {/* <p className="text-lg text-right"></p> */}
                                
                                </div>
                                <h2 className="font-bold">SalesForce Notes: </h2>
                                <p className="text-md font-normal">{house.externalNotes}</p>
                                <h2 className="font-bold">Internal Notes: </h2>
                                <p className="text-md font-thin">{house.internalNotes}</p>
                                </div>
                                <Form houseId={house.id} />
                            </AccordionContent>                            
                        </AccordionItem>
                    </div>
                ))}
            </Accordion>
        </main>
    )
}