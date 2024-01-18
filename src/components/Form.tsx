"use client";

import { getActiveShiftByAgentId, updateActiveShiftByShiftId, updateProperty } from "../app/actions/actions";
import toast, { Toaster } from "react-hot-toast";
import {  useRef } from "react";
import SubmitFormButton from "./SubmitFormButton";
import { useSession } from "next-auth/react";
// import { useFormStatus } from "react-dom";

export default function Form({ houseId }: { houseId: number }) {
    const constructionTypes = ['Easy', 'Moderate', 'Hard'];

    const statusAttemptOptions = [
        "",
        'Door Knock Attempt 1',
        'Door Knock Attempt 2',
        'Door Knock Attempt 3',
        'Door Knock Attempt 4',
        'Door Knock Attempt 5',
        'Door Knock Attempt 6',
        'Consent Final Yes',
        'Consent Final No',
        'Engineer Visit Required',
        'Home Does Not Exist'
    ];

    const session = useSession();

    if (!session || !session.data ) {
        return <div>loading...</div>
    }

    const agentId = session.data.user.id
    const agentName = session.data.user.name


    

    async function clientAction(formData: FormData) {
        const result = await updateProperty(formData);

        const currentShift = await getActiveShiftByAgentId(agentId);

        const statusAttempt = formData.get("statusAttempt");

        

        // Make sure currentShift is not null before proceeding
        if (currentShift.status === "error" || !currentShift.shift) {
            console.error("No current shift found.");
            return;
        }

        if (result.status === "success") {
            toast.success(result.message);

            const shiftId =  currentShift.shift.id;

            if (statusAttempt === null) {
                toast.error("No status attempt selected.");
                return;
            } else {
                
                const shiftUpdate = await updateActiveShiftByShiftId(shiftId, statusAttempt as string);
            
                if (shiftUpdate.status === "success") {
                    toast.success(shiftUpdate.message);
                }
                else {
                    toast.error(shiftUpdate.message);
                }
            }
        } else {
            toast.error(result.message);
        }
    }

    const ref = useRef<HTMLFormElement>(null);

    return (
        <>
            <form
                ref={ref}
                action={async (formData) => {
                    ref.current?.reset();
                    await clientAction(formData);
                }
                }
                className="p-4 mx-auto w-full bg-gray-200 "
            >

                <div className="mb-4">

                    <textarea
                        id="id"
                        name="id"
                        className="hidden"
                        value={houseId}
                    />
                    <textarea
                        id="agentName"
                        name="agentName"
                        className="hidden"
                        value={agentName ?? "No Agent Name"}
                    />
                    <textarea
                        id="agentId"
                        name="agentId"
                        className="hidden"
                        value={agentId}
                    />
                    <label htmlFor="externalNotes" className="block text-gray-700 text-sm font-bold mb-2">
                        SalesForce Notes
                    </label>
                    <textarea
                        id="externalNotes"
                        name="externalNotes"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // required
                    // value={}
                    // value={salesForceNotes}
                    // onChange={(e) => setSalesForceNotes(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <span className="block text-gray-700 text-sm font-bold mb-2">Difficulty</span>
                    {constructionTypes.map((option) => (
                        <label key={option} className="inline-flex items-center mt-3">
                            <input
                                type="radio"
                                id="type"
                                className="form-radio h-5 w-5 text-gray-600"
                                name="type"
                                value={option}
                            // onChange={(e) => setDifficulty(e.target.value)}
                            />
                            <span className="ml-2 text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <label htmlFor="attemptNumber" className="block text-gray-700 text-sm font-bold mb-2">
                        Attempt Number
                    </label>
                    <select
                        id="statusAttempt"
                        name="statusAttempt"
                        className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    // value={attemptNumber}
                    // onChange={(e) => setAttemptNumber(e.target.value)}
                    >
                        {statusAttemptOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 flex flex-row">
                    <div className='flex flex-col '>


                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // value={userInfo.lastName}
                        // onChange={handleUserInfoChange}
                        />
                    </div>
                    <div className='flex flex-col '>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // value={userInfo.lastName}
                        // onChange={handleUserInfoChange}
                        />
                    </div>
                    {/* Repeat for other user info fields */}
                </div>
                <div className="mb-4 flex flex-row">
                    <div className='flex flex-col '>


                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // value={userInfo.lastName}
                        // onChange={handleUserInfoChange}
                        />
                    </div>
                    <div className='flex flex-col '>
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // value={userInfo.lastName}
                        // onChange={handleUserInfoChange}
                        />
                    </div>
                    {/* Repeat for other user info fields */}
                </div>

                <div className="mb-4">
                    <label htmlFor="internalNotes" className="block text-gray-700 text-sm font-bold mb-2">
                        Internal Notes
                    </label>
                    <textarea
                        id="internalNotes"
                        name="internalNotes"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    // value={internalNotes}
                    // onChange={(e) => setInternalNotes(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-end">
                    <SubmitFormButton title="Update property" />
                </div>

            </form>
        </>
    );
}
