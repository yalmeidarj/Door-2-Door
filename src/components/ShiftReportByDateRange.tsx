export default function ShiftReportByDateRange({ totalHoursWorked, totalTimePerLocation }: { totalHoursWorked: string, totalTimePerLocation: { [key: string]: string } }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">General Report</h2>
            <div className="mb-8">
                {totalHoursWorked && (
                    <div className="bg-blue-100 rounded-lg p-4 mb-4">
                        <p className="text-lg font-semibold text-blue-800">Total Hours Worked: <strong>{totalHoursWorked}</strong></p>
                    </div>
                )}
            </div>
            {Object.keys(totalTimePerLocation).length > 0 && (
                <>
                    <h3 className="font-semibold mb-2 text-lg text-gray-700">Time Worked Per Location:</h3>
                    <ul className="bg-gray-50 rounded-lg p-4">
                        {Object.entries(totalTimePerLocation).map(([location, time]) => (
                            <li key={location} className="border-b border-gray-200 last:border-b-0 p-2 flex justify-between items-center">
                                <span className="text-gray-600">{location}</span>
                                <span className="font-semibold text-gray-800">{time}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}