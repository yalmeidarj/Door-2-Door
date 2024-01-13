// HouseRecordsUploader.tsx
"use client";

import React, { useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import SubmitFormButton from "./SubmitFormButton";
import { updateHouseRecords } from "../app/actions/actions";

interface HouseRecordsUploaderProps {
    // Define any additional props if needed
}

const HouseRecordsUploader: React.FC<HouseRecordsUploaderProps> = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const session = useSession();
    const formRef = useRef<HTMLFormElement>(null);

    if (!session || !session.data) {
        return <div>loading...</div>;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                try {
                    const jsonData = JSON.parse(text as string);
                    const result = await updateHouseRecords(jsonData);
                    if (result.status === "success") {
                        toast.success(result.message);
                        formRef.current?.reset();
                    } else {
                        toast.error(result.message);
                    }
                    
                } catch (error) {
                    toast.error("Error parsing JSON file");
                }
            };
            reader.readAsText(selectedFile);
        } else {
            toast.error("Please select a file before submitting");
        }
    };

    return (
        <>
            <Toaster />
            <form ref={formRef} onSubmit={handleSubmit} className="p-4 mx-auto w-full bg-gray-200">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <SubmitFormButton title="Upload and Update Records" />
            </form>
        </>
    );
};

export default HouseRecordsUploader;

