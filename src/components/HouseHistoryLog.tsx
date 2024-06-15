import React from 'react';
import { format } from "date-fns";

interface LogEntry {
    name: string | null;
    lastName: string | null;
    type: string | null;
    statusAttempt: string | null;
    consent: string | null;
    email: string | null;
    externalNotes: string | null;
    internalNotes: string | null;
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
            const newDate = format(new Date(data), 'MMM do');
            return newDate.toString();
        }
        return data as string;
    }

    return (
        <div className="space-y-2">
            {logs.map((log, index) => (
                <div key={index} className="p-2 bg-gray-100 flex flex-col rounded-md shadow-sm">
                    <div className="p-2 bg-gray-100 flex">
                        {(Object.keys(log) as (keyof LogEntry)[]).map((key) =>
                            isDataValid(log[key]) && (
                                <div key={key}><strong>{key}:</strong> {formatData(log[key])}</div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HouseHistoryLog;