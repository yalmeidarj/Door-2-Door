"use client";

import { updateProperty } from "../app/actions/actions";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import SubmitFormButton from "./SubmitFormButton";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { LuPlusCircle } from "react-icons/lu";
import { IoMdCloseCircleOutline } from "react-icons/io";

type NotesButtonProps = {
    houseId: number;
    currentNotes: string;
}

export default function NotesButton({ houseId, currentNotes }: NotesButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const session = useSession();

    if (!session || !session.data) {
        return <div>loading...</div>;
    }

    const agentId = session.data.user.id;
    const agentName = session.data.user.name;

    async function clientAction(formData: FormData) {
        setLoading(true);

        const response = await updateProperty(formData);
        if (response.status === 'error') {
            toast.error("There was an error updating the notes");
            setLoading(false);
            return false;
        } else {
            toast.success(`${response.message}`);
            setLoading(false);
            return true;
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
            {!isFormVisible && (
                <button
                    onClick={() => setIsFormVisible(true)}
                    className="flex items-center space-x-2 p-2  text-gray-600 hover:text-gray-800"
                >
                    <LuPlusCircle />
                    <span>Add Notes</span>
                </button>
            )}

            {isFormVisible && (
                <div className="relative">
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800"
                    >
                        <IoMdCloseCircleOutline size={24} />
                    </button>
                    <form
                        ref={ref}
                        action={async (formData) => {
                            const result = await clientAction(formData);
                            if (result) {
                                handleFormReset();
                            }
                        }}
                        className="p-2 mx-auto w-full min-w-[20rem] bg-gray-200 shadow-lg rounded-lg"
                    >
                        {/* Hidden Inputs for functionality */}
                        <textarea id="id" name="id" className="hidden" value={houseId} />
                        <textarea id="agentName" name="agentName" className="hidden" value={agentName ?? "No Agent Name"} />
                        <textarea id="agentId" name="agentId" className="hidden" value={agentId} />
                        <input id="currentNotes" name="currentNotes" className="hidden" value={currentNotes} />
                        <div className="mb-6">
                            <Textarea
                                className="w-full h-32"
                                placeholder={'Type here...'}
                                id="internalNotes"
                                name="internalNotes"
                            />
                        </div>
                        <div className="flex justify-end">
                            <SubmitFormButton title="Add Notes" />
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
