import { getAllClockedInAgents } from "@/app/actions/actions";

interface PastShiftsProps {
    name: string | null;
    id: string;
}

interface ErrorProps {
    error: string;
}


// Directly use PastShiftsProps[] as the type for agents.
export default async function ClockedInAgents() {
    const result = await getAllClockedInAgents();

    // Check if the result is an array (successful response) or an error object
    if (!Array.isArray(result)) {
        // Handle the error case here
        // For example, you might want to display an error message
        return <div>Error: {result.error}</div>;
    }

    // If it's an array, it can be treated as an array of PastShiftsProps
    const agents: PastShiftsProps[] = result;

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>All Agents Currently Clocked In</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {agents.map((agent) => (
                    <div key={agent.id} className='bg-white hover:bg-gray-100 p-3 rounded shadow'>
                        {agent.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
