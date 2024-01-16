import React from 'react';

const Spinner = () => {
    return (
        <div className=" flex justify-center items-center p-4 bg-white border-2 border-solid border-gray-300 rounded-md shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-t-blue-500"></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export default Spinner;
