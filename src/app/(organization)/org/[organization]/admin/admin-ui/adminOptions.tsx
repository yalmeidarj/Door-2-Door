"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type AccordionItemProps = {
    id: number,
    name: string,
    component: React.ReactNode
}
export default function AccordionItems({ data }: { data: AccordionItemProps[] }) {

    return (
        <Accordion type="single" collapsible className="w-full">
            {data.map((item: any) =>
                <AccordionItem
                    key={item.id}
                    value={`item-${item.id}`}>
                    <AccordionTrigger>{item.name}</AccordionTrigger>
                    <AccordionContent>
                        {item.component}
                    </AccordionContent>
                </AccordionItem>
            )}
        </Accordion>        
    )
}
