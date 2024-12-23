import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function HouseDetails({ props }: { props: any }) {
    const [showNotes, setShowNotes] = useState(false)

    return (
        <div className='w-full'>
            <div className='text-right'>
                <p className="text-lg">
                    <span className="font-bold">
                        {props.lastName ?? "No last name"}, {props.name ?? "No name"}
                    </span>
                </p>
                <p className="text-sm font-light">{props.phone ?? "No phone"} | {props.email ?? "No email"}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <h2 className="font-bold">Notes:</h2>
                <button
                    type="button"
                    onClick={() => setShowNotes((prev) => !prev)}
                    className="text-gray-600  hover:text-gray-800"
                    aria-label={showNotes ? "Hide Notes" : "Show Notes"}
                >
                    {showNotes ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            </div>

            {showNotes && (
                <p className="text-gray-600 mt-2">{props.notes ?? "No notes available"}</p>
            )}
        </div>
    )
}

export default HouseDetails
