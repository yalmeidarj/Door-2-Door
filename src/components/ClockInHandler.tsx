"use client";
import { ClockIn } from "@/app/actions/actions";
import toast from "react-hot-toast";
import SubmitFormButton from "./SubmitFormButton";

type ClockInProps = {
    agentId: string;
    locations: { id: number; name: string }[];
};


export default function ClockInHandler({ agentId, locations }: ClockInProps) {

    async function clientAction(formData: FormData) {

        console.log(`clientAction: ${formData.getAll('id')}`);
        const result = await ClockIn(formData );
        if (result.status === "success") {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }


    return (
        <form
            // action={serverAction}
            action={clientAction}
            className="flex flex-wrap"
        >
            <textarea
                name="agentId"
                id="agentId"
                className="hidden"
                value={agentId}
            />
            {/* <textarea
                name="locationId"
                id="locationId"
                className="hidden"
                value={locationId}
            /> */}
            <select className="" name="locationId" id="locationId">
                {locations.map((option) => (
                    <option className="" value={option.id}>{option.name}</option>
                ))}
            </select>
            <SubmitFormButton title="Clock In" />
        </form>

    )
}
