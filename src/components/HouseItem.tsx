import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HouseDetailsProps, HouseItemProps } from "@/lib/houses/types";
import Form from "./Form";
import HouseCard from "./HouseCard";
import NotClockedIn from "./NotLoggedIn";

export default function HouseItem({ house, activeShift }: HouseItemProps) {
    
    return (
        <>
            <Accordion
                className="flex flex-col justify-center"
                type="single" collapsible >
                <div key={house.id}>
                    <AccordionItem value={`${house.id}`} className="w-full">
                        <AccordionTrigger>
                            <HouseCard house={house} />
                        </AccordionTrigger>
                        <AccordionContent>
                            <HouseDetails props={house} />
                            {activeShift
                                ? <Form
                                    info={{
                                        streetNumber: `${house.streetNumber}`,
                                        streetName: ` ${house.Street.name}`,
                                        locationName: `${house.Location.name}`,
                                        currentNotes: `${house.internalNotes}`,
                                    }}    
                                    houseId={house.id}
                                    />
                                : <NotClockedIn />
                            }
                        </AccordionContent>
                    </AccordionItem>
                </div>
            </Accordion>
        </>
    );
}

function HouseDetails({ props }: HouseDetailsProps) {
    return (
        <div className='p-4 mx-auto max-w-md '>
            <div className=' '>
                <p className="text-lg text-right"><span className="font-bold">{props.lastName ?? "No last name"}, {props.name ?? "No name"}</span></p>
                <p className="text-sm text-right font-light">{props.phone ?? "No phone"} | {props.email ?? "No email"}</p>
            </div>
            <h2 className="font-bold">SalesForce Notes: </h2>
            <p className="text-md font-normal">{props.externalNotes}</p>
            <h2 className="font-bold">Internal Notes: </h2>
            <p className="text-md font-thin">{props.internalNotes}</p>
        </div>
    )
}