import SeedSfTable from "@/components/houseTable/SeedSfTable";
import { getAllUsers } from "../actions/actions";

import CompactTable from "@/components/compactTable/CompactTable";

export default async function Page() {
    return (        
        <div className='p-4'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>Generate Seeding Report</h1>
            <CompactTable />

        </div>        
    )
}


