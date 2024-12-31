"use client"
import { getAllLocationsDropDown } from "@/app/actions/actions";
import { FormWrapper } from "./FormWrapper";
import SubmitFormButton from "./SubmitFormButton";
import { massUpdateStatusAttemptByLocationId } from "@/lib/automations/updateFromAppToSF";

import { useRef } from "react";


type Location = {
    id: number;
    name: string;
    // neighborhood: string;
    // priorityStatus: number;
    // isDeleted: boolean;
}[] | {
    error: string;
}

type Props = {
    data: Location;
};

export default function MassUpdateStatusByLocationForm({ data }: Props) {

    const statusAttemptOptions = [
        'No Attempt ',
        'Door Knock Attempt 1',
        'Door Knock Attempt 2',
        'Door Knock Attempt 3',
        'Door Knock Attempt 4',
        'Door Knock Attempt 5',
        'Door Knock Attempt 6',
        'Consent Final Yes',
        'Consent Final No',
        'engineer visit required',
        'Home Does Not Exist'
    ]

    async function clientAction(formData: FormData) {
        
        const currentStatusAttempt = formData.get("currentStatusAttempt");
        const newStatusAttempt = formData.get("newStatusAttempt");
        const chosenSite = formData.get("site");
        const result = await massUpdateStatusAttemptByLocationId(chosenSite as string, currentStatusAttempt as string, newStatusAttempt as string);

        // if (!result) {
        //     toast.error("Something went wrong");
        //     return;
        // }
        // if (result.status === "success") {
        //     toast.success(result.statusMessage as string);
        // }
        // if (result.status === "error") {
        //     toast.error(result.error as string);
        // }
    }

       

    const ref = useRef<HTMLFormElement>(null);
    return (
        <div className='max-h-[750px] max-w-[600px]'>
        <FormWrapper
            title="Mass Update Status By Location"
            description="Use this form to mass update the status of all houses in a location"
        >
                <form
                    ref={ref}
                    action={async (formData) => {
                        ref.current?.reset();
                        await clientAction(formData);
                    }
                    }
                    // action={clientAction}
            >
                <div className='flex flex-col gap-6'>
                    <label htmlFor="site" className="block text-sm font-medium text-gray-700">Choose a site:</label>
                    <select
                        required
                        name="site" id="site"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value=""></option>
                        {Array.isArray(data) && data.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    <div className='flex flex-row justify-between gap-2'>
                        <div className='flex flex-col'>
                            <label htmlFor="currentStatusAttempt">Get all Houses by <span className='font-semibold'>current</span> status attempt</label>
                            <select
                                // required
                                name="currentStatusAttempt" id="currentStatusAttempt"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value=" "></option>
                                {statusAttemptOptions.map((statusAttempt) => (
                                    <option key={statusAttempt} value={statusAttempt}>
                                        {statusAttempt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="newStatusAttempt">Change status attempt to</label>
                            <select
                                required
                                name="newStatusAttempt" id="newStatusAttempt"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value=""></option>
                                {statusAttemptOptions.map((statusAttempt) => (
                                    <option key={statusAttempt} value={statusAttempt}>
                                        {statusAttempt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <SubmitFormButton title="Mass Update Status By Location" />
                </div>
            </form>
            </FormWrapper>
            </div>
    )
}
