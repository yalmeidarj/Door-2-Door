"use client";

import { getActiveShiftByAgentId, updateActiveShiftByShiftId, updateProperty } from "../app/actions/actions";
import toast, { Toaster } from "react-hot-toast";
import {  use, useEffect, useRef, useState } from "react";
import SubmitFormButton from "./SubmitFormButton";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConsentYesSchema, FormSchema } from "@/lib/houses/types";
import PhoneInput from "./PhoneInput";
import { statusOptions } from "@/lib/utils";




type FormProps = {
    houseId: number;
    info: {
        streetNumber: string;
        streetName: string;
        locationName: string;
        currentNotes: string;
    };
};


export default function Form({ houseId, info }: FormProps) {
    const constructionTypes = ['Easy', 'Moderate', 'Hard'];
    // const [phone, setPhone] = useState('');

    const statusAttemptOptions = statusOptions;

    const session = useSession();

    if (!session || !session.data) {
        return <div>loading...</div>
    }

    const agentId = session.data.user.id
    const agentName = session.data.user.name



    async function clientAction(formData: FormData) {
        
        
        const currentShift = await getActiveShiftByAgentId(agentId);

        const statusAttempt = formData.get("statusAttempt");

        // Make sure currentShift is not null before proceeding
        if (currentShift.status === "error" || !currentShift.shift) {
            console.error("No current shift found.");
            return;
        }
        const shiftId = currentShift.shift.id;
        const phoneNumber = formData.get("phone") as string;
        const newObject = {
            id: formData.get("id") ,
            agentName: formData.get("agentName") ,
            agentId: formData.get("agentId") ,
            externalNotes: formData.get("externalNotes") ,
            type: formData.get("type") ,
            statusAttempt: formData.get("statusAttempt") ,
            lastName: formData.get("lastName") ,
            name: formData.get("name") ,
            phone: phoneNumber.slice(2).replace(/\D/g, ''),
            email: formData.get("email") ,
            internalNotes: formData.get("internalNotes"),
            // shiftId: currentShift.shift.id
        }
        
        
        if (statusAttempt === "Consent Final Yes") {
            const result = ConsentYesSchema.safeParse(newObject);
            if (result.success) {
                const updateResult = await updateProperty( formData);
                toast.success(updateResult.status);
                const shiftUpdate = await updateActiveShiftByShiftId(shiftId, statusAttempt as string);
                if (shiftUpdate.status !== "success") {
                    toast.error(shiftUpdate.message);                    
                }                
                return true;
            } else {
                
                toast.error(result.error.issues[0].message);
                return false;
            }
            
        } else {
            console.log("not consent yes");
            
            const result = FormSchema.safeParse(newObject);
            if (result.success) {
                const updateResult = await updateProperty(formData);
                if (updateResult.status === "success") {

                    if (statusAttempt === null) {
                        toast.error("No status attempt selected.");
                        return;
                    } else {
                    
                        const shiftUpdate = await updateActiveShiftByShiftId(shiftId, statusAttempt as string);
                
                        if (shiftUpdate.status !== "success") {
                            toast.error(shiftUpdate.message);
                            // return false;
                        }
                    }
                }
                toast.success(updateResult.status);
                return true;
            } else {
                
                toast.error(result.error.issues[0].message);
                return false;
            }
        }

        
    }

    const ref = useRef<HTMLFormElement>(null);
    const [resetCounter, setResetCounter] = useState(0);

    const handleFormReset = () => {
        ref.current?.reset();
        setResetCounter(resetCounter + 1); // Increment to trigger reset
    };

    return (
        <>
            <form
                ref={ref}
                action={async (formData) => {
                    const result = await clientAction(formData);
                    if (result) {
                        // ref.current?.reset();
                        handleFormReset();
                    }
                }}
                className="p-4 mx-auto w-full max-w-2xl sm:p-6 md:p-8 bg-gray-200 shadow-lg rounded-lg"
            >
                {/* Hidden Inputs for functionality */}
                <textarea id="id" name="id" className="hidden" value={houseId} />
                <textarea id="agentName" name="agentName" className="hidden" value={agentName ?? "No Agent Name"} />
                <textarea id="agentId" name="agentId" className="hidden" value={agentId} />
                

                {/* External Notes Section */}
                {/* <div className="mb-6">
                    <FormItem
                        label="SalesForce Notes"
                        input="externalNotes"
                        type="text"
                    />
                </div> */}

                {/* Attempt Number Section */}
                <div className='flex flex-row justify-between '>
                    <div className='flex flex-col h-max items-center bg-gray-300 text-slate-600 justify-between border-slate-300 border-dotted border-2 rounded-md px-2 py-8 '>
                        <span className='text-semibold text-xs'> {info.locationName}</span>                
                        <span className='text-semibold text-xs'> {info.streetNumber}</span>                
                        <span className='text-semibold text-xs'> {info.streetName}</span>
                    </div>
                    <div className="mb-4 flex flex-col gap-2 items-center">
                        <div className="mb-4">
                            {/* <span className="block text-gray-800 text-sm font-semibold mb-2">Difficulty</span> */}
                                    <div className="flex flex-wrap -mx-2 items-center m-w-full justify-around border-b-2 border-gray-300">
                                {constructionTypes.map((option) => (
                                    <div key={option} className="flex flex-col  items-center px-1 mb-8">
                                        <label htmlFor={option} className=" text-gray-500">{option}</label>
                                        <input
                                            type="radio"
                                            id={option}
                                            name="type"
                                            className="form-radio  text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            value={option}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 w-full">
                            <select
                                id="statusAttempt"
                                name="statusAttempt"
                                className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                    <option value="" >
                                            Status Attempt
                                    </option>
                                {statusAttemptOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Home owner Info Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Name Field */}                    
                        <FormItem
                            label="Name"
                            input="name"
                            type="text"
                        />
                    
                    {/* Last Name Field */}                    
                        <FormItem
                            label="Last Name"
                            input="lastName"
                            type="text"
                        />
                        
                </div>

                {/* Email and Phone Section with Responsive Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Email Field */}                    
                    <FormItem
                        label="Email"
                        input="email"
                        type="email"
                    />
                
                {/* Phone Field */}                    
                    <PhoneInput
                        key={resetCounter} 
                    />
                    
                </div>
                {/* Internal Notes Section */}
                <input
                    id="currentNotes"   
                    name="currentNotes"
                    value={info.currentNotes}
                    type="hidden" />
                {/* Internal Notes Section */}
                <div className="mb-6">
                    <Textarea
                        // placeholder={info.currentNotes === 'null' ? 'Type message here...' : info.currentNotes} 
                        placeholder={'Type message here...'}
                        id="internalNotes"
                        name="internalNotes"
                    />
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                    <SubmitFormButton title="Update property" />
                </div>
            </form>
        </>
    );
}

function FormItem({ label, input, type, size }: { label: string, input: string, type: string, size?:number }) {
    return (
        <>
            <Input
                type={type}
                id={input}
                name={input}
                placeholder={label}
                size={size}
                autoComplete="off"
                className="focus:ring-indigo-500"
            />
        </>

    )
}



