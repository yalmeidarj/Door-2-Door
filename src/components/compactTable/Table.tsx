import React, { useRef } from 'react';
import CopyToClipboard from '../CopyToClipboard';
import { cn } from '@/lib/utils';
import ChangeHouseStatusDropdown from '../ChangeHouseStatusDropdown';
import { string } from 'zod';
import { FaSalesforce } from "react-icons/fa6";

import { LuBadgeAlert } from "react-icons/lu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import HouseEditLog from '@/app/(organization)/org/[organization]/seeding/HouseLog';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Id } from '../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ConflictSign } from './ConflictSign';

interface LogEntry {
    name: string | null;
    lastName: string | null;
    type: string | null;
    statusAttempt: string | null;
    consent: string | null;
    email: string | null;
    // externalNotes: string | null;
    // internalNotes: string | null;
    phone: string | null;
    timeStamp: Date;
    userName: string | null;
}

interface House {
    _id: string | undefined;
    streetNumber: string | undefined;
    streetName: string | undefined;
    name: string  | undefined;
    lastName: string  | undefined;
    // lastUpdated: Date;
    // lastUpdatedBy: string;
    notes: string  | undefined;
    // internalNotes: string;
    type: string  | undefined;
    phone: string  | undefined;
    email: string  | undefined;
    statusAttempt: string | undefined;
    salesForceConflict: boolean | undefined;
    // isConcilatedInSalesForce: boolean  | undefined;
    // consent: string  | undefined;
    // location: string;
    // houseHistory: LogEntry[];
}

interface TableProps {
    data: House[];
    siteId: string
    userId: string
}

const Table: React.FC<TableProps> = ({ data, siteId, userId }) => {
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <TableHeader
                    columns={[
                        'Address',
                        'Last Name',                        
                        'Name',
                        'Phone',
                        'Email',
                        'Type',
                        'Status',
                        'Notes',
                    ]}
                />
                <tbody>
                    {data.map((row) => (
                        
                        <tr key={row._id}
                            className={` ${row.salesForceConflict === true ? "bg-red-200" : "odd:bg-gray-200 even:bg-gray-50 hover:bg-gray-200"
                                }`}
                        >
                            <TableCell className={`  border-b-0 pr-2  gap-2 font-semibold min-w-[180px] justify-between ${row.salesForceConflict ? "bg-red-200" : ""} `} text={`${row.streetNumber} ${row.streetName} `} >
                                {row.salesForceConflict ? <ConflictSign  /> : null}
                            </TableCell>                                

                            <TableCell text={row.lastName} />
                            <TableCell text={row.name} />
                            <TableCell text={row.phone} />
                            <TableCell text={row.email} />
                            <TableCell clipboard={false} text={row.type} />
                            <TableCell
                                className='py-0 px-0'
                                clipboard={false}
                                text='None' >
                                <ChangeHouseStatusDropdown
                                    houseId={row._id as string}
                                    siteId={siteId as string}
                                    statusAttempt={row.statusAttempt as string}
                                    userId={userId}
                                />
                                <div className="flex justify-center ">
                                    {/* <span>{row.lastUpdatedBy.substring(0, 9)}-{format(new Date(row.lastUpdated), 'MMM dd, HH:mm')}</span> */}
                                </div>
                            </TableCell>
                            <TableCell
                                clipboard={false}
                                text={row.notes}
                            >
                                                                <CornerNoteButton
                                    houseId={row._id}
                                />
                                <div className="flex flex-col justify-between ">
                                    
                                    <Dialog>
                                        <DialogTrigger
                                            className="text-sm text-gray-200 bg-night hover:text-gray-900 hover:bg-sun py-1 px-2 rounded-md"
                                        >View House History</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>                                                
                                                    <DialogTitle>All House History</DialogTitle>
                                                    <ScrollArea className="h-[90vh] ">                                                    
                                                <HouseEditLog
                                                    houseId={row._id as string}
                                                    />
                                                </ScrollArea>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



function TableHeader({ columns }: { columns: string[] }) {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column} className="px-2 py-1 border border-gray-200">
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

const conciliatorProps = {
    houseId: string,
}

const CornerNoteButton = ({ houseId }: { houseId?: string }) => {
    const updateProperty = useMutation(api.house.conciliateHouse);
    const {data: session} = useSession();
    if (!session || !session.user) {
        return (
            <div>
                loading...
            </div>
        )
    }
    const user = session.user;   
    
    const ref = useRef<HTMLFormElement>(null);
    async function clientAction(formData: FormData) {
       
        const newObject = {
            houseID: formData.get("id") as Id<"house">,
        };
        const response = await updateProperty(newObject);
        if (!response || response === null) {            
            return null;
        } else {
            return true            
        }
    }

    const handleFormReset = () => {
        ref.current?.reset();
    };
    
    const handleSubmit = async () => { 
        const formData = new FormData(ref.current!);
        formData.set("id", houseId as string);
        const result = await clientAction(formData);
        if (result) {            
            toast.success("Status updated successfully!");
            handleFormReset();
        } else {
            toast.error("Failed to update status.");
            console.log(formData.get("id"))
        }
    }

    return (
        <form ref={ref}>

        <button
                id='id'
                name='id'
                type="button"
            onClick={() => handleSubmit()}
            className=" top-0 left-0 h-full px-3 bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out group flex items-center justify-center shadow-md"
        >
            <FaSalesforce
                className="text-white text-xl group-hover:scale-110 transition-all duration-300 ease-in-out"
            />
        </button>
            </form>
    );
};
interface TableCellProps {
    text?: string | null | undefined;
    className?: string;
    clipboard?: boolean;
    children?: React.ReactNode;
}

function TableCell({ text, className, clipboard = true, children }: TableCellProps) {
    let displayText = '';

    if (text === 'None' && !clipboard) {
        displayText = '';
    } else {
        displayText = text || 'N/A';
    }

    return (
        <td className={cn('h-full p-2 border-y border-gray-300', className)}>
            {displayText ? (
                <div className="flex items-center justify-between w-full ">
                    <span>{displayText}</span>
                    {clipboard && displayText !== 'N/A' && <CopyToClipboard text={displayText} />}
                </div>
            ) : (
                <span className="text-gray-400">{displayText}</span>
            )}
            {children}
        </td>
    );
}


export default Table;