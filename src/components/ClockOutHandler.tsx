"use client"
import toast from "react-hot-toast";
import SubmitFormButton from "./SubmitFormButton";
import { ClockOut } from "@/app/actions/actions";

type ClockInProps = {
    props: string;
};

export default function ClockOutHandler({ props }: ClockInProps) {

    async function clientAction(formData: FormData) {
            
            console.log(`clientAction: ${formData.get('id')}`);
            const result = await ClockOut(formData);
            if (result?.error) {
                toast.error(`${result.error?.toLocaleUpperCase()} `);
            }
            else {
                toast.success(`${result.success?.toLocaleUpperCase()} `);
            }
        }

        

    return (
        <form
            action={clientAction}
            className="flex flex-wrap"
        >
            <textarea
                name="id"
                id="id"
                className="hidden"
                value={props}
            />
            <SubmitFormButton
                // className="bg-red-500 text-white "
                title="Clock Out"
            />
        </form>

    )
}

