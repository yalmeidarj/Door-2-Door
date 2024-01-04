'use client';

import { useRouter } from 'next/navigation';

export default function GoBackButton() {
    const router = useRouter();

    return (
        <div className={`flex justify-center`}>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => router.back()}
            >
                Go Back
            </button>
        </div>
    );
}