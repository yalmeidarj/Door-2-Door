interface ErrorProps {
    error: string;
}

export default function ErrorComponent({ error }: ErrorProps) {
    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>Error</h1>
            <div className='bg-red-100 text-red-800 p-3 rounded shadow'>
                <p
                // className="text-sm font-medium text-red-800"
                >Sorry, we encountered an issue: <span className="text-sm font-medium text-red-800">{error}</span>
                </p>
                {/* <button className='mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>
                    Retry
                </button> */}
            </div>
        </div>
    )
}
