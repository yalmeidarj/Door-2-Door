'use client'
import { useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RiArrowDropDownLine } from "react-icons/ri";
import { useSession } from 'next-auth/react';
import { statusOptions } from '@/lib/utils';
import { updateProperty } from '@/app/actions/actions';

export default function ChangeHouseStatusDropdown({ houseId, statusAttempt }: { houseId: string, statusAttempt: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [currentStatus, setCurrentStatus] = useState(statusAttempt);
    const { data: session } = useSession();

    if (!session || !session.user || !session.user.name) {
        return <div>No user found...</div>
    }

    const agentId = session.user.id;
    const agentName = session.user.name;
    const ref = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        try {
            setIsLoading(true);
            const response = await updateProperty(formData);
            console.log('response', response);
            setIsLoading(false);
            return response;
        } catch (error) {
            console.error('Error updating property:', error);
            setIsLoading(false);
            return null;
        }
    }

    const handleFormReset = () => {
        ref.current?.reset();
    };

    const handleSubmit = async (option: string) => {
        const formData = new FormData(ref.current!);
        formData.set("statusAttempt", option); // Set the selected statusAttempt value
        formData.set("id", houseId);
        formData.set("agentId", agentId);
        formData.set("agentName", agentName);

        const result = await clientAction(formData);
        if (result) {
            handleFormReset();
            setCurrentStatus(option); // Update the currentStatus state to the selected option
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row justify-between gap-2 w-full h-full m-0 p-0 bg-slate-100'>
                <span>{currentStatus}</span>
                <RiArrowDropDownLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <form ref={ref}>
                    {statusOptions.map((option: string) => (
                        <DropdownMenuItem key={option} onClick={() => handleSubmit(option)}>
                            <DropdownMenuLabel className='cursor-pointer'>
                                {option}
                            </DropdownMenuLabel>
                        </DropdownMenuItem>
                    ))}
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
