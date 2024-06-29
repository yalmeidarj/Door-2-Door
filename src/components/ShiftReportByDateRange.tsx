import { FaClock, FaHome, FaCheck, FaTimes, FaListAlt, FaMapMarkerAlt } from 'react-icons/fa';

type ShiftReportProps = {
    totalHoursWorked: string;
    totalTimePerLocation: { [key: string]: string };
    housesNotFinal: number;
    housesYes: number;
    housesNo: number;
    totalHouses: number;
};

export default function ShiftReportByDateRange({ totalHoursWorked, totalTimePerLocation, housesNotFinal, housesYes, housesNo, totalHouses }: ShiftReportProps) {
    return (
        <div className="bg-gray-100 shadow-md rounded-lg p-4 md:p-6 lg:p-8 space-y-4">
            {totalHoursWorked && (
                <div className="bg-blue-100 rounded-lg p-4 flex items-center space-x-2">
                    <FaClock className="text-blue-800" />
                    <p className="text-base font-medium text-teal-800">Hours: <strong>{totalHoursWorked}</strong></p>
                </div>
            )}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                    <FaHome className="text-teal-600" />
                    <p className="text-base font-medium text-teal-800">Attempt: <strong>{housesNotFinal}</strong></p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaCheck className="text-green-600" />
                    <p className="text-base font-medium text-teal-800">Yes: <strong>{housesYes}</strong></p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaTimes className="text-red-600" />
                    <p className="text-base font-medium text-teal-800">No: <strong>{housesNo}</strong></p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaListAlt className="text-teal-600" />
                    <p className="text-base font-medium text-teal-800">Total: <strong>{totalHouses}</strong></p>
                </div>
            </div>
            {Object.keys(totalTimePerLocation).length > 0 && (
                <>
                    <h3 className="font-medium text-base text-gray-800">Time Worked Per Location:</h3>
                    <ul className="bg-white rounded-lg p-4 space-y-2">
                        {Object.entries(totalTimePerLocation).map(([location, time]) => (
                            <li key={location} className="flex justify-between items-center border-b border-gray-300 last:border-b-0 p-2">
                                <span className="flex items-center space-x-2 text-gray-600">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>{location}</span>
                                </span>
                                <span className="font-medium text-gray-800">{time}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
