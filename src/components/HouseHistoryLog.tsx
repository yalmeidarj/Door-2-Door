import React from 'react';
import { format } from "date-fns";

interface LogEntry {
    name: string | null;
    lastName: string | null;
    type: string | null;
    statusAttempt: string | null;
    consent: string | null;
    email: string | null;
    phone: string | null;
    timeStamp: Date;
    userName: string | null;
}

interface HouseHistoryLogProps {
    logs: LogEntry[];
}

const HouseHistoryLog: React.FC<HouseHistoryLogProps> = ({ logs }) => {

    function isDataValid(data: string | Date | null): boolean {
        if (data === null) {
            return false;
        }
        if (typeof data === "string") {
            const parts = data.split("->").map(part => part.trim());
            if (parts.length === 2 && (parts[1] === "null" || parts[0] === parts[1])) {
                return false;
            }
        }
        return true;
    }

    function formatData(data: string | Date | null): string {
        if (data === null) {
            return "";
        }
        if (data instanceof Date) {
            const newDate = format(new Date(data), 'MMM do, hh:mm a');
            return newDate.toString();
        } else {
            const parts = data.split("->").map(part => part.trim());
            if (parts.length === 2 && parts[1] === "null") {
                return parts[0];
            }
            return data;
        }
    }

    return (
        <div className="relative group inline-block">
            <div className="hidden group-hover:block sm:min-w-screen min-w-[750px] absolute z-10 p-4 bg-white border border-gray-300 rounded-lg shadow-lg left-0 lg:left-auto lg:right-0">
                <div className="space-y-2">
                    {logs.map((log, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded-md shadow-sm">
                                {isDataValid(log.userName) && isDataValid(log.timeStamp) && (
                                    <div className="w-full mb-2"><span className='text-xs'> {log.userName} on {formatData(log.timeStamp)}</span></div>
                                )}
                            <div className="flex flex-row">
                                {/* {log.historyLog} */}
                                {(Object.keys(log) as (keyof LogEntry)[]).map((key) =>
                                    key !== 'userName' && key !== 'timeStamp' && isDataValid(log[key]) && (
                                        <div key={key} className="w-1/2 mb-1 p-1 border-r-2 border-dashed border-gray-400 "><strong className="text-xs">{key}:</strong> {formatData(log[key])}</div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="cursor-pointer text-blue-500">View House History</div>
        </div>
    );
};

export default HouseHistoryLog;
