import React from 'react';
import CopyToClipboard from '../CopyToClipboard';
import ConciliateWithSFButton from '../conciliateWithSFButton/ConciliateWithSFButton';
import { cn } from '@/lib/utils';

interface House {
    id: number;
    streetNumber: number;
    street: {
        name: string;
    };
    name: string;
    lastName: string;
    type: string;
    phone: string;
    email: string;
    statusAttempt: string;
    isConcilatedInSalesForce: boolean;
    consent: string;
    location: string;
}

interface TableProps {
    data: House[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-2 py-1 border border-gray-200">Address</th>
                        <th className="px-2 py-1 border border-gray-200">Last Name</th>
                        <th className="px-2 py-1 border border-gray-200">Name</th>
                        <th className="px-2 py-1 border border-gray-200">Phone</th>
                        <th className="px-2 py-1 border border-gray-200">Email</th>
                        <th className="px-2 py-1 border border-gray-200">Type</th>
                        <th className="px-2 py-1 border border-gray-200">Status Attempt</th>
                        <th className="px-2 py-1 border border-gray-200">Consent</th>
                        {/* <th className="px-2 py-1 border border-gray-200">Conciliated?</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (    
                        console.log(row.isConcilatedInSalesForce),                        
                        <tr key={row.id} className=" odd:bg-gray-100 even:bg-gray-50">
                                <TableCell
                                    className='font-semibold flex justify-between items-start'
                                    text={`${row.streetNumber} ${row.street.name}`} ><ConciliateWithSFButton houseId={row.id.toString()} status={row.isConcilatedInSalesForce} /></TableCell>
                            
                            <TableCell text={row.lastName} />
                            <TableCell text={row.name} />
                            <TableCell text={row.phone} />
                            <TableCell text={row.email} />
                            <td className="px-2 py-1 border border-gray-200">{row.type}  </td>
                            <td className="px-2 py-1 border border-gray-200">{row.statusAttempt}  </td>
                            <td className="px-2 py-1 border border-gray-200">{row.consent}  </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



function TableCell({ text, className, children }: { text: string | null | undefined, className?: string, children?: React.ReactNode}) {

    let clipboardText = true;

    if (text === null || text === undefined || text === '') {
        clipboardText = false;
    }
        

    return (
        <td className={cn('px-2 py-1 border border-gray-200', className)}>
            {clipboardText ?
                <div>
                    {text}
                <CopyToClipboard text={text} />
                </div>
                :
                <span className="text-gray-400">N/A</span>}
            {children}
        </td>
    )

}

export default Table;