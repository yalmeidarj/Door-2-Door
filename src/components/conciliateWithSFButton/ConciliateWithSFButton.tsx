'use client'
import { useState } from 'react';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { switchSFStatus } from "@/app/actions/actions";
import { RiForbid2Fill } from "react-icons/ri";

export default function ConciliateWithSFButton({ houseId, status }: { houseId: string, status: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [currentStatus, setCurrentStatus] = useState(status);

    const handleClick = async () => {
        setIsLoading(true);
        setIsSuccess(null);  // Reset success state
        try {
            await switchSFStatus(houseId, !currentStatus);
            setCurrentStatus(!currentStatus);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error switching status:", error);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className={`flex items-center justify-center bg-${currentStatus ? 'green' : 'red'}-500 hover:bg-${currentStatus ? 'green' : 'red'}-700 text-white font-bold py-2 px-4 rounded`}
                disabled={isLoading}
                aria-label={currentStatus ? 'Deactivate Status' : 'Activate Status'}
            >
                {isLoading ? (
                    <FaSpinner className="animate-spin" />
                ) : (
                        currentStatus ? <FaCheck /> : <RiForbid2Fill />
                )}
            </button>
            <div aria-live="polite" className="sr-only">
                {isSuccess === true && 'Status successfully updated.'}
                {isSuccess === false && 'Failed to update status.'}
            </div>
        </div>
    )
}