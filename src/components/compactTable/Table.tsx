"use client"
import React, { createContext, useContext, useRef, useState } from 'react';
import CopyToClipboard from '../CopyToClipboard';
import { cn } from '@/lib/utils';
import ChangeHouseStatusDropdown from '../ChangeHouseStatusDropdown';
import { FaCheck, FaSalesforce } from "react-icons/fa6";
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
import { usePathname, useRouter } from 'next/navigation';


interface House {
    _id: string | undefined;
    streetNumber: string | undefined;
    streetName: string | undefined;
    name: string | undefined;
    lastName: string | undefined;
    notes: string | undefined;
    type: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    statusAttempt: string | undefined;
    salesForceConflict: boolean | undefined;
}

interface TableProps {
    data: House[];
    siteId: string;
    userId: string;
}

interface ConciliationContextType {
    conciliatedHouses: Set<string>;
    setConciliatedHouses: (value: React.SetStateAction<Set<string>>) => void;
    toggleConciliation: (houseId: string) => void;
    clearConciliations: () => void;
    hasPendingConciliations: boolean;
}

interface ConciliationProviderProps {
    children: React.ReactNode;
}

interface TableHeaderProps {
    columns: string[];
}

interface CornerNoteButtonProps {
    houseId: string | undefined;
}


const ConciliationContext = createContext<ConciliationContextType>({
    conciliatedHouses: new Set<string>(),
    setConciliatedHouses: () => { },
    toggleConciliation: () => { },
    clearConciliations: () => { },
    hasPendingConciliations: false
});

export function ConciliationProvider({ children }: ConciliationProviderProps) {
    const [conciliatedHouses, setConciliatedHouses] = useState<Set<string>>(new Set());

    const toggleConciliation = (houseId: string) => {
        setConciliatedHouses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(houseId)) {
                newSet.delete(houseId);
            } else {
                newSet.add(houseId);
            }
            return newSet;
        });
    };

    const clearConciliations = () => {
        setConciliatedHouses(new Set());
    };

    return (
        <ConciliationContext.Provider value={{
            conciliatedHouses,
            setConciliatedHouses,
            toggleConciliation,
            clearConciliations,
            hasPendingConciliations: conciliatedHouses.size > 0
        }}>
            {children}
        </ConciliationContext.Provider>
    );
}

export const useConciliation = () => useContext(ConciliationContext);

const Table: React.FC<TableProps> = ({ data, siteId, userId }) => {
    const { hasPendingConciliations, conciliatedHouses, clearConciliations } = useConciliation();
    const updateProperty = useMutation(api.house.conciliateHouse);
    const router = useRouter();
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");

    const conciliateAllMarked = async () => {
        try {
            const promises = Array.from(conciliatedHouses).map(houseId =>
                updateProperty({
                    houseID: houseId as Id<"house">
                })
            );

            await Promise.all(promises);
            toast.success(`${conciliatedHouses.size} houses updated in SalesForce successfully!`);

            // Clear the context after successful submission
            clearConciliations();
        } catch (error) {
            toast.error("Failed to update houses in SalesForce.");
            console.error(error);
        }

        router.refresh();
    };

    return (
        <div className="flex flex-col gap-4">
            {hasPendingConciliations && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={conciliateAllMarked}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
                    >
                        <FaSalesforce className="text-lg" />
                        <span>Conciliate All Marked ({conciliatedHouses.size})</span>
                    </button>
                </div>
            )}

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
                            'SF Update',
                            'Notes',
                        ]}
                    />
                    <tbody>
                        {data.map((row) => (
                            <tr key={row._id}
                                className={` ${row.salesForceConflict === true ? "bg-red-200" : "odd:bg-gray-200 even:bg-gray-50 hover:bg-gray-200"}`}
                            >
                                <TableCell className={`border-b-0 pr-2 gap-2 font-semibold min-w-[180px] justify-between ${row.salesForceConflict ? "bg-red-200" : ""} `} text={`${row.streetNumber} ${row.streetName} `} >
                                    {row.salesForceConflict === true ? <ConflictSign /> : null}
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
                                        houseId={row._id as Id<"house">}
                                        siteId={siteId}
                                        statusAttempt={row.statusAttempt as string}
                                        userId={userId}
                                    />
                                    <div className="flex justify-center ">
                                        {/* <span>{row.lastUpdatedBy.substring(0, 9)}-{format(new Date(row.lastUpdated), 'MMM dd, HH:mm')}</span> */}
                                    </div>
                                </TableCell>
                                <TableCell
                                    className='items-center justify-center'
                                    clipboard={false} text=" ">
                                    <CornerNoteButton
                                        houseId={row._id}
                                    />
                                </TableCell>
                                <TableCell
                                    clipboard={false}
                                    text={row.notes}
                                >
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
                                                            houseId={row._id as Id<"house">}
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
        </div>
    );
};

function TableHeader({ columns }: TableHeaderProps) {
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



const CornerNoteButton: React.FC<CornerNoteButtonProps> = ({ houseId }) => {
    const updateProperty = useMutation(api.house.conciliateHouse);
    const { conciliatedHouses, toggleConciliation } = useConciliation();
    const { data: session } = useSession();
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
    const ref = useRef<HTMLFormElement>(null);

    if (!session || !session.user) {
        return <div>loading...</div>;
    }

    const isConciliated = houseId ? conciliatedHouses.has(houseId) || isSuccessful : false;

    const handleSubmit = async () => {
        if (!houseId) return;

        try {
            if (ref.current) {
                const formData = new FormData(ref.current);
                formData.set("id", houseId);
            }

            const result = await updateProperty({ houseID: houseId as Id<"house"> });

            if (result !== null) {
                setIsSuccessful(true);
                toast.success("Status updated successfully!");

                // Update the context
                toggleConciliation(houseId);
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            toast.error("An error occurred.");
            console.error(error);
        }
    };

    const handleToggleMark = () => {
        if (!isSuccessful && houseId) {
            toggleConciliation(houseId);
        }
    };

    return (
        <form ref={ref}>
            {isSuccessful ? (
                <div className="flex items-center justify-center rounded-sm w-full px-2 py-1 bg-green-500 transition-all duration-300 ease-in-out shadow-md">
                    <FaCheck className="text-white text-xl" />
                </div>
            ) : (
                <button
                    id='id'
                    name='id'
                    type="button"
                    onClick={houseId && conciliatedHouses.has(houseId) ? handleSubmit : handleToggleMark}
                    className={`flex items-center rounded-sm w-full px-2 py-1 transition-all duration-300 ease-in-out group shadow-md ${houseId && conciliatedHouses.has(houseId)
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {houseId && conciliatedHouses.has(houseId) ? (
                        <span className="w-full text-white text-sm flex items-center justify-center gap-1">
                            <FaSalesforce className="text-white text-lg" />
                            Conciliate
                        </span>
                    ) : (
                        <FaSalesforce className="w-full text-white text-xl group-hover:scale-110 transition-all duration-300 ease-in-out" />
                    )}
                </button>
            )}
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