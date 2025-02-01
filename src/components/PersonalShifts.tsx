"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import ShiftCard from './ShiftCard';
import LoadingSpinner from './LoadingSpinner';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Id } from '../../convex/_generated/dataModel';
import { CalendarDays } from "lucide-react"
import SiteName from './SiteName';

export type SingleShift = {
    _id: string;
    userID: string;
    siteID: string;
    orgID?: string;
    startingDate: number;
    finishedDate?: number;
    isFinished: boolean;
    onBreak?: boolean;
    updatedHouses?: number;
    updatedHousesFinal?: number;
    updatedHousesFinalNo?: number;
    pace?: number;
    maxInactiveTime?: number;
    shiftBreaks: Array<{
        _id: string;
        _creationTime: number;
        shiftId: string;
        siteID: string;
        description?: string;
        endTime?: number;
        motive: "inactivity" | "transit" | "general";
        status: string;
    }>;
};

export type ShiftBreakData =
    | { message: string }
    | SingleShift[];

interface ShiftDurationDisplayProps {
    // We'll accept ShiftBreakData which is the union
    // and handle the case when it's an array vs. when it's { message: string }
    shifts: ShiftBreakData;
}

function formatDurationMs(durationMs: number) {
    // Convert total duration (ms) to hours and minutes
    const totalHours = durationMs / (1000 * 60 * 60);
    const hours = Math.floor(totalHours);
    // Zero-pad minutes if you want an "H:MMh" style
    const minutes = Math.floor((totalHours - hours) * 60);

    // For a "H:MMh" format (3:05h)
    if (hours > 0) {
        const paddedMinutes = String(minutes).padStart(2, "0");
        return `${hours}:${paddedMinutes}h`;
    }
    // If no whole hours, just show minutes
    return `${minutes}m`;

    /*
    // Alternate style: "Xh Ym"
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "0m";
    }
    */
}

function formatHoursDecimal(totalHours: number) {
    // For the summary "Xh Ym"
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
}

// -----------------------------------------------
// ShiftDurationDisplay Component
// -----------------------------------------------
function ShiftDurationDisplay({ shifts }: ShiftDurationDisplayProps) {
    // 1. Handle the case where shifts is not an array
    if (!Array.isArray(shifts)) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">{shifts.message ?? "No shift data available"}</p>
                </CardContent>
            </Card>
        );
    }

    // 2. If we have an empty array
    if (shifts.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">No shift data available</p>
                </CardContent>
            </Card>
        );
    }

    // 3. Filter out shifts without valid startingDate or finishedDate
    const shiftsWithDuration = shifts
        .filter((shift) => shift.startingDate && shift.finishedDate)
        .map((shift) => {
            const { startingDate, finishedDate } = shift;
            const durationMs = finishedDate! - startingDate; // safe because of the filter

            return {
                ...shift,
                durationMs,
                formattedDuration: formatDurationMs(durationMs),
                duration: durationMs,
            };
        });

    if (shiftsWithDuration.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Shift Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">No shifts with complete duration data available</p>
                </CardContent>
            </Card>
        );
    }

    // 4. Calculate total and average durations in ms
    const totalDurationMs = shiftsWithDuration.reduce((acc, shift) => acc + shift.durationMs, 0);
    const avgDurationMs = totalDurationMs / shiftsWithDuration.length;

    // 5. Convert ms -> hours for total hours worked
    const totalHoursWorked = totalDurationMs / (1000 * 60 * 60);

    // 6. Format total hours worked (e.g., "3h 15m")
    const formattedTotalHoursWorked = formatHoursDecimal(totalHoursWorked);

    // For average shift
    const avgDurationFormatted = formatDurationMs(avgDurationMs);

    // 7. Calculate totals for updatedHouses, updatedHousesFinal, updatedHousesFinalNo
    const totalUpdatedHouses = shiftsWithDuration.reduce(
        (acc, shift) => acc + (shift.updatedHouses ?? 0),
        0
    );
    const totalUpdatedHousesFinal = shiftsWithDuration.reduce(
        (acc, shift) => acc + (shift.updatedHousesFinal ?? 0),
        0
    );
    const totalUpdatedHousesFinalNo = shiftsWithDuration.reduce(
        (acc, shift) => acc + (shift.updatedHousesFinalNo ?? 0),
        0
    );

    const allTotalHouses = totalUpdatedHouses + totalUpdatedHousesFinal + totalUpdatedHousesFinalNo;
    const pace = totalDurationMs / allTotalHouses;

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="bg-gradient-to-r from-night to-black p-4 rounded-t-lg">
                <CardTitle className="text-white text-2xl font-bold">Work Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {/* Overall Totals Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between">
                        {/* Section title takes 2/5 of the width */}
                        <div className="w-2/5">
                            <h2 className="text-xl font-semibold">Overall Totals</h2>
                        </div>
                        {/* Totals data takes the remaining 3/5 */}
                        <div className="w-3/5 flex justify-end gap-6 border bg-slate-100 p-2 max-w-max items-center">
                            <div className="flex flex-col items-center">
                                <span className="text-gray-700 text-sm">Total Hours</span>
                                <span className="text-gray-700 text-xl font-semibold">{formattedTotalHoursWorked}</span>                               
                            </div>
                            <div className="flex justify-center items-center max-x-max ">
                            <div className="flex flex-col items-center">
                                <span className="text-gray-700 text-sm">Att.</span>
                                <span className="text-gray-700 text-sm">{totalUpdatedHouses}</span>
                            </div>
                            <div className="flex flex-col items-center border-x m-1 p-1">
                                <span className="text-gray-700 text-sm">Yes</span>
                                <span className="text-gray-700 text-sm">{totalUpdatedHousesFinal}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-gray-700 text-sm">No</span>
                                <span className="text-gray-700 text-sm">{totalUpdatedHousesFinalNo}</span>
                            </div>
                            {/* <div className="flex flex-col items-center">
                                <span className="text-gray-700 text-sm">Pace</span>
                                    <span className="text-gray-700 text-sm">{pace.toFixed(2)}</span>
                            </div> */}
                        </div>
                        </div>
                    </div>
                </section>

                {/* Shift Details Section */}
                <section>
                    <div className="space-y-3">
                        {shiftsWithDuration.map((shift, index) => (
                            <div
                                key={shift._id ?? index}
                                className="flex justify-between items-center bg-white p-4  border-b"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">
                                        {new Date(shift.startingDate).toLocaleDateString()}
                                    </span>
                                    {/* Optionally include additional shift details if available */}
                                    <span className="text-xs text-gray-500"> {<SiteName id={shift.siteID} />}</span>
                                    {/* {shift.location && (
                                    )} */}
                                </div>
                                <div className="max-w-max flex justify-between items-center gap-6">
                                <span className="text-xl font-bolt">{shift.formattedDuration}</span>
                                
                                    <div className="flex justify-center items-center max-x-max ">
                                        <div className="flex flex-col items-center justify-between ">
                                            <span className="text-gray-700 self-start text-sm">Att.</span>
                                            <span className="text-gray-700 text-sm">{shift.updatedHouses ?? 0}</span>
                                        </div>
                                        <div className="flex flex-col items-center border-x mx-1 px-1">
                                            <span className="text-gray-700 self-start text-sm">Yes</span>
                                            <span className="text-gray-700 text-sm">{shift.updatedHousesFinal ?? 0}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-gray-700 self-start text-sm">No</span>
                                            <span className="text-gray-700 text-sm">{shift.updatedHousesFinalNo ?? 0}</span>
                                        </div>
                                        {/* <div className="flex flex-col items-center">
                                            <span className="text-gray-700 text-sm">Pace</span>
                                            <span className="text-gray-700 text-sm">{((shift.durationMs ?? 0)  / (shift.updatedHouses ?? 0 + (shift.updatedHousesFinal ?? 0) + (shift.updatedHousesFinalNo ?? 0) )).toFixed(2)}</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}
const DataBadge = ({ children, color = 'bg-blue-500' }: { children: ReactNode, color?: string }) => (
    
    <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${color}`}>
        {children}
    </span>
);

interface SummaryItemProps {
    label: string
    value: ReactNode
    color?: string
}

function SummaryItem({ label, value, color = "bg-blue-100 text-blue-800" }: SummaryItemProps) {
    return (
        <div className="flex flex-col max-w-max justify-between text-center items-center py-2">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${color}`}>{value}</span>
        </div>
    )
}


export default function PersonalShifts({ agentId }: { agentId: string }) {
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: tenDaysAgo, to: now });

    // const shifts = useQuery(api.shiftLogger.getFinishedShiftsByAgentId, {
    const shifts = useQuery(api.shiftLogger.getFinishedShiftBreakByAgentId, {
        agentId: agentId,
        startDate: dateRange?.from ? dateRange.from.toUTCString() : tenDaysAgo.toUTCString(),
        // startDate: dateRange.from
        endDate: dateRange?.to ? dateRange.to.toUTCString() : now.toUTCString()
    });

    if (!shifts) {
        return <div>Loading...</div>;
    }

    const handleRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
    };
    if (!Array.isArray(shifts)) {        
        return <div>No shifts found</div>;
    }
    return (
        <>
            <div className="mb-4">
                <DatePickerWithRange
                    dateRange={dateRange}
                    className="mb-4"
                    onChange={handleRangeChange}
                />
            </div>
            <div className="w-full flex justify-evenly gap-2 flex-wrap">
                <ShiftDurationDisplay shifts={shifts} />
                {shifts.map((shift) => (
                    <ShiftCard key={shift._id} shift={shift} />
                ))}
            </div>
        </>
            
    );
}
               