// HouseRecordsUploader.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import SubmitFormButton from "./SubmitFormButton";
import { updateHouseRecordsAsAdmin } from "@/app/actions/actions";
import { revalidatePath } from 'next/cache';
import Spinner from './Spinner';

interface HouseRecordsUploaderProps {
    // Define any additional props if needed
}

const HouseUpdateFromSF: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // const session = useSession();
    const formRef = useRef<HTMLFormElement>(null);

    // if (!session || !session.data) {
    //     return <div>loading...</div>;
    // }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        formRef.current?.reset();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedFile) {
            setIsLoading(true); // Start loading
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                try {
                    const jsonData = JSON.parse(text as string);
                    // await new Promise ((resolve ) => setTimeout(resolve, 4000));
                    // toast.success("success");
                    const result = await updateHouseRecordsAsAdmin(jsonData);
                    if (result.status === "success") {
                        console.log(`****\nSuccess: ${result.message}\n****`);
                        toast.success(result.message);
                    } else {
                        toast.error(result.message);
                    }
                } catch (error) {
                    toast.error("Error parsing JSON file");
                }
                setIsLoading(false); // Stop loading
                handleClearFile();
            };
            reader.readAsText(selectedFile);
        } else {
            toast.error("Please select a file before submitting");
        }
    };

    return (
        <>
            <Toaster />
            {isLoading ? (
            <Spinner />
            ): (
            <form ref={formRef} onSubmit={handleSubmit} className="p-4 mx-auto w-full bg-gray-200 rounded-sm shadow-md m-4">
                
                {!selectedFile && (
                    <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    disabled={!!selectedFile && true}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-solid border-2 file:text-sm file:font-semibold file:border-violet-700  file:text-violet-700 hover:file:bg-violet-100"
                    />
                )}
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2 justify-between align-middle items-center '>
                {selectedFile?.name}
                {selectedFile && (
                            <button type="button" onClick={handleClearFile} className="block w-full text-sm mr-4 py-2 px-4 text-red-500 border-solid border-2 border-red-500 hover:bg-red-100 rounded-sm">
                        Clear
                    </button>
                )}
                </div>
                <SubmitFormButton title="Upload and Update Records" />
                </div>
                </form>
            )}
        </>
    );
};

export default HouseUpdateFromSF;

