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
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

export default function ChangeHouseStatusDropdown({ houseId,  statusAttempt }:
    { houseId: string,  siteId: string, statusAttempt: string }) {
    const updateProperty = useMutation(api.houseEditLog.createNewEditByHouseId);
    const [currentStatus, setCurrentStatus] = useState(statusAttempt);

    const { data: session } = useSession(); 
    if (!session || !session.user) {
                
        return <div>Loading...</div>;
    }
    
    const user = session.user;
    // const agentId = session.user.id;
    // const agentName = session.user.name;
    const ref = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        const newObject = {
            statusAttempt: formData.get("statusAttempt") as string,
            houseId: formData.get("id") as Id<"house">,
            agentId: formData.get("agentId") as Id<"users">,
            // siteID: siteId
            // shiftId: formData.get("shiftId") as Id<"shiftLogger"> 
        };
        try {
            const response = await updateProperty(newObject);
            if (response){
                return true
            }
        } catch (error) {
            console.error('Error updating property:', error);
            
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
        formData.set("agentId", user.id as string );
        const result = await clientAction(formData);
        if (result) {
            handleFormReset();
            setCurrentStatus(option); // Update the currentStatus state to the selected option
            toast.success("Status updated successfully!");
        } else {
            toast.error("Failed to update status.");
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
